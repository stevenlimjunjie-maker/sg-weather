import { useState, useEffect, useCallback, useRef } from 'react'
import { findNearest } from '../utils/distanceCalc'

const URLS = {
  twoHr: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
  twentyFourHr: 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
  temperature: 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature',
  humidity: 'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity',
  rainfall: 'https://api-open.data.gov.sg/v2/real-time/api/rainfall',
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Actual API structure: data.stations[] + data.readings[0].data[]
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
      name: station?.name,
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
      const [twoHr, twentyFour, temp, humid, rain] = await Promise.all([
        fetchJson(URLS.twoHr),
        fetchJson(URLS.twentyFourHr),
        fetchJson(URLS.temperature),
        fetchJson(URLS.humidity),
        fetchJson(URLS.rainfall),
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
      const humidRange = record.general?.relativeHumidity ?? {}
      // general.forecast is an object {code, text}
      const general24 = record.general?.forecast?.text ?? record.general?.forecast ?? ''

      // Sensor readings
      const tempReadings = parseSensorReadings(temp)
      const humidReadings = parseSensorReadings(humid)
      const rainReadings = parseSensorReadings(rain)

      setAreas(enrichedAreas)
      setData({ enrichedAreas, periods, tempRange, humidRange, general24, tempReadings, humidReadings, rainReadings })
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

    const { lat, lon } = area

    let temperature = null
    if (data.tempReadings?.length && lat != null) {
      const nearest = findNearest(lat, lon, data.tempReadings, r => ({ lat: r.lat, lon: r.lon }))
      temperature = nearest?.value ?? null
    }

    let humidity = null
    if (data.humidReadings?.length && lat != null) {
      const nearest = findNearest(lat, lon, data.humidReadings, r => ({ lat: r.lat, lon: r.lon }))
      humidity = nearest?.value ?? null
    }

    let rainfall = null
    let isRaining = false
    if (data.rainReadings?.length && lat != null) {
      const nearest = findNearest(lat, lon, data.rainReadings, r => ({ lat: r.lat, lon: r.lon }))
      rainfall = nearest?.value ?? null
      isRaining = rainfall != null && rainfall > 0
    }

    return { area, temperature, humidity, rainfall, isRaining }
  }, [data])

  return { areas, data, loading, error, updatedAt, retry: fetchAll, areaWeather }
}
