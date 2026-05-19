import { useApi } from './useApi'
import { mainStore } from '~/data/userProfile'
import type { TradeOrderItem } from '~/data/userProfile'

const mapOrder = (o: any): TradeOrderItem => ({
  id: Number(o.id),
  side: o.side,
  assetName: o.assetName ?? '',
  ticker: o.ticker ?? '',
  logo: o.logo ?? '',
  currency: o.currency ?? 'USD',
  amount: Number(o.amount ?? 0),
  quantity: Number(o.quantity ?? 0),
  quantityMode: o.quantityMode,
  limitPrice: Number(o.limitPrice ?? 0),
  durationUnit: o.durationUnit ?? 'hours',
  durationValue: o.durationValue ?? null,
  createdAt: o.createdAt ?? '',
  expiresAt: o.expiresAt ?? null,
  progress: Number(o.progress ?? 0),
  status: o.status ?? 'active',
})

export const useStore = () => {
  const api = useApi()

  const loadAll = async () => {
    try {
      const [balance, transactions, goal, profile, holdings, orders] = await Promise.all([
        api.get<any>('/api/balance'),
        api.get<any[]>('/api/transactions'),
        api.get<any>('/api/goal'),
        api.get<any>('/api/user/profile'),
        api.get<any[]>('/api/portfolio/holdings').catch(() => []),
        api.get<any[]>('/api/orders').catch(() => []),
      ])

      mainStore.balanceStore.balance = Number(balance.balance ?? 0)
      mainStore.balanceStore.currency = balance.currency ?? 'UAH'
      mainStore.balanceStore.history = (balance.history ?? []).map((h: any) => ({
        date: h.dateLabel ?? h.date ?? '',
        value: Number(h.value ?? 0),
      }))

      mainStore.transactionsStore.splice(
        0,
        mainStore.transactionsStore.length,
        ...(transactions ?? []).map((t: any) => ({
          id: t.id,
          type: t.type,
          assetName: t.assetName ?? '',
          ticker: t.ticker ?? '',
          quantity: Number(t.quantity ?? 0),
          amount: Number(t.amount ?? 0),
          currency: t.currency ?? 'UAH',
          date: t.date ?? '',
          status: t.status ?? 'completed',
          note: t.note,
        })),
      )

      mainStore.goalStore.targetAmount = Number(goal.targetAmount ?? 0)
      mainStore.goalStore.earnedAmount = Number(goal.earnedAmount ?? 0)

      const firstName = profile.firstName ?? ''
      const lastName = profile.lastName ?? ''
      const autoAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(`${firstName} ${lastName}`.trim() || 'U')}&background=7c3aed&color=ffffff&size=128&bold=true&rounded=true`

      Object.assign(mainStore.userProfile, {
        firstName,
        lastName,
        email: profile.email ?? '',
        avatar: profile.avatar || autoAvatar,
        country: profile.country ?? '',
        purpose: profile.purpose ?? '',
        birthDate: profile.birthDate ?? '',
        phone: profile.phone ?? '',
        registrationCompleted: profile.registrationCompleted ?? false,
      })

      mainStore.holdingsStore.splice(
        0,
        mainStore.holdingsStore.length,
        ...(holdings ?? []).map((h: any) => ({
          ticker: h.ticker ?? '',
          assetName: h.assetName ?? '',
          quantity: Number(h.quantity ?? 0),
          averageBuyPrice: Number(h.averageBuyPrice ?? 0),
          logo: h.logo ?? '',
        })),
      )

      const allOrders = (orders ?? []).map(mapOrder)
      mainStore.buyOrdersStore.splice(0, mainStore.buyOrdersStore.length,
        ...allOrders.filter(o => o.side === 'buy'),
      )
      mainStore.sellOrdersStore.splice(0, mainStore.sellOrdersStore.length,
        ...allOrders.filter(o => o.side === 'sell'),
      )
    } catch (e) {
      console.error('useStore.loadAll error:', e)
    }
  }

  const refreshBalance = async () => {
    try {
      const balance = await api.get<any>('/api/balance')
      mainStore.balanceStore.balance = Number(balance.balance ?? 0)
      mainStore.balanceStore.currency = balance.currency ?? 'UAH'
      mainStore.balanceStore.history = (balance.history ?? []).map((h: any) => ({
        date: h.dateLabel ?? h.date ?? '',
        value: Number(h.value ?? 0),
      }))
      const transactions = await api.get<any[]>('/api/transactions')
      mainStore.transactionsStore.splice(
        0,
        mainStore.transactionsStore.length,
        ...(transactions ?? []).map((t: any) => ({
          id: t.id,
          type: t.type,
          assetName: t.assetName ?? '',
          ticker: t.ticker ?? '',
          quantity: Number(t.quantity ?? 0),
          amount: Number(t.amount ?? 0),
          currency: t.currency ?? 'UAH',
          date: t.date ?? '',
          status: t.status ?? 'completed',
          note: t.note,
        })),
      )
    } catch (e) {
      console.error('refreshBalance error:', e)
    }
  }

  const refreshHoldings = async () => {
    try {
      const holdings = await api.get<any[]>('/api/portfolio/holdings').catch(() => [])
      mainStore.holdingsStore.splice(
        0,
        mainStore.holdingsStore.length,
        ...(holdings ?? []).map((h: any) => ({
          ticker: h.ticker ?? '',
          assetName: h.assetName ?? '',
          quantity: Number(h.quantity ?? 0),
          averageBuyPrice: Number(h.averageBuyPrice ?? 0),
          logo: h.logo ?? '',
        })),
      )
    } catch (e) {
      console.error('refreshHoldings error:', e)
    }
  }

  const refreshOrders = async () => {
    try {
      const orders = await api.get<any[]>('/api/orders').catch(() => [])
      const allOrders = (orders ?? []).map(mapOrder)
      mainStore.buyOrdersStore.splice(0, mainStore.buyOrdersStore.length,
        ...allOrders.filter(o => o.side === 'buy'),
      )
      mainStore.sellOrdersStore.splice(0, mainStore.sellOrdersStore.length,
        ...allOrders.filter(o => o.side === 'sell'),
      )
    } catch (e) {
      console.error('refreshOrders error:', e)
    }
  }

  return { loadAll, refreshBalance, mapOrder, refreshHoldings, refreshOrders }
}
