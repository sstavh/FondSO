<script setup lang="ts">
import { computed } from 'vue'
import { marketCompanies } from '~/data/marketCompanies'

const formatPercent = (value: number) => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

const tickerItems = computed(() => {
  return marketCompanies.map((company) => {
    const rawPercent =
      ((company.startPrice - ((company.minPrice + company.maxPrice) / 2)) /
        company.startPrice) *
      100

    const percent = Number(rawPercent.toFixed(2))

    return {
      uid: `base-${company.id}`,
      id: company.id,
      name: company.name,
      ticker: company.ticker,
      logo: company.logo,
      percent,
      isPositive: percent >= 0,
      price: company.startPrice,
    }
  })
})

const repeatedTickerItems = computed(() => [
  ...tickerItems.value.map((item) => ({
    ...item,
    uid: `first-${item.id}`,
  })),
  ...tickerItems.value.map((item) => ({
    ...item,
    uid: `second-${item.id}`,
  })),
])
</script>

<template>
  <section class="ticker-tape">
    <div class="ticker-tape__fade ticker-tape__fade--left"></div>
    <div class="ticker-tape__fade ticker-tape__fade--right"></div>

    <div class="ticker-tape__viewport">
      <div class="ticker-tape__track">
        <div class="ticker-tape__group">
          <article
            v-for="item in repeatedTickerItems"
            :key="item.uid"
            class="ticker-card"
          >
            <div class="ticker-card__left">
              <div class="ticker-card__logo-wrap">
                <img
                  :src="item.logo"
                  :alt="item.name"
                  class="ticker-card__logo"
                />
              </div>

              <div class="ticker-card__info">
              
                <p class="ticker-card__ticker">{{ item.name }}</p>
              </div>
            </div>

            <div class="ticker-card__right">
              <p class="ticker-card__price">${{ item.price.toFixed(2) }}</p>
              <p
                class="ticker-card__change"
                :class="{
                  'ticker-card__change--up': item.isPositive,
                  'ticker-card__change--down': !item.isPositive,
                }"
              >
                {{ formatPercent(item.percent) }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ticker-tape {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.02);
}

.ticker-tape__viewport {
  overflow: hidden;
  width: 100%;
}

.ticker-tape__track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: tickerScroll 65s linear infinite;
}

.ticker-tape:hover .ticker-tape__track {
  animation-play-state: paused;
}

.ticker-tape__group {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
}

.ticker-card {
  min-width: 230px;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.025);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.ticker-card__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.ticker-card__logo-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.ticker-card__logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.ticker-card__info {
  min-width: 0;
}

.ticker-card__ticker {
  margin: 0 0 2px;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 700;
}

.ticker-card__name {
  margin: 0;
  color: var(--text-secondary);
  font-size: 10px;
  white-space: nowrap;
}

.ticker-card__right {
  text-align: right;
  flex-shrink: 0;
}

.ticker-card__price {
  margin: 0 0 2px;
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 600;
}

.ticker-card__change {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
}

.ticker-card__change--up {
  color: #22c55e;
}

.ticker-card__change--down {
  color: #ef4444;
}

.ticker-tape__fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 70px;
  z-index: 2;
  pointer-events: none;
}

.ticker-tape__fade--left {
  left: 0;
  background: linear-gradient(to right, var(--bg-main), transparent);
}

.ticker-tape__fade--right {
  right: 0;
  background: linear-gradient(to left, var(--bg-main), transparent);
}

@keyframes tickerScroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

@media (max-width: 900px) {
  .ticker-card {
    min-width: 210px;
    padding: 9px 12px;
  }

  .ticker-tape__group {
    gap: 12px;
    padding: 8px 0;
  }

  .ticker-tape__track {
    animation-duration: 80s;
  }
}
</style>