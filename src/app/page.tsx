'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Map as MapIcon, List } from 'lucide-react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { PlaceTooltip } from '@/components/PlaceTooltip';
import { AuthPromptModal } from '@/components/AuthPromptModal';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/lib/supabase/client';
import type { Place, PlaceCategory } from '@/types/place';

// Карта использует DOM/geolocation — рендерим только на клиенте
const PlacesMap = dynamic(() => import('@/components/PlacesMap').then((m) => m.PlacesMap), {
  ssr: false,
});

// TODO: заменить на реальную сессию (supabase.auth.getUser() / контекст),
// когда будет готова авторизация
const CURRENT_USER_ID: string | null = null;
const IS_AUTHENTICATED = false;

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { favoriteIds, isFavorite, toggleFavorite, authPromptOpen, closeAuthPrompt } =
    useFavorites({ userId: CURRENT_USER_ID, isAuthenticated: IS_AUTHENTICATED });

  const fetchPlaces = useCallback(async () => {
    setLoading(true);

    let query = supabase.from('places').select('*').eq('city', 'moscow');

    if (selectedAge !== 'all') {
      query = query.contains('age_groups', [selectedAge]);
    }
    if (selectedCategories.length > 0) {
      // overlaps — место попадает под фильтр, если хотя бы один выбранный
      // чипс совпадает с одним из его тегов (а не только с category)
      query = query.overlaps('tags', selectedCategories);
    }
    if (searchQuery.trim()) {
      query = query.ilike('name', `%${searchQuery.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Не удалось загрузить места:', error.message);
      setPlaces([]);
    } else {
      setPlaces(data ?? []);
    }
    setLoading(false);
  }, [selectedAge, selectedCategories, searchQuery]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  function handleResetFilters() {
    setSelectedAge('all');
    setSelectedCategories([]);
    setSearchQuery('');
  }

  function handleCategoryToggle(category: PlaceCategory) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header onReset={handleResetFilters} onSearch={setSearchQuery} favoritesCount={favoriteIds.length} />
      <FilterBar
        selectedAge={selectedAge}
        selectedCategories={selectedCategories}
        onAgeChange={setSelectedAge}
        onCategoryToggle={handleCategoryToggle}
      />

      <div className="relative flex-1 overflow-hidden">
        {view === 'map' ? (
          <PlacesMap places={places} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
        ) : (
          <div className="h-full overflow-y-auto px-4 py-4 sm:px-6">
            {loading ? (
              <p className="py-10 text-center text-sm text-gray-400">Загружаем места…</p>
            ) : places.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">
                Ничего не нашлось — попробуй изменить фильтры
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {places.map((place) => (
                  <PlaceTooltip
                    key={place.id}
                    place={place}
                    isFavorite={isFavorite(place.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Мобильный переключатель Карта / Списком */}
        <button
          type="button"
          onClick={() => setView((v) => (v === 'map' ? 'list' : 'map'))}
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg sm:hidden"
        >
          {view === 'map' ? (
            <>
              <List size={16} /> Списком
            </>
          ) : (
            <>
              <MapIcon size={16} /> Карта
            </>
          )}
        </button>
      </div>

      <AuthPromptModal open={authPromptOpen} onClose={closeAuthPrompt} />
    </div>
  );
}