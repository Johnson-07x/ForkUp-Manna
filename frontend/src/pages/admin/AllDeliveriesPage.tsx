import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  InputAdornment,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { useAllDeliveries } from '@/hooks/useDeliveries';
import type { Delivery, DeliveryStatus } from '@/types/delivery.types';

const STATUS_TABS: Array<{ label: string; value: DeliveryStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'Picked Up', value: 'PICKED_UP' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Failed', value: 'FAILED' },
];

export function AllDeliveriesPage() {
  const { data: deliveries = [], isLoading } = useAllDeliveries();
  const [tab, setTab] = useState<DeliveryStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = deliveries.filter((d: Delivery) => {
    const matchesTab = tab === 'ALL' || d.status === tab;
    const q = search.toLowerCase();
    const matchesSearch =
      d.claim.donation.title.toLowerCase().includes(q) ||
      d.claim.receiver.name.toLowerCase().includes(q) ||
      (d.volunteer?.name ?? '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <Box>
      <PageHeader
        title="All Deliveries"
        subtitle={`${deliveries.length} total deliveries on the platform`}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by donation, receiver or volunteer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {STATUS_TABS.map((t) => (
          <Tab
            key={t.value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {t.label.replace('_', ' ')}
                {t.value !== 'ALL' && (
                  <Chip
                    label={deliveries.filter((d: Delivery) => d.status === t.value).length}
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

      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<LocalShippingIcon />}
              title="No deliveries found"
              description={search ? 'Try a different search term.' : undefined}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Donation</TableCell>
                    <TableCell>Receiver</TableCell>
                    <TableCell>Volunteer</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Delivered</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((d: Delivery) => (
                    <TableRow key={d.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 180 }}>
                          {d.claim.donation.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {d.claim.donation.city}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{d.claim.receiver.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {d.claim.receiver.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {d.volunteer ? (
                          <>
                            <Typography variant="body2">{d.volunteer.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{d.volunteer.phone}</Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.disabled">Unassigned</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(d.createdAt), 'MMM d, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {d.deliveryTime ? (
                          <Typography variant="body2">
                            {format(new Date(d.deliveryTime), 'MMM d, yyyy')}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={d.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
