<template>
  <div class="tw-h-screen tw-flex">
    <v-sheet class="tw-mx-auto tw-my-auto tw-rounded-md pa-12 pb-8" width="448">
      <h2
        class="tw-text-center tw-font-sacramento tw-font-light tw-text-[60px] tw-mb-1"
      >
        Login
      </h2>
      <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>
        <v-text-field
          density="compact"
          v-model="form.username"
          :rules="rules.username"
          outlined
          required
          variant="outlined"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between tw-mt-3"
        >
          Password

          <router-link
            class="text-caption text-decoration-none text-blue"
            to="/forgot-password"
          >
            Forgot login password?</router-link
          >
        </div>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          @click:append-inner="visible = !visible"
          density="compact"
          v-model="form.password"
          :rules="rules.password"
          outlined
          required
          variant="outlined"
        ></v-text-field>

        <v-btn
          type="submit"
          class="mb-8 mt-4"
          color="blue"
          size="large"
          variant="tonal"
          block
          :disabled="!formValid || loading"
        >
          <font-awesome-icon v-if="loading" :icon="['fas', 'sync-alt']" spin />
          &nbsp;<span v-if="!loading">Log In</span>
        </v-btn>
        <v-card-text class="text-center">
          <router-link class="text-blue text-decoration-none" to="/register">
            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </v-card-text>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const visible = ref(false)
const formValid = ref(false)
const loading = ref(false)
const formRef = ref(null)
const form = ref({
  username: '',
  password: '',
})
const rules = ref({
  username: [
    (value) => !!value || 'Tên đăng nhập là bắt buộc',
    (value) => (value && value.length >= 3) || 'Nhập tối thiểu 3 kí tự',
  ],
  password: [
    (value) => !!value || 'Mật khẩu là bắt buộc',
    (value) => (value && value.length >= 6) || 'Nhập tối thiểu 6 kí tự',
  ],
})

const onSubmit = async () => {
  if (formRef.value.validate()) {
    loading.value = true
  }
  try {
    const response = await authStore.login(form.value)
    if (response.status === 200) {
      toast.success(response.message)
      router.push({ name: 'dashboard' })
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>
