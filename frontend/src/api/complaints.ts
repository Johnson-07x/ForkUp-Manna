import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';
import type { Complaint, ComplaintRequest, ComplaintStatusUpdateRequest } from '@/types/complaint.types';

export const complaintApi = {
  file: (data: ComplaintRequest) =>
    apiClient.post<ApiResponse<Complaint>>('/complaints', data),

  getMy: () =>
    apiClient.get<ApiResponse<Complaint[]>>('/complaints/my'),

  getAll: (status?: string) => {
    const url = status ? `/complaints/all?status=${status}` : '/complaints/all';
    return apiClient.get<ApiResponse<Complaint[]>>(url);
  },

  getById: (uuid: string) =>
    apiClient.get<ApiResponse<Complaint>>(`/complaints/${uuid}`),

  updateStatus: (uuid: string, data: ComplaintStatusUpdateRequest) =>
    apiClient.put<ApiResponse<Complaint>>(`/complaints/${uuid}/status`, data),
};
