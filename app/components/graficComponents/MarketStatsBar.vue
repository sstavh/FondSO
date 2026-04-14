<script setup lang="ts">
import { computed } from 'vue'
import type { MarketCompany } from '~/data/marketCompanies'
import { useMarketStats } from '../useMarketStats'

const props = defineProps<{
  company: MarketCompany
}>()

const currentCompany = computed(() => props.company)
const { stats } = useMarketStats(() => currentCompany.value)

const isPositive = computed(() => stats.value.change24h >= 0)

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

const formatSigned = (num: number) => {
  return `${num > 0 ? '+' : ''}${num}`
}
</script>

<template>
  <section class="stats-bar">
    <div class="stats-card">
      <p class="stats-card__label">24H зміна</p>
      <p
        class="stats-card__value"
        :class="{
          'stats-card__value--up': isPositive,
          'stats-card__value--down': !isPositive,
        }"
      >
        {{ formatSigned(stats.change24h) }}
      </p>
      <p class="stats-card__sub">
        {{ formatSigned(stats.changePercent) }}%
      </p>
    </div>

    <div class="stats-card">
      <p class="stats-card__label">Купили</p>
      <p class="stats-card__value stats-card__value--buy">
        {{ formatNumber(stats.buyVolume) }}
      </p>
      <p class="stats-card__sub">обсяг покупок</p>
    </div>

    <div class="stats-card">
      <p class="stats-card__label">Продали</p>
      <p class="stats-card__value stats-card__value--sell">
        {{ formatNumber(stats.sellVolume) }}
      </p>
      <p class="stats-card__sub">обсяг продажів</p>
    </div>

    <div class="stats-card">
      <p class="stats-card__label">Обсяг</p>
      <p class="stats-card__value">
        {{ formatNumber(stats.totalVolume) }}
      </p>
      <p class="stats-card__sub">усього за 24h</p>
    </div>
  </section>
</template>

<style scoped>
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stats-card {
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.stats-card__label {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.2;
}

.stats-card__value {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: var(--font-bold);
  line-height: 1.1;
}

.stats-card__sub {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.2;
}

.stats-card__value--up,
.stats-card__value--buy {
  color: #22c55e;
}

.stats-card__value--down,
.stats-card__value--sell {
  color: #ef4444;
}

@media (max-width: 1000px) {
  .stats-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .stats-bar {
    grid-template-columns: 1fr;
  }
}
</style>