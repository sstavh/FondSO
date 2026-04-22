<script setup lang="ts">
import { computed, reactive } from 'vue'
import type {
  Currency,
  OrderDurationUnit,
  TradeOrderItem,
} from '../../data/userProfile'
import type { MarketCompany } from '~/data/marketCompanies'
import {
  holdingsStore,
  orderPreviewStore,
  sellOrdersStore,
} from '../../data/userProfile'

const props = defineProps<{
  company: MarketCompany
}>()

const currencies: Currency[] = ['USD', 'EUR', 'UAH', 'PLN']
const durationUnits: OrderDurationUnit[] = ['hours', 'days', 'unlimited']

const form = reactive({
  currency: 'USD' as Currency,
  quantity: '',
  limitPrice: '',
  durationValue: '',
  durationUnit: 'hours' as OrderDurationUnit,
})

const selectedHolding = computed(() => {
  return holdingsStore.find((item) => item.ticker === props.company.ticker) ?? null
})

const availableQuantity = computed(() => {
  return selectedHolding.value?.quantity ?? 0
})

const isValid = computed(() => {
  const base =
    props.company &&
    form.currency &&
    form.quantity &&
    Number(form.quantity) > 0 &&
    form.limitPrice &&
    Number(form.limitPrice) > 0 &&
    Number(form.quantity) <= availableQuantity.value

  if (!base) return false

  if (form.durationUnit === 'unlimited') return true

  return Boolean(form.durationValue && Number(form.durationValue) > 0)
})

const createOrder = () => {
  if (!isValid.value) return

  const now = new Date()
  let expiresAt: string | null = null

  if (form.durationUnit !== 'unlimited') {
    const expires = new Date(now)

    if (form.durationUnit === 'hours') {
      expires.setHours(expires.getHours() + Number(form.durationValue))
    } else {
      expires.setDate(expires.getDate() + Number(form.durationValue))
    }

    expiresAt = expires.toISOString()
  }

  const order: TradeOrderItem = {
    id: Date.now(),
    side: 'sell',
    assetName: props.company.name,
    ticker: props.company.ticker,
    logo: props.company.logo,
    currency: form.currency,
    amount: Number(form.quantity) * Number(form.limitPrice),
    quantity: Number(form.quantity),
    limitPrice: Number(form.limitPrice),
    durationUnit: form.durationUnit,
    durationValue: form.durationUnit === 'unlimited' ? null : Number(form.durationValue),
    createdAt: now.toISOString(),
    expiresAt,
    progress: 0,
    status: 'active',
  }

  sellOrdersStore.unshift(order)
  orderPreviewStore.order = order
  orderPreviewStore.isOpen = true

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
        <span>Скільки продати</span>
        <input v-model="form.quantity" type="number" min="0" step="0.01" class="trade-input" />
        <small class="trade-hint">
          Доступно: {{ availableQuantity }} шт.
        </small>
      </label>

      <label class="trade-field">
        <span>Ціна продажу</span>
        <input v-model="form.limitPrice" type="number" min="0" step="0.01" class="trade-input" />
      </label>

      <div class="trade-row">
        <label class="trade-field">
          <span>Термін</span>
          <select v-model="form.durationUnit" class="trade-input">
            <option
              v-for="unit in durationUnits"
              :key="unit"
              :value="unit"
            >
              {{
                unit === 'hours'
                  ? 'Години'
                  : unit === 'days'
                    ? 'Дні'
                    : 'Без обмеження'
              }}
            </option>
          </select>
        </label>

        <label class="trade-field" v-if="form.durationUnit !== 'unlimited'">
          <span>Кількість</span>
          <input v-model="form.durationValue" type="number" min="1" class="trade-input" />
        </label>
      </div>

      <button class="trade-submit" type="button" :disabled="!isValid" @click="createOrder">
        Створити заявку на продаж
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

.trade-hint {
  color: var(--text-secondary);
  font-size: 12px;
}
</style>