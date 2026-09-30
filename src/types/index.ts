export type UserRole = 'CITIZEN' | 'AUTHORITY' | 'ADMIN' | 'SUPER_ADMIN' | 'MODERATOR';

export type IssueStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CITIZEN_VERIFICATION'
  | 'CLOSED'
  | 'REOPENED'
  | 'REJECTED'
  | 'DUPLICATE';

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueCategoryGroup = 'Infrastructure' | 'Environment' | 'Public Safety' | 'Water & Drainage' | 'Other';

export interface IssueCategory {
  id: string;
  name: string;
  nameBn: string;
  group: IssueCategoryGroup;
  icon: string;
  description: string;
  defaultSeverity: IssueSeverity;
  slaDays: number;
}

export interface IssueLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  addressBn?: string;
  area: string; // e.g. Mirpur, Dhanmondi, Uttara, Mohammadpur
  areaBn?: string;
  ward: string; // e.g. Ward 10, Ward 27
  wardBn?: string;
  city: string; // Dhaka
  cityBn?: string;
  district: string;
  districtBn?: string;
  division: string;
  divisionBn?: string;
}

export interface StatusHistoryEntry {
  id: string;
  issueId: string;
  oldStatus?: IssueStatus;
  newStatus: IssueStatus;
  changedBy: string;
  changedByRole: UserRole;
  department?: string;
  note: string;
  noteBn?: string;
  createdAt: string;
  evidenceUrl?: string;
}

export interface CitizenVerificationVote {
  id: string;
  userId: string;
  userName: string;
  vote: 'FIXED' | 'STILL_EXISTS';
  comment?: string;
  createdAt: string;
}

export interface IssueMedia {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'RESOLUTION_IMAGE';
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface Issue {
  id: string;
  trackingNumber: string; // e.g. NC-2026-DH-1042
  title: string;
  titleBn: string;
  description: string;
  descriptionBn?: string;
  categoryId: string;
  categoryName: string;
  categoryNameBn?: string;
  categoryGroup: IssueCategoryGroup;
  severity: IssueSeverity;
  status: IssueStatus;
  location: IssueLocation;
  
  // Media
  media: IssueMedia[];
  resolutionMedia?: IssueMedia[];
  resolutionNote?: string;
  resolvedAt?: string;
  closedAt?: string;
  
  // Authority assignment
  assignedAuthority?: string; // e.g. "Dhaka North City Corporation (DNCC)"
  assignedAuthorityBn?: string;
  assignedDepartment?: string; // e.g. "Civil Infrastructure & Road Repair"
  assignedDepartmentBn?: string;
  assignedOfficer?: string; // e.g. "Engr. Zahid Hasan"
  targetResolutionDate?: string;
  slaDays: number;
  
  // Community engagement
  reportedBy: {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
  };
  communityConfirmations: number; // "I See This Too" count
  userConfirmed?: boolean; // current user confirmed
  followedByUser?: boolean;
  
  // Citizen verification after authority marked RESOLVED
  citizenVerifications: {
    fixedCount: number;
    stillExistsCount: number;
    userVote?: 'FIXED' | 'STILL_EXISTS';
    votes: CitizenVerificationVote[];
  };
  
  // Audit trail
  timeline: StatusHistoryEntry[];
  
  createdAt: string;
  updatedAt: string;
}

export interface AreaSummary {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  city: string;
  totalReports: number;
  resolvedCount: number;
  inProgressCount: number;
  underReviewCount: number;
  criticalCount: number;
  resolutionRate: number; // percentage
  avgResolutionDays: number;
  topCategories: {
    name: string;
    count: number;
    percent: number;
  }[];
  recentIssues: Issue[];
  center: [number, number]; // [lat, lng]
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'STATUS_CHANGE' | 'VERIFICATION_REQUEST' | 'COMMUNITY_CONFIRM' | 'SLA_ALERT';
  issueId: string;
  trackingNumber: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  joinedDate: string;
  location: string;
  stats: {
    reportsCount: number;
    verifiedCount: number;
    resolvedCount: number;
    impactScore: number;
  };
  badges: {
    id: string;
    name: string;
    nameBn: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}
