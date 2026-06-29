import React from 'react';
import type { Priority } from '../../types/Email';
import { getPriorityClass, PRIORITY_LABELS } from '../../utils/priorityUtils';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => (
  <span className={`${getPriorityClass(priority)} ${className}`}>
    {PRIORITY_LABELS[priority] ?? priority}
  </span>
);
