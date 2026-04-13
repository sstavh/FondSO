import { reactive } from 'vue'

export type Currency = 'UAH' | 'USD' | 'EUR' | 'PLN'
export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment'

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
      type: 'deposit',
      amount: 12000,
      currency: 'UAH',
      date: '2026-03-01',
      status: 'completed',
    },
    {
      id: 2,
      type: 'payment',
      amount: 350,
      currency: 'UAH',
      date: '2026-03-03',
      status: 'completed',
    },
    {
      id: 3,
      type: 'transfer',
      amount: 4200,
      currency: 'UAH',
      date: '2026-03-08',
      status: 'completed',
    },
    {
      id: 4,
      type: 'withdrawal',
      amount: 1800,
      currency: 'UAH',
      date: '2026-03-10',
      status: 'completed',
    },
    {
      id: 5,
      type: 'deposit',
      amount: 5600,
      currency: 'UAH',
      date: '2026-03-14',
      status: 'pending',
    },
    {
      id: 6,
      type: 'payment',
      amount: 990,
      currency: 'UAH',
      date: '2026-03-18',
      status: 'failed',
    },
  ],

  goalStore: {
    targetAmount: 50000,  // скільки хочеш заробити
    earnedAmount: 20150,  // скільки вже зароблено
  },
})

export const userProfile = mainStore.userProfile
export const balanceStore = mainStore.balanceStore
export const transactionsStore = mainStore.transactionsStore
export const goalStore = mainStore.goalStore