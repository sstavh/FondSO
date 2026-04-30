import { reactive } from 'vue'

export type Currency = 'UAH' | 'USD' | 'EUR' | 'PLN'
export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type TransactionType = 'buy' | 'sell' | 'deposit' | 'withdrawal'
export type OrderDurationUnit = 'hours' | 'days' | 'unlimited'
export type BuyQuantityMode = 'whole' | 'partial'
export type OrderSide = 'buy' | 'sell'

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
  note?: string
}

export interface GoalState {
  targetAmount: number
  earnedAmount: number
}

export interface PortfolioHolding {
  ticker: string
  assetName: string
  quantity: number
  averageBuyPrice: number
  logo: string
}

export interface TradeOrderItem {
  id: number
  side: OrderSide
  assetName: string
  ticker: string
  logo: string
  currency: Currency
  amount: number
  quantity: number
  quantityMode?: BuyQuantityMode
  limitPrice: number
  durationUnit: OrderDurationUnit
  durationValue: number | null
  createdAt: string
  expiresAt: string | null
  progress: number
  status: 'active' | 'cancelled' | 'completed'
}

export interface OrderPreviewState {
  isOpen: boolean
  order: TradeOrderItem | null
}

export const mainStore = reactive<{
  userProfile: UserProfile
  balanceStore: BalanceState
  transactionsStore: TransactionItem[]
  goalStore: GoalState
  holdingsStore: PortfolioHolding[]
  buyOrdersStore: TradeOrderItem[]
  sellOrdersStore: TradeOrderItem[]
  orderPreviewStore: OrderPreviewState
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
    balance: 0,
    currency: 'UAH',
    history: [],
  },
  transactionsStore: [],
  goalStore: {
    targetAmount: 0,
    earnedAmount: 0,
  },
  holdingsStore: [],
  buyOrdersStore: [],
  sellOrdersStore: [],
  orderPreviewStore: {
    isOpen: false,
    order: null,
  },
})

export const userProfile = mainStore.userProfile
export const balanceStore = mainStore.balanceStore
export const transactionsStore = mainStore.transactionsStore
export const goalStore = mainStore.goalStore
export const holdingsStore = mainStore.holdingsStore
export const buyOrdersStore = mainStore.buyOrdersStore
export const sellOrdersStore = mainStore.sellOrdersStore
export const orderPreviewStore = mainStore.orderPreviewStore
