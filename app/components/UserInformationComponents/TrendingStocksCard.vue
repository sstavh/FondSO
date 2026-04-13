<script setup lang="ts">
import { trendingStocks } from '~/data/stocks'

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}
</script>

<template>
  <section class="stocks-card">
    <div class="stocks-card__head">
      <div>
        <p class="stocks-card__label">Ринок</p>
        <h3 class="stocks-card__title">Які акції в тренді</h3>
      </div>
    </div>

    <div class="stocks-list">
      <div
        v-for="stock in trendingStocks"
        :key="stock.id"
        class="stock-item"
      >
        <div class="stock-item__left">
          <div class="stock-item__avatar">
            {{ stock.ticker.slice(0, 1) }}
          </div>

          <div class="stock-item__info">
            <p class="stock-item__name">{{ stock.name }}</p>
            <p class="stock-item__ticker">{{ stock.ticker }}</p>
          </div>
        </div>

        <div class="stock-item__right">
          <p class="stock-item__price">{{ formatPrice(stock.price) }}</p>
          <p
            class="stock-item__change"
            :class="{
              'stock-item__change--up': stock.direction === 'up',
              'stock-item__change--down': stock.direction === 'down',
            }"
          >
            {{ stock.direction === 'up' ? '+' : '-' }}{{ stock.changePercent }}%
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stocks-card {
  width: 100%;
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.stocks-card__head {
  margin-bottom: 18px;
}

.stocks-card__label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.stocks-card__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.stocks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stock-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
}

.stock-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.stock-item__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--accent-light);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.stock-item__info {
  min-width: 0;
}

.stock-item__name {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.stock-item__ticker {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.stock-item__right {
  text-align: right;
  flex-shrink: 0;
}

.stock-item__price {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.stock-item__change {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.stock-item__change--up {
  color: #22c55e;
}

.stock-item__change--down {
  color: #ef4444;
}

@media (max-width: 700px) {
  .stock-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .stock-item__right {
    text-align: left;
  }
}
</style>