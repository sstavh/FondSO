<script setup lang="ts">
import MarketStockChart from '../components/graficComponents/MarketChartCard.vue'
import { getMarketCompanyByTicker } from '~/data/marketCompanies'


const selectedCompany = getMarketCompanyByTicker('NVDA')

</script>

<template>
   <MarketStockChart :company="selectedCompany" />
</template>

<style scoped></style>