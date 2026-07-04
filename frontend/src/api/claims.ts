import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';
import type { Claim, ClaimRequest } from '@/types/claim.types';

export const claimApi = {
  create: (data: ClaimRequest) =>
    apiClient.post<ApiResponse<Claim>>('/claims', data),

  getMy: () =>
    apiClient.get<ApiResponse<Claim[]>>('/claims/my'),

  getOnMyDonations: () =>
    apiClient.get<ApiResponse<Claim[]>>('/claims/on-my-donations'),

  getAll: () =>
    apiClient.get<ApiResponse<Claim[]>>('/claims/all'),

  approve: (id: string) =>
    apiClient.put<ApiResponse<Claim>>(`/claims/${id}/approve`),

  reject: (id: string) =>
    apiClient.put<ApiResponse<Claim>>(`/claims/${id}/reject`),

  cancel: (id: string) =>
    apiClient.put<ApiResponse<Claim>>(`/claims/${id}/cancel`),

  confirmReceived: (id: string) =>
    apiClient.put<ApiResponse<Claim>>(`/claims/${id}/confirm-received`),
};
