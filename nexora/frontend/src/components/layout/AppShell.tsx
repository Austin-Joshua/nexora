import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useWebSocket } from '../../hooks/useWebSocket';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, title, subtitle }) => {
  useWebSocket(); // connect WebSocket for real-time notifications

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar title={title} subtitle={subtitle} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
