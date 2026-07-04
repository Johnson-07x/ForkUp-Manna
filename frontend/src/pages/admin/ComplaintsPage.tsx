import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { format } from 'date-fns';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useAllComplaints, useUpdateComplaintStatus } from '@/hooks/useComplaints';
import type { Complaint, ComplaintStatus } from '@/types/complaint.types';

const STATUS_OPTIONS: ComplaintStatus[] = ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'];

const STATUS_COLOR: Record<ComplaintStatus, 'error' | 'warning' | 'success' | 'default'> = {
  OPEN: 'error',
  UNDER_REVIEW: 'warning',
  RESOLVED: 'success',
  DISMISSED: 'default',
};

const TABS: Array<{ label: string; value: ComplaintStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Dismissed', value: 'DISMISSED' },
];

interface UpdateDialogProps {
  complaint: Complaint | null;
  onClose: () => void;
}

function UpdateDialog({ complaint, onClose }: UpdateDialogProps) {
  const [status, setStatus] = useState<ComplaintStatus>(complaint?.status ?? 'OPEN');
  const [adminNotes, setAdminNotes] = useState(complaint?.adminNotes ?? '');
  const { mutate: update, isPending } = useUpdateComplaintStatus();

  if (!complaint) return null;

  const handleSubmit = () => {
    update(
      { uuid: complaint.id, data: { status, adminNotes: adminNotes.trim() || undefined } },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open={!!complaint} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Complaint</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>{complaint.subject}</strong>
          <br />
          Filed by {complaint.complainant.name}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s.replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Admin Notes"
          multiline
          rows={3}
          fullWidth
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 2000 } }}
          helperText={`${adminNotes.length}/2000`}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending} loading={isPending}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ComplaintsPage() {
  const [tab, setTab] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Complaint | null>(null);

  const statusFilter = tab !== 'ALL' ? tab : undefined;
  const { data: complaints = [], isLoading } = useAllComplaints(statusFilter);

  return (
    <Box>
      <PageHeader
        title="Complaints"
        subtitle="Review and manage platform complaints"
      />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TABS.map((t) => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={<ReportIcon />}
          title="No complaints"
          description="No complaints found for this filter."
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {complaints.map((c) => (
            <Card key={c.id}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {c.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      <Typography variant="caption" color="text.secondary">
                        By <strong>{c.complainant.name}</strong> ({c.complainant.role})
                      </Typography>
                      {c.reportedUser && (
                        <Typography variant="caption" color="text.secondary">
                          · Against <strong>{c.reportedUser.name}</strong> ({c.reportedUser.role})
                        </Typography>
                      )}
                      {c.donationTitle && (
                        <Typography variant="caption" color="text.secondary">
                          · Donation: <strong>{c.donationTitle}</strong>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Chip
                    label={c.status.replace('_', ' ')}
                    color={STATUS_COLOR[c.status]}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {c.description}
                </Typography>

                {c.adminNotes && (
                  <Box sx={{ mb: 1.5, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Admin Notes
                    </Typography>
                    <Typography variant="body2">{c.adminNotes}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.disabled">
                    {format(new Date(c.createdAt), 'MMM d, yyyy HH:mm')}
                  </Typography>
                  <Button size="small" variant="outlined" onClick={() => setSelected(c)}>
                    Update Status
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <UpdateDialog complaint={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
