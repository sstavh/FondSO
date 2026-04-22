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

const touched = reactive({
  amount: false,
  cardNumber: false,
  cardHolder: false,
  expiry: false,
  cvv: false,
})

const resetForm = () => {
  form.amount = ''
  form.currency = balanceStore.currency
  form.cardNumber = ''
  form.cardHolder = ''
  form.expiry = ''
  form.cvv = ''

  touched.amount = false
  touched.cardNumber = false
  touched.cardHolder = false
  touched.expiry = false
  touched.cvv = false
}

watch(
  () => props.isOpen,
  (value) => {
    if (value) {
      form.currency = balanceStore.currency
    } else {
      resetForm()
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

const formattedCardHolder = computed({
  get: () => form.cardHolder,
  set: (value: string) => {
    form.cardHolder = value
      .replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ\s'-]/g, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, 40)
  },
})

const amountError = computed(() => {
  if (!touched.amount) return ''
  if (!form.amount) return 'Вкажіть суму.'
  if (!/^\d+(\.\d{1,2})?$/.test(form.amount)) return 'Дозволено тільки числа і до 2 знаків після коми.'
  if (Number(form.amount) <= 0) return 'Сума повинна бути більшою за 0.'
  return ''
})

const cardNumberError = computed(() => {
  if (!touched.cardNumber) return ''
  const digits = form.cardNumber.replace(/\s/g, '')
  if (!digits) return 'Вкажіть номер картки.'
  if (digits.length !== 16) return 'Номер картки повинен містити 16 цифр.'
  return ''
})

const cardHolderError = computed(() => {
  if (!touched.cardHolder) return ''
  const value = form.cardHolder.trim()
  if (!value) return 'Вкажіть імʼя власника.'
  if (value.length < 3) return 'Мінімум 3 символи.'
  if (!/^[A-Za-zА-Яа-яІіЇїЄєҐґ\s'-]+$/.test(value)) return 'Дозволені тільки літери, пробіл, апостроф і дефіс.'
  return ''
})

const expiryError = computed(() => {
  if (!touched.expiry) return ''
  if (!form.expiry) return 'Вкажіть термін дії.'
  if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return 'Формат повинен бути MM/YY.'

  const [monthText] = form.expiry.split('/')
  const month = Number(monthText)

  if (month < 1 || month > 12) return 'Місяць повинен бути від 01 до 12.'
  return ''
})

const cvvError = computed(() => {
  if (!touched.cvv) return ''
  if (!form.cvv) return 'Вкажіть CVV.'
  if (!/^\d{3}$/.test(form.cvv)) return 'CVV повинен містити 3 цифри.'
  return ''
})

const isValid = computed(() => {
  return Boolean(
    !amountError.value &&
      !cardNumberError.value &&
      !cardHolderError.value &&
      !expiryError.value &&
      !cvvError.value &&
      form.amount &&
      form.currency &&
      form.cardNumber &&
      form.cardHolder &&
      form.expiry &&
      form.cvv
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

const submitRefill = () => {
  touched.amount = true
  touched.cardNumber = true
  touched.cardHolder = true
  touched.expiry = true
  touched.cvv = true

  if (!isValid.value) return

  const refillAmount = Number(form.amount)

  balanceStore.balance += refillAmount
  balanceStore.currency = form.currency

  balanceStore.history.push({
    date: formatHistoryDate(),
    value: Number(balanceStore.balance.toFixed(2)),
  })

  transactionsStore.unshift({
    id: Date.now(),
    type: 'deposit',
    assetName: 'Поповнення балансу',
    ticker: 'BALANCE',
    quantity: 1,
    amount: refillAmount,
    currency: form.currency,
    date: formatTransactionDate(),
    status: 'completed',
    note: 'Поповнення з банківської картки',
  })

  resetForm()
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="refill-overlay"
      @click="emit('close')"
    >
      <div
        class="refill-popup"
        @click.stop
      >
        <div class="refill-popup__head">
          <div>
            <p class="refill-popup__eyebrow">Баланс</p>
            <h3 class="refill-popup__title">
              Поповнення рахунку
            </h3>
          </div>

          <button
            type="button"
            class="refill-popup__close"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <div class="refill-popup__form">
          <label class="refill-field">
            <span>Сума</span>

            <input
              v-model="form.amount"
              type="text"
              inputmode="decimal"
              maxlength="12"
              class="refill-input"
              placeholder="Введіть суму"
              @blur="touched.amount = true"
            />
            <small v-if="amountError" class="refill-error">{{ amountError }}</small>
          </label>

          <label class="refill-field">
            <span>Валюта</span>

            <select
              v-model="form.currency"
              class="refill-input"
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

          <label class="refill-field refill-field--full">
            <span>Номер картки</span>

            <input
              v-model="formattedCardNumber"
              type="text"
              inputmode="numeric"
              maxlength="19"
              class="refill-input"
              placeholder="0000 0000 0000 0000"
              @blur="touched.cardNumber = true"
            />
            <small v-if="cardNumberError" class="refill-error">{{ cardNumberError }}</small>
          </label>

          <label class="refill-field refill-field--full">
            <span>Власник картки</span>

            <input
              v-model="formattedCardHolder"
              type="text"
              maxlength="40"
              class="refill-input"
              placeholder="IVAN PETRENKO"
              @blur="touched.cardHolder = true"
            />
            <small v-if="cardHolderError" class="refill-error">{{ cardHolderError }}</small>
          </label>

          <div class="refill-row">
            <label class="refill-field">
              <span>MM/YY</span>

              <input
                v-model="formattedExpiry"
                type="text"
                inputmode="numeric"
                maxlength="5"
                class="refill-input"
                placeholder="12/28"
                @blur="touched.expiry = true"
              />
              <small v-if="expiryError" class="refill-error">{{ expiryError }}</small>
            </label>

            <label class="refill-field">
              <span>CVV</span>

              <input
                v-model="formattedCvv"
                type="password"
                inputmode="numeric"
                maxlength="3"
                class="refill-input"
                placeholder="***"
                @blur="touched.cvv = true"
              />
              <small v-if="cvvError" class="refill-error">{{ cvvError }}</small>
            </label>
          </div>
        </div>

        <div class="refill-popup__bottom">
          <button
            type="button"
            class="refill-popup__cancel"
            @click="emit('close')"
          >
            Скасувати
          </button>

          <button
            type="button"
            class="refill-popup__submit"
            :disabled="!isValid"
            @click="submitRefill"
          >
            Поповнити
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.refill-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 400;
}

.refill-popup {
  width: 100%;
  max-width: 560px;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background: #11111a;
  box-shadow: var(--shadow-glass);
}

.refill-popup__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.refill-popup__eyebrow {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
}

.refill-popup__title {
  margin: 0;
  color: var(--text-primary);
  font-size: 26px;
  font-weight: 700;
}

.refill-popup__close {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: white;
  cursor: pointer;
}

.refill-popup__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.refill-row {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.refill-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.refill-field--full {
  grid-column: 1 / -1;
}

.refill-field span {
  color: var(--text-secondary);
  font-size: 13px;
}

.refill-input {
  min-height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: #0e0e16;
  color: white;
  outline: none;
}

.refill-input:focus {
  border-color: var(--accent);
}

.refill-error {
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
}

.refill-popup__bottom {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.refill-popup__cancel,
.refill-popup__submit {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
}

.refill-popup__cancel {
  border: 1px solid var(--glass-border);
  background: transparent;
  color: white;
}

.refill-popup__submit {
  border: none;
  background: var(--accent);
  color: white;
}

.refill-popup__submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .refill-popup {
    padding: 18px;
  }

  .refill-popup__form,
  .refill-row {
    grid-template-columns: 1fr;
  }

  .refill-popup__bottom {
    flex-direction: column;
  }
}
</style>