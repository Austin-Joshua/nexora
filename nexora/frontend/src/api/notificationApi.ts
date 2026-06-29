import axiosInstance from './axiosInstance';
import type { Notification } from '../types/Notification';

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const { data } = await axiosInstance.get<Notification[]>('/api/notifications');
    return data;
  },

  markRead: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/api/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await axiosInstance.patch('/api/notifications/read-all');
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await axiosInstance.get<{ count: number }>('/api/notifications/unread-count');
    return data.count;
  },
};
