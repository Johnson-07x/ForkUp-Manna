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
  TextField,
  Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { format } from 'date-fns';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { DonationMap } from '@/components/map/DonationMap';
import { useCreateClaim } from '@/hooks/useClaims';
import { useDonation } from '@/hooks/useDonations';

const FOOD_TYPE_LABEL: Record<string, string> = {
  VEG: 'Vegetarian',
  NON_VEG: 'Non-Vegetarian',
  BOTH: 'Mixed (Veg & Non-Veg)',
};

export function ReceiverDonationDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: donation, isLoading } = useDonation(id);
  const { mutate: createClaim, isPending: claiming } = useCreateClaim();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notes, setNotes] = useState('');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!donation) {
    return <Alert severity="error">Donation not found.</Alert>;
  }

  const canClaim = donation.status === 'AVAILABLE';

  const handleClaim = () => {
    createClaim(
      { donationId: id, notes: notes || undefined },
      { onSuccess: () => navigate('/receiver/claims') }
    );
    setConfirmOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title={donation.title}
        subtitle={`Posted by ${donation.donor.name} · ${format(new Date(donation.createdAt), 'MMMM d, yyyy')}`}
        action={{ label: 'Back', onClick: () => navigate('/receiver/donations') }}
      />

      <Grid container spacing={3}>
        {/* Main content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              {donation.imageUrl && (
                <Box
                  component="img"
                  src={donation.imageUrl}
                  alt={donation.title}
                  sx={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 2, mb: 2 }}
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

          {donation.latitude && donation.longitude && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Pickup Location</Typography>
                <DonationMap latitude={donation.latitude} longitude={donation.longitude} title={donation.title} />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Donor info */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Donor</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{donation.donor.name}</Typography>
              <Typography variant="body2" color="text.secondary">{donation.donor.phone}</Typography>
            </CardContent>
          </Card>

          {/* Claim action */}
          {canClaim && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Claim this donation
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add a note for the donor (optional):
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  placeholder="e.g. I need this for a shelter of 15 people…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<AssignmentTurnedInIcon />}
                  onClick={() => setConfirmOpen(true)}
                  disabled={claiming}
                >
                  Claim Donation
                </Button>
              </CardContent>
            </Card>
          )}

          {!canClaim && (
            <Alert severity="info">
              This donation is {donation.status.toLowerCase()} and is no longer available for claims.
            </Alert>
          )}
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Claim"
        message="You are about to claim this donation. The donor will be notified and can approve or reject your claim."
        confirmLabel="Submit Claim"
        loading={claiming}
        onConfirm={handleClaim}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
