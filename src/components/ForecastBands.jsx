import { getWeatherEmoji } from '../utils/emojiMap'

function BandRow({ label, forecast, wind }) {
  const emoji = getWeatherEmoji(forecast)
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: '1px solid #F0F0F0',
    }}>
      <div style={{ width: '48px', textAlign: 'center', fontSize: '28px' }}>{emoji}</div>
      <div style={{ flex: 1, marginLeft: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginTop: '2px' }}>{forecast || '—'}</div>
        {wind && (
          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
            💨 {wind.direction} · {wind.speed?.low}–{wind.speed?.high} km/h
          </div>
        )}
      </div>
    </div>
  )
}

// Majority vote across all regions for a representative forecast
function majorityForecast(regions) {
  if (!regions) return '—'
  const values = Object.values(regions).map(r => (typeof r === 'string' ? r : r?.text)).filter(Boolean)
  if (!values.length) return '—'
  const freq = {}
  for (const v of values) freq[v] = (freq[v] ?? 0) + 1
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
}

export function ForecastBands({ periods, tempRange, humidRange, general24 }) {
  if (!periods || periods.length === 0) {
    return (
      <div style={{ margin: '0 16px 16px', border: '1px solid #E0E0E0', borderRadius: '16px', padding: '20px', textAlign: 'center', color: '#AAA', fontSize: '14px' }}>
        24-hour forecast unavailable
      </div>
    )
  }

  return (
    <div style={{ margin: '0 16px 16px', border: '1px solid #E0E0E0', borderRadius: '16px', background: '#FFF', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          24-Hour Forecast
        </div>
      </div>

      {/* Temp + humidity range */}
      {(tempRange?.low != null || tempRange?.high != null) && (
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '12px 16px',
          background: '#FAFAFA',
          margin: '12px 16px',
          borderRadius: '10px',
          border: '1px solid #F0F0F0',
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#2196F3' }}>{tempRange.low}°</div>
            <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>Low</div>
          </div>
          <div style={{ width: '1px', background: '#E0E0E0' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#FF5722' }}>{tempRange.high}°</div>
            <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>High</div>
          </div>
          {humidRange?.low != null && (
            <>
              <div style={{ width: '1px', background: '#E0E0E0' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#4CAF50' }}>
                  {humidRange.low}–{humidRange.high}%
                </div>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>Humidity</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Time bands */}
      <div style={{ padding: '0 20px' }}>
        {periods.map((period, i) => {
          const label = period.timePeriod?.text ?? `Period ${i + 1}`
          const forecast = majorityForecast(period.regions)
          return (
            <BandRow key={i} label={label} forecast={forecast} />
          )
        })}
      </div>

      {general24 && (
        <div style={{ padding: '12px 20px', fontSize: '13px', color: '#555', borderTop: '1px solid #F0F0F0' }}>
          {general24}
        </div>
      )}
    </div>
  )
}
