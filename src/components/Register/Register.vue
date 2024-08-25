<template>
  <div class="tw-min-h-screen tw-flex">
    <v-sheet class="mx-auto tw-rounded-md pa-12 pb-8" width="450">
      <h2
        class="tw-text-center tw-font-sacramento tw-font-light tw-text-[60px] tw-mb-1"
      >
        Register
      </h2>
      <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
        <div class="text-subtitle-1 text-medium-emphasis">
          Tài khoản<span class="tw-text-red-600 tw-ms-1">*</span>
        </div>
        <v-text-field
          density="compact"
          v-model="form.username"
          :rules="rules.username"
          placeholder="Nhập tên tài khoản"
          outlined
          required
          variant="outlined"
          color="primary"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">
          Email<span class="tw-text-red-600 tw-ms-1">*</span>
        </div>
        <v-text-field
          density="compact"
          v-model="form.email"
          :rules="rules.email"
          name="email"
          placeholder="Nhập email"
          outlined
          required
          variant="outlined"
          color="primary"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">
          Mật khẩu<span class="tw-text-red-600 tw-ms-1">*</span>
        </div>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          @click:append-inner="visible = !visible"
          density="compact"
          v-model="form.password"
          :rules="rules.password"
          placeholder="Nhập mật khẩu"
          outlined
          required
          variant="outlined"
          class="mt-2"
          color="primary"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis">
          Họ và tên<span class="tw-text-red-600 tw-ms-1">*</span>
        </div>
        <v-text-field
          density="compact"
          v-model="form.fullname"
          :rules="rules.fullName"
          placeholder="Nhập họ và tên"
          outlined
          required
          variant="outlined"
          color="primary"
        ></v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">
          Số điện thoại<span class="tw-text-red-600 tw-ms-1">*</span>
        </div>
        <v-text-field
          density="compact"
          v-model="form.phoneNumber"
          :rules="rules.phoneNumber"
          placeholder="Nhập số điện thoại"
          required
          outlined
          clearable
          variant="outlined"
          color="primary"
        ></v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">
          Ngày sinh<span class="tw-text-red-600 tw-ms-1">*</span>
        </div>
        <VueDatePicker
          v-model="form.dateOfBirth"
          :format="dateFormat"
          :rules="rules.birthdate"
          label="Ngày sinh"
          :input-props="{ placeholder: 'yyyy-mm-dd' }"
          placeholder="yyyy-mm-dd"
          class="tw-mb-4"
        />

        <div class="text-subtitle-1 text-medium-emphasis">
          Giới tính<span class="tw-text-red-600 tw-ms-1">*</span>
        </div>
        <v-radio-group v-model="form.gender" :rules="rules.gender" inline>
          <v-radio label="Nam" value="1"></v-radio>
          <v-radio label="Nữ" value="2"></v-radio>
          <v-radio :value="3" label="Unknow"></v-radio>
        </v-radio-group>

        <div class="text-subtitle-1 text-medium-emphasis">
          Đội ngũ<span class="tw-text-red-600 tw-ms-1">*</span>
        </div>
        <v-select
          density="compact"
          :items="teams"
          item-value="id"
          item-title="name"
          variant="outlined"
          v-model="form.teamId"
          :rules="rules.team"
        ></v-select>
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
          &nbsp;<span v-if="!loading">Register</span>
        </v-btn>
        <div class="text-center">
          <router-link class="text-blue text-decoration-none" to="/login">
            Back to login <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import * as authService from '@/apis/authServices'
import * as teamService from '@/apis/teamServices'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'

const toast = useToast()
const router = useRouter()

const form = ref({
  username: '',
  password: '',
  email: '',
  fullname: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: '',
  teamId: '',
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
  email: [
    (value) => !!value || 'Email là bắt buộc',
    (value) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'Email không hợp lệ'
    },
  ],
  fullName: [(v) => !!v || 'Họ và tên là bắt buộc'],
  gender: [(v) => !!v || 'Giới tính là bắt buộc'],
  team: [(v) => !!v || 'Đội ngũ là bắt buộc'],
  phoneNumber: [
    (value) => !!value || 'Số điện thoại là bắt buộc',
    (value) => {
      const pattern =
        /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/
      return pattern.test(value) || 'Số điện thoại không hợp lệ'
    },
  ],
  birthdate: [
    (value) => !!value || 'Ngày sinh là bắt buộc',
    (value) => {
      const isValidDate = dayjs(value, 'yyyy-MM-dd', true).isValid()
      return isValidDate || 'Ngày sinh không hợp lệ (Định dạng: yyyy-MM-dd)'
    },
    (value) => {
      const age = dayjs().diff(dayjs(value), 'year')
      return age >= 18 || 'Bạn phải trên 18 tuổi'
    },
  ],
})
const teams = ref([])
const formRef = ref(null)
const visible = ref(false)
const dateFormat = 'yyyy-mm-dd'
const formValid = ref(false)
const loading = ref(false)

const fetchTeams = async () => {
  const res = await teamService.getTeamAPI()
  teams.value = res
}

const onSubmit = async () => {
  if (formRef.value.validate()) {
    loading.value = true
  }
  try {
    const response = await authService.registerAPI(form.value)
    if (response.status === 200) {
      toast.success(response.message)
      router.push({ name: 'activate' })
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchTeams()
})
</script>
