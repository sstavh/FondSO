<script setup lang="ts">
import Header from '~/components/Header.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentView = (route.query.view as string) || 'home'
</script>

<template>
  <Header :start-view="currentView" />
</template>

<style scoped>
.container {
  padding-top: 30px;
  margin-left: 330px;
}
</style>