<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarketStockChart from '../components/graficComponents/MarketChartCard.vue'
import type { MarketCompany } from '~/composables/useApi'
import { useApi } from '~/composables/useApi'

const api = useApi()
const selectedCompany = ref<MarketCompany | null>(null)

onMounted(async () => {
  selectedCompany.value = await api.get<MarketCompany>('/api/market/companies/NVDA')
})
</script>

<template>
  <MarketStockChart v-if="selectedCompany" :company="selectedCompany" />
</template>

<style scoped></style>