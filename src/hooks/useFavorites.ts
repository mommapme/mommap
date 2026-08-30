'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface UseFavoritesOptions {
  userId: string | null;
  isAuthenticated: boolean;
}

interface UseFavoritesResult {
  favoriteIds: string[];
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (placeId: string) => void;
  authPromptOpen: boolean;
  closeAuthPrompt: () => void;
  loading: boolean;
}

export function useFavorites({ userId, isAuthenticated }: UseFavoritesOptions): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  // Загружаем избранное из Supabase при входе; для гостя список всегда пуст
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setFavoriteIds([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase
      .from('favorites')
      .select('place_id')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Не удалось загрузить избранное:', error.message);
        } else {
          setFavoriteIds((data ?? []).map((row) => row.place_id as string));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, userId]);

  const isFavorite = useCallback(
    (placeId: string) => favoriteIds.includes(placeId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (placeId: string) => {
      // Незарегистрированная мама — просто открываем поп-ап, в БД не идём
      if (!isAuthenticated || !userId) {
        setAuthPromptOpen(true);
        return;
      }

      const alreadyFavorite = favoriteIds.includes(placeId);

      // Оптимистичное обновление — сначала меняем UI, затем шлём запрос;
      // при ошибке откатываем состояние обратно
      setFavoriteIds((prev) =>
        alreadyFavorite ? prev.filter((id) => id !== placeId) : [...prev, placeId]
      );

      const request = alreadyFavorite
        ? supabase.from('favorites').delete().eq('user_id', userId).eq('place_id', placeId)
        : supabase.from('favorites').insert({ user_id: userId, place_id: placeId });

      request.then(({ error }) => {
        if (error) {
          console.error('Не удалось обновить избранное:', error.message);
          setFavoriteIds((prev) =>
            alreadyFavorite ? [...prev, placeId] : prev.filter((id) => id !== placeId)
          );
        }
      });
    },
    [isAuthenticated, userId, favoriteIds]
  );

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    authPromptOpen,
    closeAuthPrompt: () => setAuthPromptOpen(false),
    loading,
  };
}