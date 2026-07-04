import { Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { DonationStatus } from '@/types/donation.types';
import type { ClaimStatus } from '@/types/claim.types';
import type { DeliveryStatus } from '@/types/delivery.types';

type Status = DonationStatus | ClaimStatus | DeliveryStatus;

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // Donation
  AVAILABLE:  { label: 'Available',  color: '#1B8A52', bg: alpha('#1B8A52', 0.11) },
  CLAIMED:    { label: 'Claimed',    color: '#1565A8', bg: alpha('#1565A8', 0.10) },
  PICKED_UP:  { label: 'Picked Up',  color: '#7B5EA7', bg: alpha('#7B5EA7', 0.10) },
  DELIVERED:  { label: 'Delivered',  color: '#147A54', bg: alpha('#147A54', 0.12) },
  EXPIRED:    { label: 'Expired',    color: '#78909C', bg: alpha('#78909C', 0.12) },
  CANCELLED:  { label: 'Cancelled',  color: '#C0392B', bg: alpha('#C0392B', 0.10) },
  // Claim
  PENDING:    { label: 'Pending',    color: '#C98A0A', bg: alpha('#C98A0A', 0.12) },
  APPROVED:   { label: 'Approved',   color: '#1B8A52', bg: alpha('#1B8A52', 0.11) },
  REJECTED:   { label: 'Rejected',   color: '#C0392B', bg: alpha('#C0392B', 0.10) },
  COMPLETED:  { label: 'Completed',  color: '#147A54', bg: alpha('#147A54', 0.12) },
  // Delivery
  ASSIGNED:   { label: 'Assigned',   color: '#1565A8', bg: alpha('#1565A8', 0.10) },
  IN_TRANSIT: { label: 'In Transit', color: '#C9590A', bg: alpha('#C9590A', 0.11) },
  FAILED:     { label: 'Failed',     color: '#C0392B', bg: alpha('#C0392B', 0.10) },
};

interface StatusChipProps {
  status: Status;
  size?: 'small' | 'medium';
}

export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const config = STATUS_MAP[status];
  if (!config) return <Chip label={status} size={size} />;
  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        fontWeight: 700,
        fontSize: size === 'small' ? '0.72rem' : '0.8rem',
        bgcolor: config.bg,
        color: config.color,
        border: `1px solid ${alpha(config.color, 0.20)}`,
        '& .MuiChip-label': { px: size === 'small' ? 1.25 : 1.5 },
      }}
    />
  );
}
