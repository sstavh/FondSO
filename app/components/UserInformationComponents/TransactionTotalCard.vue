<script setup lang="ts">
import { computed } from 'vue'
import { transactionsStore } from '~/data/userProfile'

const completedTransactions = computed(() =>
  transactionsStore.filter((item) => item.status === 'completed')
)

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatType = (type: string) => {
  const map: Record<string, string> = {
    deposit: 'Поповнення',
    withdrawal: 'Виведення',
    transfer: 'Переказ',
    payment: 'Оплата',
  }

  return map[type] || type
}

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    completed: 'Проведено',
    pending: 'В обробці',
    failed: 'Помилка',
  }

  return map[status] || status
}
</script>

<template>
  <section class="transactions-card">
    <div class="transactions-card__head">
      <div>
        <p class="transactions-card__label">Проведені транзакції</p>
        <h2 class="transactions-card__title">Історія операцій</h2>
      </div>

      <div class="transactions-card__count">
        {{ completedTransactions.length }} операцій
      </div>
    </div>

    <div v-if="completedTransactions.length" class="transactions-list">
      <div
        v-for="transaction in completedTransactions"
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="transaction-item__left">
          <p class="transaction-item__title">
            {{ formatType(transaction.type) }}
          </p>

          <p class="transaction-item__meta">
            {{ transaction.date }} · {{ formatStatus(transaction.status) }}
          </p>
        </div>

        <div class="transaction-item__right">
          {{ formatCurrency(transaction.amount, transaction.currency) }}
        </div>
      </div>
    </div>

    <div v-else class="transactions-empty">
      Транзакцій поки немає
    </div>
  </section>
</template>

<style scoped>
.transactions-card {
  width: 100%;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.transactions-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.transactions-card__label {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.transactions-card__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.transactions-card__count {
  padding: 10px 14px;
  border-radius: 999px;
  background: var(--accent-light);
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  white-space: nowrap;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
}

.transaction-item__left {
  min-width: 0;
}

.transaction-item__title {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.transaction-item__meta {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.transaction-item__right {
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  white-space: nowrap;
}

.transactions-empty {
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  text-align: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.03);
}

@media (max-width: 700px) {
  .transactions-card__head {
    flex-direction: column;
  }

  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .transaction-item__right {
    white-space: normal;
  }
}
</style>