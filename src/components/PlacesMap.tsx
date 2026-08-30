'use client';

import { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import type { Place } from '@/types/place';
import { CATEGORIES } from '@/constants/categories';
import { PlaceTooltip } from './PlaceTooltip';

interface PlacesMapProps {
  places: Place[];
  isFavorite: (placeId: string) => boolean;
  onToggleFavorite: (placeId: string) => void;
}

const MOSCOW_CENTER: [number, number] = [55.751244, 37.618423];

export function PlacesMap({ places, isFavorite, onToggleFavorite }: PlacesMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Геопозиция нужна только для показа расстояния в тултипе —
  // отказ пользователя не блокирует работу карты
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  return (
    <div className="relative h-full w-full">
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY, lang: 'ru_RU' }}>
        <Map
          defaultState={{ center: MOSCOW_CENTER, zoom: 12 }}
          width="100%"
          height="100%"
          onClick={() => setSelectedPlace(null)}
        >
          {userLocation && (
            <Placemark
              geometry={[userLocation.lat, userLocation.lng]}
              options={{ preset: 'islands#geolocationIcon', iconColor: '#111827' }}
            />
          )}

          {places.map((place) => (
            <Placemark
              key={place.id}
              geometry={[place.latitude, place.longitude]}
              options={{
                preset: 'islands#circleIcon',
                iconColor: CATEGORIES[place.category].color,
              }}
              onClick={(e: { get: (key: string) => any }) => {
                e.get('originalEvent').domEvent.stopPropagation();
                setSelectedPlace(place);
              }}
            />
          ))}
        </Map>
      </YMaps>

      {/* Тултип выбранного места — плавающая панель поверх карты
         (на мобильных выглядит как bottom-sheet, на десктопе — карточка слева-снизу) */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:left-4 sm:translate-x-0">
          <PlaceTooltip
            place={selectedPlace}
            userLocation={userLocation}
            isFavorite={isFavorite(selectedPlace.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      )}
    </div>
  );
}