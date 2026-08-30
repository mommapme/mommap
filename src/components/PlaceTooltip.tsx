'use client';

import Image from 'next/image';
import { Heart, Star, ArrowUpRight } from 'lucide-react';
import type { Place } from '@/types/place';
import { TAG_CONFIG } from '@/constants/categories';
import { getDistanceLabel } from '@/lib/distance';

interface PlaceTooltipProps {
  place: Place;
  userLocation?: { lat: number; lng: number } | null;
  isFavorite?: boolean;
  onToggleFavorite?: (placeId: string) => void;
}

export function PlaceTooltip({
  place,
  userLocation,
  isFavorite = false,
  onToggleFavorite,
}: PlaceTooltipProps) {
  const distanceLabel = userLocation
    ? getDistanceLabel(userLocation.lat, userLocation.lng, place.latitude, place.longitude)
    : null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
      <div className="relative h-32 w-full bg-gray-100">
        {place.cover_url && (
          <Image src={place.cover_url} alt={place.name} fill sizes="288px" className="object-cover" />
        )}

        <button
          type="button"
          onClick={() => onToggleFavorite?.(place.id)}
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform active:scale-90"
        >
          <Heart size={16} className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-500'} />
        </button>

        {place.is_verified && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-violet-600 shadow-sm">
            Проверено
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-gray-900">{place.name}</h3>
          <div className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-gray-900">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {place.rating.toFixed(1)}
          </div>
        </div>

        {distanceLabel && <p className="mt-0.5 text-xs text-gray-500">{distanceLabel} от вас</p>}

        {place.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {place.tags.map((tag) => {
              const cfg = TAG_CONFIG[tag];
              if (!cfg) return null;
              return (
                <span
                  key={tag}
                  title={cfg.label}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                  style={{ backgroundColor: `${cfg.color}1A` }}
                >
                  {cfg.icon}
                </span>
              );
            })}
          </div>
        )}

        
          <a href={place.yandex_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-gray-900 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Маршрут и контакты
          <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}