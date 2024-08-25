<template>
  <v-app-bar
    v-if="isAuthenticated"
    color="teal-darken-4"
    image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
  >
    <template v-slot:image>
      <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>
    </template>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawerStore.toggleDrawer"></v-app-bar-nav-icon>
    </template>
    <v-col cols="auto">
      <v-img
        :width="120"
        src="https://cdn.vuetifyjs.com/docs/images/brand-kit/v-text-logo-light.png"
      ></v-img>
    </v-col>
    <v-spacer></v-spacer>
    <v-col lg="6" cols="12">
      <v-form class="mt-5">
        <v-text-field
          rounded
          variant="outlined"
          placeholder="Search"
          dense
          append-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-form>
    </v-col>
    <v-spacer></v-spacer>
    <v-btn class="text-none" stacked>
      <v-badge color="error" content="5">
        <v-icon>mdi-bell-outline</v-icon>
      </v-badge>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <span style="cursor: pointer" v-bind="props">
          <v-chip link>
            <v-badge dot bottom color="green" offset-y="5" offset-x="4">
              <v-avatar size="40">
                <v-img :src="user.Avatar" />
              </v-avatar>
            </v-badge>
            <span class="ml-3">{{ user.FullName }}</span>
          </v-chip>
        </span>
      </template>
      <v-list density="compact" nav width="250" class="py-0">
        <v-list-item two-line>
          <template v-slot:prepend>
            <v-list-item
              lines="two"
              :prepend-avatar="user.Avatar"
              subtitle="Logged in"
              :title="user.FullName"
            ></v-list-item>
          </template>
        </v-list-item>
        <v-divider />
        <v-list-item
          link
          :prepend-icon="menu.icon"
          :title="menu.title"
          v-for="(menu, i) in menus"
          :key="i"
          @click="menu.title === 'Logout' && logout()"
        >
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script setup>
import { useDrawerStore } from "@/stores/drawer";
import { useAuthStore } from "@/stores/auth";
const drawerStore = useDrawerStore();
const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.getUser);

const menus = [
  { title: "Profile", icon: "mdi-account" },
  { title: "Change Password", icon: "mdi-key" },
  { title: "Setting", icon: "mdi-cog" },
  { title: "Logout", icon: "mdi-logout" },
];

const logout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>
