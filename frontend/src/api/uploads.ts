import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<string>>('/uploads/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
