<script setup lang="ts">
import { computed, reactive } from 'vue'
import { transactionsStore } from '~/data/userProfile'

const dealLogoErrors = reactive(new Set<string>())

const latestDeals = computed(() => {
  return [...transactionsStore]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
})

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatAction = (type: string) => {
  const map: Record<string, string> = {
    buy: 'Bought',
    sell: 'Sold',
    BUY: 'Bought',
    SELL: 'Sold',
  }

  return map[type] || type
}

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    completed: 'Completed',
    COMPLETED: 'Completed',
    pending: 'Pending',
    PENDING: 'Pending',
    failed: 'Failed',
    FAILED: 'Failed',
  }

  return map[status] || status
}

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    completed: 'deal-item__status--completed',
    pending: 'deal-item__status--pending',
    failed: 'deal-item__status--failed',
  }

  return map[status] || ''
}
</script>

<template>
  <section class="deals-card">
    <div class="deals-card__head">
      <p class="deals-card__label">History</p>
      <h3 class="deals-card__title">Latest Deals</h3>
    </div>

    <div class="deals-list">
      <div
        v-for="deal in latestDeals"
        :key="deal.id"
        class="deal-item"
      >
        <div class="deal-item__left">
          <div class="deal-item__logo-wrap">
            <img
              v-if="!dealLogoErrors.has(deal.ticker)"
              :src="`https://assets.parqet.com/logos/symbol/${deal.ticker}`"
              :alt="deal.assetName"
              class="deal-item__logo"
              @error="dealLogoErrors.add(deal.ticker)"
            />
            <span v-else class="deal-item__logo-fallback">{{ deal.ticker.slice(0, 1) }}</span>
          </div>

          <div>
            <p class="deal-item__title">
              {{ formatAction(deal.type) }} {{ deal.assetName }}
            </p>

            <p class="deal-item__meta">
              {{ deal.ticker }} · {{ deal.quantity }} акцій · {{ deal.date }}
            </p>
          </div>
        </div>

        <div class="deal-item__right">
          <p class="deal-item__amount">
            {{ formatCurrency(deal.amount, deal.currency) }}
          </p>

          <p class="deal-item__status" :class="statusClass(deal.status)">
            {{ formatStatus(deal.status) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.deals-card {
  width: 100%;
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.deals-card__head {
  margin-bottom: 18px;
}

.deals-card__label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.deals-card__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.deals-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deal-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
}

.deal-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.deal-item__logo-wrap {
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

.deal-item__logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.deal-item__logo-fallback {
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.deal-item__title {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.deal-item__meta {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.deal-item__right {
  text-align: right;
  flex-shrink: 0;
}

.deal-item__amount {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-bold);
}

.deal-item__status {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.deal-item__status--completed {
  color: #22c55e;
}

.deal-item__status--pending {
  color: #f59e0b;
}

.deal-item__status--failed {
  color: #ef4444;
}

@media (max-width: 700px) {
  .deal-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .deal-item__right {
    text-align: left;
  }
}
</style>