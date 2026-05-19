import { reactive, computed } from 'vue'
import { useApi } from './useApi'
import { holdingsStore } from '~/data/userProfile'

interface PriceSnapshot {
  ticker: string
  currentPrice: number
  changePercent: number
  logo: string
}

const prices = reactive<Record<string, PriceSnapshot>>({})

export const useMarketPrices = () => {
  const api = useApi()

  const fetchPrices = async (tickers: string[]) => {
    if (!tickers.length) return
    try {
      const data = await api.get<PriceSnapshot[]>(`/api/market/prices?tickers=${tickers.join(',')}`)
      for (const snap of data) {
        prices[snap.ticker] = snap
      }
    } catch {}
  }

  const totalPortfolioValue = computed(() =>
    holdingsStore.reduce((sum, h) => {
      const snap = prices[h.ticker]
      const price = snap ? snap.currentPrice : h.averageBuyPrice
      return sum + price * h.quantity
    }, 0),
  )

  const totalCostBasis = computed(() =>
    holdingsStore.reduce((sum, h) => sum + h.averageBuyPrice * h.quantity, 0)
  )

  const totalProfitLoss = computed(() => totalPortfolioValue.value - totalCostBasis.value)

  return { prices, fetchPrices, totalPortfolioValue, totalProfitLoss }
}
