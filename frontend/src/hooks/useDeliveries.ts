import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deliveryApi } from '@/api/deliveries';

export function useAvailableDeliveries() {
  return useQuery({
    queryKey: ['deliveries', 'available'],
    queryFn: () => deliveryApi.getAvailable().then((r) => r.data.data),
  });
}

export function useMyDeliveries() {
  return useQuery({
    queryKey: ['deliveries', 'my'],
    queryFn: () => deliveryApi.getMy().then((r) => r.data.data),
  });
}

export function useAllDeliveries() {
  return useQuery({
    queryKey: ['deliveries', 'all'],
    queryFn: () => deliveryApi.getAll().then((r) => r.data.data),
  });
}

export function useAcceptDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deliveryApi.accept(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      toast.success('Delivery accepted! Head to the pickup location.');
    },
    onError: () => toast.error('Failed to accept delivery.'),
  });
}

export function useMarkPickedUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deliveryApi.markPickedUp(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      toast.success('Marked as picked up. Now deliver it!');
    },
    onError: () => toast.error('Failed to update status.'),
  });
}

export function useMarkDelivered() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deliveryApi.markDelivered(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Great job! Delivery completed.');
    },
    onError: () => toast.error('Failed to mark as delivered.'),
  });
}
