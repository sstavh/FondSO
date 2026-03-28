<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">{{ isLogin ? 'Вхід' : 'Створити акаунт' }}</h2>
      <p class="auth-subtitle">
        {{ isLogin ? 'Увійдіть у свій акаунт' : 'Заповніть форму для реєстрації' }}
      </p>

      <form v-if="isLogin" class="auth-form" @submit.prevent="handleLogin">
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

        <p class="switch-text">
          Ще немає акаунта?
          <button type="button" class="switch-button" @click="switchMode(false)">
            Створити акаунт
          </button>
        </p>
      </form>

      <form v-else class="auth-form" @submit.prevent="handleRegister">
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
          <button type="button" class="switch-button" @click="switchMode(true)">
            Увійти
          </button>
        </p>
      </form>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const isLogin = ref<boolean>(true)
const message = ref<string>('')

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

const switchMode = (loginMode: boolean): void => {
  isLogin.value = loginMode
  message.value = ''
}

const handleLogin = async (): Promise<void> => {
  message.value = `Спроба входу для: ${loginForm.email}`

  // emit / api / store логіка тут
}

const handleRegister = async (): Promise<void> => {
  if (registerForm.password !== registerForm.confirmPassword) {
    message.value = 'Паролі не співпадають'
    return
  }

  message.value = `Акаунт для ${registerForm.email} готовий до створення`

  // emit / api / store логіка тут
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
  border: 1px solid var(--glass-border);
  background: var(--accent-light);
  color: var(--text-primary);
  font-size: var(--text-sm);
}

@media (max-width: 480px) {
  .auth-wrapper {
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