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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { format } from 'date-fns';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { ComplaintDialog } from '@/components/complaints/ComplaintDialog';
import { ReviewDialog } from '@/components/reviews/ReviewDialog';
import { useCancelClaim, useConfirmReceived, useMyClaims } from '@/hooks/useClaims';
import type { Claim, ClaimStatus } from '@/types/claim.types';

const TABS: Array<{ label: string; value: ClaimStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const FOOD_TYPE_COLOR: Record<string, 'success' | 'error' | 'warning'> = {
  VEG: 'success',
  NON_VEG: 'error',
  BOTH: 'warning',
};

interface ClaimCardProps {
  claim: Claim;
}

function ClaimCard({ claim }: ClaimCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const { mutate: cancel, isPending } = useCancelClaim();
  const { mutate: confirmReceived, isPending: confirming } = useConfirmReceived();
  const navigate = useNavigate();

  const canCancel = claim.status === 'PENDING';
  const canConfirm = claim.status === 'COMPLETED';
  const donor = claim.donation.donor;

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, flex: 1, mr: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              onClick={() => navigate(`/receiver/donations/${claim.donation.id}`)}
            >
              {claim.donation.title}
            </Typography>
            <StatusChip status={claim.status} />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={claim.donation.foodType.replace('_', ' ')}
              color={FOOD_TYPE_COLOR[claim.donation.foodType] ?? 'default'}
              size="small"
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {claim.donation.address}, {claim.donation.city}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Claimed {format(new Date(claim.createdAt), 'MMM d, yyyy')}
          </Typography>

          {claim.notes && (
            <Typography variant="body2" sx={{ mt: 1.5, fontStyle: 'italic', color: 'text.secondary' }}>
              "{claim.notes}"
            </Typography>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {canConfirm && (
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircleIcon />}
                disabled={confirming}
                onClick={() => confirmReceived(claim.id)}
              >
                Confirm Received
              </Button>
            )}
            {claim.status === 'COMPLETED' && donor && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<StarIcon />}
                onClick={() => setReviewOpen(true)}
              >
                Rate Donor
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setConfirmOpen(true)}
              >
                Cancel Claim
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
        open={confirmOpen}
        title="Cancel Claim"
        message="Are you sure you want to cancel this claim? The donation will become available for others."
        confirmLabel="Yes, Cancel"
        confirmColor="error"
        loading={isPending}
        onConfirm={() => { cancel(claim.id); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />

      {donor && (
        <ReviewDialog
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          donationId={claim.donation.id}
          donationTitle={claim.donation.title}
          revieweeId={donor.id}
          revieweeName={donor.name}
        />
      )}

      <ComplaintDialog
        open={complaintOpen}
        onClose={() => setComplaintOpen(false)}
        reportedUserId={donor?.id}
        reportedUserName={donor?.name}
        donationId={claim.donation.id}
        donationTitle={claim.donation.title}
      />
    </>
  );
}

export function MyClaimsPage() {
  const navigate = useNavigate();
  const { data: claims = [], isLoading } = useMyClaims();
  const [tab, setTab] = useState<ClaimStatus | 'ALL'>('ALL');

  const filtered = tab === 'ALL' ? claims : claims.filter((c) => c.status === tab);

  return (
    <Box>
      <PageHeader
        title="My Claims"
        subtitle="Track your food donation claims"
        action={{ label: 'Browse Donations', icon: <SearchIcon />, onClick: () => navigate('/receiver/donations') }}
      />

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
          description={tab === 'ALL' ? 'Browse available donations and claim food you need.' : undefined}
          action={tab === 'ALL' ? { label: 'Browse Donations', onClick: () => navigate('/receiver/donations') } : undefined}
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
