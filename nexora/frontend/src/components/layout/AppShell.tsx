import React, { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Sidebar for Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer container */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-slate-950 animate-slide-right shadow-2xl z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setMobileMenuOpen(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
