'use client';

import { useState } from 'react';
import { Search, Heart, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
  onSearch?: (query: string) => void;
  onFavoritesClick?: () => void;
  onLoginClick?: () => void;
  favoritesCount?: number;
}

const CITIES = [{ value: 'moscow', label: 'Москва' }] as const;

export function Header({
  onReset,
  onSearch,
  onFavoritesClick,
  onLoginClick,
  favoritesCount = 0,
}: HeaderProps) {
  const [query, setQuery] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const [city, setCity] = useState<(typeof CITIES)[number]>(CITIES[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.(query);
  }

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      {/* Логотип — сброс всех фильтров */}
      <button
        type="button"
        onClick={onReset}
        className="shrink-0 text-xl font-extrabold tracking-tight text-gray-900"
      >
        Mom<span className="text-violet-500">Map</span>
      </button>

      {/* Выбор города */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setCityOpen((v) => !v)}
          className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {city.label}
          <ChevronDown
            size={14}
            className={`transition-transform ${cityOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {cityOpen && (
          <ul className="absolute left-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            {CITIES.map((c) => (
              <li key={c.value}>
                <button
                  type="button"
                  onClick={() => {
                    setCity(c);
                    setCityOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Поиск */}
      <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-md flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Куда отправимся сегодня?"
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
        />
      </form>

      {/* Избранное */}
      <button
        type="button"
        onClick={onFavoritesClick}
        aria-label="Избранное"
        className="relative shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-50 hover:text-rose-500"
      >
        <Heart size={20} />
        {favoritesCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Войти */}
      <button
        type="button"
        onClick={onLoginClick}
        className="shrink-0 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
      >
        Войти
      </button>
    </header>
  );
}