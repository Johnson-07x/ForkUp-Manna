import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DonationCard } from '@/components/donations/DonationCard';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useSearchDonations } from '@/hooks/useDonations';
import type { DonationSearchParams, FoodType } from '@/types/donation.types';

const FOOD_TYPE_OPTIONS: Array<{ label: string; value: FoodType | '' }> = [
  { label: 'All Types', value: '' },
  { label: 'Vegetarian', value: 'VEG' },
  { label: 'Non-Vegetarian', value: 'NON_VEG' },
  { label: 'Mixed', value: 'BOTH' },
];

const EXPIRY_OPTIONS: Array<{ label: string; value: number | '' }> = [
  { label: 'Any time', value: '' },
  { label: 'Within 1 hour', value: 1 },
  { label: 'Within 3 hours', value: 3 },
  { label: 'Within 6 hours', value: 6 },
  { label: 'Within 12 hours', value: 12 },
  { label: 'Within 24 hours', value: 24 },
];

export function BrowseDonationsPage() {
  const [page, setPage] = useState(0);

  // draft filter state (controlled by form inputs)
  const [keyword, setKeyword] = useState('');
  const [foodType, setFoodType] = useState<FoodType | ''>('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [expiresWithin, setExpiresWithin] = useState<number | ''>('');

  // applied filter state (committed on Search click)
  const [applied, setApplied] = useState<DonationSearchParams>({ page: 0, size: 12 });

  const { data: donationPage, isLoading } = useSearchDonations(applied);
  const donations = donationPage?.content ?? [];
  const totalPages = donationPage?.totalPages ?? 0;

  const hasActiveFilters =
    !!applied.keyword || !!applied.foodType || !!applied.city ||
    !!applied.state || !!applied.expiresWithinHours;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next: DonationSearchParams = { page: 0, size: 12 };
    if (keyword.trim()) next.keyword = keyword.trim();
    if (foodType) next.foodType = foodType;
    if (city.trim()) next.city = city.trim();
    if (state.trim()) next.state = state.trim();
    if (expiresWithin !== '') next.expiresWithinHours = expiresWithin as number;
    setApplied(next);
    setPage(0);
  };

  const handleClear = () => {
    setKeyword('');
    setFoodType('');
    setCity('');
    setState('');
    setExpiresWithin('');
    setApplied({ page: 0, size: 12 });
    setPage(0);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, p: number) => {
    const next = { ...applied, page: p - 1 };
    setApplied(next);
    setPage(p - 1);
  };

  return (
    <Box>
      <PageHeader
        title="Available Donations"
        subtitle="Browse food donations near you and claim what you need"
      />

      {/* Search filters */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ mb: 4 }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label="Keyword"
              placeholder="Search by title or description…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Food Type</InputLabel>
              <Select
                label="Food Type"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value as FoodType | '')}
              >
                {FOOD_TYPE_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Expires within</InputLabel>
              <Select
                label="Expires within"
                value={expiresWithin}
                onChange={(e) => setExpiresWithin(e.target.value as number | '')}
              >
                {EXPIRY_OPTIONS.map((o) => (
                  <MenuItem key={String(o.value)} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
            Search
          </Button>
          {hasActiveFilters && (
            <Button type="button" variant="outlined" onClick={handleClear}>
              Clear filters
            </Button>
          )}
          {hasActiveFilters && (
            <Typography variant="body2" color="text.secondary">
              {donationPage?.totalElements ?? 0} result{donationPage?.totalElements !== 1 ? 's' : ''} found
            </Typography>
          )}
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : donations.length === 0 ? (
        <EmptyState
          icon={<SearchIcon />}
          title="No donations available"
          description={
            hasActiveFilters
              ? 'No donations match your filters. Try adjusting your search.'
              : 'Check back later — donors are always adding new food donations.'
          }
        />
      ) : (
        <>
          <Grid container spacing={3}>
            {donations.map((donation) => (
              <Grid key={donation.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <DonationCard donation={donation} linkTo={`/receiver/donations/${donation.id}`} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
