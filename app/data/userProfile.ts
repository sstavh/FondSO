import { reactive } from 'vue'

export type Currency = 'UAH' | 'USD' | 'EUR' | 'PLN'

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  avatar: string
  country: string
  purpose: string
  birthDate: string
  phone: string
  registrationCompleted: boolean
}

export interface BalanceHistoryItem {
  date: string
  value: number
}

export interface BalanceState {
  balance: number
  currency: Currency
  history: BalanceHistoryItem[]
}

export const mainStore = reactive<{
  userProfile: UserProfile
  balanceStore: BalanceState
}>({
  userProfile: {
    firstName: '',
    lastName: '',
    email: '',
    avatar: '/images/avatar.jpg',
    country: '',
    purpose: '',
    birthDate: '',
    phone: '',
    registrationCompleted: false,
  },

  balanceStore: {
    balance: 20150,
    currency: 'UAH',
    history: [
      { date: '01.03', value: 18200 },
      { date: '05.03', value: 17950 },
      { date: '10.03', value: 18640 },
      { date: '15.03', value: 19120 },
      { date: '20.03', value: 18810 },
      { date: '25.03', value: 19480 },
      { date: '30.03', value: 20150 },
    ],
  },
})

export const userProfile = mainStore.userProfile
export const balanceStore = mainStore.balanceStore