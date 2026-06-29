import type { Priority } from '../types/Email';

export const PRIORITY_CLASS: Record<Priority, string> = {
  HIGH:   'priority-high',
  MEDIUM: 'priority-medium',
  LOW:    'priority-low',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH:   '🔴 High',
  MEDIUM: '🟡 Medium',
  LOW:    '🟢 Low',
};

export function getPriorityClass(priority: Priority): string {
  return PRIORITY_CLASS[priority] || 'priority-medium';
}
