<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  balanceStore,
  transactionsStore,
} from '../data/userProfile'
import type { Currency } from '../data/userProfile'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const currencies: Currency[] = ['UAH', 'USD', 'EUR', 'PLN']

const form = reactive({
  amount: '',
  currency: balanceStore.currency as Currency,
  cardNumber: '',
  cardHolder: '',
  expiry: '',
  cvv: '',
})

const resetForm = () => {
  form.amount = ''
  form.currency = balanceStore.currency
  form.cardNumber = ''
  form.cardHolder = ''
  form.expiry = ''
  form.cvv = ''
}

watch(
  () => props.isOpen,
  (value) => {
    if (value) {
      form.currency = balanceStore.currency
    }
  }
)

const formattedCardNumber = computed({
  get: () => form.cardNumber,
  set: (value: string) => {
    form.cardNumber = value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim()
  },
})

const formattedExpiry = computed({
  get: () => form.expiry,
  set: (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)

    if (digits.length <= 2) {
      form.expiry = digits
    } else {
      form.expiry = `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
  },
})

const formattedCvv = computed({
  get: () => form.cvv,
  set: (value: string) => {
    form.cvv = value.replace(/\D/g, '').slice(0, 3)
  },
})

const numericAmount = computed(() => Number(form.amount || 0))

const hasEnoughBalance = computed(() => {
  return numericAmount.value > 0 && numericAmount.value <= balanceStore.balance
})

const isValid = computed(() => {
  return Boolean(
    form.amount &&
      Number(form.amount) > 0 &&
      form.currency &&
      form.cardNumber.replace(/\s/g, '').length === 16 &&
      form.cardHolder.trim().length >= 3 &&
      /^\d{2}\/\d{2}$/.test(form.expiry) &&
      form.cvv.length === 3 &&
      hasEnoughBalance.value
  )
})

const formatHistoryDate = () => {
  const now = new Date()

  return now.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
  })
}

const formatTransactionDate = () => {
  return new Date().toISOString().slice(0, 10)
}

const submitWithdraw = () => {
  if (!isValid.value) return

  const withdrawAmount = Number(form.amount)

  balanceStore.balance -= withdrawAmount
  balanceStore.currency = form.currency

  balanceStore.history.push({
    date: formatHistoryDate(),
    value: Number(balanceStore.balance.toFixed(2)),
  })

  transactionsStore.unshift({
    id: Date.now(),
    type: 'withdrawal',
    assetName: 'Виведення коштів',
    ticker: 'BALANCE',
    quantity: 1,
    amount: withdrawAmount,
    currency: form.currency,
    date: formatTransactionDate(),
    status: 'completed',
    note: 'Виведення на банківську картку',
  })

  resetForm()
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="withdraw-overlay"
      @click="emit('close')"
    >
      <div
        class="withdraw-popup"
        @click.stop
      >
        <div class="withdraw-popup__head">
          <div>
            <p class="withdraw-popup__eyebrow">Баланс</p>
            <h3 class="withdraw-popup__title">Виведення коштів</h3>
          </div>

          <button
            type="button"
            class="withdraw-popup__close"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <div class="withdraw-balance-box">
          <span>Доступний баланс</span>
          <strong>{{ balanceStore.balance.toFixed(2) }} {{ balanceStore.currency }}</strong>
        </div>

        <div class="withdraw-popup__form">
          <label class="withdraw-field">
            <span>Сума</span>
            <input
              v-model="form.amount"
              type="number"
              min="1"
              step="0.01"
              class="withdraw-input"
              placeholder="Введіть суму"
            />
          </label>

          <label class="withdraw-field">
            <span>Валюта</span>
            <select
              v-model="form.currency"
              class="withdraw-input"
            >
              <option
                v-for="currency in currencies"
                :key="currency"
                :value="currency"
              >
                {{ currency }}
              </option>
            </select>
          </label>

          <label class="withdraw-field withdraw-field--full">
            <span>Номер картки</span>
            <input
              v-model="formattedCardNumber"
              type="text"
              class="withdraw-input"
              placeholder="0000 0000 0000 0000"
            />
          </label>

          <label class="withdraw-field withdraw-field--full">
            <span>Власник картки</span>
            <input
              v-model="form.cardHolder"
              type="text"
              class="withdraw-input"
              placeholder="IVAN PETRENKO"
            />
          </label>

          <div class="withdraw-row">
            <label class="withdraw-field">
              <span>MM/YY</span>
              <input
                v-model="formattedExpiry"
                type="text"
                class="withdraw-input"
                placeholder="12/28"
              />
            </label>

            <label class="withdraw-field">
              <span>CVV</span>
              <input
                v-model="formattedCvv"
                type="password"
                class="withdraw-input"
                placeholder="***"
              />
            </label>
          </div>
        </div>

        <p v-if="form.amount && !hasEnoughBalance" class="withdraw-error">
          Недостатньо коштів на балансі.
        </p>

        <div class="withdraw-popup__bottom">
          <button
            type="button"
            class="withdraw-popup__cancel"
            @click="emit('close')"
          >
            Скасувати
          </button>

          <button
            type="button"
            class="withdraw-popup__submit"
            :disabled="!isValid"
            @click="submitWithdraw"
          >
            Вивести кошти
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.withdraw-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 400;
}

.withdraw-popup {
  width: 100%;
  max-width: 560px;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background: #11111a;
  box-shadow: var(--shadow-glass);
}

.withdraw-popup__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.withdraw-popup__eyebrow {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
}

.withdraw-popup__title {
  margin: 0;
  color: var(--text-primary);
  font-size: 26px;
  font-weight: 700;
}

.withdraw-popup__close {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: white;
  cursor: pointer;
}

.withdraw-balance-box {
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.03);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.withdraw-balance-box span {
  color: var(--text-secondary);
  font-size: 13px;
}

.withdraw-balance-box strong {
  color: var(--text-primary);
  font-size: 16px;
}

.withdraw-popup__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.withdraw-row {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.withdraw-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.withdraw-field--full {
  grid-column: 1 / -1;
}

.withdraw-field span {
  color: var(--text-secondary);
  font-size: 13px;
}

.withdraw-input {
  min-height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: #0e0e16;
  color: white;
  outline: none;
}

.withdraw-input:focus {
  border-color: var(--accent);
}

.withdraw-error {
  margin: 14px 0 0;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
}

.withdraw-popup__bottom {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.withdraw-popup__cancel,
.withdraw-popup__submit {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
}

.withdraw-popup__cancel {
  border: 1px solid var(--glass-border);
  background: transparent;
  color: white;
}

.withdraw-popup__submit {
  border: none;
  background: var(--accent);
  color: white;
}

.withdraw-popup__submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .withdraw-popup {
    padding: 18px;
  }

  .withdraw-popup__form,
  .withdraw-row {
    grid-template-columns: 1fr;
  }

  .withdraw-popup__bottom {
    flex-direction: column;
  }
}
</style>