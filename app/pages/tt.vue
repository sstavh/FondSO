<script setup lang="ts">
import MarketStockChart from '../components/graficComponents/MarketChartCard.vue'
import MarketStatsBar from '../components/graficComponents/MarketStatsBar.vue'
import { marketCompanies } from '~/data/marketCompanies'

const selectedCompany = marketCompanies[0] // 🔥 ПРОСТО ТЕСТ
</script>

<template>
  <div class="page-wrap">

    <!-- 🔥 ПОЛОСКА -->
    <MarketStatsBar :company="selectedCompany" />

    <!-- 🔥 ГРАФІК -->
    <MarketStockChart :company="selectedCompany" />

  </div>
</template>

<style scoped>
.page-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>