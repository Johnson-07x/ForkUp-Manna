import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';

interface StatCardProps {
  label: string;
  value?: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function StatCard({ label, value, icon, color, onClick }: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform .2s ease, box-shadow .2s ease',
        '&:hover': onClick
          ? { transform: 'translateY(-3px)', boxShadow: 6 }
          : {},
        position: 'relative',
        overflow: 'hidden',
        '&::after': onClick ? {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: '16px 16px 0 0',
        } : {},
      }}
    >
      <CardContent sx={{ p: '20px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: 2.5,
            background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
            border: `1px solid ${color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, flexShrink: 0,
          }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1, color: 'text.primary', mb: 0.5 }}>
          {value ?? '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

function DonorDashboard() {
  const { data: stats, isLoading } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="My Donations" value={stats?.myDonations} icon={<FastfoodIcon />}
                    color="#2E7D32" onClick={() => navigate('/donor/donations')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Available" value={stats?.myAvailable} icon={<HourglassEmptyIcon />} color="#1565C0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Claimed" value={stats?.myClaimed} icon={<AssignmentIcon />} color="#F57C00" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Delivered" value={stats?.myDelivered} icon={<CheckCircleIcon />} color="#6A1B9A" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard label="Claims Received" value={stats?.claimsOnMyDonations} icon={<AssignmentIcon />}
                    color="#F57C00" onClick={() => navigate('/donor/claims')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard label="Pending Review" value={stats?.pendingClaimsOnMyDonations} icon={<PendingIcon />}
                    color="#D32F2F" onClick={() => navigate('/donor/claims')} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" size="large" startIcon={<AddIcon />}
                onClick={() => navigate('/donor/donations/new')}>
          Post New Donation
        </Button>
      </Box>
    </>
  );
}

function ReceiverDashboard() {
  const { data: stats, isLoading } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Total Claims" value={stats?.myTotalClaims} icon={<AssignmentIcon />}
                    color="#2E7D32" onClick={() => navigate('/receiver/claims')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Pending" value={stats?.myPendingClaims} icon={<PendingIcon />} color="#F57C00" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Approved" value={stats?.myApprovedClaims} icon={<CheckCircleIcon />} color="#1565C0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Completed" value={stats?.myCompletedClaims} icon={<VolunteerActivismIcon />} color="#6A1B9A" />
        </Grid>
      </Grid>

      <Box>
        <Button variant="contained" size="large" startIcon={<SearchIcon />}
                onClick={() => navigate('/receiver/donations')}>
          Browse Available Donations
        </Button>
      </Box>
    </>
  );
}

function VolunteerDashboard() {
  const { data: stats, isLoading } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard label="Total Deliveries" value={stats?.myTotalDeliveries} icon={<LocalShippingIcon />}
                    color="#2E7D32" onClick={() => navigate('/volunteer/deliveries/my')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard label="Active" value={stats?.myActiveDeliveries} icon={<DeliveryDiningIcon />}
                    color="#F57C00" onClick={() => navigate('/volunteer/deliveries/my')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard label="Completed" value={stats?.myCompletedDeliveries} icon={<CheckCircleIcon />} color="#6A1B9A" />
        </Grid>
      </Grid>

      <Box>
        <Button variant="contained" size="large" startIcon={<DeliveryDiningIcon />}
                onClick={() => navigate('/volunteer/deliveries')}>
          View Available Deliveries
        </Button>
      </Box>
    </>
  );
}

function AdminDashboard() {
  const { data: stats, isLoading } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Platform Overview</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Total Users" value={stats?.totalUsers} icon={<PeopleIcon />}
                    color="#1565C0" onClick={() => navigate('/admin/users')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Donors" value={stats?.totalDonors} icon={<FastfoodIcon />} color="#2E7D32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Receivers" value={stats?.totalReceivers} icon={<VolunteerActivismIcon />} color="#F57C00" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Volunteers" value={stats?.totalVolunteers} icon={<DeliveryDiningIcon />} color="#6A1B9A" />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Donations & Deliveries</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Total Donations" value={stats?.totalDonations} icon={<FastfoodIcon />}
                    color="#2E7D32" onClick={() => navigate('/admin/donations')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Available" value={stats?.availableDonations} icon={<HourglassEmptyIcon />} color="#1565C0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Total Claims" value={stats?.totalClaims} icon={<AssignmentIcon />}
                    color="#F57C00" onClick={() => navigate('/admin/claims')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Delivered" value={stats?.deliveredDonations} icon={<CheckCircleIcon />} color="#6A1B9A" />
        </Grid>
      </Grid>
    </>
  );
}

export function DashboardPage() {
  const { user } = useAuth();

  const ROLE_CONTENT: Record<string, React.ReactNode> = {
    DONOR: <DonorDashboard />,
    RECEIVER: <ReceiverDashboard />,
    VOLUNTEER: <VolunteerDashboard />,
    ADMIN: <AdminDashboard />,
  };

  return (
    <Box>
      {/* Welcome banner */}
      <Box sx={{
        mb: 4, p: 3, borderRadius: 3,
        background: 'linear-gradient(135deg, #0B3D26 0%, #147A54 60%, #1A9060 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -30, right: 100,
          width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(201,89,10,0.18)',
        }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', position: 'relative', zIndex: 1 }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5, position: 'relative', zIndex: 1 }}>
          {user?.role === 'DONOR' && 'Manage your food donations and review incoming claims.'}
          {user?.role === 'RECEIVER' && 'Browse available donations and manage your claims.'}
          {user?.role === 'VOLUNTEER' && 'Help deliver food to those in need and make a difference.'}
          {user?.role === 'ADMIN' && 'Platform-wide overview of ForkUp Manna operations.'}
        </Typography>
      </Box>
      {user?.role ? ROLE_CONTENT[user.role] : null}
    </Box>
  );
}
