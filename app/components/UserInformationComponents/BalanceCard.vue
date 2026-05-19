<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { balanceStore, type Currency } from '../../data/userProfile'
import { useMarketPrices } from '~/composables/useMarketPrices'

const selectedCurrency = ref<Currency>(balanceStore.currency)
const isChartVisible = ref(false)
const { totalPortfolioValue, totalProfitLoss } = useMarketPrices()
const showGoalPanel = ref(false)
const earningGoalInput = ref('')

const exchangeRates: Record<Currency, number> = {
  UAH: 1,
  USD: 0.025,
  EUR: 0.023,
  PLN: 0.098,
}

const currencySymbols: Record<Currency, string> = {
  UAH: '₴',
  USD: '$',
  EUR: '€',
  PLN: 'zł',
}

const convertedHistory = computed(() => {
  const rate = exchangeRates[selectedCurrency.value] ?? 1

  return (balanceStore.history ?? []).map((item) => ({
    ...item,
    value: Number(item.value ?? 0) * rate,
  }))
})

const currentBalance = computed(() => {
  const rate = exchangeRates[selectedCurrency.value] ?? 1
  return Number(balanceStore.balance ?? 0) * rate
})

const portfolioValueConverted = computed(() => {
  const rate = exchangeRates[selectedCurrency.value] ?? 1
  return totalPortfolioValue.value * rate
})

const profitConverted = computed(() => {
  const rate = exchangeRates[selectedCurrency.value] ?? 1
  return totalProfitLoss.value * rate
})

const earningGoal = computed(() => {
  const v = parseFloat(earningGoalInput.value)
  return isNaN(v) || v <= 0 ? 0 : v
})

const goalProgress = computed(() => {
  if (!earningGoal.value) return 0
  const pct = (profitConverted.value / earningGoal.value) * 100
  return Math.min(Math.max(pct, 0), 100)
})

function saveGoal() {
  localStorage.setItem('earningGoal', earningGoalInput.value)
}

const previousBalance = computed(() => {
  const history = convertedHistory.value
  if (history.length < 2) return 0
  return Number(history[history.length - 2]?.value ?? 0)
})

const delta = computed(() => {
  return currentBalance.value - previousBalance.value
})

const deltaPercent = computed(() => {
  if (!previousBalance.value) return 0

  const result = (delta.value / previousBalance.value) * 100
  return Number.isFinite(result) ? result : 0
})

const isPositive = computed(() => delta.value >= 0)

const maxValue = computed(() => {
  const values = convertedHistory.value.map((i) => Number(i.value ?? 0))
  return values.length ? Math.max(...values) : 1
})

const minValue = computed(() => {
  const values = convertedHistory.value.map((i) => Number(i.value ?? 0))
  return values.length ? Math.min(...values) : 0
})

const chartPoints = computed(() => {
  const history = convertedHistory.value
  const width = 320
  const height = 96
  const padding = 8
  const range = maxValue.value - minValue.value || 1

  if (!history.length) {
    return `${padding},${height - padding}`
  }

  return history
    .map((item, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(history.length - 1, 1)

      const y =
        height -
        padding -
        ((item.value - minValue.value) / range) * (height - padding * 2)

      return `${x},${y}`
    })
    .join(' ')
})

const areaPoints = computed(() => {
  return `8,88 ${chartPoints.value} 312,88`
})

function formatMoney(value: number, currency: Currency) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'UAH' ? 0 : 2,
  }).format(Number(value ?? 0))
}

onMounted(() => {
  const saved = localStorage.getItem('earningGoal')
  if (saved) earningGoalInput.value = saved
  requestAnimationFrame(() => {
    isChartVisible.value = true
  })
})
</script>

<template>
  <div class="balance-card" :class="{ 'balance-card--visible': isChartVisible }">
    <div class="balance-header">
      <div>
        <div class="balance-label">Поточний баланс</div>
        <div class="balance-value">
          {{ formatMoney(currentBalance, selectedCurrency) }}
        </div>
      </div>

      <select v-model="selectedCurrency" class="currency-select">
        <option value="UAH">{{ currencySymbols.UAH }} UAH</option>
        <option value="USD">{{ currencySymbols.USD }} USD</option>
        <option value="EUR">{{ currencySymbols.EUR }} EUR</option>
        <option value="PLN">{{ currencySymbols.PLN }} PLN</option>
      </select>
    </div>

    <button
      v-if="portfolioValueConverted > 0"
      class="portfolio-badge"
      :class="{ 'portfolio-badge--visible': isChartVisible, 'portfolio-badge--active': showGoalPanel }"
      @click="showGoalPanel = !showGoalPanel"
    >
      <span class="portfolio-badge__label">Акції:</span>
      <span class="portfolio-badge__value">{{ formatMoney(portfolioValueConverted, selectedCurrency) }}</span>
    </button>

    <Transition name="goal">
      <div v-if="showGoalPanel && portfolioValueConverted > 0" class="goal-panel">
        <p class="goal-panel__title">Ціль прибутку</p>
        <div class="goal-panel__row">
          <span class="goal-panel__label">Поточний прибуток:</span>
          <span class="goal-panel__profit" :class="profitConverted >= 0 ? 'profit-positive' : 'profit-negative'">
            {{ profitConverted >= 0 ? '+' : '' }}{{ formatMoney(profitConverted, selectedCurrency) }}
          </span>
        </div>
        <div class="goal-panel__input-row">
          <span class="goal-panel__currency">{{ currencySymbols[selectedCurrency] }}</span>
          <input
            v-model="earningGoalInput"
            type="number"
            class="goal-panel__input"
            placeholder="Бажаний прибуток..."
            @input="saveGoal"
          />
        </div>
        <div v-if="earningGoal > 0" class="goal-panel__progress-wrap">
          <div class="goal-panel__bar">
            <div class="goal-panel__fill" :style="{ width: goalProgress + '%' }"></div>
          </div>
          <span class="goal-panel__pct">{{ goalProgress.toFixed(0) }}%</span>
        </div>
      </div>
    </Transition>

    <div
      class="balance-change"
      :class="[
        isPositive ? 'positive' : 'negative',
        { 'balance-change--visible': isChartVisible }
      ]"
    >
      <span class="badge">
        {{ isPositive ? '+' : '' }}{{ Number(deltaPercent ?? 0).toFixed(1) }}%
      </span>
      <span class="change-text">
        {{ isPositive ? 'Баланс зріс' : 'Баланс знизився' }}
      </span>
    </div>

    <div class="chart-box" :class="{ 'chart-box--visible': isChartVisible }">
      <svg viewBox="0 0 320 96" class="chart-svg">
        <polygon
          :points="areaPoints"
          class="chart-area"
          :class="[
            isPositive ? 'positive-fill' : 'negative-fill',
            { 'chart-area--visible': isChartVisible }
          ]"
        />
        <polyline
          :points="chartPoints"
          class="chart-line"
          :class="[
            isPositive ? 'positive-line' : 'negative-line',
            { 'chart-line--visible': isChartVisible }
          ]"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.balance-card {
  width: 100%;
  max-width: 420px;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
  opacity: 0;
  transform: translateY(18px) scale(0.985);
  transition:
    opacity 0.55s ease,
    transform 0.55s ease,
    box-shadow 0.25s ease;
}

.balance-card--visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.balance-card:hover {
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.3);
}

.balance-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.balance-label {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.balance-value {
  color: var(--text-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}

.currency-select {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 8px 12px;
  outline: none;
}

.portfolio-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.25);
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.45s ease 0.1s,
    transform 0.45s ease 0.1s,
    background 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;
  appearance: none;
  font-family: inherit;
}

.portfolio-badge--visible {
  opacity: 1;
  transform: translateY(0);
}

.portfolio-badge--active,
.portfolio-badge:hover {
  background: rgba(124, 58, 237, 0.22);
  border-color: rgba(124, 58, 237, 0.45);
}

.portfolio-badge__label {
  color: var(--text-secondary);
  font-size: 12px;
}

.portfolio-badge__value {
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
}

.goal-panel {
  margin-top: 10px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(124, 58, 237, 0.07);
  border: 1px solid rgba(124, 58, 237, 0.18);
}

.goal-panel__title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
}

.goal-panel__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.goal-panel__label {
  color: var(--text-secondary);
  font-size: 12px;
}

.goal-panel__profit {
  font-size: 13px;
  font-weight: 700;
}

.profit-positive {
  color: #22c55e;
}

.profit-negative {
  color: #ef4444;
}

.goal-panel__input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.goal-panel__currency {
  color: var(--text-secondary);
  font-size: 13px;
  flex-shrink: 0;
}

.goal-panel__input {
  flex: 1;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
}

.goal-panel__input:focus {
  border-color: rgba(124, 58, 237, 0.45);
}

.goal-panel__progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.goal-panel__bar {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.goal-panel__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
  transition: width 0.4s ease;
}

.goal-panel__pct {
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  min-width: 32px;
  text-align: right;
}

.goal-enter-active,
.goal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.goal-enter-from,
.goal-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.balance-change {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.45s ease 0.18s,
    transform 0.45s ease 0.18s;
}

.balance-change--visible {
  opacity: 1;
  transform: translateY(0);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
}

.change-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.positive .badge {
  color: #166534;
  background: rgba(74, 222, 128, 0.16);
}

.negative .badge {
  color: #be123c;
  background: rgba(251, 113, 133, 0.16);
}

.chart-box {
  margin-top: 18px;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.5s ease 0.28s,
    transform 0.5s ease 0.28s;
}

.chart-box--visible {
  opacity: 1;
  transform: translateY(0);
}

.chart-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

.chart-line {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
}

.chart-line--visible {
  animation: drawLine 1.5s ease forwards 0.35s;
}

.chart-area {
  stroke: none;
  opacity: 0;
  transform: translateY(8px);
  transform-origin: bottom center;
}

.chart-area--visible {
  animation: revealArea 0.9s ease forwards 0.9s;
}

.positive-line {
  stroke: #4ade80;
}

.negative-line {
  stroke: #fb7185;
}

.positive-fill {
  fill: rgba(74, 222, 128, 0.16);
}

.negative-fill {
  fill: rgba(251, 113, 133, 0.16);
}

@keyframes drawLine {
  0% {
    stroke-dashoffset: 400;
    opacity: 0.2;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

@keyframes revealArea {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>