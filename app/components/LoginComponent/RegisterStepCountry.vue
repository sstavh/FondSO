<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  next: [country: string]
}>()

const country = ref('')

const countries = [
  'Україна',
  'Польща',
  'Німеччина',
  'Іспанія',
  'Франція',
  'Італія',
  'США',
  'Канада',
]

const handleNext = () => {
  if (!country.value) return
  emit('next', country.value)
}
</script>

<template>
  <div class="step-card">
    <p class="step-logo">FondSO</p>

    <h2 class="step-title">Оберіть країну проживання</h2>

    <p class="step-text">
      Це потрібно для налаштування акаунта та подальшого заповнення профілю.
    </p>

    <div class="field">
      <label for="country">Країна</label>
      <select id="country" v-model="country">
        <option disabled value="">Оберіть країну</option>
        <option v-for="item in countries" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>

    <button class="main-button" :disabled="!country" @click="handleNext">
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

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field label {
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: 600;
}

.field select {
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-main);
  outline: none;
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