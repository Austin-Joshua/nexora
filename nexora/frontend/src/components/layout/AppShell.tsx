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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
