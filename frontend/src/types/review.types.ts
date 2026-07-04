export interface ReviewerSummary {
  id: string;
  name: string;
  role: string;
}

export interface Review {
  id: string;
  reviewer: ReviewerSummary;
  reviewee: ReviewerSummary;
  donationId: string;
  donationTitle: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewRequest {
  donationId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
}
