<template>
  <div>
    <main>
      <NuxtPage />
    </main>
    <OrderToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useStore } from '~/composables/useStore'
import OrderToast from '~/components/OrderToast.vue'

const auth = useAuth()
const store = useStore()

onMounted(async () => {
  auth.init()
  if (auth.isLoggedIn.value) {
    await store.loadAll()
  }
})
</script>

<style scoped>
</style>
