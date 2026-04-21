export interface MarketStats {
  change24h: number
  changePercent: number
  buyVolume: number
  sellVolume: number
  totalVolume: number
}

export const generateMarketStats = (basePrice: number): MarketStats => {
  const change = (Math.random() - 0.5) * basePrice * 0.08
  const buy = Math.random() * 5000 + 2000
  const sell = Math.random() * 5000 + 2000

  return {
    change24h: Number(change.toFixed(2)),
    changePercent: Number(((change / basePrice) * 100).toFixed(2)),
    buyVolume: Math.round(buy),
    sellVolume: Math.round(sell),
    totalVolume: Math.round(buy + sell),
  }
}