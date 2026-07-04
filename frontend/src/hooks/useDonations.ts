import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { donationApi } from '@/api/donations';
import type { DonationRequest, DonationSearchParams } from '@/types/donation.types';

export function useAvailableDonations(page = 0, city?: string) {
  return useQuery({
    queryKey: ['donations', 'available', page, city],
    queryFn: () => donationApi.getAvailable(page, 12, city).then((r) => r.data.data),
  });
}

export function useSearchDonations(params: DonationSearchParams, enabled = true) {
  return useQuery({
    queryKey: ['donations', 'search', params],
    queryFn: () => donationApi.search(params).then((r) => r.data.data),
    enabled,
  });
}

export function useMyDonations() {
  return useQuery({
    queryKey: ['donations', 'my'],
    queryFn: () => donationApi.getMy().then((r) => r.data.data),
  });
}

export function useAllDonations() {
  return useQuery({
    queryKey: ['donations', 'all'],
    queryFn: () => donationApi.getAll().then((r) => r.data.data),
  });
}

export function useDonation(id: string) {
  return useQuery({
    queryKey: ['donation', id],
    queryFn: () => donationApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DonationRequest) => donationApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Donation created successfully!');
    },
    onError: () => toast.error('Failed to create donation.'),
  });
}

export function useUpdateDonation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DonationRequest) => donationApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      qc.invalidateQueries({ queryKey: ['donation', id] });
      toast.success('Donation updated.');
    },
    onError: () => toast.error('Failed to update donation.'),
  });
}

export function useCancelDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => donationApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Donation cancelled.');
    },
    onError: () => toast.error('Failed to cancel donation.'),
  });
}

export function useDuplicateDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => donationApi.duplicate(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success(`Donation duplicated! New donation ID: ${res.data.data.id}`);
    },
    onError: () => toast.error('Failed to duplicate donation.'),
  });
}
