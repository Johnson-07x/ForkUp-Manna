import type { DonationStatus, FoodType, UserSummary } from './donation.types';

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface DonationSummary {
  id: string;
  title: string;
  city: string;
  address: string;
  status: DonationStatus;
  foodType: FoodType;
  donor?: UserSummary;
}

export interface ClaimRequest {
  donationId: string;
  notes?: string;
}

export interface Claim {
  id: string;
  donation: DonationSummary;
  receiver: UserSummary;
  volunteer?: UserSummary;
  status: ClaimStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
