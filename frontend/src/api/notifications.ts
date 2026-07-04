import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';
import type { Notification, NotificationPage } from '@/types/notification.types';

export const notificationApi = {
  getMy: (page = 0, size = 20) =>
    apiClient.get<ApiResponse<NotificationPage>>(`/notifications?page=${page}&size=${size}`),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count'),

  markRead: (id: string) =>
    apiClient.put<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllRead: () =>
    apiClient.put<ApiResponse<void>>('/notifications/read-all'),
};
