export type ComplaintStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Complaint {
  id: string;
  complainant: UserSummary;
  reportedUser?: UserSummary;
  donationId?: string;
  donationTitle?: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintRequest {
  subject: string;
  description: string;
  reportedUserId?: string;
  donationId?: string;
}

export interface ComplaintStatusUpdateRequest {
  status: ComplaintStatus;
  adminNotes?: string;
}
