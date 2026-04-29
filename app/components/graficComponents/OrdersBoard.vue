<script setup lang="ts">
import { computed } from 'vue'
import { buyOrdersStore, sellOrdersStore } from '../../data/userProfile'

const props = defineProps<{
  ticker?: string
}>()

const allOrders = computed(() => {
  const merged = [...buyOrdersStore, ...sellOrdersStore].sort((a, b) => b.id - a.id)

  if (!props.ticker) return merged

  return merged.filter((order) => order.ticker === props.ticker)
})
</script>

<template>
  <section class="orders-board">
    <div class="orders-board__head">
      <h3 class="orders-board__title">Активні заявки</h3>
    </div>

    <div class="orders-list" v-if="allOrders.length">
      <article
        v-for="order in allOrders"
        :key="order.id"
        class="orders-item"
      >
        <div class="orders-item__left">
          <img :src="order.logo" :alt="order.assetName" class="orders-item__logo" />

          <div>
            <p class="orders-item__name">{{ order.assetName }}</p>
            <p class="orders-item__meta">
               {{ order.side === 'buy' ? 'Купівля' : 'Продаж' }}
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
          <p class="orders-item__status">
            {{
              order.durationUnit === 'unlimited'
                ? 'Без обмеження'
                : `${order.durationValue} ${order.durationUnit === 'hours' ? 'год.' : 'дн.'}`
            }}
          </p>

          <div class="orders-progress">
            <div class="orders-progress__bar" :style="{ width: `${order.progress}%` }"></div>
          </div>
        </div>
      </article>
    </div>

    <p v-else class="orders-empty">Для цієї акції активних заявок поки немає.</p>
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
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.03);
}

.orders-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.orders-item__logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  object-fit: contain;
  background: rgba(255,255,255,0.04);
  padding: 8px;
}

.orders-item__name,
.orders-item__value,
.orders-item__status {
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

.orders-progress {
  margin-top: 6px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}

.orders-progress__bar {
  height: 100%;
  background: var(--accent);
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