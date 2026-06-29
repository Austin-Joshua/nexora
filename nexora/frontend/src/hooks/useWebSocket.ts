import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import type { Notification } from '../types/Notification';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function useWebSocket() {
  const { user, token } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE}/ws`),
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
