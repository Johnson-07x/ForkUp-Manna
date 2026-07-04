import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';
import type { Delivery } from '@/types/delivery.types';

export const deliveryApi = {
  getAvailable: () =>
    apiClient.get<ApiResponse<Delivery[]>>('/deliveries/available'),

  getMy: () =>
    apiClient.get<ApiResponse<Delivery[]>>('/deliveries/my'),

  getAll: () =>
    apiClient.get<ApiResponse<Delivery[]>>('/deliveries/all'),

  accept: (id: string) =>
    apiClient.put<ApiResponse<Delivery>>(`/deliveries/${id}/accept`),

  markPickedUp: (id: string) =>
    apiClient.put<ApiResponse<Delivery>>(`/deliveries/${id}/pickup`),

  markDelivered: (id: string) =>
    apiClient.put<ApiResponse<Delivery>>(`/deliveries/${id}/deliver`),
};
