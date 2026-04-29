<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { UserProfile } from '~/data/userProfile'
import { userProfile } from '~/data/userProfile'

const props = defineProps<{
  isOpen: boolean
  userProfile: UserProfile
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()

const fullName = computed(() => {
  return `${props.userProfile.firstName || ''} ${props.userProfile.lastName || ''}`.trim() || 'Користувач'
})

const formattedPurpose = computed(() => {
  if (props.userProfile.purpose === 'investment') return 'Для інвестування'
  if (props.userProfile.purpose === 'trading') return 'Для трейдингу'
  return 'Не вказано'
})

const formattedBirthDate = computed(() => {
  if (!props.userProfile.birthDate) return 'Не вказано'

  const date = new Date(props.userProfile.birthDate)

  if (Number.isNaN(date.getTime())) {
    return props.userProfile.birthDate
  }

  return date.toLocaleDateString('uk-UA')
})

const registrationStatus = computed(() => {
  return props.userProfile.registrationCompleted
    ? 'Реєстрацію завершено'
    : 'Реєстрацію не завершено'
})

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
          {{ userProfile.email || 'Email не вказано' }}
        </p>

        <div class="account-popup__status">
          {{ registrationStatus }}
        </div>
      </div>

      <div class="account-popup__content">
        <div class="account-popup__grid">
          <div class="info-card">
            <p class="info-card__label">Ім'я</p>
            <p class="info-card__value">
              {{ userProfile.firstName || 'Не вказано' }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Прізвище</p>
            <p class="info-card__value">
              {{ userProfile.lastName || 'Не вказано' }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Країна</p>
            <p class="info-card__value">
              {{ userProfile.country || 'Не вказано' }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Мета акаунта</p>
            <p class="info-card__value">
              {{ formattedPurpose }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Дата народження</p>
            <p class="info-card__value">
              {{ formattedBirthDate }}
            </p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Номер телефону</p>
            <p class="info-card__value">
              {{ userProfile.phone || 'Не вказано' }}
            </p>
          </div>
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