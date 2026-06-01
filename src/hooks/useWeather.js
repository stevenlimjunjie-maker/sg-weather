import { useState, useEffect, useCallback, useRef } from 'react'

const URLS = {
  twoHr: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
  twentyFourHr: 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
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
      const [twoHr, twentyFour] = await Promise.all([
        fetchJson(URLS.twoHr),
        fetchJson(URLS.twentyFourHr),
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

      setAreas(enrichedAreas)
      setData({ enrichedAreas, periods, tempRange, general24 })
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
    return { area }
  }, [data])

  return { areas, data, loading, error, updatedAt, retry: fetchAll, areaWeather }
}
