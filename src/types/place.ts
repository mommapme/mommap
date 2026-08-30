export type PlaceCategory =
  | 'food'
  | 'play'
  | 'outdoor'
  | 'development'
  | 'nursery'
  | 'shop';

export type PlaceTag =
  | 'food'
  | 'play'
  | 'nursery'
  | 'kids_menu'
  | 'outdoor'
  | 'development'
  | 'shop';

export type AgeGroup = '0-1' | '1-3' | '3-5' | '5+' | '7+' | '10+' | '14+';

export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  tags: PlaceTag[];
  age_groups: AgeGroup[];
  address: string;
  city: 'moscow';
  latitude: number;
  longitude: number;
  rating: number;
  cover_url: string;
  yandex_maps_url: string;
  is_verified: boolean;
}