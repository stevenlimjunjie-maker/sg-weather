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
      margin: '16px',
      border: '1px solid #E0E0E0',
      borderRadius: '16px',
      background: '#FFF',
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FFFBED 0%, #FFF 100%)',
        padding: '24px 20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#F5A623', letterSpacing: '1px' }}>
              📍 {areaName?.toUpperCase()}
            </div>
            <div style={{ fontSize: '15px', color: '#333', marginTop: '4px' }}>
              {forecast}
            </div>
          </div>
          <div style={{ fontSize: '56px', lineHeight: 1, marginLeft: '12px' }}>
            {emoji}
          </div>
        </div>
        {weather?.temperature != null && (
          <div style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '52px', fontWeight: '800', color: '#1A1A1A', lineHeight: 1 }}>
              {Math.round(weather.temperature)}
            </span>
            <span style={{ fontSize: '24px', fontWeight: '600', color: '#666', verticalAlign: 'super' }}>°C</span>
          </div>
        )}

        {updatedAt && (
          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#AAA' }}>Updated {formatTime(updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
