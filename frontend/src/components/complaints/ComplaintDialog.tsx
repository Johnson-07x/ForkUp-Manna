import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useFileComplaint } from '@/hooks/useComplaints';

interface ComplaintDialogProps {
  open: boolean;
  onClose: () => void;
  reportedUserId?: string;
  reportedUserName?: string;
  donationId?: string;
  donationTitle?: string;
}

export function ComplaintDialog({
  open,
  onClose,
  reportedUserId,
  reportedUserName,
  donationId,
  donationTitle,
}: ComplaintDialogProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const { mutate: file, isPending } = useFileComplaint();

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) return;
    file(
      {
        subject: subject.trim(),
        description: description.trim(),
        reportedUserId,
        donationId,
      },
      {
        onSuccess: () => {
          setSubject('');
          setDescription('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (isPending) return;
    setSubject('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>File a Complaint</DialogTitle>
      <DialogContent>
        {(reportedUserName || donationTitle) && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {reportedUserName && <>Reporting <strong>{reportedUserName}</strong></>}
            {reportedUserName && donationTitle && ' · '}
            {donationTitle && <>Donation: <strong>{donationTitle}</strong></>}
          </Typography>
        )}

        <TextField
          label="Subject"
          fullWidth
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          helperText={`${subject.length}/100`}
          sx={{ mb: 2, mt: 1 }}
        />

        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 2000 } }}
          helperText={`${description.length}/2000`}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isPending}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={!subject.trim() || !description.trim() || isPending}
          loading={isPending}
        >
          Submit Complaint
        </Button>
      </DialogActions>
    </Dialog>
  );
}
