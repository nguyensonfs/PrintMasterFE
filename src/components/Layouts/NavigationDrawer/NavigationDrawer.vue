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
          v-for="(item, index) in sidebar"
          :key="index"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.url"
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
import { useSidebarStore } from "@/stores/sidebar";

const drawerStore = useDrawerStore();
const sidebarStore = useSidebarStore();
const authStore = useAuthStore();

const { isOpen } = storeToRefs(drawerStore);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userRoles = computed(() => authStore.getUserPermissions);
const sidebar = computed(() => sidebarStore.getAccessibleItems(userRoles.value));
</script>
