export interface MarketPoint {
  time: string
  value: number
}

export interface MarketCompany {
  id: number
  name: string
  ticker: string
  logo: string
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
    logo: '/images/stocks/apple.png',
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
    logo: '/images/stocks/tesla.png',
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
    logo: '/images/stocks/nvidia.png',
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
    logo: '/images/stocks/amazon.png',
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
    logo: '/images/stocks/microsoft.png',
    startPrice: 428,
    minPrice: 360,
    maxPrice: 500,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 6,
    name: 'Meta',
    ticker: 'META',
    logo: '/images/stocks/meta.png',
    startPrice: 512,
    minPrice: 430,
    maxPrice: 620,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 7,
    name: 'Netflix',
    ticker: 'NFLX',
    logo: '/images/stocks/netflix.png',
    startPrice: 640,
    minPrice: 500,
    maxPrice: 760,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 8,
    name: 'Google',
    ticker: 'GOOGL',
    logo: '/images/stocks/google.png',
    startPrice: 168,
    minPrice: 130,
    maxPrice: 220,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 9,
    name: 'AMD',
    ticker: 'AMD',
    logo: '/images/stocks/amd.png',
    startPrice: 156,
    minPrice: 110,
    maxPrice: 220,
    pointsCount: 24,
    updateInterval: 300000,
  },
  {
    id: 10,
    name: 'Intel',
    ticker: 'INTC',
    logo: '/images/stocks/intel.png',
    startPrice: 34,
    minPrice: 20,
    maxPrice: 60,
    pointsCount: 24,
    updateInterval: 300000,
  },
]

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