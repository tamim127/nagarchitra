'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Issue, IssueStatus, StatusHistoryEntry, CitizenVerificationVote } from '@/types';
import { INITIAL_ISSUES } from '@/data/initialIssues';
import { useAuthRole } from './AuthRoleContext';

interface IssueContextType {
  issues: Issue[];
  getIssueById: (id: string) => Issue | undefined;
  addIssue: (data: {
    title: string;
    description: string;
    categoryId: string;
    categoryName: string;
    categoryGroup: any;
    severity: any;
    latitude: number;
    longitude: number;
    address: string;
    area: string;
    ward: string;
    photos: string[];
  }) => Issue;
  updateIssueStatus: (
    id: string,
    newStatus: IssueStatus,
    note: string,
    evidenceUrl?: string,
    assignedDepartment?: string,
    assignedOfficer?: string
  ) => void;
  confirmIssue: (id: string) => void;
  followIssue: (id: string) => void;
  voteResolution: (id: string, vote: 'FIXED' | 'STILL_EXISTS', comment?: string) => void;
  findNearbyDuplicates: (lat: number, lng: number, categoryId?: string, radiusMeters?: number) => {
    issue: Issue;
    distanceMeters: number;
  }[];
  getStats: () => {
    total: number;
    inProgress: number;
    resolved: number;
    underReview: number;
    critical: number;
    citizenConfirmed: number;
  };
  getAreaSummary: (slug: string) => any;
  resetToDefaultData: () => void;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

// Haversine formula to compute distance in meters between two coordinates
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentUser } = useAuthRole();

  // Load from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nagarchitra_issues_db_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setIssues(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse stored issues, using initial issues', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nagarchitra_issues_db_v1', JSON.stringify(issues));
    }
  }, [issues, isLoaded]);

  const getIssueById = (id: string) => {
    return issues.find((i) => i.id === id || i.trackingNumber.toLowerCase() === id.toLowerCase());
  };

  const addIssue = (data: {
    title: string;
    description: string;
    categoryId: string;
    categoryName: string;
    categoryGroup: any;
    severity: any;
    latitude: number;
    longitude: number;
    address: string;
    area: string;
    ward: string;
    photos: string[];
  }): Issue => {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    const randomHex = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, '0');
    const newId = `${slug}-${randomHex}`;
    const trackingNum = `NC-2026-DH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newIssue: Issue = {
      id: newId,
      trackingNumber: trackingNum,
      title: data.title,
      titleBn: data.title,
      description: data.description,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      categoryGroup: data.categoryGroup,
      severity: data.severity,
      status: 'SUBMITTED',
      location: {
        id: `loc-${Date.now()}`,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        area: data.area,
        ward: data.ward || 'Ward Central',
        city: 'Dhaka',
        district: 'Dhaka',
        division: 'Dhaka',
      },
      media: data.photos.map((url, idx) => ({
        id: `media-${Date.now()}-${idx}`,
        type: 'IMAGE',
        url,
        caption: `Evidence photo #${idx + 1}`,
        uploadedAt: new Date().toISOString(),
      })),
      reportedBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
      },
      communityConfirmations: 1,
      userConfirmed: true,
      followedByUser: true,
      slaDays: 7,
      citizenVerifications: {
        fixedCount: 0,
        stillExistsCount: 0,
        votes: [],
      },
      timeline: [
        {
          id: `timeline-${Date.now()}`,
          issueId: newId,
          newStatus: 'SUBMITTED',
          changedBy: currentUser.name,
          changedByRole: currentUser.role,
          note: 'Public issue report submitted with photo evidence and GPS location.',
          noteBn: 'নাগরিক কর্তৃক ছবি ও জিপিএস সহ সমস্যা রিপোর্ট জমা দেয়া হয়েছে।',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIssues((prev) => [newIssue, ...prev]);
    return newIssue;
  };

  const updateIssueStatus = (
    id: string,
    newStatus: IssueStatus,
    note: string,
    evidenceUrl?: string,
    assignedDepartment?: string,
    assignedOfficer?: string
  ) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== id) return issue;

        const timelineEntry: StatusHistoryEntry = {
          id: `timeline-${Date.now()}`,
          issueId: issue.id,
          oldStatus: issue.status,
          newStatus,
          changedBy: currentUser.name,
          changedByRole: currentUser.role,
          department: assignedDepartment || issue.assignedDepartment,
          note,
          evidenceUrl,
          createdAt: new Date().toISOString(),
        };

        const updatedIssue: Issue = {
          ...issue,
          status: newStatus,
          assignedDepartment: assignedDepartment || issue.assignedDepartment,
          assignedOfficer: assignedOfficer || issue.assignedOfficer,
          updatedAt: new Date().toISOString(),
          timeline: [timelineEntry, ...issue.timeline],
        };

        if (newStatus === 'RESOLVED') {
          updatedIssue.resolvedAt = new Date().toISOString();
          if (evidenceUrl) {
            updatedIssue.resolutionMedia = [
              {
                id: `res-media-${Date.now()}`,
                type: 'RESOLUTION_IMAGE',
                url: evidenceUrl,
                caption: 'Official resolution proof photo',
                uploadedAt: new Date().toISOString(),
              },
            ];
          }
          if (note) {
            updatedIssue.resolutionNote = note;
          }
          // Automatically transition to CITIZEN_VERIFICATION
          updatedIssue.status = 'CITIZEN_VERIFICATION';
          const verificationEntry: StatusHistoryEntry = {
            id: `timeline-${Date.now() + 1}`,
            issueId: issue.id,
            oldStatus: 'RESOLVED',
            newStatus: 'CITIZEN_VERIFICATION',
            changedBy: 'System Engine',
            changedByRole: 'ADMIN',
            note: 'Resolution submitted by authority. 7-day citizen verification voting period opened.',
            noteBn: 'কর্তৃপক্ষ কর্তৃক সমাধান সাবমিট করা হয়েছে। ৭ দিনের নাগরিক যাচাইকরণ ও ভোটিং উন্মুক্ত করা হলো।',
            createdAt: new Date().toISOString(),
          };
          updatedIssue.timeline = [verificationEntry, ...updatedIssue.timeline];
        }

        if (newStatus === 'CLOSED') {
          updatedIssue.closedAt = new Date().toISOString();
        }

        return updatedIssue;
      })
    );
  };

  const confirmIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== id) return issue;
        const current = !!issue.userConfirmed;
        return {
          ...issue,
          userConfirmed: !current,
          communityConfirmations: current
            ? Math.max(0, issue.communityConfirmations - 1)
            : issue.communityConfirmations + 1,
        };
      })
    );
  };

  const followIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== id) return issue;
        return {
          ...issue,
          followedByUser: !issue.followedByUser,
        };
      })
    );
  };

  const voteResolution = (id: string, vote: 'FIXED' | 'STILL_EXISTS', comment?: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== id) return issue;

        const existingVotes = issue.citizenVerifications?.votes || [];
        const filteredVotes = existingVotes.filter((v) => v.userId !== currentUser.id);

        const newVote: CitizenVerificationVote = {
          id: `vote-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          vote,
          comment,
          createdAt: new Date().toISOString(),
        };

        const updatedVotes = [newVote, ...filteredVotes];
        const fixedCount = updatedVotes.filter((v) => v.vote === 'FIXED').length;
        const stillExistsCount = updatedVotes.filter((v) => v.vote === 'STILL_EXISTS').length;

        let newStatus = issue.status;
        const additionalTimelineEntries: StatusHistoryEntry[] = [];

        // SIGNATURE RULE: If citizens vote STILL_EXISTS and it crosses threshold (>=2 and > fixedCount)
        if (stillExistsCount >= 2 && stillExistsCount > fixedCount && issue.status !== 'REOPENED') {
          newStatus = 'REOPENED';
          additionalTimelineEntries.push({
            id: `timeline-reopen-${Date.now()}`,
            issueId: issue.id,
            oldStatus: issue.status,
            newStatus: 'REOPENED',
            changedBy: 'Citizen Verification Threshold Engine',
            changedByRole: 'ADMIN',
            note: `Reopened automatically: ${stillExistsCount} citizens voted that the problem still persists on site.`,
            noteBn: `নাগরিকদের ${stillExistsCount}টি নেতিবাচক ভোটের ভিত্তিতে স্বয়ংক্রিয়ভাবে পুনরায় চালু (Reopened) করা হয়েছে।`,
            createdAt: new Date().toISOString(),
          });
        } else if (fixedCount >= 3 && fixedCount > stillExistsCount * 2 && issue.status === 'CITIZEN_VERIFICATION') {
          // If overwhelming citizens confirm it is FIXED
          newStatus = 'CLOSED';
          additionalTimelineEntries.push({
            id: `timeline-close-${Date.now()}`,
            issueId: issue.id,
            oldStatus: issue.status,
            newStatus: 'CLOSED',
            changedBy: 'Citizen Verification Engine',
            changedByRole: 'ADMIN',
            note: `Citizen-confirmed resolution: ${fixedCount} residents verified fix is complete. Issue permanently closed.`,
            noteBn: `নাগরিকদের ${fixedCount}টি ইতিবাচক ভোটের ভিত্তিতে সমস্যাটি সফলভাবে ক্লোজড করা হয়েছে।`,
            createdAt: new Date().toISOString(),
          });
        }

        return {
          ...issue,
          status: newStatus,
          citizenVerifications: {
            fixedCount,
            stillExistsCount,
            userVote: vote,
            votes: updatedVotes,
          },
          timeline: [...additionalTimelineEntries, ...issue.timeline],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const findNearbyDuplicates = (lat: number, lng: number, categoryId?: string, radiusMeters = 700) => {
    const results: { issue: Issue; distanceMeters: number }[] = [];

    issues.forEach((issue) => {
      const distance = getDistanceFromLatLonInMeters(
        lat,
        lng,
        issue.location.latitude,
        issue.location.longitude
      );

      if (distance <= radiusMeters) {
        if (!categoryId || issue.categoryId === categoryId) {
          results.push({ issue, distanceMeters: distance });
        }
      }
    });

    return results.sort((a, b) => a.distanceMeters - b.distanceMeters);
  };

  const getStats = () => {
    const total = issues.length;
    const inProgress = issues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
    const resolved = issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
    const underReview = issues.filter((i) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW' || i.status === 'VERIFIED').length;
    const critical = issues.filter((i) => i.severity === 'CRITICAL' && i.status !== 'CLOSED').length;
    const citizenConfirmed = issues.filter(
      (i) => (i.citizenVerifications?.fixedCount || 0) > 0 && i.status === 'CLOSED'
    ).length;

    return { total, inProgress, resolved, underReview, critical, citizenConfirmed };
  };

  const getAreaSummary = (slug: string) => {
    const normalized = slug.toLowerCase().replace(/[^a-z]/g, '');
    const areaIssues = issues.filter((i) => {
      const a = i.location.area.toLowerCase().replace(/[^a-z]/g, '');
      return a.includes(normalized) || normalized.includes(a);
    });

    const total = areaIssues.length;
    const resolvedCount = areaIssues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
    const inProgressCount = areaIssues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
    const underReviewCount = areaIssues.filter((i) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW' || i.status === 'VERIFIED').length;
    const criticalCount = areaIssues.filter((i) => i.severity === 'CRITICAL').length;
    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

    // Category distribution
    const categoryCounts: { [name: string]: number } = {};
    areaIssues.forEach((i) => {
      categoryCounts[i.categoryName] = (categoryCounts[i.categoryName] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      resolvedCount,
      inProgressCount,
      underReviewCount,
      criticalCount,
      resolutionRate,
      topCategories,
      recentIssues: areaIssues.slice(0, 8),
    };
  };

  const resetToDefaultData = () => {
    setIssues(INITIAL_ISSUES);
    localStorage.removeItem('nagarchitra_issues_db_v1');
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        getIssueById,
        addIssue,
        updateIssueStatus,
        confirmIssue,
        followIssue,
        voteResolution,
        findNearbyDuplicates,
        getStats,
        getAreaSummary,
        resetToDefaultData,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
