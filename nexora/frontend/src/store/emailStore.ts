import { create } from 'zustand';
import type { Email, EmailCategory, Priority } from '../types/Email';

interface EmailState {
  selectedEmail: Email | null;
  activeCategory: EmailCategory | 'ALL';
  activePriority: Priority | 'ALL';
  searchQuery: string;
  lastSyncedAt: Date | null;
  setSelectedEmail: (email: Email | null) => void;
  setActiveCategory: (category: EmailCategory | 'ALL') => void;
  setActivePriority: (priority: Priority | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  setLastSyncedAt: (date: Date) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  selectedEmail: null,
  activeCategory: 'ALL',
  activePriority: 'ALL',
  searchQuery: '',
  lastSyncedAt: null,

  setSelectedEmail: (email) => set({ selectedEmail: email }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setActivePriority: (priority) => set({ activePriority: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLastSyncedAt: (date) => set({ lastSyncedAt: date }),
}));
