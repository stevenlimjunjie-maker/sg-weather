import { getWeatherEmoji } from '../utils/emojiMap'

export function ShareButton({ areaName, weather, onToast }) {
  if (!areaName || !weather) return null

  const forecast = weather?.area?.forecast ?? ''
  const temp = weather?.temperature != null ? `${Math.round(weather.temperature)}°C` : ''
  const emoji = getWeatherEmoji(forecast)

  const text = [
    temp && `It's ${temp}`,
    forecast && `and ${forecast}`,
    `in ${areaName} right now ${emoji}`,
    '— via SG Weather 🇸🇬',
  ].filter(Boolean).join(' ')

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SG Weather', text })
        onToast('Shared!')
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(text)
        onToast('Copied to clipboard!')
      } catch {
        onToast('Could not copy')
      }
    }
  }

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <button
        onClick={handleShare}
        style={{
          width: '100%',
          padding: '14px',
          background: '#F5A623',
          color: '#FFF',
          border: 'none',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '700',
          fontFamily: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'opacity 0.15s',
        }}
        onMouseDown={e => e.currentTarget.style.opacity = '0.85'}
        onMouseUp={e => e.currentTarget.style.opacity = '1'}
        onTouchStart={e => e.currentTarget.style.opacity = '0.85'}
        onTouchEnd={e => e.currentTarget.style.opacity = '1'}
      >
        <span>📤</span>
        Share My Weather
      </button>

      <div style={{
        marginTop: '10px',
        padding: '12px 14px',
        background: '#F9F9F9',
        borderRadius: '10px',
        border: '1px solid #EEEEEE',
        fontSize: '13px',
        color: '#555',
        lineHeight: 1.5,
      }}>
        {text}
      </div>
    </div>
  )
}
