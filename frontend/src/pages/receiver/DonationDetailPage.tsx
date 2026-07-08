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
import DirectionsIcon from '@mui/icons-material/Directions';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
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

  const mapsUrl =
    donation.latitude && donation.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${donation.latitude},${donation.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${donation.address}, ${donation.city}, ${donation.state}`
        )}`;

  return (
    <Box>
      <PageHeader
        title={donation.title}
        subtitle={`Posted by ${donation.donor.name} · ${format(new Date(donation.createdAt), 'MMMM d, yyyy')}`}
        action={{ label: 'Back', onClick: () => navigate('/receiver/donations') }}
      />

      <Grid container spacing={3}>

        {/* ── Uber-style pickup map — full width ── */}
        {donation.latitude && donation.longitude && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ overflow: 'hidden', borderRadius: 2 }}>
              {/* Floating label overlay on top of map */}
              <Box sx={{ position: 'relative' }}>
                <DonationMap
                  latitude={donation.latitude}
                  longitude={donation.longitude}
                  height={400}
                  sx={{ borderRadius: 0, border: 'none' }}
                />
                <Chip
                  icon={<LocationOnIcon sx={{ color: '#ff4444 !important' }} />}
                  label="Pickup Point"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    zIndex: 1200,
                    bgcolor: 'rgba(0,0,0,0.72)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backdropFilter: 'blur(4px)',
                  }}
                />
              </Box>

              {/* Dark address strip — Uber/Ola style */}
              <Box
                sx={{
                  bgcolor: '#111827',
                  color: 'white',
                  px: 2.5,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {/* Pulsing location dot */}
                <Box
                  sx={{
                    position: 'relative',
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      bgcolor: '#22c55e',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: -5,
                      borderRadius: '50%',
                      border: '2px solid #22c55e',
                      opacity: 0.35,
                    },
                  }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.45, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.2 }}
                  >
                    Pickup Address
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                    {donation.address}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>
                    {donation.city}, {donation.state}
                    {donation.pincode ? ` – ${donation.pincode}` : ''}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DirectionsIcon />}
                  component="a"
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flexShrink: 0, borderRadius: 5, px: 2, fontWeight: 700 }}
                >
                  Directions
                </Button>
              </Box>

              {/* Pickup instructions strip */}
              {donation.pickupInstructions && (
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    bgcolor: 'action.hover',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  <AccessTimeIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                      Pickup Instructions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {donation.pickupInstructions}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        )}

        {/* ── Main content ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
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

              {/* Show pickup instructions here only when there's no map (no coordinates) */}
              {!donation.latitude && donation.pickupInstructions && (
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
        </Grid>

        {/* ── Sidebar ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Donor info */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Donor Contact</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{donation.donor.name}</Typography>
              </Box>
              {donation.donor.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography
                    variant="body2"
                    component="a"
                    href={`tel:${donation.donor.phone}`}
                    sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {donation.donor.phone}
                  </Typography>
                </Box>
              )}
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
