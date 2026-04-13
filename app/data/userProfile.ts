import { reactive } from 'vue'

export type Currency = 'UAH' | 'USD' | 'EUR' | 'PLN'
export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type TransactionType = 'buy' | 'sell'

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

export interface TransactionItem {
  id: number
  type: TransactionType
  assetName: string
  ticker: string
  quantity: number
  amount: number
  currency: Currency
  date: string
  status: TransactionStatus
}

export interface GoalState {
  targetAmount: number
  earnedAmount: number
}

export const mainStore = reactive<{
  userProfile: UserProfile
  balanceStore: BalanceState
  transactionsStore: TransactionItem[]
  goalStore: GoalState
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

  transactionsStore: [
    {
      id: 1,
      type: 'buy',
      assetName: 'Apple',
      ticker: 'AAPL',
      quantity: 5,
      amount: 12000,
      currency: 'UAH',
      date: '2026-03-01',
      status: 'completed',
    },
    {
      id: 2,
      type: 'buy',
      assetName: 'Tesla',
      ticker: 'TSLA',
      quantity: 2,
      amount: 8350,
      currency: 'UAH',
      date: '2026-03-03',
      status: 'pending',
    },
    {
      id: 3,
      type: 'sell',
      assetName: 'NVIDIA',
      ticker: 'NVDA',
      quantity: 1,
      amount: 4200,
      currency: 'UAH',
      date: '2026-03-08',
      status: 'completed',
    },
    {
      id: 4,
      type: 'buy',
      assetName: 'Amazon',
      ticker: 'AMZN',
      quantity: 3,
      amount: 7800,
      currency: 'UAH',
      date: '2026-03-10',
      status: 'failed',
    },
    {
      id: 5,
      type: 'buy',
      assetName: 'Microsoft',
      ticker: 'MSFT',
      quantity: 4,
      amount: 15600,
      currency: 'UAH',
      date: '2026-03-14',
      status: 'completed',
    },
  ],

  goalStore: {
    targetAmount: 50000,
    earnedAmount: 20150,
  },
})

export const userProfile = mainStore.userProfile
export const balanceStore = mainStore.balanceStore
export const transactionsStore = mainStore.transactionsStore
export const goalStore = mainStore.goalStore