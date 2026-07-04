import type { ClaimStatus, DonationSummary } from './claim.types';
import type { UserSummary as ClaimUserSummary } from './donation.types';

export type DeliveryStatus = 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';

export interface ClaimSummary {
  id: string;
  donation: DonationSummary;
  receiver: ClaimUserSummary;
  status: ClaimStatus;
}

export interface Delivery {
  id: string;
  claim: ClaimSummary;
  volunteer: ClaimUserSummary;
  status: DeliveryStatus;
  pickupTime?: string;
  deliveryTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
