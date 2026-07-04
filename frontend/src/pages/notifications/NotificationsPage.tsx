import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Pagination,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDistanceToNow } from 'date-fns';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/hooks/useNotifications';
import type { Notification, NotificationType } from '@/types/notification.types';

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  DONATION_CREATED:  <FastfoodIcon fontSize="small" />,
  DONATION_CLAIMED:  <AssignmentIcon fontSize="small" />,
  CLAIM_APPROVED:    <CheckCircleIcon fontSize="small" />,
  CLAIM_REJECTED:    <AnnouncementIcon fontSize="small" />,
  DELIVERY_ASSIGNED: <DeliveryDiningIcon fontSize="small" />,
  DELIVERY_COMPLETED: <CheckCircleIcon fontSize="small" />,
  SYSTEM:            <NotificationsIcon fontSize="small" />,
};

const TYPE_COLOR: Partial<Record<NotificationType, 'success' | 'info' | 'warning' | 'error' | 'primary'>> = {
  CLAIM_APPROVED:    'success',
  CLAIM_REJECTED:    'error',
  DELIVERY_COMPLETED: 'success',
  DONATION_CLAIMED:  'info',
  DELIVERY_ASSIGNED: 'primary',
  SYSTEM:            'warning',
};

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  const { mutate: markRead } = useMarkNotificationRead();
  const color = TYPE_COLOR[notification.type] ?? 'default';

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        cursor: 'pointer',
        bgcolor: notification.read ? 'transparent' : 'action.hover',
        borderRadius: 2,
        mb: 0.5,
        px: 2,
        py: 1.5,
        '&:hover': { bgcolor: 'action.selected' },
      }}
      onClick={() => { if (!notification.read) markRead(notification.id); }}
    >
      <Box
        sx={{
          width: 36, height: 36, borderRadius: 2, mr: 2, flexShrink: 0,
          bgcolor: `${color}.main`, opacity: 0.85,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
        }}
      >
        {TYPE_ICON[notification.type]}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 700 }}>
            {notification.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            {!notification.read && (
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
            )}
            <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap' }}>
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {notification.message}
        </Typography>
        <Chip
          label={notification.type.replace(/_/g, ' ')}
          size="small"
          variant="outlined"
          color={color === 'default' ? undefined : color}
          sx={{ mt: 1, fontSize: 10, height: 20 }}
        />
      </Box>
    </ListItem>
  );
}

export function NotificationsPage() {
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState<'ALL' | 'UNREAD'>('ALL');

  const { data: notifPage, isLoading } = useNotifications(page);
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllNotificationsRead();

  const notifications = notifPage?.content ?? [];
  const totalPages = notifPage?.totalPages ?? 0;

  const displayed = tab === 'UNREAD'
    ? notifications.filter((n: Notification) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle="Stay up-to-date on your donations, claims, and deliveries"
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="All" value="ALL" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                Unread
                {unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    size="small"
                    color="primary"
                    sx={{ height: 18, '& .MuiChip-label': { px: 0.75, fontSize: 11 } }}
                  />
                )}
              </Box>
            }
            value="UNREAD"
          />
        </Tabs>
        {unreadCount > 0 && (
          <Button size="small" onClick={() => markAllRead()} disabled={markingAll}>
            Mark all as read
          </Button>
        )}
      </Box>

      <Card>
        <CardContent sx={{ p: 2 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : displayed.length === 0 ? (
            <EmptyState
              icon={<NotificationsIcon />}
              title={tab === 'UNREAD' ? 'All caught up!' : 'No notifications yet'}
              description={tab === 'UNREAD' ? 'You have no unread notifications.' : 'Notifications will appear here as you use the platform.'}
            />
          ) : (
            <>
              <List disablePadding>
                {displayed.map((n: Notification, idx: number) => (
                  <Box key={n.id}>
                    <NotificationItem notification={n} />
                    {idx < displayed.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </Box>
                ))}
              </List>

              {totalPages > 1 && tab === 'ALL' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={(_, p) => setPage(p - 1)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
