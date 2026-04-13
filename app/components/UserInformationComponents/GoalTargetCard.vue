<script setup lang="ts">
import { computed } from 'vue'
import { goalStore, balanceStore } from '~/data/userProfile'

const remainingAmount = computed(() => {
  const value = goalStore.targetAmount - goalStore.earnedAmount
  return value > 0 ? value : 0
})

const progressPercent = computed(() => {
  if (!goalStore.targetAmount) return 0
  const percent = Math.round((goalStore.earnedAmount / goalStore.targetAmount) * 100)
  return percent > 100 ? 100 : percent
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: balanceStore.currency,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <section class="goal-card">
    <div class="goal-card__top">
      <p class="goal-card__label">Фінансова ціль</p>
      <h3 class="goal-card__title">Скільки хочеш заробити</h3>
    </div>

    <div class="goal-card__main">
      <p class="goal-card__target">{{ formatCurrency(goalStore.targetAmount) }}</p>
      <p class="goal-card__hint">Цільова сума</p>
    </div>

    <div class="goal-card__progress">
      <div class="goal-card__progress-bar">
        <div
          class="goal-card__progress-fill"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>

      <div class="goal-card__progress-info">
        <span>{{ progressPercent }}%</span>
        <span>Залишилось: {{ formatCurrency(remainingAmount) }}</span>
      </div>
    </div>

    <div class="goal-card__stats">
      <div class="goal-stat">
        <p class="goal-stat__label">Вже зароблено</p>
        <p class="goal-stat__value">{{ formatCurrency(goalStore.earnedAmount) }}</p>
      </div>

      <div class="goal-stat">
        <p class="goal-stat__label">Ще потрібно</p>
        <p class="goal-stat__value">{{ formatCurrency(remainingAmount) }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.goal-card {
  min-width: 600px;;
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.goal-card__top {
  margin-bottom: 16px;
}

.goal-card__label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.goal-card__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.goal-card__main {
  margin-bottom: 18px;
}

.goal-card__target {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: var(--font-bold);
  line-height: 1.2;
}

.goal-card__hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.goal-card__progress {
  margin-bottom: 18px;
}

.goal-card__progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  margin-bottom: 8px;
}

.goal-card__progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
}

.goal-card__progress-info {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.goal-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.goal-stat {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
}

.goal-stat__label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.goal-stat__value {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

@media (max-width: 700px) {
  .goal-card__stats {
    grid-template-columns: 1fr;
  }

  .goal-card__progress-info {
    flex-direction: column;
  }
}
</style>