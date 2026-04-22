<script setup lang="ts">
import { computed } from 'vue'
import type { MarketCompany } from '~/data/marketCompanies'
import { useLiveMarketChart } from '../../logig/useLiveMarketChart'

const props = defineProps<{
  company: MarketCompany
}>()

const currentCompany = computed(() => props.company)

const {
  points,
  chartWidth,
  chartHeight,
  paddingLeft,
  paddingRight,
  linePath,
  areaPath,
  gridLines,
  currentPrice,
  priceChange,
  priceChangePercent,
} = useLiveMarketChart(() => currentCompany.value)

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}
</script>

<template>
  <section class="market-chart-card">
    <div class="market-chart-card__header">
      <div>
        <h3 class="market-chart-card__title">{{ company.name }}</h3>
      </div>

      <div class="market-chart-card__stats">
        <p class="market-chart-card__price">
          {{ formatPrice(currentPrice) }}
        </p>

        <p class="market-chart-card__change">
          {{ priceChange > 0 ? '+' : '' }}{{ formatPrice(priceChange) }}
          ({{ priceChange > 0 ? '+' : '' }}{{ priceChangePercent.toFixed(2) }}%)
        </p>
      </div>
    </div>

    <div class="market-chart-card__chart">
      <svg
        class="market-chart-card__svg"
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient :id="`marketAreaFill-${company.id}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(124, 58, 237, 0.35)" />
            <stop offset="100%" stop-color="rgba(124, 58, 237, 0)" />
          </linearGradient>
        </defs>

        <line
          v-for="line in gridLines"
          :key="line.y"
          :x1="paddingLeft"
          :y1="line.y"
          :x2="chartWidth - paddingRight"
          :y2="line.y"
          class="market-chart-card__grid-line"
        />

        <path :d="areaPath" :fill="`url(#marketAreaFill-${company.id})`" />
        <path :d="linePath" class="market-chart-card__line" />
      </svg>

      <div class="market-chart-card__times">
        <span
          v-for="point in points"
          :key="`${company.id}-${point.time}-${point.value}`"
          class="market-chart-card__time"
        >
          {{ point.time }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.market-chart-card {
  width: 100%;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
  background: #0f1117;
  box-shadow: var(--shadow-glass);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.market-chart-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.market-chart-card__label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.market-chart-card__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.market-chart-card__stats {
  text-align: right;
}

.market-chart-card__price {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: var(--font-bold);
  line-height: 1;
}

.market-chart-card__change {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--accent);
}

.market-chart-card__chart {
  width: 100%;
}

.market-chart-card__svg {
  width: 100%;
  height: 320px;
  display: block;
}

.market-chart-card__grid-line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
}

.market-chart-card__line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.market-chart-card__times {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  margin-top: 10px;
  overflow: hidden;
}

.market-chart-card__time {
  color: var(--text-secondary);
  font-size: 10px;
  white-space: nowrap;
}
</style>