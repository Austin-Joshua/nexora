import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useWebSocket } from '../../hooks/useWebSocket';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  noScroll?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, noScroll }) => {
  useWebSocket();

  // Sidebar collapse state persisted in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('gmail_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('gmail_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* TopBar spans full width across top (64px) */}
      <TopBar onToggleSidebar={toggleSidebar} />

      {/* Main container below TopBar */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        {/* Sidebar below TopBar */}
        <Sidebar collapsed={isSidebarCollapsed} />

        {/* Main content pane */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: noScroll ? 'hidden' : 'auto',
            background: 'var(--bg)',
            borderRadius: '16px 0 0 0',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
