import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { DonationMap } from '@/components/map/DonationMap';
import { useApproveClaim, useClaimsOnMyDonations, useRejectClaim } from '@/hooks/useClaims';
import { useCancelDonation, useDonation, useDuplicateDonation } from '@/hooks/useDonations';
import type { Claim, ClaimStatus } from '@/types/claim.types';

const FOOD_TYPE_LABEL: Record<string, string> = {
  VEG: 'Vegetarian',
  NON_VEG: 'Non-Vegetarian',
  BOTH: 'Mixed (Veg & Non-Veg)',
};

const CLAIM_TABS: Array<{ label: string; value: ClaimStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Completed', value: 'COMPLETED' },
];

interface ClaimRowProps {
  claim: Claim;
}

function ClaimRow({ claim }: ClaimRowProps) {
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const { mutate: approve, isPending: approving } = useApproveClaim();
  const { mutate: reject, isPending: rejecting } = useRejectClaim();

  const canAct = claim.status === 'PENDING';

  return (
    <>
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 2, py: 2,
          borderBottom: '1px solid', borderColor: 'divider', flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {claim.receiver.name}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {claim.receiver.phone} · {claim.receiver.email}
          </Typography>
          {claim.notes && (
            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: 'text.secondary' }}>
              "{claim.notes}"
            </Typography>
          )}
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.25 }}>
            {format(new Date(claim.createdAt), 'MMM d, yyyy HH:mm')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <StatusChip status={claim.status} />
          {canAct && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => setConfirmApprove(true)}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setConfirmReject(true)}
              >
                Reject
              </Button>
            </>
          )}
        </Box>
      </Box>

      <ConfirmDialog
        open={confirmApprove}
        title="Approve Claim"
        message="Approve this claim? A delivery will be automatically scheduled for this food donation."
        confirmLabel="Approve"
        confirmColor="primary"
        loading={approving}
        onConfirm={() => { approve(claim.id); setConfirmApprove(false); }}
        onCancel={() => setConfirmApprove(false)}
      />
      <ConfirmDialog
        open={confirmReject}
        title="Reject Claim"
        message="Are you sure you want to reject this claim? The receiver will be notified."
        confirmLabel="Reject"
        confirmColor="error"
        loading={rejecting}
        onConfirm={() => { reject(claim.id); setConfirmReject(false); }}
        onCancel={() => setConfirmReject(false)}
      />
    </>
  );
}

export function DonorDonationDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: donation, isLoading: loadingDonation } = useDonation(id);
  const { data: allClaims = [], isLoading: loadingClaims } = useClaimsOnMyDonations();
  const { mutate: cancel, isPending: cancelling } = useCancelDonation();
  const { mutate: duplicate, isPending: duplicating } = useDuplicateDonation();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [claimTab, setClaimTab] = useState<ClaimStatus | 'ALL'>('ALL');

  const donationClaims = allClaims.filter((c) => c.donation.id === id);
  const filteredClaims = claimTab === 'ALL' ? donationClaims : donationClaims.filter((c) => c.status === claimTab);

  if (loadingDonation) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!donation) {
    return <Alert severity="error">Donation not found.</Alert>;
  }

  const canCancel = donation.status === 'AVAILABLE';

  return (
    <Box>
      <PageHeader
        title={donation.title}
        subtitle={`Posted ${format(new Date(donation.createdAt), 'MMMM d, yyyy')}`}
        action={{ label: 'Back to My Donations', onClick: () => navigate('/donor/donations') }}
      />

      <Grid container spacing={3}>
        {/* Donation info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              {donation.imageUrl && (
                <Box
                  component="img"
                  src={donation.imageUrl}
                  alt={donation.title}
                  sx={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 2, mb: 2 }}
                />
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <StatusChip status={donation.status} />
                <Chip label={FOOD_TYPE_LABEL[donation.foodType]} size="small" color="primary" variant="outlined" />
                {donation.servesPeople && (
                  <Chip icon={<PeopleIcon />} label={`Serves ${donation.servesPeople}`} size="small" variant="outlined" />
                )}
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Quantity</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{donation.quantity}</Typography>

              {donation.description && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Description</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {donation.description}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {donation.address}, {donation.city}, {donation.state}
                    {donation.pincode && ` - ${donation.pincode}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    Expires: {format(new Date(donation.expiryTime), 'MMM d, yyyy HH:mm')}
                  </Typography>
                </Box>
              </Box>

              {donation.pickupInstructions && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Pickup Instructions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {donation.pickupInstructions}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>

          {/* Map */}
          {donation.latitude && donation.longitude && (
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Pickup Location</Typography>
                <DonationMap latitude={donation.latitude} longitude={donation.longitude} title={donation.title} />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar: actions + claims */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Actions</Typography>
              {canCancel && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  sx={{ mb: 1 }}
                  onClick={() => navigate(`/donor/donations/${id}/edit`)}
                >
                  Edit Donation
                </Button>
              )}
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<ContentCopyIcon />}
                disabled={duplicating}
                sx={{ mb: canCancel ? 1 : 0 }}
                onClick={() =>
                  duplicate(id, {
                    onSuccess: (res) => navigate(`/donor/donations/${res.data.data.id}`),
                  })
                }
              >
                Duplicate Donation
              </Button>
              {canCancel && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setConfirmCancel(true)}
                  disabled={cancelling}
                >
                  Cancel Donation
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Claims */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Claims ({donationClaims.length})
              </Typography>

              <Tabs
                value={claimTab}
                onChange={(_, v) => setClaimTab(v)}
                sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
                variant="scrollable"
              >
                {CLAIM_TABS.map((t) => (
                  <Tab key={t.value} label={t.label} value={t.value} sx={{ fontSize: 12 }} />
                ))}
              </Tabs>

              {loadingClaims ? (
                <CircularProgress size={24} />
              ) : filteredClaims.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  {claimTab === 'ALL' ? 'No claims yet.' : `No ${claimTab.toLowerCase()} claims.`}
                </Typography>
              ) : (
                filteredClaims.map((claim) => <ClaimRow key={claim.id} claim={claim} />)
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel Donation"
        message="This will cancel the donation and notify any receivers who have claimed it. This cannot be undone."
        confirmLabel="Cancel Donation"
        confirmColor="error"
        loading={cancelling}
        onConfirm={() => { cancel(id, { onSuccess: () => navigate('/donor/donations') }); setConfirmCancel(false); }}
        onCancel={() => setConfirmCancel(false)}
      />
    </Box>
  );
}
