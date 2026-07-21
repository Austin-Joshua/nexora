// Category color + label system — used by CategoryTag and throughout the app

export const CAT_COLORS: Record<string, { label: string; color: string }> = {
  ASSIGNMENT:    { label: 'Assignment',    color: '#6366f1' },
  HACKATHON:     { label: 'Hackathon',     color: '#f97316' },
  PLACEMENT:     { label: 'Placement',     color: '#10b981' },
  MEETING:       { label: 'Meeting',       color: '#a855f7' },
  ATTENDANCE:    { label: 'Attendance',     color: '#ef4444' },
  ANNOUNCEMENT:  { label: 'Announcement',  color: '#eab308' },
  PROMOTIONAL:   { label: 'Promo',         color: '#64748b' },
  INTERNSHIP:    { label: 'Internship',    color: '#14b8a6' },
  RESEARCH:      { label: 'Research',      color: '#06b6d4' },
  FINANCE:       { label: 'Finance',       color: '#22c55e' },
  PERSONAL:      { label: 'Personal',      color: '#ec4899' },
  SPAM:          { label: 'Spam',          color: '#ef4444' },
  UNCATEGORIZED: { label: 'Other',         color: '#64748b' },
};

// Legacy label map kept for backward-compat with existing pages
export const CATEGORY_LABELS: Record<string, string> = {
  ASSIGNMENT:    'Assignment',
  ATTENDANCE:    'Attendance',
  HACKATHON:     'Hackathon',
  PLACEMENT:     'Placement',
  INTERNSHIP:    'Internship',
  MEETING:       'Meeting',
  ANNOUNCEMENT:  'Announcement',
  RESEARCH:      'Research',
  FINANCE:       'Finance',
  PERSONAL:      'Personal',
  PROMOTIONAL:   'Promotional',
  SPAM:          'Spam',
  UNCATEGORIZED: 'Other',
};
