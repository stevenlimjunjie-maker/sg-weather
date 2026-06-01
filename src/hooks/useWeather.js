import { useState, useEffect, useCallback, useRef } from 'react'
import { findNearest } from '../utils/distanceCalc'

const URLS = {
  twoHr: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
  twentyFourHr: 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
  temperature: 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature',
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function parseSensorReadings(json) {
  const stations = json?.data?.stations ?? []
  const readings = json?.data?.readings?.[0]?.data ?? []
  return readings.map(r => {
    const station = stations.find(s => s.id === r.stationId)
    return {
      id: r.stationId,
      value: r.value,
      lat: station?.location?.latitude,
      lon: station?.location?.longitude,
    }
  })
}

export function useWeather() {
  const [data, setData] = useState(null)
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const intervalRef = useRef(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [twoHr, twentyFour, temp] = await Promise.all([
        fetchJson(URLS.twoHr),
        fetchJson(URLS.twentyFourHr),
        fetchJson(URLS.temperature),
      ])

      // 2-hour forecast — data.items[0].forecasts + data.area_metadata
      const areaList = twoHr?.data?.items?.[0]?.forecasts ?? []
      const areaMetadata = twoHr?.data?.area_metadata ?? []

      const enrichedAreas = areaList.map(f => {
        const meta = areaMetadata.find(m => m.name === f.area)
        return {
          name: f.area,
          forecast: f.forecast,
          lat: meta?.label_location?.latitude,
          lon: meta?.label_location?.longitude,
        }
      })

      // 24-hour forecast — data.records[0]
      const record = twentyFour?.data?.records?.[0] ?? {}
      const periods = record.periods ?? []
      const tempRange = record.general?.temperature ?? {}
      const general24 = record.general?.forecast?.text ?? record.general?.forecast ?? ''

      const tempReadings = parseSensorReadings(temp)

      setAreas(enrichedAreas)
      setData({ enrichedAreas, periods, tempRange, general24, tempReadings })
      setUpdatedAt(new Date())
    } catch (e) {
      setError(e.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    intervalRef.current = setInterval(fetchAll, 5 * 60 * 1000)
    return () => clearInterval(intervalRef.current)
  }, [fetchAll])

  const areaWeather = useCallback((areaName) => {
    if (!data || !areaName) return null
    const area = data.enrichedAreas.find(a => a.name === areaName)
    if (!area) return null

    let temperature = null
    if (data.tempReadings?.length && area.lat != null) {
      const nearest = findNearest(area.lat, area.lon, data.tempReadings, r => ({ lat: r.lat, lon: r.lon }))
      temperature = nearest?.value ?? null
    }

    return { area, temperature }
  }, [data])

  return { areas, data, loading, error, updatedAt, retry: fetchAll, areaWeather }
}
