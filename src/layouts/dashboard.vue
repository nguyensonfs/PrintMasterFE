<template>
  <v-app>
    <NavigationDrawer />
    <TopNavigation />
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
import NavigationDrawer from '@/components/Layouts/NavigationDrawer'
</script>
