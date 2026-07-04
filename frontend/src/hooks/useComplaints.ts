import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { complaintApi } from '@/api/complaints';
import type { ComplaintRequest, ComplaintStatusUpdateRequest } from '@/types/complaint.types';

export function useFileComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ComplaintRequest) => complaintApi.file(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint filed successfully.');
    },
    onError: () => toast.error('Failed to file complaint.'),
  });
}

export function useMyComplaints() {
  return useQuery({
    queryKey: ['complaints', 'my'],
    queryFn: () => complaintApi.getMy().then((r) => r.data.data),
  });
}

export function useAllComplaints(status?: string) {
  return useQuery({
    queryKey: ['complaints', 'all', status],
    queryFn: () => complaintApi.getAll(status).then((r) => r.data.data),
  });
}

export function useUpdateComplaintStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: ComplaintStatusUpdateRequest }) =>
      complaintApi.updateStatus(uuid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint status updated.');
    },
    onError: () => toast.error('Failed to update complaint status.'),
  });
}
