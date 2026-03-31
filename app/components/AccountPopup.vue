<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfile } from '~/data/userProfile'

const props = defineProps<{
  isOpen: boolean
  userProfile: UserProfile
}>()

const emit = defineEmits<{
  close: []
}>()

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
  return props.userProfile.registrationCompleted ? 'Реєстрацію завершено' : 'Реєстрацію не завершено'
})
</script>

<template>
  <div
    v-if="isOpen"
    class="account-popup-overlay"
    @click="emit('close')"
  >
    <div class="account-popup" @click.stop>
      <button class="account-popup__close" type="button" @click="emit('close')">
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
            <p class="info-card__value">{{ userProfile.firstName || 'Не вказано' }}</p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Прізвище</p>
            <p class="info-card__value">{{ userProfile.lastName || 'Не вказано' }}</p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Країна</p>
            <p class="info-card__value">{{ userProfile.country || 'Не вказано' }}</p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Мета акаунта</p>
            <p class="info-card__value">{{ formattedPurpose }}</p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Дата народження</p>
            <p class="info-card__value">{{ formattedBirthDate }}</p>
          </div>

          <div class="info-card">
            <p class="info-card__label">Номер телефону</p>
            <p class="info-card__value">{{ userProfile.phone || 'Не вказано' }}</p>
          </div>
        </div>
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
  -webkit-backdrop-filter: blur(8px);
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
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.account-popup__close:hover {
  background: var(--accent-light);
  transform: scale(1.05);
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
  border: 2px solid var(--glass-border);
  background: var(--bg-main);
}

.account-popup__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.account-popup__name {
  margin: 0 0 var(--space-xs);
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: 700;
}

.account-popup__email {
  margin: 0 0 var(--space-md);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.account-popup__status {
  padding: 10px 14px;
  border-radius: 999px;
  background: var(--accent-light);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: 600;
}

.account-popup__content {
  width: 100%;
}

.account-popup__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.info-card {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
}

.info-card__label {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-card__value {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: 600;
  word-break: break-word;
}

@media (max-width: 640px) {
  .account-popup {
    padding: var(--space-lg);
  }

  .account-popup__grid {
    grid-template-columns: 1fr;
  }

  .account-popup__avatar-wrap {
    width: 88px;
    height: 88px;
  }

  .account-popup__name {
    font-size: var(--text-lg);
  }
}
</style>