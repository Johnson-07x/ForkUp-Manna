import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
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
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useAllUsers, useSuspendUser, useUnsuspendUser } from '@/hooks/useProfile';
import type { User, UserRole } from '@/types/auth.types';

const ROLE_TABS: Array<{ label: string; value: UserRole | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Donors', value: 'DONOR' },
  { label: 'Receivers', value: 'RECEIVER' },
  { label: 'Volunteers', value: 'VOLUNTEER' },
  { label: 'Admins', value: 'ADMIN' },
];

const ROLE_COLOR: Record<UserRole, 'success' | 'info' | 'warning' | 'error'> = {
  DONOR: 'success',
  RECEIVER: 'info',
  VOLUNTEER: 'warning',
  ADMIN: 'error',
};

const STATUS_COLOR: Record<string, 'success' | 'default' | 'error'> = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  SUSPENDED: 'error',
};

function stringAvatar(name: string) {
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();
}

export function UsersPage() {
  const { data: users = [], isLoading } = useAllUsers();
  const [tab, setTab] = useState<UserRole | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { mutate: suspend } = useSuspendUser();
  const { mutate: unsuspend } = useUnsuspendUser();

  const filtered = users.filter((u: User) => {
    const matchesTab = tab === 'ALL' || u.role === tab;
    const q = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const handleSuspend = (user: User) => {
    setPendingId(user.id);
    suspend(user.id, { onSettled: () => setPendingId(null) });
  };

  const handleUnsuspend = (user: User) => {
    setPendingId(user.id);
    unsuspend(user.id, { onSettled: () => setPendingId(null) });
  };

  return (
    <Box>
      <PageHeader
        title="Manage Users"
        subtitle={`${users.length} registered users on the platform`}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name, email or phone…"
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
      >
        {ROLE_TABS.map((t) => (
          <Tab
            key={t.value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {t.label}
                <Chip
                  label={t.value === 'ALL' ? users.length : users.filter((u: User) => u.role === t.value).length}
                  size="small"
                  sx={{ height: 18, '& .MuiChip-label': { px: 0.75, fontSize: 11 } }}
                />
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
              icon={<PeopleIcon />}
              title="No users found"
              description={search ? 'Try a different search term.' : undefined}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((user: User) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 13 }}>
                            {stringAvatar(user.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={ROLE_COLOR[user.role]}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={STATUS_COLOR[user.status] ?? 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {user.role !== 'ADMIN' && (
                          user.status === 'SUSPENDED' ? (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<CheckCircleIcon />}
                              disabled={pendingId === user.id}
                              onClick={() => handleUnsuspend(user)}
                            >
                              Reactivate
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<BlockIcon />}
                              disabled={pendingId === user.id}
                              onClick={() => handleSuspend(user)}
                            >
                              Suspend
                            </Button>
                          )
                        )}
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
