import type { EmailCategory } from '../types/Email';

export const CATEGORY_COLORS: Record<EmailCategory, string> = {
  ASSIGNMENT:    'badge-assignment',
  ATTENDANCE:    'badge-attendance',
  HACKATHON:     'badge-hackathon',
  PLACEMENT:     'badge-placement',
  INTERNSHIP:    'badge-internship',
  MEETING:       'badge-meeting',
  ANNOUNCEMENT:  'badge-announcement',
  RESEARCH:      'badge-research',
  FINANCE:       'badge-finance',
  PERSONAL:      'badge-personal',
  PROMOTIONAL:   'badge-promotional',
  SPAM:          'badge-spam',
  UNCATEGORIZED: 'badge-uncategorized',
};

export const CATEGORY_LABELS: Record<EmailCategory, string> = {
  ASSIGNMENT:    '📚 Assignment',
  ATTENDANCE:    '🎓 Attendance',
  HACKATHON:     '🚀 Hackathon',
  PLACEMENT:     '💼 Placement',
  INTERNSHIP:    '🌟 Internship',
  MEETING:       '📅 Meeting',
  ANNOUNCEMENT:  '📢 Announcement',
  RESEARCH:      '🔬 Research',
  FINANCE:       '💰 Finance',
  PERSONAL:      '👤 Personal',
  PROMOTIONAL:   '📧 Promotional',
  SPAM:          '🚫 Spam',
  UNCATEGORIZED: '📂 Other',
};

export function getCategoryClass(category: EmailCategory): string {
  return CATEGORY_COLORS[category] || 'badge-uncategorized';
}
