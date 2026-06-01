import { getWeatherEmoji } from '../utils/emojiMap'

function Stat({ label, value, unit }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A1A' }}>
        {value != null ? value : '—'}
        {value != null && unit && <span style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>{unit}</span>}
      </div>
      <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
        {label}
      </div>
    </div>
  )
}

export function CurrentCard({ areaName, weather, updatedAt }) {
  const forecast = weather?.area?.forecast ?? ''
  const emoji = getWeatherEmoji(forecast)

  const formatTime = (date) => {
    if (!date) return ''
    return date.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })
  }

  const rainStatus = weather?.isRaining ? '🌧 Raining' : '✓ Dry'
  const rainColor = weather?.isRaining ? '#2196F3' : '#4CAF50'

  return (
    <div style={{
      margin: '16px',
      border: '1px solid #E0E0E0',
      borderRadius: '16px',
      background: '#FFF',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF8ED 0%, #FFF 100%)',
        padding: '24px 20px 20px',
        borderBottom: '1px solid #F0F0F0',
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

        {/* Temperature big display */}
        {weather?.temperature != null && (
          <div style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '52px', fontWeight: '800', color: '#1A1A1A', lineHeight: 1 }}>
              {Math.round(weather.temperature)}
            </span>
            <span style={{ fontSize: '24px', fontWeight: '600', color: '#666', verticalAlign: 'super' }}>°C</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', padding: '16px 8px', borderBottom: '1px solid #F0F0F0' }}>
        <Stat label="Humidity" value={weather?.humidity != null ? Math.round(weather.humidity) : null} unit="%" />
        <div style={{ width: '1px', background: '#F0F0F0', margin: '0 8px' }} />
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: rainColor }}>{rainStatus}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Rainfall</div>
        </div>
        <div style={{ width: '1px', background: '#F0F0F0', margin: '0 8px' }} />
        <Stat label="Rainfall" value={weather?.rainfall != null ? weather.rainfall.toFixed(1) : null} unit=" mm" />
      </div>

      {/* Updated timestamp */}
      {updatedAt && (
        <div style={{ padding: '10px 20px', textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: '#AAA' }}>Updated {formatTime(updatedAt)}</span>
        </div>
      )}
    </div>
  )
}
