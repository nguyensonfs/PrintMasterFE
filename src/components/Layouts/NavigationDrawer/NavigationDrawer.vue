<template>
  <v-navigation-drawer
    image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
    theme="dark"
    v-model="isOpen"
    v-if="isAuthenticated"
  >
    <div class="pa-4 tw-text-center" color="grey-lighten-4">
      <v-avatar class="mb-4 tw-mx-auto" size="64">
        <v-img
          aspect-ratio="30"
          src="https://cdn.vuetifyjs.com/docs/images/brand-kit/v-logo-atom.png"
        />
      </v-avatar>

      <div>PRINT MASTER</div>
    </div>
    <v-slide-x-reverse-transition>
      <v-list>
        <v-list-item
          v-for="[icon, text, url] in links"
          :key="icon"
          :prepend-icon="icon"
          :title="text"
          :to="url"
          link
        ></v-list-item>
      </v-list>
    </v-slide-x-reverse-transition>
  </v-navigation-drawer>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useDrawerStore } from "@/stores/drawer";
import { useAuthStore } from "@/stores/auth";

const drawerStore = useDrawerStore();
const authStore = useAuthStore();
const router = useRouter();

const { isOpen } = storeToRefs(drawerStore);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const links = [
  ["mdi-view-dashboard", "Dashboard", "/dashboard"],
  ["mdi-home", "Trang chủ", "/dashboard"],
  ["mdi-warehouse", "Quản lý kho", "/inventories"],
  ["mdi-delete", "Quản lý giao hàng", "/deliveries"],
  ["mdi-image", "Quản lý dự án", "/projects"],
  ["mdi-account-tie", "Quản lý nhân viên", "/employees"],
  ["mdi-account-multiple", "Quản lý khách hàng", "/customers"],
  ["mdi-domain", "Quản lý phòng ban", "/departments"],
];
</script>
