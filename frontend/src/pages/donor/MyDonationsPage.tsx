import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { DonationCard } from '@/components/donations/DonationCard';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useMyDonations } from '@/hooks/useDonations';
import type { DonationStatus } from '@/types/donation.types';

const STATUS_TABS: Array<{ label: string; value: DonationStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Claimed', value: 'CLAIMED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export function MyDonationsPage() {
  const navigate = useNavigate();
  const { data: donations = [], isLoading } = useMyDonations();
  const [tab, setTab] = useState<DonationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = donations.filter((d) => {
    const matchesTab = tab === 'ALL' || d.status === tab;
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
                          d.city.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <Box>
      <PageHeader
        title="My Donations"
        subtitle="Track and manage all your food donations"
        action={{ label: 'Post New', icon: <AddIcon />, onClick: () => navigate('/donor/donations/new') }}
      />

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by title or city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 280 }}
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
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FastfoodIcon />}
          title={search || tab !== 'ALL' ? 'No donations match your filter' : 'No donations yet'}
          description={tab === 'ALL' && !search ? 'Post your first food donation to help people in need.' : undefined}
          action={tab === 'ALL' && !search ? { label: 'Post Donation', onClick: () => navigate('/donor/donations/new') } : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {filtered.map((donation) => (
            <Grid key={donation.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <DonationCard donation={donation} linkTo={`/donor/donations/${donation.id}`} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
