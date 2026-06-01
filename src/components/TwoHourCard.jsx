import { getWeatherEmoji } from '../utils/emojiMap'

export function TwoHourCard({ areaName, weather }) {
  const forecast = weather?.area?.forecast ?? ''
  const emoji = getWeatherEmoji(forecast)

  if (!areaName || !forecast) return null

  return (
    <div style={{
      margin: '0 16px 16px',
      border: '1px solid #E0E0E0',
      borderRadius: '16px',
      background: '#FFF',
      overflow: 'hidden',
      padding: '16px 20px',
    }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
        2-Hour Forecast
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#F5A623', letterSpacing: '1px', marginBottom: '4px' }}>
            {areaName.toUpperCase()}
          </div>
          <div style={{ fontSize: '15px', color: '#333' }}>
            {forecast}
          </div>
        </div>
        <div style={{ fontSize: '40px', lineHeight: 1, marginLeft: '12px' }}>
          {emoji}
        </div>
      </div>
    </div>
  )
}
