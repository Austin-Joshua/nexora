import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { BrainChat } from '../components/brain/BrainChat';

export const BrainPage: React.FC = () => (
  <AppShell title="Nexora Brain" subtitle="Natural language Q&A over your emails">
    <div className="h-full">
      <BrainChat />
    </div>
  </AppShell>
);
