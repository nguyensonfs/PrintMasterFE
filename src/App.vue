<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script setup>
import { PUBLIC_LAYOUT } from "./constants";
const route = useRoute();
const layout = computed(() => (route.meta.layout || PUBLIC_LAYOUT) + "-layout");
</script>
