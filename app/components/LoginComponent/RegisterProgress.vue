<script setup lang="ts">
defineProps<{
  currentStep: number
  totalSteps: number
}>()
</script>

<template>
  <div class="progress-wrap">
    <p class="progress-text">Етап {{ currentStep }} з {{ totalSteps }}</p>

    <div class="progress-steps">
      <div class="step" :class="{ done: currentStep > 1, active: currentStep === 1 }">
        <span class="circle">{{ currentStep > 1 ? '✓' : '1' }}</span>
        <span class="label">Реєстрація</span>
      </div>

      <div class="step" :class="{ done: currentStep > 2, active: currentStep === 2 }">
        <span class="circle">{{ currentStep > 2 ? '✓' : '2' }}</span>
        <span class="label">Країна</span>
      </div>

      <div class="step" :class="{ done: currentStep > 3, active: currentStep === 3 }">
        <span class="circle">{{ currentStep > 3 ? '✓' : '3' }}</span>
        <span class="label">Мета</span>
      </div>

      <div class="step" :class="{ done: currentStep > 4, active: currentStep === 4 }">
        <span class="circle">{{ currentStep > 4 ? '✓' : '4' }}</span>
        <span class="label">Дані</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-wrap {
  margin-bottom: var(--space-xl);
}

.progress-text {
  margin: 0 0 var(--space-md);
  text-align: center;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: 700;
}

.progress-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 700;
}

.label {
  color: var(--text-secondary);
  font-size: var(--text-xs);
  text-align: center;
}

.step.active .circle,
.step.done .circle {
  background: var(--accent);
  color: var(--text-primary);
  border-color: var(--accent);
}

.step.active .label,
.step.done .label {
  color: var(--text-primary);
}
</style>