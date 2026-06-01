import { getWeatherEmoji } from '../utils/emojiMap'

export function CurrentCard({ areaName, weather, updatedAt }) {
  const forecast = weather?.area?.forecast ?? ''
  const emoji = getWeatherEmoji(forecast)

  const formatTime = (date) => {
    if (!date) return ''
    return date.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{
      flexShrink: 0,
      border: '1px solid #E0E0E0',
      borderRadius: '12px',
      background: '#FFF',
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FFFBED 0%, #FFF 100%)',
        padding: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#F5A623', letterSpacing: '1px' }}>
              📍 {areaName?.toUpperCase()}
            </div>
            <div style={{ fontSize: '13px', color: '#333', marginTop: '3px' }}>
              {forecast}
            </div>
          </div>
          <div style={{ fontSize: '44px', lineHeight: 1, marginLeft: '12px' }}>
            {emoji}
          </div>
        </div>

        {weather?.temperature != null && (
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '40px', fontWeight: '800', color: '#1A1A1A', lineHeight: 1 }}>
              {Math.round(weather.temperature)}
            </span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#666', verticalAlign: 'super' }}>°C</span>
          </div>
        )}

        {updatedAt && (
          <div style={{ marginTop: '6px', textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#AAA' }}>Updated {formatTime(updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
