<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { holdingsStore, balanceStore } from '~/data/userProfile'
import { useMarketPrices } from '~/composables/useMarketPrices'

const isVisible = ref(false)
const { prices, fetchPrices, totalPortfolioValue } = useMarketPrices()

const logoErrors = reactive(new Set<string>())

const getLogoSrc = (ticker: string) =>
  `https://assets.parqet.com/logos/symbol/${ticker}`

const onLogoError = (ticker: string) => logoErrors.add(ticker)

const hasHoldings = computed(() => holdingsStore.length > 0)

const enrichedHoldings = computed(() =>
  holdingsStore.map((h) => {
    const snap = prices[h.ticker]
    const currentPrice = snap ? snap.currentPrice : h.averageBuyPrice
    const changePercent = snap ? snap.changePercent : 0
    const positionValue = currentPrice * h.quantity
    const costBasis = h.averageBuyPrice * h.quantity
    const profitLoss = positionValue - costBasis
    const profitLossPct = costBasis ? (profitLoss / costBasis) * 100 : 0
    return {
      ...h,
      currentPrice,
      changePercent,
      positionValue,
      profitLoss,
      profitLossPct,
    }
  }),
)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: balanceStore.currency,
    maximumFractionDigits: 2,
  }).format(value)

const formatPct = (value: number) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

onMounted(async () => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
  if (holdingsStore.length) {
    await fetchPrices(holdingsStore.map((h) => h.ticker))
  }
})
</script>

<template>
  <section class="holdings-card" :class="{ 'holdings-card--visible': isVisible }">
    <div class="holdings-card__head">
      <div>
        <p class="holdings-card__label">
          
          Портфель
        </p>
        <h3 class="holdings-card__title">
         
          Мої акції
        </h3>
      </div>
      <div v-if="hasHoldings" class="holdings-card__total">
        <p class="holdings-card__total-label">
         
          Загальна вартість
        </p>
        <p class="holdings-card__total-value">{{ formatCurrency(totalPortfolioValue) }}</p>
      </div>
    </div>

    <div v-if="hasHoldings" class="holdings-list">
      <div
        v-for="holding in enrichedHoldings"
        :key="holding.ticker"
        class="holding-item"
      >
        <div class="holding-item__left">
          <div class="holding-item__logo-wrap">
            <img
              v-if="!logoErrors.has(holding.ticker)"
              :src="getLogoSrc(holding.ticker)"
              :alt="holding.assetName"
              class="holding-item__logo"
              @error="onLogoError(holding.ticker)"
            />
            <span v-else class="holding-item__logo-fallback">{{ holding.ticker.slice(0, 1) }}</span>
          </div>
          <div class="holding-item__info">
            <p class="holding-item__name">{{ holding.assetName }}</p>
            <p class="holding-item__ticker">
              {{ holding.ticker }}
              <span
                class="holding-item__day-change"
                :class="holding.changePercent >= 0 ? 'positive' : 'negative'"
              >
                {{ formatPct(holding.changePercent) }}
              </span>
            </p>
          </div>
        </div>

        <div class="holding-item__center">
          <p class="holding-item__qty">{{ holding.quantity }} шт.</p>
          <p class="holding-item__avg">Сер.: {{ formatCurrency(holding.averageBuyPrice) }}</p>
        </div>

        <div class="holding-item__right">
          <p class="holding-item__price">{{ formatCurrency(holding.currentPrice) }}</p>
          <p
            class="holding-item__pnl"
            :class="holding.profitLoss >= 0 ? 'positive' : 'negative'"
          >
            {{ holding.profitLoss >= 0 ? '+' : '' }}{{ formatCurrency(holding.profitLoss) }}
            ({{ formatPct(holding.profitLossPct) }})
          </p>
        </div>
      </div>
    </div>

    <div v-else class="holdings-empty">
      <div class="holdings-empty__icon">📊</div>
      <p class="holdings-empty__text">У вас поки немає акцій</p>
      <p class="holdings-empty__sub">Придбайте перші акції на сторінці торгівлі</p>
    </div>
  </section>
</template>

<style scoped>
.holdings-card {
  width: 100%;
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
  opacity: 0;
  transform: translateY(16px) scale(0.985);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease,
    box-shadow 0.25s ease;
}

.holdings-card--visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.holdings-card:hover {
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
}

.holdings-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
  gap: 12px;
}

.head-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  flex-shrink: 0;
  margin-right: 8px;
  color: var(--accent);
}

.head-icon {
  width: 15px;
  height: 15px;
}

.holdings-card__label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
}

.holdings-card__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
}

.holdings-card__total {
  text-align: right;
  flex-shrink: 0;
}

.holdings-card__total-label {
  margin: 0 0 4px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.holdings-card__total-value {
  margin: 0;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: var(--font-bold);
}

.holdings-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.holding-item {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1.2fr;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.holding-item:hover {
  border-color: rgba(124, 58, 237, 0.3);
  background: rgba(124, 58, 237, 0.04);
}

.holding-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.holding-item__logo-wrap {
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

.holding-item__logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.holding-item__logo-fallback {
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.holding-item__info {
  min-width: 0;
}

.holding-item__name {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.holding-item__ticker {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  gap: 6px;
}

.holding-item__day-change {
  font-size: 11px;
  font-weight: var(--font-semibold);
  padding: 2px 6px;
  border-radius: 999px;
}

.holding-item__center {
  min-width: 0;
}

.holding-item__qty {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.holding-item__avg {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.holding-item__right {
  text-align: right;
}

.holding-item__price {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-bold);
}

.holding-item__pnl {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.positive {
  color: #22c55e;
}

.positive.holding-item__day-change {
  background: rgba(34, 197, 94, 0.12);
}

.negative {
  color: #ef4444;
}

.negative.holding-item__day-change {
  background: rgba(239, 68, 68, 0.12);
}

.holdings-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 8px;
  text-align: center;
}

.holdings-empty__icon {
  font-size: 36px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.holdings-empty__text {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.holdings-empty__sub {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

@media (max-width: 700px) {
  .holdings-card__head {
    flex-direction: column;
  }

  .holdings-card__total {
    text-align: left;
  }

  .holding-item {
    grid-template-columns: 1fr 1fr;
    row-gap: 10px;
  }

  .holding-item__left {
    grid-column: 1 / -1;
  }

  .holding-item__right {
    text-align: left;
  }
}
</style>
