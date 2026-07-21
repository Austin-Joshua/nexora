import axiosInstance from './axiosInstance';
import type { EmailPage, EmailReaction } from '../types/Email';

export interface SenderSummary {
  senderEmail: string;
  senderName: string | null;
  emailCount: number;
  latestSubject: string | null;
  latestReceivedAt: string | null;
}

export const emailApi = {
  getEmails: async (params: {
    category?: string;
    priority?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<EmailPage> => {
    const { data } = await axiosInstance.get<EmailPage>('/api/emails', { params });
    return data;
  },

  getEmail: async (id: number) => {
    const { data } = await axiosInstance.get(`/api/emails/${id}`);
    return data;
  },

  syncEmails: async (): Promise<{ message: string }> => {
    const { data } = await axiosInstance.post('/api/emails/sync');
    return data;
  },

  getCategoryCounts: async (): Promise<Record<string, number>> => {
    const { data } = await axiosInstance.get('/api/emails/categories');
    return data;
  },

  markRead: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/api/emails/${id}/read`);
  },

  markAsRead: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/api/emails/${id}/read`);
  },

  updateReaction: async (id: number, reaction: EmailReaction): Promise<void> => {
    await axiosInstance.patch(`/api/emails/${id}/reaction`, { reaction });
  },

  sendReply: async (id: number, replyBody: string): Promise<{ message: string }> => {
    const { data } = await axiosInstance.post(`/api/emails/${id}/reply`, { replyBody });
    return data;
  },

  getSenderSummary: async (): Promise<SenderSummary[]> => {
    const { data } = await axiosInstance.get<SenderSummary[]>('/api/emails/by-sender');
    return data;
  },

  getEmailsFromSender: async (
    senderEmail: string,
    page = 0,
    size = 20,
  ): Promise<EmailPage> => {
    const { data } = await axiosInstance.get<EmailPage>(
      `/api/emails/sender/${encodeURIComponent(senderEmail)}`,
      { params: { page, size } },
    );
    return data;
  },

  getEmailThread: async (threadId: string): Promise<any[]> => {
    const { data } = await axiosInstance.get<any[]>(`/api/emails/thread/${threadId}`);
    return data;
  },
};
