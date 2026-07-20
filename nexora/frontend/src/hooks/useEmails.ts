import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailApi } from '../api/emailApi';
import { authApi } from '../api/authApi';
import { useEmailStore } from '../store/emailStore';
import { useAuthStore } from '../store/authStore';

export function useEmails(page = 0, size = 20) {
  const { activeCategory, activePriority, searchQuery } = useEmailStore();
  const { setLastSyncedAt, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const params = {
    category: activeCategory !== 'ALL' ? activeCategory : undefined,
    priority: activePriority !== 'ALL' ? activePriority : undefined,
    search: searchQuery || undefined,
    page,
    size,
  };

  const emailsQuery = useQuery({
    queryKey: ['emails', params],
    queryFn: () => emailApi.getEmails(params),
    staleTime: 60_000,
  });

  const categoryCountsQuery = useQuery({
    queryKey: ['email-categories'],
    queryFn: emailApi.getCategoryCounts,
    staleTime: 120_000,
  });

  const syncMutation = useMutation({
    mutationFn: emailApi.syncEmails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['email-categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-emails'] });
      setLastSyncedAt(new Date().toISOString());
      authApi.getCurrentUser().then((updatedUser) => {
        setUser({
          userId: updatedUser.userId,
          email: updatedUser.email,
          name: updatedUser.name,
          profilePictureUrl: updatedUser.profilePictureUrl ?? undefined,
          userRole: updatedUser.userRole,
          onboardingComplete: updatedUser.onboardingComplete,
          calendarSyncEnabled: updatedUser.calendarSyncEnabled ?? true,
          lastSyncedAt: updatedUser.lastSyncedAt,
        });
      }).catch((err) => console.error("Failed to fetch updated user role:", err));
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || error.message || "Sync failed. Please check your Google permissions.";
      console.error("Gmail sync error:", error);
      alert("Gmail Sync Failed:\n" + errorMsg);
    }
  });

  const markReadMutation = useMutation({
    mutationFn: emailApi.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  return {
    emails: emailsQuery.data?.content ?? [],
    totalPages: emailsQuery.data?.totalPages ?? 0,
    totalElements: emailsQuery.data?.totalElements ?? 0,
    isLoading: emailsQuery.isLoading,
    isError: emailsQuery.isError,
    categoryCounts: categoryCountsQuery.data ?? {},
    sync: syncMutation.mutate,
    isSyncing: syncMutation.isPending,
    markRead: markReadMutation.mutate,
  };
}
