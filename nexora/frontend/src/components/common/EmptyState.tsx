import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-500">
      {icon ?? <Inbox size={28} />}
    </div>
    <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
    {description && <p className="text-slate-500 text-sm max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
