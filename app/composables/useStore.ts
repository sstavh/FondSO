import { useApi } from './useApi'
import { mainStore } from '~/data/userProfile'

export const useStore = () => {
  const api = useApi()

  const loadAll = async () => {
    try {
      const [balance, transactions, goal, profile] = await Promise.all([
        api.get<any>('/api/balance'),
        api.get<any[]>('/api/transactions'),
        api.get<any>('/api/goal'),
        api.get<any>('/api/user/profile'),
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

      Object.assign(mainStore.userProfile, {
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email ?? '',
        avatar: profile.avatar ?? '/images/avatar.jpg',
        country: profile.country ?? '',
        purpose: profile.purpose ?? '',
        birthDate: profile.birthDate ?? '',
        phone: profile.phone ?? '',
        registrationCompleted: profile.registrationCompleted ?? false,
      })
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

  return { loadAll, refreshBalance }
}
