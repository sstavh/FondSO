export interface TrendingStockItem {
  id: number
  name: string
  ticker: string
  price: number
  changePercent: number
  direction: 'up' | 'down'
}

export const trendingStocks: TrendingStockItem[] = [
  {
    id: 1,
    name: 'Apple',
    ticker: 'AAPL',
    price: 214.32,
    changePercent: 3.8,
    direction: 'up',
  },
  {
    id: 2,
    name: 'Tesla',
    ticker: 'TSLA',
    price: 187.45,
    changePercent: 5.2,
    direction: 'up',
  },
  {
    id: 3,
    name: 'NVIDIA',
    ticker: 'NVDA',
    price: 902.14,
    changePercent: 6.4,
    direction: 'up',
  },
  {
    id: 4,
    name: 'Amazon',
    ticker: 'AMZN',
    price: 178.21,
    changePercent: 2.7,
    direction: 'up',
  },
  {
    id: 5,
    name: 'Microsoft',
    ticker: 'MSFT',
    price: 428.9,
    changePercent: 1.9,
    direction: 'up',
  },
]