<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{
  next: [
    payload: {
      firstName: string
      lastName: string
      birthDate: string
      phone: string
      privacyAccepted: boolean
    }
  ]
}>()

const form = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  phone: '',
  privacyAccepted: false,
})

const handleNext = () => {
  if (
    !form.firstName ||
    !form.lastName ||
    !form.birthDate ||
    !form.phone ||
    !form.privacyAccepted
  ) {
    return
  }

  emit('next', { ...form })
}
</script>

<template>
  <div class="step-card">
    <p class="step-logo">FondSO</p>

    <h2 class="step-title">Заповніть ваші дані</h2>

    <p class="step-text">
      Це останній етап створення акаунта. Після цього ви перейдете на головну сторінку.
    </p>

    <div class="grid">
      <div class="field">
        <label for="firstName">Ім'я</label>
        <input id="firstName" v-model="form.firstName" type="text" placeholder="Ім'я" />
      </div>

      <div class="field">
        <label for="lastName">Прізвище</label>
        <input id="lastName" v-model="form.lastName" type="text" placeholder="Прізвище" />
      </div>

      <div class="field">
        <label for="birthDate">Дата народження</label>
        <input id="birthDate" v-model="form.birthDate" type="date" />
      </div>

      <div class="field">
        <label for="phone">Номер телефону</label>
        <input id="phone" v-model="form.phone" type="tel" placeholder="+380 XX XXX XX XX" />
      </div>
    </div>

    <label class="privacy">
      <input v-model="form.privacyAccepted" type="checkbox" />
      <span>Я погоджуюсь з політикою конфіденційності</span>
    </label>

    <button class="main-button" @click="handleNext">
      Завершити
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

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
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

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-main);
  outline: none;
}

.privacy {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--text-sm);
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

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>