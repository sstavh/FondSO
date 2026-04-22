import { reactive } from 'vue'

export type Currency = 'UAH' | 'USD' | 'EUR' | 'PLN'
export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type TransactionType = 'buy' | 'sell'
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

  holdingsStore: [
    {
      ticker: 'AAPL',
      assetName: 'Apple',
      quantity: 12,
      averageBuyPrice: 214,
      logo: '/images/stocks/apple.png',
    },
    {
      ticker: 'TSLA',
      assetName: 'Tesla',
      quantity: 6,
      averageBuyPrice: 187,
      logo: '/images/stocks/tesla.png',
    },
    {
      ticker: 'NVDA',
      assetName: 'NVIDIA',
      quantity: 3,
      averageBuyPrice: 902,
      logo: '/images/stocks/nvidia.png',
    },
    {
      ticker: 'AMZN',
      assetName: 'Amazon',
      quantity: 8,
      averageBuyPrice: 178,
      logo: '/images/stocks/amazon.png',
    },
  ],

  buyOrdersStore: [
    {
      id: 101,
      side: 'buy',
      assetName: 'Apple',
      ticker: 'AAPL',
      logo: '/images/stocks/apple.png',
      currency: 'USD',
      amount: 1200,
      quantity: 5,
      quantityMode: 'whole',
      limitPrice: 210,
      durationUnit: 'days',
      durationValue: 2,
      createdAt: '2026-04-21T09:00:00',
      expiresAt: '2026-04-23T09:00:00',
      progress: 45,
      status: 'active',
    },
  ],

  sellOrdersStore: [
    {
      id: 201,
      side: 'sell',
      assetName: 'Tesla',
      ticker: 'TSLA',
      logo: '/images/stocks/tesla.png',
      currency: 'USD',
      amount: 561,
      quantity: 3,
      limitPrice: 187,
      durationUnit: 'unlimited',
      durationValue: null,
      createdAt: '2026-04-21T08:00:00',
      expiresAt: null,
      progress: 72,
      status: 'active',
    },
  ],

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