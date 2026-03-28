import { reactive } from 'vue'

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  avatar: string
  country: string
  purpose: string
  birthDate: string
  phone: string
  registrationCompleted: boolean
}

export const userProfile = reactive<UserProfile>({
  firstName: '',
  lastName: '',
  email: '',
  avatar: '/images/avatar.jpg',
  country: '',
  purpose: '',
  birthDate: '',
  phone: '',
  registrationCompleted: false,
})