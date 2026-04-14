import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { MarketCompany, MarketPoint } from '~/data/marketCompanies'
import { createInitialMarketPoints, formatTimeLabel } from '~/data/marketCompanies'

export const useLiveMarketChart = (company: () => MarketCompany) => {
  const getCompany = (): MarketCompany => company()

  const createPoints = () => {
    const current = getCompany()

    return createInitialMarketPoints(
      current.startPrice,
      current.pointsCount,
      current.minPrice,
      current.maxPrice
    )
  }

  const points = ref<MarketPoint[]>(createPoints())

  const direction = ref<'up' | 'down'>('up')
  const directionStepsLeft = ref(6)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const chartWidth = 900
  const chartHeight = 320
  const paddingTop = 24
  const paddingRight = 16
  const paddingBottom = 28
  const paddingLeft = 16

  const restartChart = () => {
    const current = getCompany()

    points.value = createInitialMarketPoints(
      current.startPrice,
      current.pointsCount,
      current.minPrice,
      current.maxPrice
    )

    direction.value = 'up'
    directionStepsLeft.value = 6

    if (intervalId) clearInterval(intervalId)
    intervalId = setInterval(pushNextPoint, current.updateInterval)
  }

  const minValue = computed(() => Math.min(...points.value.map((point) => point.value)))
  const maxValue = computed(() => Math.max(...points.value.map((point) => point.value)))
  const range = computed(() => Math.max(maxValue.value - minValue.value, 1))

  const normalizedPoints = computed(() => {
    return points.value.map((point, index) => {
      const x =
        paddingLeft +
        (index * (chartWidth - paddingLeft - paddingRight)) /
          Math.max(points.value.length - 1, 1)

      const y =
        paddingTop +
        (1 - (point.value - minValue.value) / range.value) *
          (chartHeight - paddingTop - paddingBottom)

      return { ...point, x, y }
    })
  })

  const buildSmoothPath = (list: Array<{ x: number; y: number }>) => {
    if (list.length === 0) return ''
    if (list.length === 1) return `M ${list[0]!.x} ${list[0]!.y}`

    let path = `M ${list[0]!.x} ${list[0]!.y}`

    for (let index = 0; index < list.length - 1; index += 1) {
      const current = list[index]!
      const next = list[index + 1]!
      const controlX = (current.x + next.x) / 2

      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`
    }

    return path
  }

  const linePath = computed(() => buildSmoothPath(normalizedPoints.value))

  const areaPath = computed(() => {
    if (normalizedPoints.value.length === 0) return ''

    const first = normalizedPoints.value[0]!
    const last = normalizedPoints.value[normalizedPoints.value.length - 1]!
    const baseY = chartHeight - paddingBottom

    return `${buildSmoothPath(normalizedPoints.value)} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`
  })

  const gridLines = computed(() => {
    const total = 5

    return Array.from({ length: total }, (_, index) => {
      const y =
        paddingTop +
        ((chartHeight - paddingTop - paddingBottom) / (total - 1)) * index

      const value = Number(
        (maxValue.value - (range.value / (total - 1)) * index).toFixed(2)
      )

      return { y, value }
    })
  })

  const currentPrice = computed(() => {
    if (points.value.length === 0) return 0
    return points.value[points.value.length - 1]!.value
  })

  const priceChange = computed(() => {
    if (points.value.length < 2) return 0
    return currentPrice.value - points.value[0]!.value
  })

  const priceChangePercent = computed(() => {
    if (points.value.length < 2) return 0
    const first = points.value[0]!.value
    if (!first) return 0
    return (priceChange.value / first) * 100
  })

  const getNextDirection = () => {
    if (directionStepsLeft.value <= 0) {
      direction.value = Math.random() > 0.5 ? 'up' : 'down'
      directionStepsLeft.value = Math.floor(Math.random() * 6) + 4
    }

    directionStepsLeft.value -= 1
    return direction.value
  }

  const generateNextPrice = () => {
    const current = getCompany()
    const lastPrice = currentPrice.value || current.startPrice
    const marketDirection = getNextDirection()

    const baseMove =
      Math.random() * (current.startPrice * 0.015) + current.startPrice * 0.003
    const noise = (Math.random() - 0.5) * (current.startPrice * 0.008)

    const signedMove =
      marketDirection === 'up'
        ? baseMove + noise
        : -baseMove + noise

    let nextPrice = lastPrice + signedMove

    if (nextPrice < current.minPrice) {
      nextPrice = current.minPrice + current.startPrice * 0.01
      direction.value = 'up'
      directionStepsLeft.value = 5
    }

    if (nextPrice > current.maxPrice) {
      nextPrice = current.maxPrice - current.startPrice * 0.01
      direction.value = 'down'
      directionStepsLeft.value = 5
    }

    return Number(nextPrice.toFixed(2))
  }

  const pushNextPoint = () => {
    const current = getCompany()

    const nextPoint: MarketPoint = {
      time: formatTimeLabel(current.pointsCount - 1, current.pointsCount),
      value: generateNextPrice(),
    }

    points.value = [...points.value.slice(1), nextPoint]
  }

  onMounted(() => {
    restartChart()
  })

  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
  })

  watch(
    () => getCompany().id,
    () => {
      restartChart()
    }
  )

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