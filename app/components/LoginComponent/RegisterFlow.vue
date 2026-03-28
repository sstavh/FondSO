<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userProfile } from '~/data/userProfile'
import RegisterProgress from '~/components/LoginComponent/RegisterProgress.vue'
import RegisterStepCountry from '~/components/LoginComponent/RegisterStepCountry.vue'
import RegisterStepPurpose from '~/components/LoginComponent/RegisterStepPurpose.vue'
import RegisterStepProfile from '~/components/LoginComponent/RegisterStepProfile.vue'

const router = useRouter()
const currentStep = ref(2)

const handleCountryNext = (country: string) => {
  userProfile.country = country
  currentStep.value = 3
}

const handlePurposeNext = (purpose: string) => {
  userProfile.purpose = purpose
  currentStep.value = 4
}

const handleProfileNext = async (payload: {
  firstName: string
  lastName: string
  birthDate: string
  phone: string
  privacyAccepted: boolean
}) => {
  userProfile.firstName = payload.firstName
  userProfile.lastName = payload.lastName
  userProfile.birthDate = payload.birthDate
  userProfile.phone = payload.phone
  userProfile.registrationCompleted = true

  await router.push('/')
}
</script>

<template>
  <Teleport to="body">
    <section class="flow-overlay">
      <div class="flow-container">
        <div class="flow-card">
          <RegisterProgress :current-step="currentStep" :total-steps="4" />

          <RegisterStepCountry
            v-if="currentStep === 2"
            @next="handleCountryNext"
          />

          <RegisterStepPurpose
            v-else-if="currentStep === 3"
            @next="handlePurposeNext"
          />

          <RegisterStepProfile
            v-else-if="currentStep === 4"
            @next="handleProfileNext"
          />
        </div>
      </div>
    </section>
  </Teleport>
</template>

<style scoped>
.flow-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow-y: auto;
}

.flow-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
}

.flow-card {
  width: 100%;
  max-width: 760px;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  background: var(--bg-main);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
}

@media (max-width: 640px) {
  .flow-container {
    padding: var(--space-md);
  }

  .flow-card {
    padding: var(--space-lg);
  }
}
</style>