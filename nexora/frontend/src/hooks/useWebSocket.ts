import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import type { Notification } from '../types/Notification';

// Same normalisation as axiosInstance — strip trailing /api so WS connects to the right endpoint
const RAW_WS_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const WS_BASE = RAW_WS_BASE.replace(/\/api\/?$/, '').replace(/\/$/, '');

export function useWebSocket() {
  const { user, token } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/user/${user.userId}/notifications`, (message) => {
          try {
            const notification: Notification = JSON.parse(message.body);
            addNotification(notification);
          } catch {
            // ignore parse errors
          }
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [user?.userId, token]);
}
