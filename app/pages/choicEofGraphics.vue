<script setup lang="ts">
import { ref } from 'vue'
import StocksHoverPreview from '../components/choicEofGraphicsComponent/StocksHoverPreview.vue'
import MarketStatsBar from '../components/graficComponents/MarketStatsBar.vue'
import type { MarketCompany } from '~/data/marketCompanies'
import { marketCompanies } from '~/data/marketCompanies'
import HeaderGraphs from '~/components/HeaderGraphs.vue'

const selectedCompany = ref<MarketCompany>(marketCompanies[0]!)

const handleCompanyUpdate = (company: MarketCompany) => {
  selectedCompany.value = company
}
</script>

<template>
  <HeaderGraphs/>
  <div class="page-wrap">
    <MarketStatsBar :company="selectedCompany" />

    <StocksHoverPreview @update:company="handleCompanyUpdate" />
  </div>
</template>

<style scoped>
.page-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>