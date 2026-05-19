import { computed, ref, watch, onBeforeUnmount } from 'vue'
import type { MarketCompany, MarketPoint } from '~/composables/useApi'

export interface DrawPoint { x: number; y: number }
export type DrawMode = 'none' | 'trend' | 'horizontal' | 'vertical'
export interface DrawShape { id: number; mode: Exclude<DrawMode, 'none'>; start: DrawPoint; end: DrawPoint }
export interface HoverState { x: number; y: number; pointIndex: number; visible: boolean }
export type TimeframeKey = '1D' | '1W' | '1M' | '3M'

interface ApiPoint { time: string; value: number }

const BASE_URL = 'http://localhost:8080'

const apiGet = async <T>(path: string): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('fondso_token') ?? '' : ''
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export const useAdvancedMarketChart = (company: () => MarketCompany) => {
  const chartWidth = 1080
  const chartHeight = 460
  const indicatorHeight = 60
  const paddingTop = 14
  const paddingRight = 64
  const paddingBottom = 30
  const paddingLeft = 50
  const gapBetweenCharts = 10

  const points = ref<MarketPoint[]>([])
  const ma7Data = ref<ApiPoint[]>([])
  const ma25Data = ref<ApiPoint[]>([])
  const rsiData = ref<ApiPoint[]>([])

  const zoom = ref(1)
  const offsetX = ref(0)
  const timeframe = ref<TimeframeKey>('1D')

  const drawMode = ref<DrawMode>('none')
  const drawings = ref<DrawShape[]>([])
  const draftShape = ref<DrawShape | null>(null)
  const isDrawing = ref(false)
  const hover = ref<HoverState>({ x: 0, y: 0, pointIndex: 0, visible: false })
  const isLive = ref(false)
  let liveTimer: ReturnType<typeof setInterval> | null = null

  const plotWidth = computed(() => chartWidth - paddingLeft - paddingRight)
  const pricePlotHeight = computed(() => chartHeight - paddingTop - paddingBottom - indicatorHeight - gapBetweenCharts)
  const indicatorTop = computed(() => paddingTop + pricePlotHeight.value + gapBetweenCharts)
  const indicatorPlotHeight = computed(() => indicatorHeight)

  const buildPoints = async () => {
    const current = company()
    if (!current) return
    try {
      const res = await apiGet<any>(`/api/market/companies/${current.ticker}/chart?timeframe=${timeframe.value}`)
      points.value = (res.points ?? []).map((p: any) => ({ time: p.time, value: Number(p.value) }))
      ma7Data.value = (res.ma7 ?? []).map((p: any) => ({ time: p.time, value: Number(p.value) }))
      ma25Data.value = (res.ma25 ?? []).map((p: any) => ({ time: p.time, value: Number(p.value) }))
      rsiData.value = (res.rsi ?? []).map((p: any) => ({ time: p.time, value: Number(p.value) }))
    } catch {
      points.value = []
      ma7Data.value = []
      ma25Data.value = []
      rsiData.value = []
    }
    zoom.value = 1
    offsetX.value = 0
    hover.value.visible = false
  }

  const fetchNextPoint = async () => {
    const current = company()
    try {
      const res = await apiGet<any>(`/api/market/companies/${current.ticker}/chart/next`)
      const next = res.points?.[0]
      if (next) {
        const p: MarketPoint = { time: next.time, value: Number(next.value) }
        points.value = [...points.value.slice(1), p]
        if (ma7Data.value.length) ma7Data.value = [...ma7Data.value.slice(1), { time: next.time, value: Number(next.value) }]
        if (ma25Data.value.length) ma25Data.value = [...ma25Data.value.slice(1), { time: next.time, value: Number(next.value) }]
        if (rsiData.value.length) rsiData.value = [...rsiData.value.slice(1), { time: next.time, value: 50 }]
      }
    } catch { /* silent */ }
  }

  const startLive = () => {
    stopLive()
    isLive.value = true
    liveTimer = setInterval(fetchNextPoint, company()?.updateInterval ?? 5000)
  }

  const stopLive = () => {
    if (liveTimer) { clearInterval(liveTimer); liveTimer = null }
    isLive.value = false
  }

  const toggleLive = () => isLive.value ? stopLive() : startLive()

  buildPoints()

  watch(() => company()?.id, (id) => {
    if (!id) return
    drawings.value = []
    draftShape.value = null
    buildPoints()
    if (isLive.value) startLive()
  })

  watch(timeframe, () => {
    drawings.value = []
    draftShape.value = null
    buildPoints()
  })

  onBeforeUnmount(stopLive)

  const minValue = computed(() => points.value.length ? Math.min(...points.value.map(p => p.value)) : 0)
  const maxValue = computed(() => points.value.length ? Math.max(...points.value.map(p => p.value)) : 1)
  const range = computed(() => Math.max(maxValue.value - minValue.value, 1))

  const normalizedPoints = computed(() => {
    const total = points.value.length
    const scaledWidth = plotWidth.value * zoom.value
    return points.value.map((point, index) => {
      const x = paddingLeft + (index * scaledWidth) / Math.max(total - 1, 1) - offsetX.value
      const y = paddingTop + (1 - (point.value - minValue.value) / range.value) * pricePlotHeight.value
      return { ...point, index, x, y }
    })
  })

  const visiblePoints = computed(() =>
    normalizedPoints.value.filter(p => p.x >= paddingLeft - 80 && p.x <= chartWidth - paddingRight + 80)
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

  const linePath = computed(() => buildSmoothPath(visiblePoints.value))

  const areaPath = computed(() => {
    if (!visiblePoints.value.length) return ''
    const first = visiblePoints.value[0]!
    const last = visiblePoints.value[visiblePoints.value.length - 1]!
    const baseY = paddingTop + pricePlotHeight.value
    return `${buildSmoothPath(visiblePoints.value)} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`
  })

  const gridLines = computed(() => {
    const total = 6
    return Array.from({ length: total }, (_, i) => {
      const y = paddingTop + (pricePlotHeight.value / (total - 1)) * i
      const value = Number((maxValue.value - (range.value / (total - 1)) * i).toFixed(2))
      return { y, value }
    })
  })

  const timeLabels = computed(() => {
    const list = visiblePoints.value
    if (!list.length) return []
    const maxLabels = 6
    const step = Math.max(Math.floor(list.length / maxLabels), 1)
    return list.filter((_, i) => i % step === 0).slice(0, maxLabels + 1)
  })

  const yFromValue = (val: number) =>
    paddingTop + (1 - (val - minValue.value) / range.value) * pricePlotHeight.value

  const mapIndicatorPoints = (data: ApiPoint[]) =>
    computed(() =>
      visiblePoints.value.map(vp => {
        const d = data[vp.index]
        return { x: vp.x, y: d ? yFromValue(d.value) : vp.y }
      })
    )

  const ma7Points = mapIndicatorPoints(ma7Data.value)
  const ma25Points = mapIndicatorPoints(ma25Data.value)

  const ma7PointsComputed = computed(() =>
    visiblePoints.value.map(vp => {
      const d = ma7Data.value[vp.index]
      return { x: vp.x, y: d ? yFromValue(d.value) : vp.y }
    })
  )
  const ma25PointsComputed = computed(() =>
    visiblePoints.value.map(vp => {
      const d = ma25Data.value[vp.index]
      return { x: vp.x, y: d ? yFromValue(d.value) : vp.y }
    })
  )

  const ma7Path = computed(() => buildSmoothPath(ma7PointsComputed.value))
  const ma25Path = computed(() => buildSmoothPath(ma25PointsComputed.value))

  const bollingerUpperPath = computed(() => '')
  const bollingerLowerPath = computed(() => '')

  const rsiSeries = computed(() => {
    const total = points.value.length
    const scaledWidth = plotWidth.value * zoom.value
    return rsiData.value
      .map((item, index) => {
        const x = paddingLeft + (index * scaledWidth) / Math.max(total - 1, 1) - offsetX.value
        const y = indicatorTop.value + (1 - item.value / 100) * indicatorPlotHeight.value
        return { index, value: item.value, x, y }
      })
      .filter(item => item.x >= paddingLeft - 80 && item.x <= chartWidth - paddingRight + 80)
  })

  const rsiPath = computed(() => buildSmoothPath(rsiSeries.value))

  const currentPrice = computed(() => points.value.length ? points.value[points.value.length - 1]!.value : 0)
  const firstPrice = computed(() => points.value[0]?.value ?? 0)
  const priceChange = computed(() => points.value.length < 2 ? 0 : currentPrice.value - firstPrice.value)
  const priceChangePercent = computed(() => firstPrice.value ? (priceChange.value / firstPrice.value) * 100 : 0)
  const highValue = computed(() => points.value.length ? Math.max(...points.value.map(p => p.value)) : 0)
  const lowValue = computed(() => points.value.length ? Math.min(...points.value.map(p => p.value)) : 0)
  const averageValue = computed(() => {
    if (!points.value.length) return 0
    return points.value.reduce((s, p) => s + p.value, 0) / points.value.length
  })
  const volatilityPercent = computed(() => 0)

  const lastPriceY = computed(() =>
    paddingTop + (1 - (currentPrice.value - minValue.value) / range.value) * pricePlotHeight.value
  )

  const zoomIn = () => { zoom.value = Math.min(zoom.value + 0.25, 5) }
  const zoomOut = () => {
    zoom.value = Math.max(zoom.value - 0.25, 1)
    offsetX.value = Math.min(offsetX.value, Math.max(plotWidth.value * (zoom.value - 1), 0))
  }
  const resetView = () => { zoom.value = 1; offsetX.value = 0; hover.value.visible = false }
  const pan = (deltaX: number) => {
    offsetX.value = clamp(offsetX.value + deltaX, 0, Math.max(plotWidth.value * (zoom.value - 1), 0))
  }
  const zoomAtPoint = (deltaY: number, anchorX: number) => {
    const oldZoom = zoom.value
    const nextZoom = deltaY < 0 ? Math.min(oldZoom + 0.15, 5) : Math.max(oldZoom - 0.15, 1)
    if (nextZoom === oldZoom) return
    const plotX = anchorX - paddingLeft + offsetX.value
    const ratio = plotX / Math.max(plotWidth.value * oldZoom, 1)
    zoom.value = nextZoom
    offsetX.value = clamp(ratio * plotWidth.value * nextZoom - (anchorX - paddingLeft), 0, Math.max(plotWidth.value * (nextZoom - 1), 0))
  }

  const setDrawMode = (mode: DrawMode) => { drawMode.value = drawMode.value === mode ? 'none' : mode }
  const setTimeframe = (value: TimeframeKey) => { timeframe.value = value }

  const startDraw = (x: number, y: number) => {
    if (drawMode.value === 'none') return
    isDrawing.value = true
    draftShape.value = { id: Date.now(), mode: drawMode.value, start: { x, y }, end: { x, y } }
  }
  const updateDraw = (x: number, y: number) => {
    if (!isDrawing.value || !draftShape.value) return
    if (draftShape.value.mode === 'horizontal') { draftShape.value.end = { x, y: draftShape.value.start.y }; return }
    if (draftShape.value.mode === 'vertical') { draftShape.value.end = { x: draftShape.value.start.x, y }; return }
    draftShape.value.end = { x, y }
  }
  const finishDraw = () => {
    if (!draftShape.value) return
    drawings.value.push({ ...draftShape.value })
    draftShape.value = null
    isDrawing.value = false
  }
  const clearDrawings = () => { drawings.value = []; draftShape.value = null; isDrawing.value = false }
  const removeLastDrawing = () => { drawings.value = drawings.value.slice(0, -1) }

  const setHoverAtX = (x: number) => {
    if (!visiblePoints.value.length) { hover.value.visible = false; return }
    let nearest = visiblePoints.value[0]!
    let minDist = Math.abs(nearest.x - x)
    for (const p of visiblePoints.value) {
      const d = Math.abs(p.x - x)
      if (d < minDist) { nearest = p; minDist = d }
    }
    hover.value = { x: nearest.x, y: nearest.y, pointIndex: nearest.index, visible: true }
  }
  const clearHover = () => { hover.value.visible = false }
  const hoverPoint = computed(() => hover.value.visible ? (points.value[hover.value.pointIndex] ?? null) : null)

  return {
    chartWidth, chartHeight, paddingTop, paddingRight, paddingBottom, paddingLeft,
    indicatorTop, indicatorPlotHeight,
    visiblePoints, linePath, areaPath, gridLines, timeLabels,
    currentPrice, priceChange, priceChangePercent, highValue, lowValue, averageValue, volatilityPercent,
    ma7Path, ma25Path, bollingerUpperPath, bollingerLowerPath, rsiPath, lastPriceY,
    zoom, timeframe, setTimeframe, zoomIn, zoomOut, zoomAtPoint, resetView, pan,
    drawMode, setDrawMode, drawings, draftShape, startDraw, updateDraw, finishDraw, clearDrawings, removeLastDrawing,
    hover, hoverPoint, setHoverAtX, clearHover, isLive, toggleLive,
  }
}
