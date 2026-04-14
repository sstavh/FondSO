export interface MarketPoint {
  time: string
  value: number
}

export interface MarketConfig {
  startPrice: number
  minPrice: number
  maxPrice: number
  pointsCount: number
  updateInterval: number
}

export const marketChartConfig: MarketConfig = {
  startPrice: 18640,
  minPrice: 16000,
  maxPrice: 24000,
  pointsCount: 24,
  updateInterval: 300000, // 5 хвилин
}

export const createInitialMarketPoints = (
  startPrice: number,
  pointsCount: number
): MarketPoint[] => {
  const points: MarketPoint[] = []
  let currentPrice = startPrice

  for (let index = 0; index < pointsCount; index += 1) {
    const change = (Math.random() - 0.5) * 500
    currentPrice = Math.max(15000, Math.min(25000, currentPrice + change))

    points.push({
      time: formatTimeLabel(index, pointsCount),
      value: Math.round(currentPrice),
    })
  }

  return points
}

export const formatTimeLabel = (offset = 0, pointsCount = 24) => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - (pointsCount - 1 - offset) * 5)

  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}