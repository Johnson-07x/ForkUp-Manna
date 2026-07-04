import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import StarIcon from '@mui/icons-material/Star';
import { format } from 'date-fns';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { ComplaintDialog } from '@/components/complaints/ComplaintDialog';
import { ReviewDialog } from '@/components/reviews/ReviewDialog';
import { useApproveClaim, useClaimsOnMyDonations, useRejectClaim } from '@/hooks/useClaims';
import type { Claim, ClaimStatus } from '@/types/claim.types';

const TABS: Array<{ label: string; value: ClaimStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const FOOD_TYPE_COLOR: Record<string, 'success' | 'error' | 'warning'> = {
  VEG: 'success',
  NON_VEG: 'error',
  BOTH: 'warning',
};

function ClaimCard({ claim }: { claim: Claim }) {
  const navigate = useNavigate();
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const { mutate: approve, isPending: approving } = useApproveClaim();
  const { mutate: reject, isPending: rejecting } = useRejectClaim();

  const canAct = claim.status === 'PENDING';
  const isCompleted = claim.status === 'COMPLETED';

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Donation
            </Typography>
            <StatusChip status={claim.status} />
          </Box>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 0.5, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            onClick={() => navigate(`/donor/donations/${claim.donation.id}`)}
          >
            {claim.donation.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={claim.donation.foodType.replace('_', ' ')}
              color={FOOD_TYPE_COLOR[claim.donation.foodType] ?? 'default'}
              size="small"
              variant="outlined"
            />
            <Chip label={claim.donation.city} size="small" variant="outlined" />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
            Receiver
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
            {claim.receiver.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {claim.receiver.phone} · {claim.receiver.email}
          </Typography>

          {claim.notes && (
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 1.5 }}>
              "{claim.notes}"
            </Typography>
          )}

          <Typography variant="caption" color="text.disabled">
            {format(new Date(claim.createdAt), 'MMM d, yyyy HH:mm')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            {canAct && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  disabled={approving}
                  onClick={() => setConfirmApprove(true)}
                  sx={{ flex: 1 }}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CancelIcon />}
                  disabled={rejecting}
                  onClick={() => setConfirmReject(true)}
                  sx={{ flex: 1 }}
                >
                  Reject
                </Button>
              </>
            )}
            {isCompleted && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<StarIcon />}
                onClick={() => setReviewOpen(true)}
              >
                Rate Receiver
              </Button>
            )}
            <Button
              variant="text"
              color="error"
              size="small"
              startIcon={<ReportIcon />}
              onClick={() => setComplaintOpen(true)}
            >
              Report
            </Button>
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmApprove}
        title="Approve Claim"
        message="Approve this receiver's claim? A delivery will be scheduled automatically."
        confirmLabel="Approve"
        loading={approving}
        onConfirm={() => { approve(claim.id); setConfirmApprove(false); }}
        onCancel={() => setConfirmApprove(false)}
      />
      <ConfirmDialog
        open={confirmReject}
        title="Reject Claim"
        message="Reject this claim? The receiver will be notified."
        confirmLabel="Reject"
        confirmColor="error"
        loading={rejecting}
        onConfirm={() => { reject(claim.id); setConfirmReject(false); }}
        onCancel={() => setConfirmReject(false)}
      />

      <ReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        donationId={claim.donation.id}
        donationTitle={claim.donation.title}
        revieweeId={claim.receiver.id}
        revieweeName={claim.receiver.name}
      />

      <ComplaintDialog
        open={complaintOpen}
        onClose={() => setComplaintOpen(false)}
        reportedUserId={claim.receiver.id}
        reportedUserName={claim.receiver.name}
        donationId={claim.donation.id}
        donationTitle={claim.donation.title}
      />
    </>
  );
}

export function DonorClaimsPage() {
  const { data: claims = [], isLoading } = useClaimsOnMyDonations();
  const [tab, setTab] = useState<ClaimStatus | 'ALL'>('ALL');

  const filtered = tab === 'ALL' ? claims : claims.filter((c) => c.status === tab);
  const pendingCount = claims.filter((c) => c.status === 'PENDING').length;

  return (
    <Box>
      <PageHeader
        title="Claims Received"
        subtitle="Review and manage claims on your food donations"
      />

      {pendingCount > 0 && (
        <Box
          sx={{
            mb: 3, p: 2, bgcolor: 'warning.light', borderRadius: 2,
            display: 'flex', alignItems: 'center', gap: 1,
          }}
        >
          <AssignmentIcon color="warning" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {pendingCount} pending claim{pendingCount > 1 ? 's' : ''} need{pendingCount === 1 ? 's' : ''} your review.
          </Typography>
        </Box>
      )}

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TABS.map((t) => (
          <Tab
            key={t.value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {t.label}
                {t.value !== 'ALL' && (
                  <Chip
                    label={claims.filter((c) => c.status === t.value).length}
                    size="small"
                    color={t.value === 'PENDING' ? 'warning' : undefined}
                    sx={{ height: 18, '& .MuiChip-label': { px: 0.75, fontSize: 11 } }}
                  />
                )}
              </Box>
            }
            value={t.value}
          />
        ))}
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<AssignmentIcon />}
          title={tab !== 'ALL' ? `No ${tab.toLowerCase()} claims` : 'No claims yet'}
          description={tab === 'ALL' ? 'When receivers claim your donations, they will appear here.' : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {filtered.map((claim) => (
            <Grid key={claim.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ClaimCard claim={claim} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
