<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdvancedMarketChart from '../../components/graficComponents/AdvancedMarketChart.vue'
import type { MarketCompany } from '~/data/marketCompanies'
import { marketCompanies } from '~/data/marketCompanies'
import StocksTickerTape from '~/components/graficComponents/StocksTickerTape.vue'
import TradeOrdersPanel from '~/components/graficComponents/TradeOrdersPanel.vue'
import OrdersBoard from '~/components/graficComponents/OrdersBoard.vue'

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
  <StocksTickerTape />

  <div class="stock-page">
    <div class="stock-page__head">
      <p class="stock-page__label">{{ company.ticker }}</p>
      <h1 class="stock-page__title">{{ company.name }}</h1>
    </div>

    <div class="stock-layout">
      <div class="stock-layout__chart">
        <AdvancedMarketChart :company="company" />
      </div>

      <div class="stock-layout__trade">
        <TradeOrdersPanel :company="company" />
      </div>
    </div>

    <div class="stock-layout__orders">
      <OrdersBoard :ticker="company.ticker" />
    </div>
  </div>
</template>

<style scoped>
.stock-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.stock-page__head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stock-page__label {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.stock-page__title {
  margin: 0;
  color: var(--text-primary);
  font-size: 26px;
  font-weight: var(--font-bold);
}

.stock-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(340px, 0.9fr);
  gap: 16px;
  align-items: start;
}

.stock-layout__chart,
.stock-layout__trade,
.stock-layout__orders {
  min-width: 0;
}

.stock-layout__orders {
  margin-top: 4px;
}

@media (max-width: 1100px) {
  .stock-layout {
    grid-template-columns: 1fr;
  }
}
</style>