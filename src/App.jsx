import { useState, useEffect, useCallback } from 'react'
import { useWeather } from './hooks/useWeather'
import { useGeolocation } from './hooks/useGeolocation'
import { findNearest } from './utils/distanceCalc'
import { CurrentCard } from './components/CurrentCard'
import { ForecastBands } from './components/ForecastBands'
import { AreaSelector } from './components/AreaSelector'
import { ShareButton } from './components/ShareButton'
import { Toast } from './components/Toast'
import './App.css'

function Skeleton({ height = 80 }) {
  return (
    <div style={{
      margin: '16px',
      height,
      borderRadius: '16px',
      background: 'linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      border: '1px solid #E0E0E0',
    }} />
  )
}

function ErrorCard({ message, onRetry }) {
  return (
    <div style={{
      margin: '16px',
      border: '1px solid #FFCDD2',
      borderRadius: '16px',
      background: '#FFF5F5',
      padding: '24px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
      <div style={{ fontSize: '15px', fontWeight: '600', color: '#C62828', marginBottom: '6px' }}>
        Couldn't load weather data
      </div>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        {message || 'Please check your connection and try again.'}
      </div>
      <button
        onClick={onRetry}
        style={{
          padding: '10px 24px',
          background: '#F5A623',
          color: '#FFF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  )
}

export default function App() {
  const [selectedArea, setSelectedArea] = useState('')
  const [toast, setToast] = useState(null)
  const { position, denied, loading: geoLoading, request: requestGeo } = useGeolocation()
  const { areas, data, loading, error, updatedAt, retry, areaWeather } = useWeather()

  // Auto-select nearest area on geolocation
  useEffect(() => {
    if (position && areas.length > 0 && !selectedArea) {
      const nearest = findNearest(position.lat, position.lon, areas, a => ({ lat: a.lat, lon: a.lon }))
      if (nearest) setSelectedArea(nearest.name)
    }
  }, [position, areas, selectedArea])

  // Request geolocation on mount
  useEffect(() => {
    requestGeo()
  }, [requestGeo])

  const weather = areaWeather(selectedArea)

  const showToast = useCallback((msg) => {
    setToast(msg)
  }, [])

  return (
    <div className="app-root">
      {/* App bar */}
      <div className="app-bar">
        <div className="app-bar-content">
          <span className="app-title">🇸🇬 SG Weather</span>
          {updatedAt && !loading && (
            <button
              onClick={retry}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
              title="Refresh"
              aria-label="Refresh weather data"
            >
              <span style={{ fontSize: '18px' }}>🔄</span>
            </button>
          )}
        </div>
      </div>

      <div className="scroll-content">
        {/* Location access banner or area selector */}
        {denied && !selectedArea && (
          <div style={{
            margin: '16px 16px 0',
            padding: '12px 16px',
            background: '#FFF8E1',
            border: '1px solid #FFE082',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#7B5E00',
          }}>
            📍 Location access denied — please select your area below
          </div>
        )}

        {denied && areas.length > 0 && (
          <div style={{ paddingTop: '8px' }}>
            <AreaSelector areas={areas} selected={selectedArea} onChange={setSelectedArea} />
          </div>
        )}

        {!denied && geoLoading && !selectedArea && (
          <div style={{
            margin: '16px 16px 0',
            padding: '12px 16px',
            background: '#E3F2FD',
            border: '1px solid #90CAF9',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#0D47A1',
          }}>
            📍 Detecting your location...
          </div>
        )}

        {/* Manual area picker (always show if we have areas loaded) */}
        {areas.length > 0 && selectedArea && (
          <div style={{ padding: '16px 16px 0' }}>
            <AreaSelector areas={areas} selected={selectedArea} onChange={setSelectedArea} />
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <>
            <Skeleton height={200} />
            <Skeleton height={280} />
          </>
        )}

        {/* Error state */}
        {!loading && error && <ErrorCard message={error} onRetry={retry} />}

        {/* Main content */}
        {!loading && !error && (
          <>
            {selectedArea ? (
              <>
                <CurrentCard areaName={selectedArea} weather={weather} updatedAt={updatedAt} />
                <ForecastBands
                  periods={data?.periods}
                  tempRange={data?.tempRange}
                  humidRange={data?.humidRange}
                  general24={data?.general24}
                />
                <ShareButton areaName={selectedArea} weather={weather} onToast={showToast} />
              </>
            ) : (
              !denied && areas.length > 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#AAA', fontSize: '15px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌤️</div>
                  Waiting for your location…
                  <div style={{ marginTop: '16px' }}>
                    <button
                      onClick={() => requestGeo()}
                      style={{
                        padding: '10px 20px',
                        background: '#F5A623',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        marginRight: '8px',
                      }}
                    >
                      Allow Location
                    </button>
                    <button
                      onClick={() => setSelectedArea(areas[0]?.name)}
                      style={{
                        padding: '10px 20px',
                        background: '#F0F0F0',
                        color: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      Pick Manually
                    </button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
