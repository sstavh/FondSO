import { ref, watch } from 'vue'
import type { MarketCompany } from '~/composables/useApi'

export interface MarketStatsState {
  change24h: number
  changePercent: number
  buyVolume: number
  sellVolume: number
  totalVolume: number
}

const emptyStats = (): MarketStatsState => ({
  change24h: 0,
  changePercent: 0,
  buyVolume: 0,
  sellVolume: 0,
  totalVolume: 0,
})

export const useMarketStats = (company: () => MarketCompany) => {
  const config = useRuntimeConfig()

  const apiGet = async <T>(path: string): Promise<T> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('fondso_token') ?? '' : ''
    const res = await fetch(`${config.public.apiBase}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  }

  const stats = ref<MarketStatsState>(emptyStats())

  const fetchStats = async () => {
    if (!company()) return
    try {
      const data = await apiGet<any>(`/api/market/companies/${company().ticker}/stats`)
      stats.value = {
        change24h: Number(data.change24h ?? 0),
        changePercent: Number(data.changePercent ?? 0),
        buyVolume: Number(data.buyVolume ?? 0),
        sellVolume: Number(data.sellVolume ?? 0),
        totalVolume: Number(data.totalVolume ?? 0),
      }
    } catch {
      stats.value = emptyStats()
    }
  }

  watch(() => company()?.id, (id) => { if (id) fetchStats() }, { immediate: true })

  return { stats }
}
