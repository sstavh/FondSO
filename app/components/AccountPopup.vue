<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { UserProfile } from '~/data/userProfile'
import { userProfile } from '~/data/userProfile'
import { useApi } from '~/composables/useApi'

const props = defineProps<{
  isOpen: boolean
  userProfile: UserProfile
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const api = useApi()

const fullName = computed(() => {
  return `${props.userProfile.firstName || ''} ${props.userProfile.lastName || ''}`.trim() || 'User'
})

const formattedPurpose = computed(() => {
  if (props.userProfile.purpose === 'investment') return 'For investing'
  if (props.userProfile.purpose === 'trading') return 'For trading'
  return 'Not set'
})

const formattedBirthDate = computed(() => {
  if (!props.userProfile.birthDate) return 'Not set'

  const date = new Date(props.userProfile.birthDate)

  if (Number.isNaN(date.getTime())) {
    return props.userProfile.birthDate
  }

  return date.toLocaleDateString('uk-UA')
})

const registrationStatus = computed(() => {
  return props.userProfile.registrationCompleted
    ? 'Registration complete'
    : 'Registration incomplete'
})

const showGoalForm = ref(false)
const goalInput = ref(0)
const currentGoal = ref(0)
const goalLoading = ref(false)
const goalError = ref('')

const fetchGoal = async () => {
  try {
    const res = await api.get<{ targetAmount: number; earnedAmount: number }>('/api/goal')
    currentGoal.value = Number(res.targetAmount) || 0
    goalInput.value = currentGoal.value
  } catch {
    // якщо ціль ще не встановлена — ігноруємо помилку
  }
}

watch(() => props.isOpen, (val) => {
  if (val) fetchGoal()
})

const saveGoal = async () => {
  const val = Number(goalInput.value)
  if (Number.isNaN(val) || val < 0) return
  goalLoading.value = true
  goalError.value = ''
  try {
    const res = await api.patch<{ targetAmount: number }>('/api/goal', { targetAmount: val })
    currentGoal.value = Number(res.targetAmount) || val
    showGoalForm.value = false
  } catch (e: unknown) {
    goalError.value = e instanceof Error ? e.message : 'Помилка збереження'
  } finally {
    goalLoading.value = false
  }
}

const logout = () => {
  userProfile.firstName = ''
  userProfile.lastName = ''
  userProfile.email = ''
  userProfile.country = ''
  userProfile.purpose = ''
  userProfile.birthDate = ''
  userProfile.phone = ''
  userProfile.registrationCompleted = false

  emit('close')
  router.push('/login')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="account-popup-overlay"
    @click="emit('close')"
  >
    <div class="account-popup" @click.stop>
      <button
        class="account-popup__close"
        type="button"
        @click="emit('close')"
      >
        ×
      </button>

      <div class="account-popup__top">
        <div class="account-popup__avatar-wrap">
          <img
            :src="userProfile.avatar || '/images/avatar.jpg'"
            :alt="fullName"
            class="account-popup__avatar"
          />
        </div>

        <h3 class="account-popup__name">
          {{ fullName }}
        </h3>

        <p class="account-popup__email">
          {{ userProfile.email || 'Email not set' }}
        </p>

        <div class="account-popup__status">
          {{ registrationStatus }}
        </div>
      </div>

      <div class="account-popup__content">
        <div class="account-popup__grid">
          <div class="info-card">
            <p class="info-card__label">First Name</p>
            <p class="info-card__value">
              {{ userProfile.firstName || 'Not set' }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Last Name</p>
            <p class="info-card__value">
              {{ userProfile.lastName || 'Not set' }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Country</p>
            <p class="info-card__value">
              {{ userProfile.country || 'Not set' }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Account Purpose</p>
            <p class="info-card__value">
              {{ formattedPurpose }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Date of Birth</p>
            <p class="info-card__value">
              {{ formattedBirthDate }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Phone Number</p>
            <p class="info-card__value">
              {{ userProfile.phone || 'Not set' }}
            </p>
          </div>
        </div>

        <button
          class="goal-btn"
          type="button"
          @click="showGoalForm = !showGoalForm"
        >
          Скільки ти хочеш заробити?
        </button>

        <div v-if="showGoalForm" class="goal-form">
          <p class="goal-form__label">Введи ціль заробітку</p>
          <div class="goal-form__row">
            <input
              v-model.number="goalInput"
              class="goal-form__input"
              type="number"
              min="0"
              placeholder="Наприклад: 50000"
              :disabled="goalLoading"
            />
            <button class="goal-form__save" type="button" :disabled="goalLoading" @click="saveGoal">
              {{ goalLoading ? '...' : 'Зберегти' }}
            </button>
          </div>
          <p v-if="goalError" class="goal-form__error">{{ goalError }}</p>
          <p v-else-if="currentGoal > 0" class="goal-form__current">
            Поточна ціль: {{ currentGoal.toLocaleString('uk-UA') }} ₴
          </p>
        </div>

        <button
          class="logout-btn"
          type="button"
          @click="logout"
        >
          Вийти з акаунта
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  z-index: 100;
  backdrop-filter: blur(8px);
}

.account-popup {
  position: relative;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
}

.account-popup__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--glass-bg);
  color: var(--text-primary);
  font-size: 22px;
  cursor: pointer;
}

.account-popup__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: var(--space-xl);
}

.account-popup__avatar-wrap {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.account-popup__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.account-popup__name {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: 700;
}

.account-popup__email {
  margin: 0 0 12px;
  color: var(--text-secondary);
}

.account-popup__status {
  padding: 10px 14px;
  border-radius: 999px;
  background: var(--accent-light);
}

.account-popup__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.info-card {
  padding: 14px;
  border-radius: 14px;
  background: var(--glass-bg);
}

.info-card__label {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.info-card__value {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
}

.goal-btn {
  width: 100%;
  min-height: 50px;
  border: 2px solid var(--accent-color, #6366f1);
  border-radius: 16px;
  background: transparent;
  color: var(--accent-color, #6366f1);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
  margin-bottom: 12px;
}

.goal-btn:hover {
  background: var(--accent-light, rgba(99, 102, 241, 0.12));
  transform: translateY(-1px);
}

.goal-form {
  padding: 16px;
  border-radius: 16px;
  background: var(--glass-bg);
  margin-bottom: 12px;
}

.goal-form__label {
  margin: 0 0 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

.goal-form__row {
  display: flex;
  gap: 10px;
}

.goal-form__input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
}

.goal-form__input:focus {
  border-color: var(--accent-color, #6366f1);
}

.goal-form__save {
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  background: var(--accent-color, #6366f1);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.goal-form__save:hover {
  opacity: 0.85;
}

.goal-form__current {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.goal-form__error {
  margin: 10px 0 0;
  color: #ef4444;
  font-size: 13px;
}

.logout-btn {
  width: 100%;
  min-height: 50px;
  border: none;
  border-radius: 16px;
  background: #ef4444;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.logout-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .account-popup__grid {
    grid-template-columns: 1fr;
  }
}
</style>