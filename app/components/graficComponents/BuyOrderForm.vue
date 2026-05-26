<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { BuyQuantityMode, Currency, OrderDurationUnit } from '../../data/userProfile'
import type { MarketCompany } from '~/composables/useApi'
import { balanceStore, buyOrdersStore, orderPreviewStore } from '../../data/userProfile'
import { useApi } from '~/composables/useApi'
import { useStore } from '~/composables/useStore'

const props = defineProps<{
  company: MarketCompany
  currentPrice?: number
}>()

const api = useApi()
const { mapOrder, refreshHoldings } = useStore()
const submitting = ref(false)
const errorMsg = ref('')

const currencies: Currency[] = ['USD', 'EUR']
const durationUnits: Exclude<OrderDurationUnit, 'unlimited'>[] = ['hours', 'days']

const form = reactive({
  currency: 'USD' as Currency,
  quantity: '',
  quantityMode: 'whole' as BuyQuantityMode,
  limitPrice: '',
  durationValue: '24',
  durationUnit: 'hours' as Exclude<OrderDurationUnit, 'unlimited'>,
})

watch(
  () => props.currentPrice,
  (price) => {
    if (price && !form.limitPrice) {
      form.limitPrice = price.toFixed(2)
    }
  },
  { immediate: true },
)

const availableBalance = computed(() => balanceStore.balance)

const maxQty = computed(() => {
  const price = Number(form.limitPrice)
  if (!price || price <= 0) return 0
  return Math.floor(availableBalance.value / price)
})

const totalCost = computed(() => {
  const qty = Number(form.quantity)
  const price = Number(form.limitPrice)
  return qty > 0 && price > 0 ? (qty * price).toFixed(2) : '0.00'
})

const insufficientBalance = computed(() =>
  Number(totalCost.value) > 0 && Number(totalCost.value) > availableBalance.value
)

const isValid = computed(() =>
  Boolean(
    props.company &&
    form.currency &&
    Number(form.quantity) > 0 &&
    Number(form.limitPrice) > 0 &&
    Number(form.durationValue) > 0 &&
    form.durationUnit,
  ),
)

const setMaxQty = () => {
  if (maxQty.value > 0) form.quantity = String(maxQty.value)
}

const createOrder = async () => {
  if (!isValid.value || submitting.value) return
  submitting.value = true
  errorMsg.value = ''
  try {
    const amount = Number(totalCost.value)
    const res = await api.post<any>('/api/orders', {
      side: 'buy',
      assetName: props.company.name,
      ticker: props.company.ticker,
      logo: props.company.logo,
      currency: form.currency,
      amount,
      quantity: Number(form.quantity),
      quantityMode: form.quantityMode,
      limitPrice: Number(form.limitPrice),
      durationUnit: form.durationUnit,
      durationValue: Number(form.durationValue),
    })
    const order = mapOrder(res)
    buyOrdersStore.unshift(order)
    orderPreviewStore.order = order
    orderPreviewStore.isOpen = true
    balanceStore.balance = Math.max(0, balanceStore.balance - amount)
    await refreshHoldings()
    form.quantity = ''
    form.limitPrice = props.currentPrice ? props.currentPrice.toFixed(2) : ''
    form.durationValue = '24'
  } catch (e: any) {
    errorMsg.value = e.message ?? 'Failed to create order'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="trade-card">
    <div class="trade-form">
      <label class="trade-field">
        <span>Stock</span>
        <div class="trade-asset">
          <img :src="`https://assets.parqet.com/logos/symbol/${company.ticker}`" :alt="company.name" class="trade-asset__logo" />
          <div class="trade-asset__fixed">
            {{ company.name }} ({{ company.ticker }})
          </div>
        </div>
      </label>

      <div class="trade-balance-row">
        <span class="trade-balance-label">Доступний баланс</span>
        <span class="trade-balance-value">${{ availableBalance.toFixed(2) }}</span>
      </div>

      <label class="trade-field">
        <span>Валюта</span>
        <select v-model="form.currency" class="trade-input">
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </label>

      <label class="trade-field">
        <span>Лімітна ціна</span>
        <input v-model="form.limitPrice" type="number" min="0" step="0.01" class="trade-input" />
      </label>

      <label class="trade-field">
        <span>Кількість</span>
        <div class="trade-qty-row">
          <input v-model="form.quantity" type="number" min="0" step="0.01" class="trade-input trade-input--flex" />
          <button type="button" class="trade-max-btn" @click="setMaxQty" :disabled="maxQty === 0">
            Макс {{ maxQty }}
          </button>
        </div>
      </label>

      <label class="trade-field">
        <span>Тип купівлі</span>
        <select v-model="form.quantityMode" class="trade-input">
          <option value="whole">Ціла акція</option>
          <option value="partial">Часткова акція</option>
        </select>
      </label>

      <div class="trade-row">
        <label class="trade-field">
          <span>Тривалість</span>
          <input v-model="form.durationValue" type="number" min="1" class="trade-input" />
        </label>

        <label class="trade-field">
          <span>Одиниця</span>
          <select v-model="form.durationUnit" class="trade-input">
            <option v-for="unit in durationUnits" :key="unit" :value="unit">
              {{ unit === 'hours' ? 'Години' : 'Дні' }}
            </option>
          </select>
        </label>
      </div>

      <div class="trade-summary" v-if="Number(form.quantity) > 0 && Number(form.limitPrice) > 0">
        <span>Загальна вартість</span>
        <strong :class="{ 'trade-summary--over': insufficientBalance }">
          ${{ totalCost }}
        </strong>
      </div>

      <p v-if="insufficientBalance" class="trade-error">
        Недостатньо коштів. Баланс: ${{ availableBalance.toFixed(2) }}
      </p>

      <p v-if="errorMsg" class="trade-error">{{ errorMsg }}</p>

      <button class="trade-submit" type="button" :disabled="!isValid || submitting" @click="createOrder">
        {{ submitting ? 'Розміщення...' : 'Купити' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.trade-card {
  padding: 18px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background: transparent;
}

.trade-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.trade-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trade-field span {
  color: var(--text-secondary);
  font-size: 13px;
}

.trade-input {
  min-height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: #11111a;
  color: var(--text-primary);
}

.trade-input--flex {
  flex: 1;
}

.trade-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.trade-asset {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trade-asset__logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  object-fit: contain;
  background: rgba(255,255,255,0.04);
  padding: 8px;
}

.trade-asset__fixed {
  min-height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: #11111a;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  flex: 1;
}

.trade-balance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--glass-border);
}

.trade-balance-label {
  color: var(--text-secondary);
  font-size: 13px;
}

.trade-balance-value {
  color: #22c55e;
  font-size: 14px;
  font-weight: 700;
}

.trade-qty-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.trade-max-btn {
  white-space: nowrap;
  padding: 0 14px;
  min-height: 46px;
  border-radius: 14px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.trade-max-btn:hover:not(:disabled) {
  background: rgba(var(--accent-rgb), 0.1);
}

.trade-max-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.trade-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  font-size: 13px;
}

.trade-summary strong {
  color: var(--text-primary);
  font-size: 15px;
}

.trade-summary--over {
  color: #ef4444 !important;
}

.trade-submit {
  min-height: 48px;
  border: none;
  border-radius: 14px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.trade-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.trade-error {
  margin: 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(248, 113, 113, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.28);
  color: #fca5a5;
  font-size: 13px;
}
</style>
