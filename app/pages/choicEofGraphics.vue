<script setup lang="ts">
import { ref } from 'vue'
import StocksHoverPreview from '../components/choicEofGraphicsComponent/StocksHoverPreview.vue'
import MarketStatsBar from '../components/graficComponents/MarketStatsBar.vue'
import type { MarketCompany } from '~/composables/useApi'
import HeaderGraphs from '~/components/HeaderGraphs.vue'

const selectedCompany = ref<MarketCompany | null>(null)

const handleCompanyUpdate = (company: MarketCompany) => {
  selectedCompany.value = company
}
</script>

<template>
  <HeaderGraphs />

  <section class="hero">
    <div class="hero__content">
      <p class="hero__badge">Stock Market • Real-Time Analytics</p>

      <h1 class="hero__title">
        Professional Stock Charts and Market Statistics
      </h1>

      <p class="hero__text">
        Track popular companies, analyze price changes, trading volumes and
        market behavior. Hover over a company on the left to instantly
        preview its chart and current metrics.
      </p>

      <div class="hero__info">
        <div class="hero__card">
          <span class="hero__label">Active Company</span>
          <strong class="hero__value">{{ selectedCompany?.name ?? '...' }}</strong>
        </div>

       

        <div class="hero__card">
          <span class="hero__label">Mode</span>
          <strong class="hero__value">Live Preview</strong>
        </div>
      </div>
    </div>
  </section>

  <main class="page-wrap">
    <MarketStatsBar v-if="selectedCompany" :company="selectedCompany" />

    <StocksHoverPreview @update:company="handleCompanyUpdate" />
  </main>
</template>

<style scoped>
.page-wrap {
  margin-bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

/* HERO */
.hero {
  padding: 42px 24px 12px;
}

.hero__content {

  margin: 0 auto;
  padding: 34px;
  border-radius: 28px;
  border: 1px solid var(--glass-border);
  background:
   
    var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.hero__badge {
  margin: 0 0 16px;
  color: #b794ff;
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero__title {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(34px, 5vw, 56px);
  line-height: 1.05;
  font-weight: 800;
  max-width: 850px;
}

.hero__text {
  margin: 20px 0 0;
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: 1.7;
  max-width: 820px;
}

.hero__info {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.hero__card {
  padding: 18px;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
}

.hero__label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.hero__value {
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: 700;
}

/* MOBILE */
@media (max-width: 900px) {
  .page-wrap {
    padding: 16px;
  }

  .hero {
    padding: 24px 16px 8px;
  }

  .hero__content {
    padding: 24px;
  }

  .hero__info {
    grid-template-columns: 1fr;
  }

  .hero__text {
    font-size: var(--text-base);
  }
}
</style>