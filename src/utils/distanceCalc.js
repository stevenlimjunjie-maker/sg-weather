const R = 6371

function toRad(deg) {
  return deg * (Math.PI / 180)
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function findNearest(userLat, userLon, items, getCoords) {
  let nearest = null
  let minDist = Infinity
  for (const item of items) {
    const { lat, lon } = getCoords(item)
    if (lat == null || lon == null) continue
    const dist = haversineDistance(userLat, userLon, lat, lon)
    if (dist < minDist) {
      minDist = dist
      nearest = item
    }
  }
  return nearest
}
