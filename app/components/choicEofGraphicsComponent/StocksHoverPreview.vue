<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { NuxtLink } from '#components'
import type { MarketCompany } from '~/data/marketCompanies'
import { marketCompanies } from '~/data/marketCompanies'

const props = withDefaults(
  defineProps<{
    companies?: MarketCompany[]
  }>(),
  {
    companies: () => marketCompanies,
  }
)

const emit = defineEmits<{
  (e: 'update:company', company: MarketCompany): void
}>()

const hoveredCompanyId = ref<number>(props.companies[0]?.id ?? 1)

const previewCompany = computed(() => {
  return (
    props.companies.find((company) => company.id === hoveredCompanyId.value) ??
    props.companies[0]
  )
})

const onHoverCompany = (companyId: number) => {
  hoveredCompanyId.value = companyId
}

watch(previewCompany, (company) => {
  if (company) {
    emit('update:company', company)
  }
})

onMounted(() => {
  if (previewCompany.value) {
    emit('update:company', previewCompany.value)
  }
})
</script>

<template>
  <section class="stocks-preview">
    <div class="stocks-preview__left">
      <div class="stocks-preview__left-head">
        <p class="stocks-preview__label">Акції</p>
        <h3 class="stocks-preview__title">Список компаній</h3>
      </div>

      <div class="stocks-preview__list">
        <NuxtLink
          v-for="company in companies"
          :key="company.id"
          class="stock-item"
          :class="{ active: previewCompany?.id === company.id }"
          :to="`/stocks/${company.ticker.toLowerCase()}`"
          @mouseenter="onHoverCompany(company.id)"
        >
          <div class="stock-item__left">
            <div class="stock-item__logo-wrap">
              <img
                :src="company.logo"
                :alt="company.name"
                class="stock-item__logo"
              />
            </div>

            <div class="stock-item__info">
              <p class="stock-item__name">{{ company.name }}</p>
              <p class="stock-item__ticker">{{ company.ticker }}</p>
            </div>
          </div>

          <span class="stock-item__arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stocks-preview__left {
  height: 500px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
}

.stocks-preview__left-head {
  flex-shrink: 0;
  margin-bottom: 14px;
}

.stocks-preview__label {
  margin: 0 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.stocks-preview__title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.stocks-preview__list {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stock-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
  color: inherit;
  text-decoration: none;
  transition: 0.22s ease;
}

.stock-item:hover,
.stock-item.active {
  background: var(--accent-light);
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateX(4px);
}

.stock-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.stock-item__logo-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.stock-item__logo {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.stock-item__name {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.stock-item__ticker {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.stock-item__arrow {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  flex-shrink: 0;
}
</style>