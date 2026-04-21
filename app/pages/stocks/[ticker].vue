<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdvancedMarketChart from '../../components/graficComponents/AdvancedMarketChart.vue'
import type { MarketCompany } from '~/data/marketCompanies'
import { marketCompanies } from '~/data/marketCompanies'

const route = useRoute()

const company = computed<MarketCompany>(() => {
  const ticker = String(route.params.ticker).toUpperCase()

  return (
    marketCompanies.find((item) => item.ticker === ticker) ??
    marketCompanies[0]!
  )
})
</script>

<template>
  <div class="stock-page">
    <div class="stock-page__head">
      <p class="stock-page__label">{{ company.ticker }}</p>
      <h1 class="stock-page__title">{{ company.name }}</h1>
    </div>

    <AdvancedMarketChart :company="company" />
  </div>
</template>

<style scoped>
.stock-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

.stock-page__label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.stock-page__title {
  margin: 0;
  color: var(--text-primary);
  font-size: 32px;
  font-weight: var(--font-bold);
}
</style>