import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { MarketCompany, MarketPoint } from '~/composables/useApi'

export { type MarketCompany, type MarketPoint }

export const useLiveMarketChart = (company: () => MarketCompany) => {
  const config = useRuntimeConfig()

  const apiGet = async <T>(path: string): Promise<T> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('fondso_token') ?? '' : ''
    const res = await fetch(`${config.public.apiBase}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  }

  const points = ref<MarketPoint[]>([])
  let intervalId: ReturnType<typeof setInterval> | null = null

  const chartWidth = 900
  const chartHeight = 320
  const paddingTop = 24
  const paddingRight = 16
  const paddingBottom = 28
  const paddingLeft = 16

  const fetchInitial = async () => {
    const current = company()
    if (!current) return
    try {
      const res = await apiGet<{ points: MarketPoint[] }>(`/api/market/companies/${current.ticker}/chart?timeframe=1D`)
      points.value = (res.points ?? []).map((p: any) => ({ time: p.time, value: Number(p.value) }))
    } catch {
      points.value = []
    }
  }

  const fetchNext = async () => {
    const current = company()
    if (!current) return
    try {
      const res = await apiGet<{ points: MarketPoint[] }>(`/api/market/companies/${current.ticker}/chart/next`)
      const next = res.points?.[0]
      if (next) {
        const nextPoint: MarketPoint = { time: next.time, value: Number(next.value) }
        points.value = [...points.value.slice(1), nextPoint]
      }
    } catch { /* silent */ }
  }

  const restartChart = async () => {
    if (intervalId) clearInterval(intervalId)
    await fetchInitial()
    const current = company()
    intervalId = setInterval(fetchNext, current.updateInterval)
  }

  const minValue = computed(() => points.value.length ? Math.min(...points.value.map(p => p.value)) : 0)
  const maxValue = computed(() => points.value.length ? Math.max(...points.value.map(p => p.value)) : 1)
  const range = computed(() => Math.max(maxValue.value - minValue.value, 1))

  const normalizedPoints = computed(() =>
    points.value.map((point, index) => {
      const x = paddingLeft + (index * (chartWidth - paddingLeft - paddingRight)) / Math.max(points.value.length - 1, 1)
      const y = paddingTop + (1 - (point.value - minValue.value) / range.value) * (chartHeight - paddingTop - paddingBottom)
      return { ...point, x, y }
    })
  )

  const buildSmoothPath = (list: Array<{ x: number; y: number }>) => {
    if (!list.length) return ''
    if (list.length === 1) return `M ${list[0]!.x} ${list[0]!.y}`
    let path = `M ${list[0]!.x} ${list[0]!.y}`
    for (let i = 0; i < list.length - 1; i++) {
      const cur = list[i]!
      const nxt = list[i + 1]!
      const cx = (cur.x + nxt.x) / 2
      path += ` C ${cx} ${cur.y}, ${cx} ${nxt.y}, ${nxt.x} ${nxt.y}`
    }
    return path
  }

  const linePath = computed(() => buildSmoothPath(normalizedPoints.value))

  const areaPath = computed(() => {
    if (!normalizedPoints.value.length) return ''
    const first = normalizedPoints.value[0]!
    const last = normalizedPoints.value[normalizedPoints.value.length - 1]!
    const baseY = chartHeight - paddingBottom
    return `${buildSmoothPath(normalizedPoints.value)} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`
  })

  const gridLines = computed(() => {
    const total = 5
    return Array.from({ length: total }, (_, i) => {
      const y = paddingTop + ((chartHeight - paddingTop - paddingBottom) / (total - 1)) * i
      const value = Number((maxValue.value - (range.value / (total - 1)) * i).toFixed(2))
      return { y, value }
    })
  })

  const currentPrice = computed(() => points.value.length ? points.value[points.value.length - 1]!.value : 0)
  const priceChange = computed(() => points.value.length < 2 ? 0 : currentPrice.value - points.value[0]!.value)
  const priceChangePercent = computed(() => {
    const first = points.value[0]?.value
    if (!first) return 0
    return (priceChange.value / first) * 100
  })

  onMounted(() => { if (company()) restartChart() })
  onBeforeUnmount(() => { if (intervalId) clearInterval(intervalId) })
  watch(() => company()?.id, (id) => { if (id) restartChart() })

  return {
    points,
    chartWidth,
    chartHeight,
    paddingLeft,
    paddingRight,
    linePath,
    areaPath,
    gridLines,
    currentPrice,
    priceChange,
    priceChangePercent,
  }
}
