<script setup lang="ts">
import { computed, reactive } from 'vue'
import type {
  BuyQuantityMode,
  Currency,
  OrderDurationUnit,
  TradeOrderItem,
} from '../../data/userProfile'
import type { MarketCompany } from '~/data/marketCompanies'
import {
  buyOrdersStore,
  orderPreviewStore,
} from '../../data/userProfile'

const props = defineProps<{
  company: MarketCompany
}>()

const currencies: Currency[] = ['USD', 'EUR', 'UAH', 'PLN']
const durationUnits: Exclude<OrderDurationUnit, 'unlimited'>[] = ['hours', 'days']

const form = reactive({
  currency: 'USD' as Currency,
  amount: '',
  quantity: '',
  quantityMode: 'whole' as BuyQuantityMode,
  limitPrice: '',
  durationValue: '',
  durationUnit: 'hours' as Exclude<OrderDurationUnit, 'unlimited'>,
})

const isValid = computed(() => {
  return Boolean(
    props.company &&
      form.currency &&
      form.amount &&
      Number(form.amount) > 0 &&
      form.quantity &&
      Number(form.quantity) > 0 &&
      form.limitPrice &&
      Number(form.limitPrice) > 0 &&
      form.durationValue &&
      Number(form.durationValue) > 0 &&
      form.durationUnit
  )
})

const createOrder = () => {
  if (!isValid.value) return

  const now = new Date()
  const expires = new Date(now)

  if (form.durationUnit === 'hours') {
    expires.setHours(expires.getHours() + Number(form.durationValue))
  } else {
    expires.setDate(expires.getDate() + Number(form.durationValue))
  }

  const order: TradeOrderItem = {
    id: Date.now(),
    side: 'buy',
    assetName: props.company.name,
    ticker: props.company.ticker,
    logo: props.company.logo,
    currency: form.currency,
    amount: Number(form.amount),
    quantity: Number(form.quantity),
    quantityMode: form.quantityMode,
    limitPrice: Number(form.limitPrice),
    durationUnit: form.durationUnit,
    durationValue: Number(form.durationValue),
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    progress: 0,
    status: 'active',
  }

  buyOrdersStore.unshift(order)
  orderPreviewStore.order = order
  orderPreviewStore.isOpen = true

  form.amount = ''
  form.quantity = ''
  form.limitPrice = ''
  form.durationValue = ''
}
</script>

<template>
  <section class="trade-card">
    <div class="trade-form">
      <label class="trade-field">
        <span>Акція</span>
        <div class="trade-asset">
          <img :src="company.logo" :alt="company.name" class="trade-asset__logo" />
          <div class="trade-asset__fixed">
            {{ company.name }} ({{ company.ticker }})
          </div>
        </div>
      </label>

      <label class="trade-field">
        <span>Валюта</span>
        <select v-model="form.currency" class="trade-input">
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </label>

      <label class="trade-field">
        <span>Скільки грошей</span>
        <input v-model="form.amount" type="number" min="0" class="trade-input" />
      </label>

      <label class="trade-field">
        <span>Скільки купити</span>
        <input v-model="form.quantity" type="number" min="0" step="0.01" class="trade-input" />
      </label>

      <label class="trade-field">
        <span>Тип купівлі</span>
        <select v-model="form.quantityMode" class="trade-input">
          <option value="whole">Ціла акція</option>
          <option value="partial">Частина акції</option>
        </select>
      </label>

      <label class="trade-field">
        <span>Ліміт ціни</span>
        <input v-model="form.limitPrice" type="number" min="0" step="0.01" class="trade-input" />
      </label>

      <div class="trade-row">
        <label class="trade-field">
          <span>Час</span>
          <input v-model="form.durationValue" type="number" min="1" class="trade-input" />
        </label>

        <label class="trade-field">
          <span>Одиниця</span>
          <select v-model="form.durationUnit" class="trade-input">
            <option
              v-for="unit in durationUnits"
              :key="unit"
              :value="unit"
            >
              {{ unit === 'hours' ? 'Години' : 'Дні' }}
            </option>
          </select>
        </label>
      </div>

      <button class="trade-submit" type="button" :disabled="!isValid" @click="createOrder">
        Створити заявку на купівлю
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
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: #11111a;
  color: var(--text-primary);
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
</style>