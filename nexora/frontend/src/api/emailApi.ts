import axiosInstance from './axiosInstance';
import type { EmailPage } from '../types/Email';

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

  /** Returns all senders ranked by email count with latest subject */
  getSenderSummary: async (): Promise<SenderSummary[]> => {
    const { data } = await axiosInstance.get<SenderSummary[]>('/api/emails/by-sender');
    return data;
  },

  /** Returns paginated emails from a specific sender email address */
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
};
