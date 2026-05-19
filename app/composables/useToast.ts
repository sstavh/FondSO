import { reactive } from 'vue'

export interface ToastItem {
  id: number
  side: 'buy' | 'sell'
  assetName: string
  ticker: string
  logo: string
  quantity: number
  amount: number
  currency: string
}

const toasts = reactive<ToastItem[]>([])
let nextId = 0

export const useToast = () => {
  const push = (item: Omit<ToastItem, 'id'>, duration = 4500) => {
    const id = nextId++
    toasts.push({ id, ...item })
    setTimeout(() => {
      const idx = toasts.findIndex((t) => t.id === id)
      if (idx !== -1) toasts.splice(idx, 1)
    }, duration)
  }

  const remove = (id: number) => {
    const idx = toasts.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
  }

  return { toasts, push, remove }
}
