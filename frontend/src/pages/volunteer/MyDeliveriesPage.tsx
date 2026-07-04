import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { useMarkDelivered, useMarkPickedUp, useMyDeliveries } from '@/hooks/useDeliveries';
import type { Delivery, DeliveryStatus } from '@/types/delivery.types';

const TABS: Array<{ label: string; value: DeliveryStatus | 'ALL' | 'ACTIVE' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'Picked Up', value: 'PICKED_UP' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Delivered', value: 'DELIVERED' },
];

const STEPS = ['Assigned', 'Picked Up', 'In Transit', 'Delivered'];
const STATUS_STEP: Record<DeliveryStatus, number> = {
  ASSIGNED: 0,
  PICKED_UP: 1,
  IN_TRANSIT: 2,
  DELIVERED: 3,
  FAILED: -1,
};

const FOOD_TYPE_COLOR: Record<string, 'success' | 'error' | 'warning'> = {
  VEG: 'success',
  NON_VEG: 'error',
  BOTH: 'warning',
};

function DeliveryCard({ delivery }: { delivery: Delivery }) {
  const [confirmPickup, setConfirmPickup] = useState(false);
  const [confirmDeliver, setConfirmDeliver] = useState(false);
  const { mutate: markPickedUp, isPending: pickingUp } = useMarkPickedUp();
  const { mutate: markDelivered, isPending: delivering } = useMarkDelivered();

  const { donation } = delivery.claim;
  const receiver = delivery.claim.receiver;
  const step = STATUS_STEP[delivery.status];
  const canPickUp = delivery.status === 'ASSIGNED';
  const canDeliver = delivery.status === 'PICKED_UP' || delivery.status === 'IN_TRANSIT';

  return (
    <>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1, mr: 1, lineHeight: 1.3 }}>
              {donation.title}
            </Typography>
            <StatusChip status={delivery.status} />
          </Box>

          <Chip
            label={donation.foodType.replace('_', ' ')}
            color={FOOD_TYPE_COLOR[donation.foodType] ?? 'default'}
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          {step >= 0 && (
            <Stepper activeStep={step} alternativeLabel sx={{ mb: 2 }}>
              {STEPS.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {donation.address}, {donation.city}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {receiver.name} · {receiver.phone}
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 2 }}>
            Assigned {format(new Date(delivery.createdAt), 'MMM d, yyyy')}
            {delivery.deliveryTime && ` · Delivered ${format(new Date(delivery.deliveryTime), 'MMM d, yyyy HH:mm')}`}
          </Typography>

          {(canPickUp || canDeliver) && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {canPickUp && (
                <Button
                  variant="contained"
                  startIcon={<LocalShippingIcon />}
                  disabled={pickingUp}
                  onClick={() => setConfirmPickup(true)}
                  sx={{ flex: 1 }}
                >
                  Mark Picked Up
                </Button>
              )}
              {canDeliver && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  disabled={delivering}
                  onClick={() => setConfirmDeliver(true)}
                  sx={{ flex: 1 }}
                >
                  Mark Delivered
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmPickup}
        title="Mark as Picked Up"
        message="Confirm that you have picked up the food donation from the donor."
        confirmLabel="Confirm Pickup"
        loading={pickingUp}
        onConfirm={() => { markPickedUp(delivery.id); setConfirmPickup(false); }}
        onCancel={() => setConfirmPickup(false)}
      />
      <ConfirmDialog
        open={confirmDeliver}
        title="Mark as Delivered"
        message="Confirm that you have successfully delivered the food to the receiver."
        confirmLabel="Confirm Delivery"
        confirmColor="primary"
        loading={delivering}
        onConfirm={() => { markDelivered(delivery.id); setConfirmDeliver(false); }}
        onCancel={() => setConfirmDeliver(false)}
      />
    </>
  );
}

export function MyDeliveriesPage() {
  const { data: deliveries = [], isLoading } = useMyDeliveries();
  const [tab, setTab] = useState<DeliveryStatus | 'ALL' | 'ACTIVE'>('ALL');

  const ACTIVE_STATUSES: DeliveryStatus[] = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'];

  const filtered = deliveries.filter((d) => {
    if (tab === 'ALL') return true;
    if (tab === 'ACTIVE') return ACTIVE_STATUSES.includes(d.status);
    return d.status === tab;
  });

  return (
    <Box>
      <PageHeader
        title="My Deliveries"
        subtitle="Manage your active and completed delivery assignments"
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
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<DeliveryDiningIcon />}
          title={tab !== 'ALL' ? `No ${tab.toLowerCase().replace('_', ' ')} deliveries` : 'No deliveries yet'}
          description={tab === 'ALL' ? 'Accept available deliveries to get started.' : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {filtered.map((delivery) => (
            <Grid key={delivery.id} size={{ xs: 12, md: 6 }}>
              <DeliveryCard delivery={delivery} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
