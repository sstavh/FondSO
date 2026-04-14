<script setup lang="ts">
import StocksHoverPreview from '../components/choicEofGraphicsComponent/StocksHoverPreview.vue'
</script>

<template>
  <div class="page-wrap">
    <StocksHoverPreview />
  </div>
</template>

<style scoped>
.page-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>