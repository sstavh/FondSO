export interface MarketPoint {
  time: string
  value: number
}

export interface MarketCompany {
  id: number
  name: string
  ticker: string
  startPrice: number
  minPrice: number
  maxPrice: number
  pointsCount: number
  updateInterval: number
}

export const marketCompanies: MarketCompany[] = [
  {
    id: 1,
    name: 'Apple',
    ticker: 'AAPL',
    startPrice: 214,
    minPrice: 180,
    maxPrice: 260,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 2,
    name: 'Tesla',
    ticker: 'TSLA',
    startPrice: 187,
    minPrice: 130,
    maxPrice: 260,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 3,
    name: 'NVIDIA',
    ticker: 'NVDA',
    startPrice: 902,
    minPrice: 700,
    maxPrice: 1100,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 4,
    name: 'Amazon',
    ticker: 'AMZN',
    startPrice: 178,
    minPrice: 140,
    maxPrice: 230,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 5,
    name: 'Microsoft',
    ticker: 'MSFT',
    startPrice: 428,
    minPrice: 360,
    maxPrice: 500,
    pointsCount: 24,
    updateInterval: 300000,
  },
]

export const getMarketCompanyByTicker = (ticker: string): MarketCompany => {
  const company = marketCompanies.find((item) => item.ticker === ticker)

  if (!company) {
    return marketCompanies[0]!
  }

  return company
}

export const formatTimeLabel = (offset = 0, pointsCount = 24) => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - (pointsCount - 1 - offset) * 5)

  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const createInitialMarketPoints = (
  startPrice: number,
  pointsCount: number,
  minPrice: number,
  maxPrice: number
): MarketPoint[] => {
  const points: MarketPoint[] = []
  let currentPrice = startPrice

  for (let index = 0; index < pointsCount; index += 1) {
    const change = (Math.random() - 0.5) * (startPrice * 0.04)
    currentPrice = Math.max(minPrice, Math.min(maxPrice, currentPrice + change))

    points.push({
      time: formatTimeLabel(index, pointsCount),
      value: Number(currentPrice.toFixed(2)),
    })
  }

  return points
}