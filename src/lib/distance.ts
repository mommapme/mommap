// Формула гаверсинуса — расстояние по прямой между двумя точками на сфере (км)
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDistanceLabel(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string {
  const km = getDistanceKm(lat1, lng1, lat2, lng2);
  return km < 1 ? `${Math.round(km * 1000)} м` : `${km.toFixed(1)} км`;
}