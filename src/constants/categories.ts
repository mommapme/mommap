import type { PlaceCategory, PlaceTag } from '@/types/place';

interface CategoryConfig {
  id: PlaceCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Record<PlaceCategory, CategoryConfig> = {
  food: { id: 'food', label: 'Еда', icon: '🍴', color: '#EF4444' },
  nursery: { id: 'nursery', label: 'Комната МиР', icon: '🍼', color: '#3B82F6' },
  outdoor: { id: 'outdoor', label: 'На улице', icon: '🌳', color: '#10B981' },
  play: { id: 'play', label: 'Играть', icon: '🧸', color: '#8B5CF6' },
  development: { id: 'development', label: 'Развитие', icon: '📖', color: '#F59E0B' },
  shop: { id: 'shop', label: 'Магазины', icon: '🛍️', color: '#6B7280' },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export interface TagConfig {
  label: string;
  icon: string;
  color: string;
}

export const TAG_CONFIG: Record<PlaceTag, TagConfig> = {
  ...CATEGORIES,
  kids_menu: { label: 'Детское меню', icon: '🍽️', color: '#F97316' },
};

export const AGE_GROUPS = ['0-1', '1-3', '3-5', '5+', '7+', '10+', '14+'] as const;

export const AGE_GROUP_OPTIONS = [
  { value: 'all', label: 'Все' },
  ...AGE_GROUPS.map((age) => ({ value: age, label: age })),
];