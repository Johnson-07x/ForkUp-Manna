export type DonationStatus = 'AVAILABLE' | 'CLAIMED' | 'PICKED_UP' | 'DELIVERED' | 'EXPIRED' | 'CANCELLED';
export type FoodType = 'VEG' | 'NON_VEG' | 'BOTH';

export interface UserSummary {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface DonationRequest {
  title: string;
  description?: string;
  foodType: FoodType;
  quantity: string;
  servesPeople?: number;
  expiryTime: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  pickupInstructions?: string;
}

export interface Donation {
  id: string;
  donor: UserSummary;
  title: string;
  description?: string;
  foodType: FoodType;
  quantity: string;
  servesPeople?: number;
  expiryTime: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  status: DonationStatus;
  imageUrl?: string;
  pickupInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationPage {
  content: Donation[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface DonationSearchParams {
  keyword?: string;
  foodType?: FoodType;
  city?: string;
  state?: string;
  expiresWithinHours?: number;
  page?: number;
  size?: number;
}
