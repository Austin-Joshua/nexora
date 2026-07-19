// New design-system category color map — used by CategoryTag and throughout the app

export const CAT_COLORS: Record<string, { label: string; color: string }> = {
  ASSIGNMENT:    { label: 'ASGN',  color: '#818cf8' },
  HACKATHON:     { label: 'HACK',  color: '#f97316' },
  PLACEMENT:     { label: 'PLACE', color: '#22c55e' },
  MEETING:       { label: 'MTG',   color: '#c084fc' },
  ATTENDANCE:    { label: 'ATTN',  color: '#ef4444' },
  ANNOUNCEMENT:  { label: 'ANN',   color: '#fbbf24' },
  PROMOTIONAL:   { label: 'PROMO', color: '#475569' },
  INTERNSHIP:    { label: 'INTN',  color: '#2dd4bf' },
  RESEARCH:      { label: 'RSRCH', color: '#22d3ee' },
  FINANCE:       { label: 'FIN',   color: '#4ade80' },
  PERSONAL:      { label: 'PRSN',  color: '#f472b6' },
  SPAM:          { label: 'SPAM',  color: '#ef4444' },
  UNCATEGORIZED: { label: 'MISC',  color: '#3d5570' },
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
