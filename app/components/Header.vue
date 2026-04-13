<script lang="ts" setup>
import { computed, ref } from 'vue'

import HomeSection from './HomeSection.vue'
import PortfolioOverview from './testComponents/PortfolioOverview.vue'
import PortfolioOverview2 from './testComponents/PortfolioOverview.vue'
import PortfolioHistory from './testComponents/PortfolioHistory.vue'
import PortfolioSettings from './testComponents/PortfolioSettings.vue'
import TradingSection from './testComponents/TradingSection.vue'
import AccountPopup from '~/components/AccountPopup.vue'
import { userProfile } from '~/data/userProfile'

type ViewKey =
  | 'home'
  | 'balance'
  | 'portfolio-overview-2'
  | 'portfolio-history'
  | 'agreements'
  | 'trading'

const isPortfolioOpen = ref(false)
const isAccountPopupOpen = ref(false)
const activeView = ref<ViewKey>('home')

const togglePortfolio = () => {
  isPortfolioOpen.value = !isPortfolioOpen.value
}

const selectView = (view: ViewKey) => {
  activeView.value = view
}

const goHome = () => {
  activeView.value = 'home'
}

const openAccountPopup = () => {
  isAccountPopupOpen.value = true
}

const closeAccountPopup = () => {
  isAccountPopupOpen.value = false
}

const currentComponent = computed(() => {
  const map: Record<ViewKey, any> = {
    home: HomeSection,
    balance: PortfolioOverview,
    'portfolio-overview-2': PortfolioOverview2,
    'portfolio-history': PortfolioHistory,
    agreements: PortfolioSettings,
    trading: TradingSection,
  }

  return map[activeView.value]
})
</script>

<template>
  <div class="layout-shell">
    <aside class="sidebar">
      <div class="sidebar-inner">
        <div>
          <p class="sidebar-logo">FondSO</p>

          <ul class="nav-list">
            <li
              class="nav-item"
              :class="{ active: activeView === 'home' }"
              @click="goHome"
            >
              <div class="nav-item__left">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9 21V14H15V21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span>Головна</span>
              </div>
            </li>

            <li class="nav-item" @click="togglePortfolio">
              <div class="nav-item__left">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="5"
                      rx="1.5"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <rect
                      x="3"
                      y="15"
                      width="18"
                      height="5"
                      rx="1.5"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                </span>
                <span>Портфоліо</span>
              </div>

              <span class="nav-arrow" :class="{ 'nav-arrow--open': isPortfolioOpen }">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </li>

            <ul v-if="isPortfolioOpen" class="subnav-list">
              <li
                class="subnav-item"
                :class="{ active: activeView === 'balance' }"
                @click="selectView('balance')"
              >
                Баланс
              </li>

              <li
                class="subnav-item"
                :class="{ active: activeView === 'portfolio-overview-2' }"
                @click="selectView('portfolio-overview-2')"
              >
                Огляд 2
              </li>

              <li
                class="subnav-item"
                :class="{ active: activeView === 'portfolio-history' }"
                @click="selectView('portfolio-history')"
              >
                Історія
              </li>

              <li
                class="subnav-item"
                :class="{ active: activeView === 'agreements' }"
                @click="selectView('agreements')"
              >
                Огуди
              </li>
            </ul>

            <li
              class="nav-item"
              :class="{ active: activeView === 'trading' }"
              @click="selectView('trading')"
            >
              <div class="nav-item__left">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 17L10 11L13 14L20 7"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15 7H20V12"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span>Трейдинг</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="sidebar-bottom">
          <button class="account-card" type="button" @click="openAccountPopup">
            <div class="account-avatar-wrap">
              <img
                :src="userProfile.avatar"
                :alt="`${userProfile.firstName} ${userProfile.lastName}`"
                class="account-avatar"
              />
            </div>

            <div class="account-info">
              <p class="account-name">
                {{ userProfile.firstName || 'Імʼя' }} {{ userProfile.lastName || 'Прізвище' }}
              </p>
              <p class="account-email">
                {{ userProfile.email || 'email@example.com' }}
              </p>
            </div>

            <span class="account-arrow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </aside>

    <AccountPopup
      :is-open="isAccountPopupOpen"
      :user-profile="userProfile"
      @close="closeAccountPopup"
    />

    <main class="content-section">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<style scoped>
.layout-shell {
  height: 100vh;
  display: grid;
  grid-template-columns: 300px 1fr;
  background: var(--bg-main);
  overflow: hidden;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid var(--glass-border);
  background: var(--bg-main);
  overflow: hidden;
}

.sidebar-inner {
  height: 100vh;
  padding: 32px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-logo {
  margin: 0 0 34px;
  color: var(--text-primary);
  font-size: var(--text-2xl);
  line-height: 1;
  font-weight: 700;
  font-family: var(--font-main);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  min-height: 64px;
  padding: 0 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  border: 1px solid transparent;
  background: transparent;
}

.nav-item:hover {
  background: var(--glass-bg);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--glass-bg);
  color: var(--text-primary);
  border-color: var(--glass-border);
}

.nav-item__left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  font-size: 18px;
  font-weight: 600;
  font-family: var(--font-main);
}

.nav-icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon svg {
  width: 28px;
  height: 28px;
}

.nav-arrow {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.nav-arrow svg {
  width: 22px;
  height: 22px;
}

.nav-arrow--open {
  transform: rotate(180deg);
}

.subnav-list {
  list-style: none;
  margin: -4px 0 4px;
  padding: 0 0 0 44px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subnav-item {
  min-height: 42px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: var(--text-base);
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}

.subnav-item:hover {
  background: var(--glass-bg);
  color: var(--text-primary);
}

.subnav-item.active {
  background: var(--glass-bg);
  color: var(--text-primary);
}

.sidebar-bottom {
  padding-top: 20px;
}

.account-card {
  width: 100%;
  padding: 14px;
  border-radius: 22px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  box-shadow: var(--shadow-glass);
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-primary);
  cursor: pointer;
}

.account-avatar-wrap {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
}

.account-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.account-info {
  min-width: 0;
  flex: 1;
  text-align: left;
}

.account-name {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account-email {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account-arrow {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.account-arrow svg {
  width: 20px;
  height: 20px;
}

.content-section {
  min-width: 0;
  height: 100vh;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
}

@media (max-width: 900px) {
  .layout-shell {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }

  .sidebar {
    position: relative;
    height: auto;
  }

  .sidebar-inner {
    height: auto;
  }

  .content-section {
    height: auto;
    overflow: visible;
  }
}
</style>