import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useWebSocket } from '../../hooks/useWebSocket';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  /** If true, the main content area won't auto-scroll (for pages that manage their own overflow) */
  noScroll?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, title, subtitle, noScroll }) => {
  useWebSocket(); // connect WebSocket for real-time notifications

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar title={title} subtitle={subtitle} />
        <main style={{ flex: 1, overflow: noScroll ? 'hidden' : 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
