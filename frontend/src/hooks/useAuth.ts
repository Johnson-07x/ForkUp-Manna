import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { authApi } from '@/api/auth';

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => toast.success('Password changed successfully.'),
    onError: () => toast.error('Failed to change password. Check your current password.'),
  });
}
