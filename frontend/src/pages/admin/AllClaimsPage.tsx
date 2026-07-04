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
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { useAllClaims } from '@/hooks/useClaims';
import type { Claim, ClaimStatus } from '@/types/claim.types';

const STATUS_TABS: Array<{ label: string; value: ClaimStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export function AllClaimsPage() {
  const { data: claims = [], isLoading } = useAllClaims();
  const [tab, setTab] = useState<ClaimStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = claims.filter((c: Claim) => {
    const matchesTab = tab === 'ALL' || c.status === tab;
    const q = search.toLowerCase();
    const matchesSearch =
      c.donation.title.toLowerCase().includes(q) ||
      c.receiver.name.toLowerCase().includes(q) ||
      c.receiver.email.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <Box>
      <PageHeader
        title="All Claims"
        subtitle={`${claims.length} total claims on the platform`}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by donation title or receiver…"
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
                    label={claims.filter((c: Claim) => c.status === t.value).length}
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
              icon={<AssignmentIcon />}
              title="No claims found"
              description={search ? 'Try a different search term.' : undefined}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Donation</TableCell>
                    <TableCell>Receiver</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((c: Claim) => (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 200 }}>
                          {c.donation.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {c.donation.city}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{c.receiver.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.receiver.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 160, fontStyle: c.notes ? 'italic' : 'normal' }}>
                          {c.notes ?? '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(c.createdAt), 'MMM d, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={c.status} />
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
