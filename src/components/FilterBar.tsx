'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CATEGORY_LIST, AGE_GROUP_OPTIONS } from '@/constants/categories';
import type { PlaceCategory } from '@/types/place';

interface FilterBarProps {
  selectedAge?: string;
  selectedCategories?: PlaceCategory[];
  onAgeChange?: (age: string) => void;
  onCategoryToggle?: (category: PlaceCategory) => void;
}

export function FilterBar({
  selectedAge = 'all',
  selectedCategories = [],
  onAgeChange,
  onCategoryToggle,
}: FilterBarProps) {
  const [ageOpen, setAgeOpen] = useState(false);
  const ageLabel = AGE_GROUP_OPTIONS.find((o) => o.value === selectedAge)?.label ?? 'Все';

  return (
    <div className="flex items-center gap-3 overflow-x-auto border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
      {/* Возраст */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setAgeOpen((v) => !v)}
          className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Возраст: {ageLabel}
          <ChevronDown size={14} className={`transition-transform ${ageOpen ? 'rotate-180' : ''}`} />
        </button>
        {ageOpen && (
          <ul className="absolute left-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            {AGE_GROUP_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onAgeChange?.(opt.value);
                    setAgeOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    opt.value === selectedAge ? 'font-semibold text-violet-600' : 'text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-5 w-px shrink-0 bg-gray-200" />

      {/* Чипсы категорий */}
      <div className="flex shrink-0 gap-2">
        {CATEGORY_LIST.map((cat) => {
          const active = selectedCategories.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryToggle?.(cat.id)}
              style={active ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? 'text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}