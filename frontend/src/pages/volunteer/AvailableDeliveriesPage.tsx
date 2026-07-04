import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useAcceptDelivery, useAvailableDeliveries } from '@/hooks/useDeliveries';
import type { Delivery } from '@/types/delivery.types';

const FOOD_TYPE_COLOR: Record<string, 'success' | 'error' | 'warning'> = {
  VEG: 'success',
  NON_VEG: 'error',
  BOTH: 'warning',
};

interface DeliveryCardProps {
  delivery: Delivery;
}

function DeliveryCard({ delivery }: DeliveryCardProps) {
  const { mutate: accept, isPending } = useAcceptDelivery();
  const { donation } = delivery.claim;
  const receiver = delivery.claim.receiver;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1, mr: 1, lineHeight: 1.3 }}>
            {donation.title}
          </Typography>
          <Chip
            label={donation.foodType.replace('_', ' ')}
            color={FOOD_TYPE_COLOR[donation.foodType] ?? 'default'}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Pickup: {donation.address}, {donation.city}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Deliver to: {receiver.name} · {receiver.phone}
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 2 }}>
          Created {format(new Date(delivery.createdAt), 'MMM d, yyyy HH:mm')}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          startIcon={<DeliveryDiningIcon />}
          disabled={isPending}
          onClick={() => accept(delivery.id)}
        >
          {isPending ? 'Accepting…' : 'Accept Delivery'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function AvailableDeliveriesPage() {
  const { data: deliveries = [], isLoading } = useAvailableDeliveries();

  return (
    <Box>
      <PageHeader
        title="Available Deliveries"
        subtitle="Help deliver donated food to people who need it"
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : deliveries.length === 0 ? (
        <EmptyState
          icon={<DeliveryDiningIcon />}
          title="No deliveries available"
          description="All deliveries have been assigned. Check back later or see your active deliveries."
        />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {deliveries.length} deliver{deliveries.length === 1 ? 'y' : 'ies'} waiting for a volunteer
          </Typography>
          <Grid container spacing={3}>
            {deliveries.map((delivery) => (
              <Grid key={delivery.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <DeliveryCard delivery={delivery} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
