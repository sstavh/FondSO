<script setup lang="ts">
import { computed } from 'vue'
import { transactionsStore } from '~/data/userProfile'

const boughtTotal = computed(() =>
  transactionsStore
    .filter((item) => item.type === 'deposit')
    .reduce((sum, item) => sum + Math.abs(item.amount), 0)
)

const soldTotal = computed(() =>
  transactionsStore
    .filter((item) => item.type === 'withdrawal' || item.type === 'payment')
    .reduce((sum, item) => sum + Math.abs(item.amount), 0)
)

const totalAmount = computed(() => boughtTotal.value + soldTotal.value)

const boughtPercent = computed(() => {
  if (!totalAmount.value) return 0
  return Math.round((boughtTotal.value / totalAmount.value) * 100)
})

const soldPercent = computed(() => {
  if (!totalAmount.value) return 0
  return Math.round((soldTotal.value / totalAmount.value) * 100)
})

const radius = 70
const circumference = 2 * Math.PI * radius

const boughtStroke = computed(() => {
  if (!totalAmount.value) return 0
  return (boughtPercent.value / 100) * circumference
})

const soldStroke = computed(() => {
  if (!totalAmount.value) return 0
  return (soldPercent.value / 100) * circumference
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <section class="circle-card">
    <div class="circle-card__header">
      <div>
        <p class="circle-card__label">Операції</p>
        <h2 class="circle-card__title">Куплені та продані</h2>
      </div>
    </div>

    <div class="circle-card__content">
      <div class="chart-wrap">
        <svg class="chart" viewBox="0 0 180 180">
          <circle
            class="chart-bg"
            cx="90"
            cy="90"
            :r="radius"
          />

          <circle
            class="chart-bought"
            cx="90"
            cy="90"
            :r="radius"
            :stroke-dasharray="`${boughtStroke} ${circumference}`"
          />

          <circle
            class="chart-sold"
            cx="90"
            cy="90"
            :r="radius"
            :stroke-dasharray="`${soldStroke} ${circumference}`"
            :stroke-dashoffset="`-${boughtStroke}`"
          />
        </svg>

        <div class="chart-center">
          <p class="chart-center__label">Всього</p>
          <p class="chart-center__value">{{ boughtPercent + soldPercent }}%</p>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item">
          <span class="legend-item__dot legend-item__dot--bought"></span>
          <div class="legend-item__content">
            <p class="legend-item__title">Куплені</p>
            <p class="legend-item__meta">{{ boughtPercent }}% · {{ formatCurrency(boughtTotal) }}</p>
          </div>
        </div>

        <div class="legend-item">
          <span class="legend-item__dot legend-item__dot--sold"></span>
          <div class="legend-item__content">
            <p class="legend-item__title">Продані</p>
            <p class="legend-item__meta">{{ soldPercent }}% · {{ formatCurrency(soldTotal) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.circle-card {
  min-width: 400px;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.circle-card__header {
  margin-bottom: var(--space-lg);
}

.circle-card__label {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.circle-card__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.circle-card__content {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.chart-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
}

.chart {
  width: 180px;
  height: 180px;
  transform: rotate(-90deg);
}

.chart-bg,
.chart-bought,
.chart-sold {
  fill: none;
  stroke-width: 16;
}

.chart-bg {
  stroke: rgba(255, 255, 255, 0.08);
}

.chart-bought {
  stroke: #7c3aed;
  stroke-linecap: round;
}

.chart-sold {
  stroke: #22c55e;
  stroke-linecap: round;
}

.chart-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  pointer-events: none;
}

.chart-center__label {
  margin: 0 0 4px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.chart-center__value {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.legend-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
}

.legend-item__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.legend-item__dot--bought {
  background: #7c3aed;
}

.legend-item__dot--sold {
  background: #22c55e;
}

.legend-item__title {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.legend-item__meta {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .circle-card__content {
    grid-template-columns: 1fr;
  }
}
</style>