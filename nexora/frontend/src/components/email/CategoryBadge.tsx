import React from 'react';
import type { EmailCategory } from '../../types/Email';
import { getCategoryClass, CATEGORY_LABELS } from '../../utils/categoryColors';

interface CategoryBadgeProps {
  category: EmailCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => (
  <span className={`${getCategoryClass(category)} ${className}`}>
    {CATEGORY_LABELS[category] ?? category}
  </span>
);
