import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';
import type { Donation, DonationPage, DonationRequest, DonationSearchParams } from '@/types/donation.types';

export const donationApi = {
  create: (data: DonationRequest) =>
    apiClient.post<ApiResponse<Donation>>('/donations', data),

  getAvailable: (page = 0, size = 12, city?: string) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (city) params.set('city', city);
    return apiClient.get<ApiResponse<DonationPage>>(`/donations?${params}`);
  },

  search: (p: DonationSearchParams) => {
    const params = new URLSearchParams({ page: String(p.page ?? 0), size: String(p.size ?? 12) });
    if (p.keyword) params.set('keyword', p.keyword);
    if (p.foodType) params.set('foodType', p.foodType);
    if (p.city) params.set('city', p.city);
    if (p.state) params.set('state', p.state);
    if (p.expiresWithinHours) params.set('expiresWithinHours', String(p.expiresWithinHours));
    return apiClient.get<ApiResponse<DonationPage>>(`/donations/search?${params}`);
  },

  getMy: () =>
    apiClient.get<ApiResponse<Donation[]>>('/donations/my'),

  getAll: () =>
    apiClient.get<ApiResponse<Donation[]>>('/donations/all'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Donation>>(`/donations/${id}`),

  update: (id: string, data: DonationRequest) =>
    apiClient.put<ApiResponse<Donation>>(`/donations/${id}`, data),

  cancel: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/donations/${id}`),

  duplicate: (id: string) =>
    apiClient.post<ApiResponse<Donation>>(`/donations/${id}/duplicate`),
};
