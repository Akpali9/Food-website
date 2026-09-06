export type GoalCategory = 'mental' | 'emotional' | 'financial' | 'physical' | 'professional';
export type GoalLevel = 'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'daily';
export type TrackingType = 'binary' | 'numeric' | 'time' | 'rating';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  level: GoalLevel;
  trackingType: TrackingType;
  target?: number;
  current: number;
  unit?: string;
  completed: boolean;
  parentId?: string;
  createdAt: string;
}

export const CATEGORY_CONFIG: Record<GoalCategory, { icon: string; label: string }> = {
  mental: { icon: '🧠', label: 'Mental' },
  emotional: { icon: '💛', label: 'Emotional' },
  financial: { icon: '💰', label: 'Financial' },
  physical: { icon: '💪', label: 'Physical' },
  professional: { icon: '🎯', label: 'Professional' },
};

export interface Template {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  trackingType: TrackingType;
  yearlyTarget: number;
  unit: string;
  breakdown: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'tpl1',
    title: 'Read 12 Books',
    description: 'Read one book per month to expand your knowledge.',
    category: 'mental',
    trackingType: 'numeric',
    yearlyTarget: 12,
    unit: 'books',
    breakdown: '1 book/month',
  },
  {
    id: 'tpl2',
    title: 'Save $5,000',
    description: 'Build your emergency fund.',
    category: 'financial',
    trackingType: 'numeric',
    yearlyTarget: 5000,
    unit: 'dollars',
    breakdown: '~$417/month',
  },
  // Add more templates as needed
];
