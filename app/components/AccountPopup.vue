<script setup lang="ts">
import type { UserProfile } from '~/data/userProfile'

defineProps<{
  isOpen: boolean
  userProfile: UserProfile
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div
    v-if="isOpen"
    class="account-popup-overlay"
    @click="emit('close')"
  >
    <div class="account-popup" @click.stop>
      <button class="account-popup__close" @click="emit('close')">
        ×
      </button>

      <div class="account-popup__avatar-wrap">
        <img
          :src="userProfile.avatar"
          :alt="`${userProfile.firstName} ${userProfile.lastName}`"
          class="account-popup__avatar"
        />
      </div>

      <h3 class="account-popup__name">
        {{ userProfile.firstName }} {{ userProfile.lastName }}
      </h3>

      <p class="account-popup__email">
        {{ userProfile.email }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.account-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  z-index: 100;
}

.account-popup {
  position: relative;
  width: 100%;
  max-width: 360px;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
  text-align: center;
}

.account-popup__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--glass-bg);
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
}

.account-popup__close:hover {
  background: var(--accent-light);
}

.account-popup__avatar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.account-popup__avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--glass-border);
}

.account-popup__name {
  margin: 0 0 var(--space-xs);
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: 700;
}

.account-popup__email {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}
</style>