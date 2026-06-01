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
        background: 'linear-gradient(135deg, #FFF8ED 0%, #FFF 100%)',
        padding: '24px 20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              📍 {areaName || 'Loading...'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#333', lineHeight: 1.3 }}>
              {forecast || 'Fetching forecast...'}
            </div>
          </div>
          <div style={{ fontSize: '56px', lineHeight: 1, marginLeft: '12px' }}>
            {emoji}
          </div>
        </div>


{updatedAt && (
          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#AAA' }}>Updated {formatTime(updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
