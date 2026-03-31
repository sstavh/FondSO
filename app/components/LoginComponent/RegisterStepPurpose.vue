<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  next: [purpose: string]
}>()

const purpose = ref('')

const handleNext = () => {
  if (!purpose.value) return
  emit('next', purpose.value)
}
</script>

<template>
  <div class="step-card">
    <p class="step-logo">FondSO</p>

    <h2 class="step-title">Для чого ви створюєте акаунт?</h2>

    <p class="step-text">
      Оберіть один із варіантів. Це допоможе правильно налаштувати ваш профіль.
    </p>

    <div class="choice-list">
      <button
        type="button"
        class="choice-card"
        :class="{ active: purpose === 'investment' }"
        @click="purpose = 'investment'"
      >
        Для інвестування
      </button>

      <button
        type="button"
        class="choice-card"
        :class="{ active: purpose === 'trading' }"
        @click="purpose = 'trading'"
      >
        Для трейдингу
      </button>
    </div>

    <button class="main-button" :disabled="!purpose" @click="handleNext">
      Наступне
    </button>
  </div>
</template>

<style scoped>
.step-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.step-logo {
  margin: 0;
  text-align: center;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: 700;
}

.step-title {
  margin: 0;
  text-align: center;
  color: var(--text-primary);
  font-size: var(--text-2xl);
  font-weight: 700;
}

.step-text {
  margin: 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.5;
}

.choice-list {
  display: grid;
  gap: var(--space-md);
}

.choice-card {
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.choice-card.active {
  border-color: var(--accent);
  background: var(--accent-light);
}

.main-button {
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--accent);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: 700;
  font-family: var(--font-main);
  cursor: pointer;
}

.main-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>