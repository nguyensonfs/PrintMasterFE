<template>
  <div class="tw-h-screen tw-flex">
    <v-sheet class="mx-auto tw-my-auto tw-rounded-md pa-12 pb-8" width="448">
      <h2 class="tw-text-center tw-font-sacramento tw-font-light tw-text-[60px] tw-mb-1">
        Forgot Password
      </h2>
      <v-form @submit.prevent="onSubmit" ref="formRef" v-model="formValid">
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
        <v-text-field
          density="compact"
          v-model="form.email"
          :rules="emailRules"
          type="email"
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
          &nbsp;<span v-if="!loading">Confirm</span>
        </v-btn>
        <v-card-text class="text-center">
          <router-link class="text-blue text-decoration-none" to="/login">
            Back to login <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </v-card-text>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import * as authService from "@/apis/authServices";
const toast = useToast();
const router = useRouter();
const formValid = ref(false);
const loading = ref(false);
const formRef = ref(null);
const form = ref({
  email: "",
});

const emailRules = [
  (v) => !!v || "Email là bắt buộc",
  (v) => /.+@.+\..+/.test(v) || "Email không hợp lệ",
];

const onSubmit = async () => {
  if (formRef.value.validate()) {
    loading.value = true;
  }
  try {
    const response = await authService.forgotPasswordAPI(form.value.email);
    if (response.status === 200) {
      toast.success(response.message);
      router.push({ name: "confirmChangePassword" });
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

<style></style>
