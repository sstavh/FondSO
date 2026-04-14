import { ref, watch } from 'vue'
import type { MarketCompany } from '~/data/marketCompanies'

export interface MarketStatsState {
  change24h: number
  changePercent: number
  buyVolume: number
  sellVolume: number
  totalVolume: number
}

const generateMarketStats = (basePrice: number): MarketStatsState => {
  const change24h = Number(((Math.random() - 0.5) * basePrice * 0.08).toFixed(2))
  const changePercent = Number(((change24h / basePrice) * 100).toFixed(2))

  const buyVolume = Math.round(Math.random() * 5000 + 2500)
  const sellVolume = Math.round(Math.random() * 5000 + 2000)
  const totalVolume = buyVolume + sellVolume

  return {
    change24h,
    changePercent,
    buyVolume,
    sellVolume,
    totalVolume,
  }
}

export const useMarketStats = (company: () => MarketCompany) => {
  const stats = ref<MarketStatsState>(generateMarketStats(company().startPrice))

  watch(
    () => company().id,
    () => {
      stats.value = generateMarketStats(company().startPrice)
    },
    { immediate: true }
  )

  return {
    stats,
  }
}