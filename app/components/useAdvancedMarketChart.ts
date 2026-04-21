import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { MarketCompany, MarketPoint } from '~/data/marketCompanies'
import { createInitialMarketPoints } from '~/data/marketCompanies'

export interface DrawPoint {
  x: number
  y: number
}

export type DrawMode = 'none' | 'trend' | 'horizontal' | 'vertical'

export interface DrawShape {
  id: number
  mode: Exclude<DrawMode, 'none'>
  start: DrawPoint
  end: DrawPoint
}

export interface HoverState {
  x: number
  y: number
  pointIndex: number
  visible: boolean
}

export type TimeframeKey = '1D' | '1W' | '1M' | '3M'

const timeframeMultipliers: Record<TimeframeKey, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
}

export const useAdvancedMarketChart = (company: () => MarketCompany) => {
  const chartWidth = 1280
  const chartHeight = 560
  const paddingTop = 24
  const paddingRight = 80
  const paddingBottom = 44
  const paddingLeft = 64

  const points = ref<MarketPoint[]>([])
  const zoom = ref(1)
  const offsetX = ref(0)
  const timeframe = ref<TimeframeKey>('1D')

  const drawMode = ref<DrawMode>('none')
  const drawings = ref<DrawShape[]>([])
  const draftShape = ref<DrawShape | null>(null)
  const isDrawing = ref(false)

  const hover = ref<HoverState>({
    x: 0,
    y: 0,
    pointIndex: 0,
    visible: false,
  })

  const isLive = ref(false)
  let liveTimer: ReturnType<typeof setInterval> | null = null

  const buildPoints = () => {
    const current = company()
    const multiplier = timeframeMultipliers[timeframe.value]
    const totalPoints = Math.max(current.pointsCount * multiplier, current.pointsCount)

    points.value = createInitialMarketPoints(
      current.startPrice,
      totalPoints,
      current.minPrice,
      current.maxPrice
    )

    zoom.value = 1
    offsetX.value = 0
    hover.value.visible = false
  }

  const pushNextPoint = () => {
    const current = company()
    if (!points.value.length) {
      buildPoints()
      return
    }

    const last = points.value[points.value.length - 1]
    const lastValue = last ? last.value : current.startPrice

    const delta = (Math.random() - 0.5) * (current.startPrice * 0.03)
    const nextValue = Math.max(
      current.minPrice,
      Math.min(current.maxPrice, Number((lastValue + delta).toFixed(2)))
    )

    const nextPoint: MarketPoint = {
      time: new Date().toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: nextValue,
    }

    points.value = [...points.value.slice(1), nextPoint]
  }

  const startLive = () => {
    stopLive()
    isLive.value = true
    liveTimer = setInterval(() => {
      pushNextPoint()
    }, company().updateInterval)
  }

  const stopLive = () => {
    if (liveTimer) {
      clearInterval(liveTimer)
      liveTimer = null
    }
    isLive.value = false
  }

  const toggleLive = () => {
    if (isLive.value) {
      stopLive()
      return
    }
    startLive()
  }

  buildPoints()

  watch(
    () => company().id,
    () => {
      drawings.value = []
      draftShape.value = null
      buildPoints()
      if (isLive.value) startLive()
    }
  )

  watch(timeframe, () => {
    drawings.value = []
    draftShape.value = null
    buildPoints()
  })

  onBeforeUnmount(() => {
    stopLive()
  })

  const plotWidth = computed(() => chartWidth - paddingLeft - paddingRight)
  const plotHeight = computed(() => chartHeight - paddingTop - paddingBottom)

  const minValue = computed(() => {
    if (!points.value.length) return 0
    return Math.min(...points.value.map((point) => point.value))
  })

  const maxValue = computed(() => {
    if (!points.value.length) return 1
    return Math.max(...points.value.map((point) => point.value))
  })

  const range = computed(() => Math.max(maxValue.value - minValue.value, 1))

  const normalizedPoints = computed(() => {
    const total = points.value.length
    const scaledWidth = plotWidth.value * zoom.value

    return points.value.map((point, index) => {
      const x =
        paddingLeft +
        (index * scaledWidth) / Math.max(total - 1, 1) -
        offsetX.value

      const y =
        paddingTop +
        (1 - (point.value - minValue.value) / range.value) * plotHeight.value

      return {
        ...point,
        index,
        x,
        y,
      }
    })
  })

  const visiblePoints = computed(() =>
    normalizedPoints.value.filter(
      (point) =>
        point.x >= paddingLeft - 80 &&
        point.x <= chartWidth - paddingRight + 80
    )
  )

  const buildSmoothPath = (list: Array<{ x: number; y: number }>) => {
    if (list.length === 0) return ''
    if (list.length === 1) {
      const first = list[0]
      return `M ${first.x} ${first.y}`
    }

    const first = list[0]
    let path = `M ${first.x} ${first.y}`

    for (let index = 0; index < list.length - 1; index += 1) {
      const current = list[index]
      const next = list[index + 1]

      if (!current || !next) continue

      const controlX = (current.x + next.x) / 2
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`
    }

    return path
  }

  const linePath = computed(() => buildSmoothPath(visiblePoints.value))

  const areaPath = computed(() => {
    if (!visiblePoints.value.length) return ''

    const first = visiblePoints.value[0]
    const last = visiblePoints.value[visiblePoints.value.length - 1]

    if (!first || !last) return ''

    const baseY = chartHeight - paddingBottom

    return `${buildSmoothPath(visiblePoints.value)} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`
  })

  const gridLines = computed(() => {
    const total = 6

    return Array.from({ length: total }, (_, index) => {
      const y = paddingTop + (plotHeight.value / (total - 1)) * index
      const value = Number(
        (maxValue.value - (range.value / (total - 1)) * index).toFixed(2)
      )

      return { y, value }
    })
  })

  const timeLabels = computed(() => {
    const pointsList = visiblePoints.value
    if (!pointsList.length) return []

    const maxLabels = 6
    const step = Math.max(Math.floor(pointsList.length / maxLabels), 1)

    return pointsList.filter((_, index) => index % step === 0).slice(0, maxLabels + 1)
  })

  const currentPrice = computed(() => {
    if (!points.value.length) return 0
    const last = points.value[points.value.length - 1]
    return last ? last.value : 0
  })

  const priceChange = computed(() => {
    if (points.value.length < 2) return 0
    const first = points.value[0]
    return first ? currentPrice.value - first.value : 0
  })

  const priceChangePercent = computed(() => {
    if (points.value.length < 2) return 0
    const first = points.value[0]
    if (!first || first.value === 0) return 0
    return (priceChange.value / first.value) * 100
  })

  const movingAverage = (period: number) =>
    computed(() => {
      return visiblePoints.value.map((point) => {
        const sourceIndex = point.index
        const start = Math.max(sourceIndex - period + 1, 0)
        const slice = points.value.slice(start, sourceIndex + 1)
        const avg =
          slice.reduce((sum, item) => sum + item.value, 0) / Math.max(slice.length, 1)

        const y =
          paddingTop +
          (1 - (avg - minValue.value) / range.value) * plotHeight.value

        return {
          x: point.x,
          y,
        }
      })
    })

  const ma7 = movingAverage(7)
  const ma14 = movingAverage(14)

  const ma7Path = computed(() => buildSmoothPath(ma7.value))
  const ma14Path = computed(() => buildSmoothPath(ma14.value))

  const lastPriceY = computed(() => {
    return (
      paddingTop +
      (1 - (currentPrice.value - minValue.value) / range.value) * plotHeight.value
    )
  })

  const zoomIn = () => {
    zoom.value = Math.min(zoom.value + 0.25, 5)
  }

  const zoomOut = () => {
    zoom.value = Math.max(zoom.value - 0.25, 1)
    const maxOffset = Math.max(plotWidth.value * (zoom.value - 1), 0)
    offsetX.value = Math.min(offsetX.value, maxOffset)
  }

  const resetView = () => {
    zoom.value = 1
    offsetX.value = 0
    hover.value.visible = false
  }

  const pan = (deltaX: number) => {
    const maxOffset = Math.max(plotWidth.value * (zoom.value - 1), 0)
    offsetX.value = Math.min(Math.max(offsetX.value + deltaX, 0), maxOffset)
  }

  const zoomAtPoint = (deltaY: number, anchorX: number) => {
    const oldZoom = zoom.value
    const nextZoom =
      deltaY < 0 ? Math.min(oldZoom + 0.15, 5) : Math.max(oldZoom - 0.15, 1)

    if (nextZoom === oldZoom) return

    const plotX = anchorX - paddingLeft + offsetX.value
    const ratio = plotX / Math.max(plotWidth.value * oldZoom, 1)

    zoom.value = nextZoom

    const nextPlotX = ratio * plotWidth.value * nextZoom
    const maxOffset = Math.max(plotWidth.value * (nextZoom - 1), 0)

    offsetX.value = Math.min(
      Math.max(nextPlotX - (anchorX - paddingLeft), 0),
      maxOffset
    )
  }

  const setDrawMode = (mode: DrawMode) => {
    drawMode.value = drawMode.value === mode ? 'none' : mode
  }

  const setTimeframe = (value: TimeframeKey) => {
    timeframe.value = value
  }

  const startDraw = (x: number, y: number) => {
    if (drawMode.value === 'none') return

    isDrawing.value = true
    draftShape.value = {
      id: Date.now(),
      mode: drawMode.value,
      start: { x, y },
      end: { x, y },
    }
  }

  const updateDraw = (x: number, y: number) => {
    if (!isDrawing.value || !draftShape.value) return

    if (draftShape.value.mode === 'horizontal') {
      draftShape.value.end = { x, y: draftShape.value.start.y }
      return
    }

    if (draftShape.value.mode === 'vertical') {
      draftShape.value.end = { x: draftShape.value.start.x, y }
      return
    }

    draftShape.value.end = { x, y }
  }

  const finishDraw = () => {
    if (!draftShape.value) return

    drawings.value.push({ ...draftShape.value })
    draftShape.value = null
    isDrawing.value = false
  }

  const clearDrawings = () => {
    drawings.value = []
    draftShape.value = null
    isDrawing.value = false
  }

  const removeLastDrawing = () => {
    drawings.value = drawings.value.slice(0, -1)
  }

  const setHoverAtX = (x: number) => {
    if (!visiblePoints.value.length) {
      hover.value.visible = false
      return
    }

    let nearest = visiblePoints.value[0]
    if (!nearest) {
      hover.value.visible = false
      return
    }

    let minDistance = Math.abs(nearest.x - x)

    for (const point of visiblePoints.value) {
      const distance = Math.abs(point.x - x)
      if (distance < minDistance) {
        nearest = point
        minDistance = distance
      }
    }

    hover.value = {
      x: nearest.x,
      y: nearest.y,
      pointIndex: nearest.index,
      visible: true,
    }
  }

  const clearHover = () => {
    hover.value.visible = false
  }

  const hoverPoint = computed(() => {
    if (!hover.value.visible) return null
    return points.value[hover.value.pointIndex] ?? null
  })

  return {
    chartWidth,
    chartHeight,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    points,
    visiblePoints,
    linePath,
    areaPath,
    gridLines,
    timeLabels,
    currentPrice,
    priceChange,
    priceChangePercent,
    ma7Path,
    ma14Path,
    lastPriceY,
    zoom,
    timeframe,
    setTimeframe,
    zoomIn,
    zoomOut,
    zoomAtPoint,
    resetView,
    pan,
    drawMode,
    setDrawMode,
    drawings,
    draftShape,
    startDraw,
    updateDraw,
    finishDraw,
    clearDrawings,
    removeLastDrawing,
    hover,
    hoverPoint,
    setHoverAtX,
    clearHover,
    isLive,
    toggleLive,
  }
}