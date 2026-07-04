import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { reviewApi } from '@/api/reviews';
import type { ReviewRequest } from '@/types/review.types';

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewRequest) => reviewApi.submit(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review submitted successfully!');
    },
    onError: () => toast.error('Failed to submit review.'),
  });
}

export function useReviewsForUser(userUuid: string, enabled = true) {
  return useQuery({
    queryKey: ['reviews', 'for', userUuid],
    queryFn: () => reviewApi.getForUser(userUuid).then((r) => r.data.data),
    enabled: !!userUuid && enabled,
  });
}

export function useMyGivenReviews() {
  return useQuery({
    queryKey: ['reviews', 'my-given'],
    queryFn: () => reviewApi.getMyGiven().then((r) => r.data.data),
  });
}

export function useMyReceivedReviews() {
  return useQuery({
    queryKey: ['reviews', 'my-received'],
    queryFn: () => reviewApi.getMyReceived().then((r) => r.data.data),
  });
}
