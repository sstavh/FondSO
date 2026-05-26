<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { buyOrdersStore, sellOrdersStore } from '../../data/userProfile'
import { useApi } from '~/composables/useApi'
import { useStore } from '~/composables/useStore'
import { useToast } from '~/composables/useToast'

const api = useApi()
const { refreshBalance, refreshHoldings, refreshOrders } = useStore()
const { push: pushToast } = useToast()
const cancelling = ref<number | null>(null)
const orderLogoErrors = reactive(new Set<number>())

const hiddenOrderIds = ref<Set<number>>(new Set())
const prevStatusMap = ref<Map<number, string>>(new Map())

const HIDE_DELAY = 4000

const allOrders = computed(() =>
  [...buyOrdersStore, ...sellOrdersStore].sort((a, b) => b.id - a.id),
)

const visibleOrders = computed(() =>
  allOrders.value.filter((o) => !hiddenOrderIds.value.has(o.id)),
)

const hasPendingOrders = computed(() =>
  allOrders.value.some((o) => o.status === 'active' && o.progress < 100),
)

const scheduleHide = (id: number) => {
  setTimeout(() => {
    hiddenOrderIds.value = new Set([...hiddenOrderIds.value, id])
  }, HIDE_DELAY)
}

const detectCompletions = () => {
  for (const order of allOrders.value) {
    const prev = prevStatusMap.value.get(order.id)
    if (order.status === 'completed' && prev && prev !== 'completed') {
      pushToast({
        side: order.side,
        assetName: order.assetName,
        ticker: order.ticker,
        logo: order.logo,
        quantity: order.quantity,
        amount: order.amount,
        currency: order.currency,
      })
      scheduleHide(order.id)
    }
    if (order.status === 'completed' && !prev) {
      scheduleHide(order.id)
    }
    prevStatusMap.value.set(order.id, order.status)
  }
}

const cancelOrder = async (id: number) => {
  if (cancelling.value === id) return
  cancelling.value = id
  try {
    await api.patch(`/api/orders/${id}/cancel`, {})
    await Promise.all([refreshBalance(), refreshHoldings(), refreshOrders()])
  } catch (e) {
    console.error('Failed to cancel order:', e)
  } finally {
    cancelling.value = null
  }
}

let pollInterval: ReturnType<typeof setInterval> | null = null

const startPolling = () => {
  pollInterval = setInterval(async () => {
    await refreshOrders()
    detectCompletions()
    if (!hasPendingOrders.value) {
      await Promise.all([refreshBalance(), refreshHoldings()])
    }
  }, 5000)
}

onMounted(() => {
  for (const order of allOrders.value) {
    prevStatusMap.value.set(order.id, order.status)
    if (order.status === 'completed') {
      scheduleHide(order.id)
    }
  }
  startPolling()
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<template>
  <section class="orders-board">
    <div class="orders-board__head">
      <h3 class="orders-board__title">Активні ордери</h3>
    </div>

    <div class="orders-list" v-if="visibleOrders.length">
      <article
        v-for="order in visibleOrders"
        :key="order.id"
        class="orders-item"
        :class="{ 'orders-item--filled': order.status === 'completed' }"
      >
        <div class="orders-item__left">
          <div class="orders-item__logo-wrap">
            <img
              v-if="!orderLogoErrors.has(order.id)"
              :src="`https://assets.parqet.com/logos/symbol/${order.ticker}`"
              :alt="order.assetName"
              class="orders-item__logo"
              @error="orderLogoErrors.add(order.id)"
            />
            <span v-else class="orders-item__logo-fallback">{{ order.ticker.slice(0, 1) }}</span>
          </div>
          <div>
            <p class="orders-item__name">{{ order.assetName }}</p>
            <p class="orders-item__meta">
              <span :class="order.side === 'buy' ? 'tag-buy' : 'tag-sell'">
                {{ order.side === 'buy' ? 'Купівля' : 'Продаж' }}
              </span>
            </p>
          </div>
        </div>

        <div class="orders-item__center">
          <p class="orders-item__value">{{ order.quantity }} шт.</p>
          <p class="orders-item__meta">
            {{ order.limitPrice }} {{ order.currency }}
          </p>
        </div>

        <div class="orders-item__right">
          <p class="orders-item__status" :class="order.status === 'completed' ? 'status--filled' : 'status--pending'">
            {{ order.status === 'completed' ? 'Виконано' : 'Очікує' }}
          </p>

          <div class="orders-progress">
            <div
              class="orders-progress__bar"
              :class="{ 'orders-progress__bar--filled': order.status === 'completed' }"
              :style="{ width: `${order.progress}%` }"
            ></div>
          </div>

          <p class="orders-item__duration">
            {{
              order.durationUnit === 'unlimited'
                ? 'Unlimited'
                : `${order.durationValue} ${order.durationUnit === 'hours' ? 'hr.' : 'd.'}`
            }}
          </p>
        </div>

        <button
          v-if="order.status === 'active'"
          class="orders-cancel"
          :disabled="cancelling === order.id"
          @click="cancelOrder(order.id)"
        >
          {{ cancelling === order.id ? '...' : '✕' }}
        </button>

        <div v-else class="orders-filled-icon">✓</div>
      </article>
    </div>

    <p v-else class="orders-empty">No active orders.</p>
  </section>
</template>

<style scoped>
.orders-board {
  padding: 18px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
}

.orders-board__head {
  margin-bottom: 16px;
}

.orders-board__title {
  margin: 0;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 700;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.orders-item {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.03);
  transition: border-color 0.3s ease;
}

.orders-item--filled {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.04);
}

.orders-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.orders-item__logo-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.orders-item__logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.orders-item__logo-fallback {
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.orders-item__name,
.orders-item__value {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.orders-item__meta {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.orders-item__duration {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 11px;
}

.orders-item__status {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
}

.status--pending {
  color: var(--text-secondary);
}

.status--filled {
  color: #22c55e;
}

.tag-buy { color: #22c55e; font-weight: 700; }
.tag-sell { color: #ef4444; font-weight: 700; }

.orders-progress {
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}

.orders-progress__bar {
  height: 100%;
  background: var(--accent);
  transition: width 0.6s ease;
}

.orders-progress__bar--filled {
  background: #22c55e;
}

.orders-cancel {
  width: 32px;
  height: 32px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(248, 113, 113, 0.08);
  color: #fca5a5;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.orders-cancel:hover {
  background: rgba(248, 113, 113, 0.2);
}

.orders-cancel:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.orders-filled-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  font-size: 14px;
  font-weight: 700;
}

.orders-empty {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

@media (max-width: 900px) {
  .orders-item {
    grid-template-columns: 1fr;
  }
}
</style>
