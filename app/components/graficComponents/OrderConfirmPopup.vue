<script setup lang="ts">
import type { TradeOrderItem } from '../../data/userProfile'

defineProps<{
  isOpen: boolean
  order: TradeOrderItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const formatMoney = (value: number, currency: string) => {
  return `${value.toFixed(2)} ${currency}`
}
</script>

<template>
  <teleport to="body">
    <div v-if="isOpen && order" class="popup-overlay" @click="emit('close')">
      <div class="popup-card" @click.stop>
        <div class="popup-head">
          <h3 class="popup-title">
            {{ order.side === 'buy' ? 'Заявка на купівлю' : 'Заявка на продаж' }}
          </h3>
          <button class="popup-close" type="button" @click="emit('close')">✕</button>
        </div>

        <div class="popup-asset">
          <img :src="order.logo" :alt="order.assetName" class="popup-asset__logo" />
          <div>
            <p class="popup-asset__ticker">{{ order.ticker }}</p>
            <p class="popup-asset__name">{{ order.assetName }}</p>
          </div>
        </div>

        <div class="popup-grid">
          <div class="popup-item">
            <span>Сума</span>
            <strong>{{ formatMoney(order.amount, order.currency) }}</strong>
          </div>

          <div class="popup-item">
            <span>Кількість</span>
            <strong>{{ order.quantity }}</strong>
          </div>

          <div class="popup-item">
            <span>Ліміт ціни</span>
            <strong>{{ formatMoney(order.limitPrice, order.currency) }}</strong>
          </div>

          <div class="popup-item">
            <span>Термін</span>
            <strong>
              {{
                order.durationUnit === 'unlimited'
                  ? 'Без обмеження'
                  : `${order.durationValue} ${order.durationUnit === 'hours' ? 'год.' : 'дн.'}`
              }}
            </strong>
          </div>

          <div class="popup-item" v-if="order.quantityMode">
            <span>Тип купівлі</span>
            <strong>{{ order.quantityMode === 'whole' ? 'Ціла акція' : 'Частина акції' }}</strong>
          </div>

          <div class="popup-item">
            <span>Прогрес</span>
            <strong>{{ order.progress }}%</strong>
          </div>
        </div>

        <div class="popup-progress">
          <div class="popup-progress__bar" :style="{ width: `${order.progress}%` }"></div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 200;
}

.popup-card {
  width: 100%;
  max-width: 560px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background: #11111a;
  box-shadow: var(--shadow-glass);
  padding: 22px;
}

.popup-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.popup-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 700;
}

.popup-close {
  width: 36px;
  height: 36px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}

.popup-asset {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.popup-asset__logo {
  width: 46px;
  height: 46px;
  object-fit: contain;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  padding: 8px;
}

.popup-asset__ticker {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.popup-asset__name {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.popup-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.popup-item {
  padding: 14px;
  border-radius: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popup-item span {
  color: var(--text-secondary);
  font-size: 12px;
}

.popup-item strong {
  color: var(--text-primary);
  font-size: 15px;
}

.popup-progress {
  margin-top: 18px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}

.popup-progress__bar {
  height: 100%;
  background: var(--accent);
}
</style>