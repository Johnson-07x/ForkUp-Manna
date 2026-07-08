import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { storage } from '@/utils/storage';

export function useNotificationSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const tokens = storage.getTokens();
    if (!tokens?.accessToken) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const brokerURL = `${protocol}//${window.location.host}/api/v1/ws`;

    const client = new Client({
      brokerURL,
      connectHeaders: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      reconnectDelay: 5000,
      // Refresh the token header on every reconnect attempt
      beforeConnect: () => {
        const fresh = storage.getTokens();
        client.connectHeaders = {
          Authorization: `Bearer ${fresh?.accessToken ?? ''}`,
        };
      },
      onConnect: () => {
        client.subscribe('/user/queue/notifications', () => {
          // Instantly bump the unread badge
          queryClient.setQueryData<number>(
            ['notifications', 'unread-count'],
            (old) => (old ?? 0) + 1
          );
          // Refresh the notification list
          queryClient.invalidateQueries({ queryKey: ['notifications', 0] });
        });
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame.headers['message']);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  // queryClient is stable — this runs once on mount and cleans up on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
