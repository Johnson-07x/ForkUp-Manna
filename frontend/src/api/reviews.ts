import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';
import type { Review, ReviewRequest } from '@/types/review.types';

export const reviewApi = {
  submit: (data: ReviewRequest) =>
    apiClient.post<ApiResponse<Review>>('/reviews', data),

  getForUser: (userUuid: string) =>
    apiClient.get<ApiResponse<Review[]>>(`/reviews/for/${userUuid}`),

  getMyGiven: () =>
    apiClient.get<ApiResponse<Review[]>>('/reviews/my-given'),

  getMyReceived: () =>
    apiClient.get<ApiResponse<Review[]>>('/reviews/my-received'),
};
