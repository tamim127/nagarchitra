import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../services/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { ENV } from '../config/env.js';
import {
  broadcastNewIssue,
  broadcastIssueConfirmation,
  broadcastIssueStatusUpdate,
  broadcastIssueVote,
} from '../services/socketService.js';

// Haversine formula for duplicate checking
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
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

// Generate human-readable tracking number
function generateTrackingNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `NC-${year}-${rand}`;
}

const createIssueSchema = z.object({
  title: z.string().min(3),
  titleBn: z.string().optional(),
  description: z.string().min(10),
  descriptionBn: z.string().optional(),
  categoryId: z.string(),
  categoryName: z.string(),
  categoryNameBn: z.string().optional(),
  categoryGroup: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  addressBn: z.string().optional(),
  area: z.string(),
  areaBn: z.string().optional(),
  ward: z.string().default('Ward 1'),
  wardBn: z.string().optional(),
  city: z.string().default('Dhaka'),
  cityBn: z.string().default('ঢাকা'),
  district: z.string().default('Dhaka'),
  districtBn: z.string().default('ঢাকা'),
  division: z.string().default('Dhaka'),
  divisionBn: z.string().default('ঢাকা'),
  photos: z.array(z.string()).default([]),
});

export async function getIssues(req: AuthRequest, res: Response) {
  try {
    const {
      status,
      category,
      severity,
      area,
      ward,
      search,
      page = '1',
      limit = '50',
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (category && category !== 'ALL') {
      where.categoryId = category;
    }
    if (severity && severity !== 'ALL') {
      where.severity = severity;
    }
    if (area && area !== 'ALL') {
      where.location = { ...where.location, area };
    }
    if (ward && ward !== 'ALL') {
      where.location = { ...where.location, ward };
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleBn: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, rawIssues] = await Promise.all([
      prisma.issue.count({ where }),
      prisma.issue.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          location: true,
          media: true,
          reporter: {
            select: { id: true, name: true, role: true, avatar: true },
          },
          timeline: {
            orderBy: { createdAt: 'asc' },
          },
          verificationVotes: true,
          confirmations: req.user ? { where: { userId: req.user.id } } : false,
          followers: req.user ? { where: { userId: req.user.id } } : false,
        },
      }),
    ]);

    // Format response to match frontend interface
    const issues = rawIssues.map((issue) => {
      const fixedCount = issue.verificationVotes.filter((v) => v.vote === 'FIXED').length;
      const stillExistsCount = issue.verificationVotes.filter((v) => v.vote === 'STILL_EXISTS').length;
      const userVote = req.user
        ? issue.verificationVotes.find((v) => v.userId === req.user?.id)?.vote
        : undefined;

      return {
        id: issue.id,
        trackingNumber: issue.trackingNumber,
        title: issue.title,
        titleBn: issue.titleBn || issue.title,
        description: issue.description,
        descriptionBn: issue.descriptionBn || issue.description,
        categoryId: issue.categoryId,
        categoryName: issue.categoryName,
        categoryNameBn: issue.categoryNameBn || issue.categoryName,
        categoryGroup: issue.categoryGroup,
        severity: issue.severity,
        status: issue.status,
        slaDays: issue.slaDays,
        targetResolutionDate: issue.targetResolutionDate?.toISOString(),
        assignedAuthority: issue.assignedAuthority,
        assignedAuthorityBn: issue.assignedAuthorityBn,
        assignedDepartment: issue.assignedDepartment,
        assignedDepartmentBn: issue.assignedDepartmentBn,
        assignedOfficer: issue.assignedOfficer,
        resolutionNote: issue.resolutionNote,
        resolvedAt: issue.resolvedAt?.toISOString(),
        closedAt: issue.closedAt?.toISOString(),
        communityConfirmations: issue.communityConfirmations,
        userConfirmed: req.user ? issue.confirmations && issue.confirmations.length > 0 : false,
        followedByUser: req.user ? issue.followers && issue.followers.length > 0 : false,
        reportedBy: {
          id: issue.reporter.id,
          name: issue.reporter.name,
          role: issue.reporter.role,
          avatar: issue.reporter.avatar,
        },
        location: issue.location
          ? {
              id: issue.location.id,
              latitude: issue.location.latitude,
              longitude: issue.location.longitude,
              address: issue.location.address,
              addressBn: issue.location.addressBn || issue.location.address,
              area: issue.location.area,
              areaBn: issue.location.areaBn || issue.location.area,
              ward: issue.location.ward,
              wardBn: issue.location.wardBn || issue.location.ward,
              city: issue.location.city,
              cityBn: issue.location.cityBn,
              district: issue.location.district,
              districtBn: issue.location.districtBn,
              division: issue.location.division,
              divisionBn: issue.location.divisionBn,
            }
          : undefined,
        media: issue.media.map((m) => ({
          id: m.id,
          type: m.type,
          url: m.url,
          caption: m.caption,
          uploadedAt: m.uploadedAt.toISOString(),
        })),
        citizenVerifications: {
          fixedCount,
          stillExistsCount,
          userVote,
          votes: issue.verificationVotes.map((v) => ({
            id: v.id,
            userId: v.userId,
            userName: v.userName,
            vote: v.vote,
            comment: v.comment || undefined,
            createdAt: v.createdAt.toISOString(),
          })),
        },
        timeline: issue.timeline.map((t) => ({
          id: t.id,
          issueId: t.issueId,
          oldStatus: t.oldStatus || undefined,
          newStatus: t.newStatus,
          changedBy: t.changedByName,
          changedByRole: t.changedByRole,
          department: t.department || undefined,
          note: t.note,
          noteBn: t.noteBn || undefined,
          evidenceUrl: t.evidenceUrl || undefined,
          createdAt: t.createdAt.toISOString(),
        })),
        createdAt: issue.createdAt.toISOString(),
        updatedAt: issue.updatedAt.toISOString(),
      };
    });

    return res.json({
      success: true,
      data: {
        issues,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: ENV.NODE_ENV === 'production' ? 'Error fetching issues' : (error.message || 'Error fetching issues'),
    });
  }
}

export async function getIssueById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const issue = await prisma.issue.findFirst({
      where: {
        OR: [{ id }, { trackingNumber: id }],
      },
      include: {
        location: true,
        media: true,
        reporter: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
        verificationVotes: true,
        confirmations: req.user ? { where: { userId: req.user.id } } : false,
        followers: req.user ? { where: { userId: req.user.id } } : false,
      },
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const fixedCount = issue.verificationVotes.filter((v) => v.vote === 'FIXED').length;
    const stillExistsCount = issue.verificationVotes.filter((v) => v.vote === 'STILL_EXISTS').length;
    const userVote = req.user
      ? issue.verificationVotes.find((v) => v.userId === req.user?.id)?.vote
      : undefined;

    return res.json({
      success: true,
      data: {
        ...issue,
        fixedCount,
        stillExistsCount,
        userVote,
        userConfirmed: req.user ? issue.confirmations && issue.confirmations.length > 0 : false,
        followedByUser: req.user ? issue.followers && issue.followers.length > 0 : false,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: ENV.NODE_ENV === 'production' ? 'Error fetching issue details' : (error.message || 'Error fetching issue details'),
    });
  }
}

export async function createIssue(req: AuthRequest, res: Response) {
  try {
    const validated = createIssueSchema.parse(req.body);

    // SECURITY: Authentication is required (enforced by route middleware)
    const userId = req.user!.id;

    const trackingNumber = generateTrackingNumber();

    // Map authority based on category
    let authority = 'ঢাকা উত্তর সিটি কর্পোরেশন (DNCC)';
    let department = 'পথ ও সড়ক রক্ষণাবেক্ষণ বিভাগ';
    if (validated.categoryGroup === 'Water & Drainage') {
      authority = 'ঢাকা ওয়াসা (DWASA)';
      department = 'পানি ও নিষ্কাশন রক্ষণাবেক্ষণ বিভাগ';
    } else if (validated.categoryGroup === 'Environment') {
      authority = 'বর্জ্য ব্যবস্থাপনা বিভাগ (DNCC/DSCC)';
      department = 'পরিবেশ পরিচ্ছন্নতা শাখা';
    } else if (validated.categoryGroup === 'Public Safety') {
      authority = 'ঢাকা মেট্রোপলিটন পুলিশ ও ট্রাফিক বিভাগ';
      department = 'নগর নিরাপত্তা শাখা';
    }

    const newIssue = await prisma.issue.create({
      data: {
        trackingNumber,
        title: validated.title,
        titleBn: validated.titleBn || validated.title,
        description: validated.description,
        descriptionBn: validated.descriptionBn || validated.description,
        categoryId: validated.categoryId,
        categoryName: validated.categoryName,
        categoryNameBn: validated.categoryNameBn || validated.categoryName,
        categoryGroup: validated.categoryGroup,
        severity: validated.severity as any,
        status: 'SUBMITTED',
        slaDays: 7,
        assignedAuthority: authority,
        assignedAuthorityBn: authority,
        assignedDepartment: department,
        assignedDepartmentBn: department,
        reporterId: userId,
        location: {
          create: {
            latitude: validated.latitude,
            longitude: validated.longitude,
            address: validated.address,
            addressBn: validated.addressBn || validated.address,
            area: validated.area,
            areaBn: validated.areaBn || validated.area,
            ward: validated.ward,
            wardBn: validated.wardBn || validated.ward,
            city: validated.city,
            cityBn: validated.cityBn,
            district: validated.district,
            districtBn: validated.districtBn,
            division: validated.division,
            divisionBn: validated.divisionBn,
          },
        },
        media: {
          create: validated.photos.map((url) => ({
            url,
            type: 'IMAGE',
          })),
        },
        timeline: {
          create: {
            oldStatus: null,
            newStatus: 'SUBMITTED',
            changedById: userId,
            changedByName: req.user!.name || 'নাগরিক ব্যবহারকারী',
            changedByRole: (req.user!.role || 'CITIZEN') as any,
            note: 'সমস্যাটি প্ল্যাটফর্মে সফলভাবে সাবমিট ও নথিভুক্ত করা হয়েছে।',
            noteBn: 'সমস্যাটি প্ল্যাটফর্মে সফলভাবে সাবমিট ও নথিভুক্ত করা হয়েছে।',
          },
        },
      },
      include: {
        location: true,
        media: true,
        reporter: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        timeline: true,
      },
    });

    // Increment user reports count & impact score
    await prisma.user.update({
      where: { id: userId },
      data: {
        reportsCount: { increment: 1 },
        impactScore: { increment: 15 },
      },
    }).catch(() => null);

    // Broadcast to real-time WebSocket clients
    broadcastNewIssue(newIssue);

    return res.status(201).json({
      success: true,
      message: 'Issue submitted successfully',
      data: newIssue,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue submission data',
        errors: error.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: ENV.NODE_ENV === 'production' ? 'Error creating issue' : (error.message || 'Error creating issue'),
    });
  }
}

export async function updateIssueStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const {
      newStatus,
      note,
      evidenceUrl,
      assignedDepartment,
      assignedOfficer,
    } = req.body;

    if (!newStatus) {
      return res.status(400).json({ success: false, message: 'newStatus is required' });
    }

    // SECURITY: Validate newStatus against allowed IssueStatus enum values
    const VALID_STATUSES = [
      'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'ASSIGNED',
      'IN_PROGRESS', 'RESOLVED', 'CITIZEN_VERIFICATION', 'CLOSED',
      'REOPENED', 'REJECTED', 'DUPLICATE'
    ];
    if (!VALID_STATUSES.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const currentIssue = await prisma.issue.findUnique({
      where: { id },
      include: { reporter: true },
    });

    if (!currentIssue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const updateData: any = {
      status: newStatus,
    };

    if (assignedDepartment) updateData.assignedDepartment = assignedDepartment;
    if (assignedOfficer) updateData.assignedOfficer = assignedOfficer;

    if (newStatus === 'RESOLVED') {
      updateData.resolvedAt = new Date();
      updateData.resolutionNote = note;
    } else if (newStatus === 'CLOSED') {
      updateData.closedAt = new Date();
    }

    const timelineEntry = await prisma.statusHistoryEntry.create({
      data: {
        issueId: id,
        oldStatus: currentIssue.status,
        newStatus,
        changedById: req.user?.id || 'sys-auth',
        changedByName: req.user?.name || 'কর্তৃপক্ষ প্রতিনিধি',
        changedByRole: (req.user?.role || 'AUTHORITY') as any,
        department: assignedDepartment || currentIssue.assignedDepartment || undefined,
        note: note || `Status updated from ${currentIssue.status} to ${newStatus}`,
        noteBn: note || undefined,
        evidenceUrl: evidenceUrl || undefined,
      },
    });

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: updateData,
      include: {
        location: true,
        media: true,
        reporter: {
          select: { id: true, name: true, role: true, avatar: true },
        },
        timeline: { orderBy: { createdAt: 'asc' } },
        verificationVotes: true,
      },
    });

    // If resolved, add impact score to reporter
    if (newStatus === 'RESOLVED') {
      await prisma.user.update({
        where: { id: currentIssue.reporterId },
        data: {
          resolvedCount: { increment: 1 },
          impactScore: { increment: 30 },
        },
      }).catch(() => null);
    }

    // Broadcast status change via Socket.io
    broadcastIssueStatusUpdate({
      id,
      newStatus,
      note: note || '',
      department: assignedDepartment,
      assignedOfficer,
      evidenceUrl,
      historyEntry: timelineEntry,
    });

    return res.json({
      success: true,
      message: `Issue status updated to ${newStatus}`,
      data: updatedIssue,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: ENV.NODE_ENV === 'production' ? 'Failed to update issue status' : (error.message || 'Failed to update issue status'),
    });
  }
}

export async function confirmIssue(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    // SECURITY: Authentication required (enforced by route middleware)
    const userId = req.user!.id;

    // Check if user already confirmed
    const existing = await prisma.userConfirmIssue.findUnique({
      where: {
        userId_issueId: {
          userId,
          issueId: id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already confirmed this issue',
      });
    }

    // Create confirmation
    await prisma.userConfirmIssue.create({
      data: {
        userId,
        issueId: id,
      },
    });

    // Increment count on issue
    const updated = await prisma.issue.update({
      where: { id },
      data: {
        communityConfirmations: { increment: 1 },
      },
      select: { id: true, communityConfirmations: true },
    });

    // Add points to citizen
    if (req.user?.id) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { impactScore: { increment: 5 } },
      }).catch(() => null);
    }

    broadcastIssueConfirmation(id, updated.communityConfirmations);

    return res.json({
      success: true,
      message: 'Issue confirmed successfully',
      data: {
        id,
        communityConfirmations: updated.communityConfirmations,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: ENV.NODE_ENV === 'production' ? 'Failed to confirm issue' : (error.message || 'Failed to confirm issue'),
    });
  }
}

export async function voteResolution(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { vote, comment } = req.body;

    if (vote !== 'FIXED' && vote !== 'STILL_EXISTS') {
      return res.status(400).json({
        success: false,
        message: "vote must be 'FIXED' or 'STILL_EXISTS'",
      });
    }

    // SECURITY: Authentication required (enforced by route middleware)
    const userId = req.user!.id;
    const userName = req.user!.name;

    // Upsert vote
    await prisma.citizenVerificationVote.upsert({
      where: {
        issueId_userId: {
          issueId: id,
          userId,
        },
      },
      update: {
        vote,
        comment: comment || undefined,
      },
      create: {
        issueId: id,
        userId,
        userName: userName || 'নাগরিক',
        vote,
        comment: comment || undefined,
      },
    });

    const allVotes = await prisma.citizenVerificationVote.findMany({
      where: { issueId: id },
    });

    const fixedCount = allVotes.filter((v) => v.vote === 'FIXED').length;
    const stillExistsCount = allVotes.filter((v) => v.vote === 'STILL_EXISTS').length;

    // If still exists votes are dominant (e.g. >= 3 and more than fixed), auto reopen
    if (stillExistsCount >= 3 && stillExistsCount > fixedCount) {
      await prisma.issue.update({
        where: { id },
        data: { status: 'REOPENED' },
      });
      await prisma.statusHistoryEntry.create({
        data: {
          issueId: id,
          oldStatus: 'RESOLVED',
          newStatus: 'REOPENED',
          changedById: userId,
          changedByName: 'নাগরিক ভেরিফিকেশন সিস্টেম',
          changedByRole: 'CITIZEN',
          note: `জনগণের যাচাইকরণে সমস্যাটি এখনও বিদ্যমান প্রতীয়মান হওয়ায় পুনরায় খোলা হয়েছে (ভোট: ${stillExistsCount} জন নাগরিক বলেছেন সমস্যা এখনও আছে)`,
        },
      });
    }

    broadcastIssueVote({
      id,
      fixedCount,
      stillExistsCount,
      vote,
    });

    return res.json({
      success: true,
      message: 'Citizen resolution vote recorded',
      data: {
        fixedCount,
        stillExistsCount,
        userVote: vote,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: ENV.NODE_ENV === 'production' ? 'Failed to record vote' : (error.message || 'Failed to record vote'),
    });
  }
}

export async function followIssue(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const existing = await prisma.userFollowIssue.findUnique({
      where: {
        userId_issueId: {
          userId: req.user.id,
          issueId: id,
        },
      },
    });

    if (existing) {
      await prisma.userFollowIssue.delete({
        where: { id: existing.id },
      });
      return res.json({
        success: true,
        message: 'Unfollowed issue',
        data: { followed: false },
      });
    } else {
      await prisma.userFollowIssue.create({
        data: {
          userId: req.user.id,
          issueId: id,
        },
      });
      return res.json({
        success: true,
        message: 'Followed issue updates',
        data: { followed: true },
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: ENV.NODE_ENV === 'production' ? 'Failed to toggle follow status' : (error.message || 'Failed to toggle follow status'),
    });
  }
}

export async function getNearbyDuplicates(req: Request, res: Response) {
  try {
    const { lat, lng, radius = '500', categoryId } = req.query as Record<string, string>;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat and lng parameters are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusMeters = parseFloat(radius) || 500;

    const where: any = {
      location: { isNot: null },
      status: { notIn: ['RESOLVED', 'CLOSED', 'REJECTED', 'DUPLICATE'] },
    };

    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId;
    }

    const candidates = await prisma.issue.findMany({
      where,
      include: {
        location: true,
        media: true,
      },
      take: 100,
    });

    const nearby = candidates
      .filter((item) => item.location !== null)
      .map((item) => {
        const dist = getDistanceInMeters(
          latitude,
          longitude,
          item.location!.latitude,
          item.location!.longitude
        );
        return {
          issue: item,
          distanceMeters: dist,
        };
      })
      .filter((item) => item.distanceMeters <= radiusMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    return res.json({
      success: true,
      data: nearby,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to find nearby duplicates',
    });
  }
}
