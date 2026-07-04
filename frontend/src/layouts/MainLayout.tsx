import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { SIDEBAR } from '@/theme/theme';
import type { UserRole } from '@/types/auth.types';

const DRAWER_WIDTH = 252;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  DONOR: [
    { label: 'Dashboard',      icon: <DashboardIcon />,  path: '/dashboard' },
    { label: 'Post Donation',  icon: <AddCircleIcon />,  path: '/donor/donations/new' },
    { label: 'My Donations',   icon: <ListAltIcon />,    path: '/donor/donations' },
    { label: 'Claims Received', icon: <AssignmentIcon />, path: '/donor/claims' },
  ],
  RECEIVER: [
    { label: 'Dashboard',        icon: <DashboardIcon />,      path: '/dashboard' },
    { label: 'Browse Donations', icon: <SearchIcon />,          path: '/receiver/donations' },
    { label: 'My Claims',        icon: <AssignmentIcon />,      path: '/receiver/claims' },
  ],
  VOLUNTEER: [
    { label: 'Dashboard',           icon: <DashboardIcon />,        path: '/dashboard' },
    { label: 'Available Deliveries', icon: <DeliveryDiningIcon />,  path: '/volunteer/deliveries' },
    { label: 'My Deliveries',       icon: <LocalShippingIcon />,    path: '/volunteer/deliveries/my' },
  ],
  ADMIN: [
    { label: 'Dashboard',     icon: <DashboardIcon />,       path: '/dashboard' },
    { label: 'All Donations', icon: <FastfoodIcon />,        path: '/admin/donations' },
    { label: 'All Claims',    icon: <AssignmentIcon />,      path: '/admin/claims' },
    { label: 'All Deliveries', icon: <LocalShippingIcon />, path: '/admin/deliveries' },
    { label: 'Manage Users',  icon: <PeopleIcon />,          path: '/admin/users' },
    { label: 'Complaints',    icon: <ReportIcon />,           path: '/admin/complaints' },
  ],
};

const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  DONOR:     { label: 'Donor', color: '#4CAF89' },
  RECEIVER:  { label: 'Receiver', color: '#5BA4F5' },
  VOLUNTEER: { label: 'Volunteer', color: '#E8903A' },
  ADMIN:     { label: 'Admin', color: '#E05040' },
};

function stringAvatar(name: string) {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`
    : name.slice(0, 2).toUpperCase();
}

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = NAV_ITEMS[user?.role as UserRole] ?? [];
  const roleMeta = ROLE_META[user?.role as UserRole];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Logo ── */}
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: 2,
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>
            🍽️
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem', lineHeight: 1 }}>
              ForkUp
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', letterSpacing: 2.5, textTransform: 'uppercase' }}>
              Manna
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Role badge ── */}
      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.75,
          px: 1.5, py: 0.5,
          borderRadius: 6,
          background: 'rgba(255,255,255,0.07)',
        }}>
          <Box sx={{
            width: 7, height: 7, borderRadius: '50%',
            bgcolor: roleMeta?.color ?? '#4CAF89',
            boxShadow: `0 0 6px ${roleMeta?.color ?? '#4CAF89'}`,
          }} />
          <Typography sx={{ color: SIDEBAR.text, fontSize: '0.75rem', fontWeight: 600, letterSpacing: 0.5 }}>
            {roleMeta?.label ?? user?.role}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: SIDEBAR.divider, mx: 2, mb: 1 }} />

      {/* ── Nav items ── */}
      <List sx={{ px: 1.5, flex: 1, pt: 0.5 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <ListItemButton
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1.1,
                px: 1.5,
                bgcolor: active ? alpha('#147A54', 0.28) : 'transparent',
                color: active ? '#FFFFFF' : SIDEBAR.text,
                position: 'relative',
                '&:hover': {
                  bgcolor: active ? alpha('#147A54', 0.35) : SIDEBAR.hoverBg,
                  color: '#FFFFFF',
                  '& .nav-icon': { color: '#FFFFFF' },
                },
                ...(active && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3, height: '60%',
                    borderRadius: '0 3px 3px 0',
                    bgcolor: '#4CAF89',
                  },
                }),
              }}
            >
              <ListItemIcon
                className="nav-icon"
                sx={{ color: active ? '#FFFFFF' : alpha(SIDEBAR.text, 0.65), minWidth: 36, transition: 'color 0.15s' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: active ? 700 : 500 } } }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: SIDEBAR.divider, mx: 2 }} />

      {/* ── Bottom: Profile & Logout ── */}
      <List sx={{ px: 1.5, py: 1 }}>
        <ListItemButton
          sx={{ borderRadius: 2, py: 1, color: SIDEBAR.text, '&:hover': { bgcolor: SIDEBAR.hoverBg, color: '#FFF' } }}
          onClick={() => { navigate('/notifications'); setMobileOpen(false); }}
        >
          <ListItemIcon sx={{ color: 'rgba(212,232,220,0.55)', minWidth: 36 }}>
            <NotificationsNoneIcon />
          </ListItemIcon>
          <ListItemText primary="Notifications" slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500 } } }} />
        </ListItemButton>
        <ListItemButton
          sx={{ borderRadius: 2, py: 1, color: SIDEBAR.text, '&:hover': { bgcolor: SIDEBAR.hoverBg, color: '#FFF' } }}
          onClick={() => { navigate('/profile'); setMobileOpen(false); }}
        >
          <ListItemIcon sx={{ color: 'rgba(212,232,220,0.55)', minWidth: 36 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My Profile" slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500 } } }} />
        </ListItemButton>
        <ListItemButton
          sx={{ borderRadius: 2, py: 1, color: '#F28B82', '&:hover': { bgcolor: 'rgba(240,80,64,0.12)', color: '#F28B82' } }}
          onClick={logout}
        >
          <ListItemIcon sx={{ color: '#F28B82', minWidth: 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign out" slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 600 } } }} />
        </ListItemButton>
      </List>

      {/* ── User info strip ── */}
      <Box sx={{
        px: 2, py: 2,
        borderTop: `1px solid ${SIDEBAR.divider}`,
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: alpha('#147A54', 0.6), fontSize: 13, fontWeight: 700 }}>
          {user?.name ? stringAvatar(user.name) : 'U'}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.825rem', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* ── AppBar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: (t) => t.zIndex.drawer - 1,
        }}
      >
        <Toolbar sx={{ gap: 1, minHeight: '60px !important' }}>
          <IconButton
            sx={{ display: { md: 'none' }, color: 'text.primary', mr: 0.5 }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Breadcrumb hint */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              {navItems.find(n => location.pathname.startsWith(n.path) && n.path !== '/dashboard')?.label
                ?? (location.pathname === '/dashboard' ? 'Dashboard' : '')}
            </Typography>
          </Box>

          <NotificationBell />

          <Tooltip title="Account">
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#147A54', fontSize: 13, fontWeight: 700 }}>
                {user?.name ? stringAvatar(user.name) : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{ paper: { sx: { mt: 0.5, minWidth: 220 } } }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              <Box sx={{ mt: 0.75 }}>
                <Box component="span" sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.5,
                  px: 1, py: 0.25, borderRadius: 4, fontSize: '0.7rem', fontWeight: 700,
                  bgcolor: alpha('#147A54', 0.10), color: '#147A54',
                }}>
                  {user?.role}
                </Box>
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setMenuAnchor(null); navigate('/profile'); }}>
              <PersonIcon sx={{ mr: 1.5, fontSize: 18, color: '#147A54' }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => { setMenuAnchor(null); navigate('/notifications'); }}>
              <NotificationsNoneIcon sx={{ mr: 1.5, fontSize: 18, color: '#147A54' }} /> Notifications
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} /> Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar ── */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* ── Main content ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '60px !important' }} />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
