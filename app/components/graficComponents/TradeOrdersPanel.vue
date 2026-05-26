<script setup lang="ts">
import { ref } from 'vue'
import type { MarketCompany } from '~/composables/useApi'
import BuyOrderForm from './BuyOrderForm.vue'
import SellOrderForm from './SellOrderForm.vue'
import OrderConfirmPopup from './OrderConfirmPopup.vue'
import { orderPreviewStore } from '../../data/userProfile'

type TradeTab = 'buy' | 'sell'

const props = defineProps<{
  company: MarketCompany
  currentPrice?: number
}>()

const activeTab = ref<TradeTab>('buy')

const setTab = (tab: TradeTab) => {
  activeTab.value = tab
}

const closePopup = () => {
  orderPreviewStore.isOpen = false
}
</script>

<template>
  <section class="trade-panel">
    <div class="trade-panel__card">
      <div class="trade-panel__head">
        <h2 class="trade-panel__title">Торгівля акціями</h2>
        <p class="trade-panel__text">
          Оберіть тип ордеру та заповніть всі необхідні поля.
        </p>
      </div>

      <div class="trade-panel__tabs">
        <button
          type="button"
          class="trade-panel__tab"
          :class="{ active: activeTab === 'buy' }"
          @click="setTab('buy')"
        >
          Купити
        </button>

        <button
          type="button"
          class="trade-panel__tab"
          :class="{ active: activeTab === 'sell' }"
          @click="setTab('sell')"
        >
          Продати
        </button>
      </div>

      <div class="trade-panel__content">
        <BuyOrderForm v-if="activeTab === 'buy'" :company="company" :current-price="props.currentPrice" />
        <SellOrderForm v-else :company="company" :current-price="props.currentPrice" />
      </div>
    </div>

    <OrderConfirmPopup
      :is-open="orderPreviewStore.isOpen"
      :order="orderPreviewStore.order"
      @close="closePopup"
    />
  </section>
</template>

<style scoped>
.trade-panel {
  width: 100%;
}

.trade-panel__card {
  padding: 20px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.trade-panel__head {
  margin-bottom: 18px;
}

.trade-panel__title {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 26px;
  font-weight: 700;
}

.trade-panel__text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.trade-panel__tabs {
  display: inline-flex;
  gap: 10px;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 18px;
}

.trade-panel__tab {
  min-width: 140px;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.trade-panel__tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.trade-panel__tab.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.trade-panel__content {
  width: 100%;
}

@media (max-width: 640px) {
  .trade-panel__tabs {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .trade-panel__tab {
    min-width: 0;
    width: 100%;
  }
}
</style>