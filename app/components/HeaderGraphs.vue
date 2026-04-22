<script setup lang="ts">
import { useRouter } from 'vue-router'
import { userProfile } from '~/data/userProfile'

const router = useRouter()

const MAIN_HEADER_ROUTE = '/'

const goToView = (view: string) => {
  router.push({
    path: MAIN_HEADER_ROUTE,
    query: { view },
  })
}

const goToAccount = () => {
  router.push({
    path: MAIN_HEADER_ROUTE,
    query: { view: 'home', account: 'open' },
  })
}
</script>

<template>
    <div class="container">
  <header class="header-graphs">
    <div class="header-graphs__inner">
      <!-- LOGO -->
      <p class="header-graphs__logo">FondSO</p>

      <!-- MENU -->
      <nav class="header-graphs__nav">
        <button class="header-graphs__item" @click="goToView('home')">
          Головна
        </button>

        <button class="header-graphs__item" @click="goToView('balance')">
          Баланс
        </button>

        <button
          class="header-graphs__item"
          @click="goToView('portfolio-overview-2')"
        >
      Ціль
        </button>

        <button
          class="header-graphs__item"
          @click="goToView('portfolio-history')"
        >
          Історія
        </button>


    
      </nav>

      <!-- ACCOUNT -->
      <button
        class="header-graphs__account"
        @click="goToAccount"
      >
        <img
          :src="userProfile.avatar"
          :alt="`${userProfile.firstName} ${userProfile.lastName}`"
          class="header-graphs__avatar"
        />
      </button>
    </div>
  </header>
  </div>
</template>

<style scoped>
.container {
        width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.header-graphs {

  width: 100%;
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid var(--glass-border);
  background: var(--bg-main);
}

.header-graphs__inner {
  min-height: 84px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
}

.header-graphs__logo {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-2xl);
  line-height: 1;
  font-weight: 700;
  font-family: var(--font-main);
}

.header-graphs__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.header-graphs__item {
  min-height: 46px;
  padding: 0 16px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.header-graphs__item:hover {
  background: var(--glass-bg);
  color: var(--text-primary);
  border-color: var(--glass-border);
}

/* ACCOUNT */
.header-graphs__account {
  width: 52px;
  height: 52px;
  padding: 0;
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  background: var(--glass-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s ease;
}

.header-graphs__account:hover {
  transform: scale(1.05);
  border-color: var(--accent);
}

.header-graphs__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 1000px) {
  .header-graphs__inner {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 14px;
  }

  .header-graphs__nav {
    justify-content: flex-start;
  }

  .header-graphs__account {
    justify-self: flex-start;
  }
}
</style>