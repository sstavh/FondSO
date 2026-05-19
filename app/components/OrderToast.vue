<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, remove } = useToast()

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.side === 'buy' ? 'toast--buy' : 'toast--sell'"
          @click="remove(toast.id)"
        >
          <div class="toast__icon-wrap">
            <img
              v-if="toast.logo"
              :src="toast.logo"
              :alt="toast.assetName"
              class="toast__logo"
            />
            <span v-else class="toast__logo-fallback">{{ toast.ticker.slice(0, 1) }}</span>
          </div>

          <div class="toast__body">
            <p class="toast__title">
              {{ toast.side === 'buy' ? 'Куплено' : 'Продано' }} · {{ toast.ticker }}
            </p>
            <p class="toast__sub">
              {{ toast.quantity }} шт. · {{ formatAmount(toast.amount, toast.currency) }}
            </p>
          </div>

          <div class="toast__badge" :class="toast.side === 'buy' ? 'toast__badge--buy' : 'toast__badge--sell'">
            {{ toast.side === 'buy' ? '↑ Buy' : '↓ Sell' }}
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 360px;
  padding: 14px 16px;
  border-radius: 18px;
  background: #1a1d27;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  pointer-events: all;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.toast:hover {
  transform: scale(1.02);
}

.toast--buy {
  border-color: rgba(34, 197, 94, 0.25);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(34, 197, 94, 0.12);
}

.toast--sell {
  border-color: rgba(239, 68, 68, 0.25);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.12);
}

.toast__icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.toast__logo {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.toast__logo-fallback {
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
}

.toast__body {
  flex: 1;
  min-width: 0;
}

.toast__title {
  margin: 0 0 3px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.toast__sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.toast__badge {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.toast__badge--buy {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.toast__badge--sell {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.92);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(60px) scale(0.92);
}
</style>
