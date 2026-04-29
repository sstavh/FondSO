<template>
  <RegisterFlow v-if="showRegisterSteps" />

  <div v-else class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">
        {{
          authMode === 'login'
            ? 'Вхід'
            : authMode === 'register'
              ? 'Створити акаунт'
              : 'Зміна пароля'
        }}
      </h2>

      <p class="auth-subtitle">
        {{
          authMode === 'login'
            ? 'Увійдіть у свій акаунт'
            : authMode === 'register'
              ? 'Заповніть форму для реєстрації'
              : 'Вкажіть email та створіть новий пароль'
        }}
      </p>

      <!-- LOGIN -->
      <form v-if="authMode === 'login'" class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input
            id="login-email"
            v-model="loginForm.email"
            type="email"
            placeholder="example@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="login-password">Пароль</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            placeholder="Введіть пароль"
            required
          />
        </div>

        <button type="submit" class="auth-button">Увійти</button>

        <button
          type="button"
          class="forgot-button"
          @click="switchMode('reset')"
        >
          Забули пароль?
        </button>

        <p class="switch-text">
          Ще немає акаунта?
          <button type="button" class="switch-button" @click="switchMode('register')">
            Створити акаунт
          </button>
        </p>
      </form>

      <!-- REGISTER -->
      <form v-else-if="authMode === 'register'" class="auth-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="register-name">Ім'я</label>
          <input
            id="register-name"
            v-model="registerForm.name"
            type="text"
            placeholder="Ваше ім'я"
            required
          />
        </div>

        <div class="form-group">
          <label for="register-email">Email</label>
          <input
            id="register-email"
            v-model="registerForm.email"
            type="email"
            placeholder="example@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="register-password">Пароль</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            placeholder="Створіть пароль"
            required
          />
        </div>

        <div class="form-group">
          <label for="register-confirm-password">Повторіть пароль</label>
          <input
            id="register-confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Повторіть пароль"
            required
          />
        </div>

        <button type="submit" class="auth-button">Зареєструватися</button>

        <p class="switch-text">
          Уже є акаунт?
          <button type="button" class="switch-button" @click="switchMode('login')">
            Увійти
          </button>
        </p>
      </form>

      <!-- RESET PASSWORD -->
      <form v-else class="auth-form" @submit.prevent="handlePasswordChange">
        <div class="form-group">
          <label for="reset-email">Email акаунта</label>
          <input
            id="reset-email"
            v-model="resetForm.email"
            type="email"
            placeholder="example@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="new-password">Новий пароль</label>
          <input
            id="new-password"
            v-model="resetForm.newPassword"
            type="password"
            placeholder="Новий пароль"
            required
          />
          <small class="form-hint">Мінімум 6 символів</small>
        </div>

        <div class="form-group">
          <label for="confirm-new-password">Повторіть новий пароль</label>
          <input
            id="confirm-new-password"
            v-model="resetForm.confirmNewPassword"
            type="password"
            placeholder="Повторіть новий пароль"
            required
          />
        </div>

        <button type="submit" class="auth-button">Змінити пароль</button>

        <p class="switch-text">
          Згадали пароль?
          <button type="button" class="switch-button" @click="switchMode('login')">
            Повернутися до входу
          </button>
        </p>
      </form>

      <p v-if="message" class="message" :class="{ 'message--error': isError }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { userProfile } from '~/data/userProfile'
import RegisterFlow from '~/components/LoginComponent/RegisterFlow.vue'

type AuthMode = 'login' | 'register' | 'reset'

const authMode = ref<AuthMode>('login')
const message = ref('')
const isError = ref(false)
const showRegisterSteps = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const resetForm = reactive({
  email: '',
  newPassword: '',
  confirmNewPassword: '',
})

const clearMessage = () => {
  message.value = ''
  isError.value = false
}

const switchMode = (mode: AuthMode): void => {
  authMode.value = mode
  clearMessage()
}

const setError = (text: string) => {
  message.value = text
  isError.value = true
}

const setSuccess = (text: string) => {
  message.value = text
  isError.value = false
}

const handleLogin = async (): Promise<void> => {
  if (!loginForm.email.trim()) {
    setError('Вкажіть email')
    return
  }

  if (!loginForm.password.trim()) {
    setError('Вкажіть пароль')
    return
  }

  setSuccess(`Спроба входу для: ${loginForm.email}`)
}

const handleRegister = async (): Promise<void> => {
  if (!registerForm.name.trim()) {
    setError('Вкажіть імʼя')
    return
  }

  if (!registerForm.email.trim()) {
    setError('Вкажіть email')
    return
  }

  if (registerForm.password.length < 6) {
    setError('Пароль повинен містити мінімум 6 символів')
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    setError('Паролі не співпадають')
    return
  }

  userProfile.firstName = registerForm.name
  userProfile.email = registerForm.email

  clearMessage()
  showRegisterSteps.value = true
}

const handlePasswordChange = async (): Promise<void> => {
  if (!resetForm.email.trim()) {
    setError('Вкажіть email акаунта')
    return
  }

  if (resetForm.newPassword.length < 6) {
    setError('Новий пароль повинен містити мінімум 6 символів')
    return
  }

  if (resetForm.newPassword !== resetForm.confirmNewPassword) {
    setError('Нові паролі не співпадають')
    return
  }

  resetForm.email = ''
  resetForm.newPassword = ''
  resetForm.confirmNewPassword = ''

  authMode.value = 'login'
  setSuccess('Пароль успішно змінено. Тепер увійдіть з новим паролем.')
}
</script>

<style scoped>
.auth-wrapper {
  width: 600px;
  display: flex;
  align-items: center;
  padding: var(--space-lg);
  font-family: var(--font-main);
}

.auth-card {
  width: 100%;
  max-width: 440px;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.auth-title {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-2xl);
  font-weight: 700;
}

.auth-subtitle {
  margin: var(--space-sm) 0 var(--space-lg);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-group label {
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: 600;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-main);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.form-group input::placeholder {
  color: var(--text-secondary);
}

.form-group input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-light);
}

.form-hint {
  color: var(--text-secondary);
  font-size: 12px;
}

.auth-button {
  width: 100%;
  margin-top: var(--space-xs);
  padding: 13px 16px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--accent);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-weight: 700;
  font-family: var(--font-main);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.auth-button:hover {
  background: var(--accent-hover);
  box-shadow: 0 10px 24px var(--accent-light);
}

.auth-button:active {
  transform: scale(0.985);
}

.forgot-button {
  width: fit-content;
  margin: -4px auto 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-main);
  cursor: pointer;
}

.forgot-button:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

.switch-text {
  margin: 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.switch-button {
  margin-left: var(--space-xs);
  padding: 0;
  border: none;
  background: transparent;
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-main);
  cursor: pointer;
}

.switch-button:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

.message {
  margin-top: var(--space-md);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(74, 222, 128, 0.28);
  background: rgba(74, 222, 128, 0.12);
  color: #86efac;
  font-size: var(--text-sm);
}

.message--error {
  border-color: rgba(248, 113, 113, 0.28);
  background: rgba(248, 113, 113, 0.12);
  color: #fca5a5;
}

@media (max-width: 480px) {
  .auth-wrapper {
    width: 100%;
    padding: var(--space-md);
  }

  .auth-card {
    padding: var(--space-lg);
    border-radius: var(--radius-md);
  }

  .auth-title {
    font-size: var(--text-xl);
  }
}
</style>