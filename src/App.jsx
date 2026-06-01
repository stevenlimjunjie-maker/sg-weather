import { useState, useEffect } from 'react'
import { useWeather } from './hooks/useWeather'
import { useGeolocation } from './hooks/useGeolocation'
import { findNearest } from './utils/distanceCalc'
import { CurrentCard } from './components/CurrentCard'
import { ForecastBands } from './components/ForecastBands'
import { AreaSelector } from './components/AreaSelector'
import './App.css'

function Skeleton() {
  return (
    <div style={{
      height: '120px',
      borderRadius: '12px',
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
      border: '1px solid #FFCDD2',
      borderRadius: '12px',
      background: '#FFF5F5',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#C62828', marginBottom: '4px' }}>
        Couldn't load weather data
      </div>
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
        {message || 'Please check your connection and try again.'}
      </div>
      <button
        onClick={onRetry}
        style={{
          padding: '8px 20px',
          background: '#F5A623',
          color: '#FFF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
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
  const { position, denied, request: requestGeo } = useGeolocation()
  const { areas, data, loading, error, updatedAt, retry, areaWeather } = useWeather()

  useEffect(() => {
    if (position && areas.length > 0 && !selectedArea) {
      const nearest = findNearest(position.lat, position.lon, areas, a => ({ lat: a.lat, lon: a.lon }))
      if (nearest) setSelectedArea(nearest.name)
    }
  }, [position, areas, selectedArea])

  useEffect(() => {
    requestGeo()
  }, [requestGeo])

  const weather = areaWeather(selectedArea)

  return (
    <div className="app-root">
      <div className="app-bar">
        <div className="app-bar-content">
          <span className="app-title">🇸🇬 SG Weather</span>
          {updatedAt && !loading && (
            <button
              onClick={retry}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              aria-label="Refresh"
            >
              <span style={{ fontSize: '16px' }}>🔄</span>
            </button>
          )}
        </div>
      </div>

      <div className="main-content">
        {denied && !selectedArea && (
          <div style={{
            padding: '8px 12px',
            background: '#FFF8E1',
            border: '1px solid #FFE082',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#7B5E00',
            flexShrink: 0,
          }}>
            📍 Location access denied — select your area below
          </div>
        )}

        {areas.length > 0 && (
          <AreaSelector areas={areas} selected={selectedArea} onChange={setSelectedArea} />
        )}

        {loading && (
          <>
            <Skeleton />
            <Skeleton />
          </>
        )}

        {!loading && error && <ErrorCard message={error} onRetry={retry} />}

        {!loading && !error && selectedArea && (
          <>
            <CurrentCard areaName={selectedArea} weather={weather} updatedAt={updatedAt} />
            <ForecastBands periods={data?.periods} tempRange={data?.tempRange} />
          </>
        )}

        {!loading && !error && !selectedArea && !denied && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#AAA' }}>
            <div style={{ fontSize: '40px' }}>🌤️</div>
            <div style={{ fontSize: '13px' }}>Detecting your location…</div>
            <button
              onClick={() => requestGeo()}
              style={{ padding: '8px 18px', background: '#F5A623', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer' }}
            >
              Allow Location
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
