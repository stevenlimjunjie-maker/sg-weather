const EMOJI_MAP = [
  { patterns: ['heavy thundery showers with gusty winds', 'heavy thundery showers'], emoji: '⛈️' },
  { patterns: ['thundery showers'], emoji: '⛈️' },
  { patterns: ['heavy showers'], emoji: '🌧️' },
  { patterns: ['showers'], emoji: '🌧️' },
  { patterns: ['light showers', 'light rain'], emoji: '🌦️' },
  { patterns: ['partly cloudy (night)', 'partly cloudy (day)', 'partly cloudy'], emoji: '⛅' },
  { patterns: ['cloudy'], emoji: '☁️' },
  { patterns: ['overcast'], emoji: '☁️' },
  { patterns: ['fair (night)', 'fair & warm', 'fair'], emoji: '☀️' },
  { patterns: ['sunny', 'fine', 'clear'], emoji: '☀️' },
  { patterns: ['hazy', 'slightly hazy'], emoji: '🌫️' },
  { patterns: ['windy', 'breezy'], emoji: '💨' },
  { patterns: ['mist', 'fog'], emoji: '🌁' },
  { patterns: ['warm'], emoji: '🌤️' },
]

export function getWeatherEmoji(forecast) {
  if (!forecast) return '🌡️'
  const lower = forecast.toLowerCase()
  for (const { patterns, emoji } of EMOJI_MAP) {
    if (patterns.some(p => lower.includes(p))) return emoji
  }
  return '🌡️'
}
