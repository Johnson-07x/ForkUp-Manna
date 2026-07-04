import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { claimApi } from '@/api/claims';
import type { ClaimRequest } from '@/types/claim.types';

export function useMyClaims() {
  return useQuery({
    queryKey: ['claims', 'my'],
    queryFn: () => claimApi.getMy().then((r) => r.data.data),
  });
}

export function useClaimsOnMyDonations() {
  return useQuery({
    queryKey: ['claims', 'on-my-donations'],
    queryFn: () => claimApi.getOnMyDonations().then((r) => r.data.data),
  });
}

export function useAllClaims() {
  return useQuery({
    queryKey: ['claims', 'all'],
    queryFn: () => claimApi.getAll().then((r) => r.data.data),
  });
}

export function useCreateClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ClaimRequest) => claimApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['claims'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Claim submitted! The donor will review it.');
    },
    onError: () => toast.error('Failed to submit claim.'),
  });
}

export function useApproveClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => claimApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['claims'] });
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Claim approved! A delivery has been scheduled.');
    },
    onError: () => toast.error('Failed to approve claim.'),
  });
}

export function useRejectClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => claimApi.reject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim rejected.');
    },
    onError: () => toast.error('Failed to reject claim.'),
  });
}

export function useCancelClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => claimApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim cancelled.');
    },
    onError: () => toast.error('Failed to cancel claim.'),
  });
}

export function useConfirmReceived() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => claimApi.confirmReceived(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Receipt confirmed! Thank you for the feedback.');
    },
    onError: () => toast.error('Failed to confirm receipt.'),
  });
}
