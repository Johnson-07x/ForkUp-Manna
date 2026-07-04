import { useNavigate } from 'react-router-dom';
import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Divider, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import type { Donation } from '@/types/donation.types';
import { StatusChip } from '@/components/common/StatusChip';

const FOOD_TYPE_COLOR: Record<string, 'success' | 'error' | 'warning'> = {
  VEG: 'success',
  NON_VEG: 'error',
  BOTH: 'warning',
};

function timeUntil(isoString: string) {
  const diff = new Date(isoString).getTime() - Date.now();
  if (diff < 0) return 'Expired';
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Less than 1 hr';
  if (hours < 24) return `${hours}h left`;
  return `${Math.floor(hours / 24)}d left`;
}

interface DonationCardProps {
  donation: Donation;
  linkTo?: string;
}

export function DonationCard({ donation, linkTo }: DonationCardProps) {
  const navigate = useNavigate();
  const destination = linkTo ?? `/donations/${donation.id}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea sx={{ flexGrow: 1 }} onClick={() => navigate(destination)}>
        {donation.imageUrl && (
          <CardMedia
            component="img"
            height={160}
            image={donation.imageUrl}
            alt={donation.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        {!donation.imageUrl && (
          <Box
            sx={{
              height: 120,
              bgcolor: 'primary.light',
              opacity: 0.15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RestaurantIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.6 }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, flex: 1, mr: 1 }}>
              {donation.title}
            </Typography>
            <StatusChip status={donation.status} />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={donation.foodType.replace('_', ' ')}
              color={FOOD_TYPE_COLOR[donation.foodType]}
              size="small"
              variant="outlined"
            />
            {donation.servesPeople && (
              <Chip
                icon={<PeopleIcon sx={{ fontSize: '14px !important' }} />}
                label={`${donation.servesPeople} people`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
            {donation.quantity}
          </Typography>

          <Divider sx={{ mb: 1.5 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {donation.city}, {donation.state}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {timeUntil(donation.expiryTime)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              By {donation.donor.name}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
