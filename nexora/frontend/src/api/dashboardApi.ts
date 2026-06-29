import axiosInstance from './axiosInstance';

export interface DashboardSummary {
  priorityEmails: any[];
  upcomingDeadlines: any[];
  pendingActions: any[];
  unreadCount: number;
  categoryCounts: Record<string, number>;
  todaysMeetings: any[];
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const { data } = await axiosInstance.get<DashboardSummary>('/api/dashboard/summary');
    return data;
  },
};
