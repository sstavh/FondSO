<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdvancedMarketChart from '../../components/graficComponents/AdvancedMarketChart.vue'
import type { MarketCompany } from '~/data/marketCompanies'
import { marketCompanies } from '~/data/marketCompanies'
import StocksTickerTape from '~/components/graficComponents/StocksTickerTape.vue'
import TradeOrdersPanel from '~/components/graficComponents/TradeOrdersPanel.vue'
import OrdersBoard from '~/components/graficComponents/OrdersBoard.vue'
import HeaderGraphs from '~/components/HeaderGraphs.vue'

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
  <HeaderGraphs />
  <StocksTickerTape class="StocksTickerTape" />

  <div class="stock-page">
    <div class="stock-page__hero">
      <div class="stock-page__hero-content">
        <p class="stock-page__hero-badge">Трейдинг • Ринок акцій</p>
        <h1 class="stock-page__hero-title">
          Торгівля акцією {{ company.name }}
        </h1>
        <p class="stock-page__hero-text">
          Переглядай динаміку ціни, аналізуй ринкові зміни та створюй заявки на
          купівлю або продаж для {{ company.ticker }} в одному місці.
        </p>
      </div>
    </div>

    <div class="stock-page__head">
      <p class="stock-page__label">{{ company.ticker }}</p>
      <h2 class="stock-page__title">{{ company.name }}</h2>
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

.stock-page__hero {
  padding: 22px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background:
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 28%),
    rgba(255, 255, 255, 0.03);
  box-shadow: var(--shadow-glass);
}

.stock-page__hero-content {
  max-width: 760px;
}

.stock-page__hero-badge {
  margin: 0 0 10px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stock-page__hero-title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.05;
  font-weight: 800;
}

.stock-page__hero-text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.6;
  max-width: 620px;
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

.StocksTickerTape {
  margin-top: 30px;
}

@media (max-width: 1100px) {
  .stock-layout {
    grid-template-columns: 1fr;
  }
}
</style>