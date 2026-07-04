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
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { useAllDonations } from '@/hooks/useDonations';
import type { Donation, DonationStatus } from '@/types/donation.types';

const STATUS_TABS: Array<{ label: string; value: DonationStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Claimed', value: 'CLAIMED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const FOOD_TYPE_COLOR: Record<string, 'success' | 'error' | 'warning'> = {
  VEG: 'success',
  NON_VEG: 'error',
  BOTH: 'warning',
};

export function AllDonationsPage() {
  const { data: donations = [], isLoading } = useAllDonations();
  const [tab, setTab] = useState<DonationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = donations.filter((d: Donation) => {
    const matchesTab = tab === 'ALL' || d.status === tab;
    const q = search.toLowerCase();
    const matchesSearch =
      d.title.toLowerCase().includes(q) ||
      d.donor.name.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <Box>
      <PageHeader
        title="All Donations"
        subtitle={`${donations.length} total donations on the platform`}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by title, donor or city…"
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
                {t.label}
                {t.value !== 'ALL' && (
                  <Chip
                    label={donations.filter((d: Donation) => d.status === t.value).length}
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
              icon={<FastfoodIcon />}
              title="No donations found"
              description={search ? 'Try a different search term.' : undefined}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Donation</TableCell>
                    <TableCell>Donor</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Food Type</TableCell>
                    <TableCell>Expiry</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((d: Donation) => (
                    <TableRow key={d.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 200 }}>
                          {d.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {d.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{d.donor.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{d.donor.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{d.city}, {d.state}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={d.foodType.replace('_', ' ')}
                          color={FOOD_TYPE_COLOR[d.foodType]}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(d.expiryTime), 'MMM d, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(d.expiryTime), 'HH:mm')}
                        </Typography>
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
