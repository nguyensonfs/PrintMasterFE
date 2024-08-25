<template>
  <div class="tw-h-screen tw-flex">
    <v-sheet class="mx-auto tw-my-auto tw-rounded-md pa-12 pb-8" width="448">
      <h2 class="tw-text-center tw-font-sacramento tw-font-light tw-text-[60px] tw-mb-1">
        Confirm Change Password
      </h2>
      <v-form @submit.prevent="onSubmit" ref="formRef" v-model="formValid">
        <div class="text-subtitle-1 text-medium-emphasis">Confirm Code</div>
        <v-text-field
          density="compact"
          v-model="form.confirmCode"
          :rules="activatedCodeRules"
          outlined
          required
          variant="outlined"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Password
        </div>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          @click:append-inner="visible = !visible"
          density="compact"
          v-model="form.password"
          :rules="newPasswordRules"
          outlined
          required
          variant="outlined"
          class="mt-2"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Confirm Password
        </div>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          @click:append-inner="visible = !visible"
          density="compact"
          v-model="form.confirmPassword"
          :rules="confirmNewPasswordRules"
          outlined
          required
          variant="outlined"
          class="mt-2"
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
          &nbsp;<span v-if="!loading">Confirm</span>
        </v-btn>
        <v-card-text class="text-center">
          <router-link class="text-blue text-decoration-none" to="/forgot-password">
            Back to forgot password <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </v-card-text>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import * as authService from "@/apis/authServices";
const toast = useToast();
const formValid = ref(false);
const loading = ref(false);
const formRef = ref(null);
const form = ref({
  confirmCode: "",
  password: "",
  confirmPassword: "",
});
const activatedCodeRules = [(value) => !!value || "Confirm Code là bắt buộc"];
const newPasswordRules = [
  (v) => !!v || "Mật khẩu mới là bắt buộc",
  (v) => v.length >= 6 || "Mật khẩu mới phải có ít nhất 6 ký tự",
];
const confirmNewPasswordRules = [
  (v) => !!v || "Xác nhận mật khẩu mới là bắt buộc",
  (v) => v === this.password || "Mật khẩu mới và xác nhận không khớp",
];

const onSubmit = async () => {
  if (formRef.value.validate()) {
    loading.value = true;
  }
  try {
    const response = await authService.updatePasswordAPI(form.value);
    if (response.status === 200) {
      toast.success(response.message);
      router.push({ name: "login" });
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

<style></style>
