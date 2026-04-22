<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { goalStore, balanceStore } from '~/data/userProfile'

const isVisible = ref(false)

const remainingAmount = computed(() => {
  const value = goalStore.targetAmount - goalStore.earnedAmount
  return value > 0 ? value : 0
})

const progressPercent = computed(() => {
  if (!goalStore.targetAmount) return 0
  const percent = Math.round((goalStore.earnedAmount / goalStore.targetAmount) * 100)
  return percent > 100 ? 100 : percent
})

const animatedProgress = ref(0)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: balanceStore.currency,
    maximumFractionDigits: 0,
  }).format(value)
}

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true

    setTimeout(() => {
      animatedProgress.value = progressPercent.value
    }, 180)
  })
})
</script>

<template>
  <section class="goal-card" :class="{ 'goal-card--visible': isVisible }">
    <div class="goal-card__top">
      <p class="goal-card__label">Фінансова ціль</p>
      <h3 class="goal-card__title">Скільки хочеш заробити</h3>
    </div>

    <div class="goal-card__main" :class="{ 'goal-card__main--visible': isVisible }">
      <p class="goal-card__target">{{ formatCurrency(goalStore.targetAmount) }}</p>
      <p class="goal-card__hint">Цільова сума</p>
    </div>

    <div class="goal-card__progress" :class="{ 'goal-card__progress--visible': isVisible }">
      <div class="goal-card__progress-bar">
        <div
          class="goal-card__progress-fill"
          :style="{ width: `${animatedProgress}%` }"
        />
      </div>

      <div class="goal-card__progress-info">
        <span>{{ progressPercent }}%</span>
        <span>Залишилось: {{ formatCurrency(remainingAmount) }}</span>
      </div>
    </div>

    <div class="goal-card__stats" :class="{ 'goal-card__stats--visible': isVisible }">
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
  min-width: 600px;
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
  opacity: 0;
  transform: translateY(18px) scale(0.985);
  transition:
    opacity 0.55s ease,
    transform 0.55s ease,
    box-shadow 0.25s ease;
}

.goal-card--visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.goal-card:hover {
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
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
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.45s ease 0.12s,
    transform 0.45s ease 0.12s;
}

.goal-card__main--visible {
  opacity: 1;
  transform: translateY(0);
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
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.45s ease 0.2s,
    transform 0.45s ease 0.2s;
}

.goal-card__progress--visible {
  opacity: 1;
  transform: translateY(0);
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
  width: 0;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.35);
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
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.45s ease 0.34s,
    transform 0.45s ease 0.34s;
}

.goal-card__stats--visible {
  opacity: 1;
  transform: translateY(0);
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
  .goal-card {
    min-width: 100%;
  }

  .goal-card__stats {
    grid-template-columns: 1fr;
  }

  .goal-card__progress-info {
    flex-direction: column;
  }
}
</style>