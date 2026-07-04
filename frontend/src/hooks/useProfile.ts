import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userApi, type UpdateProfileRequest } from '@/api/users';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getMe().then((r) => r.data.data),
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => userApi.getAll().then((r) => r.data.data),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateMe(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated.');
    },
    onError: () => toast.error('Failed to update profile.'),
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => userApi.suspend(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User suspended.');
    },
    onError: () => toast.error('Failed to suspend user.'),
  });
}

export function useUnsuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => userApi.unsuspend(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User reactivated.');
    },
    onError: () => toast.error('Failed to reactivate user.'),
  });
}
