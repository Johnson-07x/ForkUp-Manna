import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useSubmitReview } from '@/hooks/useReviews';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  donationId: string;
  donationTitle: string;
  revieweeId: string;
  revieweeName: string;
}

export function ReviewDialog({
  open,
  onClose,
  donationId,
  donationTitle,
  revieweeId,
  revieweeName,
}: ReviewDialogProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const { mutate: submit, isPending } = useSubmitReview();

  const handleSubmit = () => {
    if (!rating) return;
    submit(
      { donationId, revieweeId, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          setRating(null);
          setComment('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (isPending) return;
    setRating(null);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rate &amp; Review</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          How was your experience with <strong>{revieweeName}</strong> for{' '}
          <strong>{donationTitle}</strong>?
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 1 }}>
          <Rating
            size="large"
            value={rating}
            onChange={(_, val) => setRating(val)}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {rating && (
            <Typography variant="caption" color="text.secondary">
              {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][rating]}
            </Typography>
          )}
        </Box>

        <TextField
          label="Comment (optional)"
          multiline
          rows={3}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
          helperText={`${comment.length}/1000`}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isPending}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!rating || isPending}
          loading={isPending}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}
