import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDistanceToNow } from 'date-fns';
import { useMarkAllNotificationsRead, useNotifications, useUnreadCount } from '@/hooks/useNotifications';

export function NotificationBell() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  const { data: unreadCount = 0, refetch: refetchCount } = useUnreadCount();
  const { data: page, refetch: refetchList } = useNotifications(0);
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const notifications = page?.content?.slice(0, 5) ?? [];

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchor(e.currentTarget);
          refetchList();
          refetchCount();
        }}
        sx={{ color: 'text.primary' }}
      >
        <Badge badgeContent={unreadCount || undefined} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 480 } } }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          {(unreadCount ?? 0) > 0 && (
            <Button size="small" onClick={() => markAllRead()}>
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              You&apos;re all caught up!
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((n) => (
              <ListItemButton
                key={n.id}
                sx={{ bgcolor: n.read ? 'transparent' : 'action.hover', alignItems: 'flex-start', py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 600 }}>
                      {n.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" component="span">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}

        <Divider />
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            size="small"
            onClick={() => {
              setAnchor(null);
              navigate('/notifications');
            }}
          >
            View all notifications
          </Button>
        </Box>
      </Popover>
    </>
  );
}
