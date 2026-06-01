import { getWeatherEmoji } from '../utils/emojiMap'

function BandRow({ label, forecast, isLast }) {
  const emoji = getWeatherEmoji(forecast)
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderBottom: isLast ? 'none' : '1px solid #F0F0F0',
    }}>
      <div style={{ width: '32px', textAlign: 'center', fontSize: '20px', flexShrink: 0 }}>{emoji}</div>
      <div style={{ flex: 1, marginLeft: '8px' }}>
        <div style={{ fontSize: '9px', fontWeight: '600', color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: '12px', fontWeight: '500', color: '#333', marginTop: '1px' }}>{forecast || '—'}</div>
      </div>
    </div>
  )
}

function majorityForecast(regions) {
  if (!regions) return '—'
  const values = Object.values(regions).map(r => (typeof r === 'string' ? r : r?.text)).filter(Boolean)
  if (!values.length) return '—'
  const freq = {}
  for (const v of values) freq[v] = (freq[v] ?? 0) + 1
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
}

export function ForecastBands({ periods, tempRange }) {
  if (!periods || periods.length === 0) {
    return (
      <div style={{ flex: 1, border: '1px solid #E0E0E0', borderRadius: '12px', padding: '16px', textAlign: 'center', color: '#AAA', fontSize: '13px' }}>
        24-hour forecast unavailable
      </div>
    )
  }

  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      border: '1px solid #E0E0E0',
      borderRadius: '12px',
      background: '#FFF',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '10px 12px 6px', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          24-Hour Forecast
        </div>
      </div>

      {(tempRange?.low != null || tempRange?.high != null) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          margin: '0 12px 6px',
          background: '#FAFAFA',
          borderRadius: '8px',
          border: '1px solid #F0F0F0',
          flexShrink: 0,
        }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid #E0E0E0', padding: '6px 4px' }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#2196F3' }}>{tempRange.low}°</div>
            <div style={{ fontSize: '9px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>Low</div>
          </div>
          <div style={{ textAlign: 'center', padding: '6px 4px' }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#FF5722' }}>{tempRange.high}°</div>
            <div style={{ fontSize: '9px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>High</div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {periods.map((period, i) => {
          const label = period.timePeriod?.text ?? `Period ${i + 1}`
          const forecast = majorityForecast(period.regions)
          return (
            <BandRow key={i} label={label} forecast={forecast} isLast={i === periods.length - 1} />
          )
        })}
      </div>
    </div>
  )
}
