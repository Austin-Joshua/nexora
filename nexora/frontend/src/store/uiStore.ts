import { create } from 'zustand';

interface BottomSheetState {
  isOpen: boolean;
  type: 'QUICK_ACTIONS' | 'FILTER' | 'REPLY' | null;
  data?: any;
}

interface ReportModalState {
  isOpen: boolean;
  email?: any;
}

interface UIStore {
  bottomSheet: BottomSheetState;
  reportModal: ReportModalState;
  sidebarCollapsed: boolean;
  installPrompt: {
    isAvailable: boolean;
    deferredPrompt: any;
  };
  openBottomSheet: (type: BottomSheetState['type'], data?: any) => void;
  closeBottomSheet: () => void;
  openReportModal: (email: any) => void;
  closeReportModal: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setInstallPrompt: (prompt: any) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  bottomSheet: { isOpen: false, type: null },
  reportModal: { isOpen: false },
  sidebarCollapsed: false,
  installPrompt: { isAvailable: false, deferredPrompt: null },

  openBottomSheet: (type, data) => set({ bottomSheet: { isOpen: true, type, data } }),
  closeBottomSheet: () => set({ bottomSheet: { isOpen: false, type: null, data: undefined } }),

  openReportModal: (email) => set({ reportModal: { isOpen: true, email } }),
  closeReportModal: () => set({ reportModal: { isOpen: false, email: undefined } }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setInstallPrompt: (prompt) => set({ installPrompt: { isAvailable: !!prompt, deferredPrompt: prompt } }),
}));
