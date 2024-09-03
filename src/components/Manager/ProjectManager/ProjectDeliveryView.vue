<template>
  <v-row>
    <v-col>
      <div class="text-subtitle-1 text-medium-emphasis">Mã đơn hàng</div>
      <v-text-field
        density="compact"
        required
        clearable
        readonly
        variant="outlined"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Quản lý</div>
      <v-text-field
        density="compact"
        required
        outlined
        clearable
        variant="outlined"
        color="primary"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Loại máy móc</div>
      <v-select density="compact" variant="outlined" color="primary"> </v-select>
    </v-col>
    <v-col>
      <div class="text-subtitle-1 text-medium-emphasis">Tên đơn hàng</div>
      <v-text-field
        density="compact"
        required
        clearable
        readonly
        variant="outlined"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Ngày đặt</div>
      <v-text-field
        density="compact"
        required
        outlined
        clearable
        variant="outlined"
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col></v-col>
  </v-row>
</template>
<script setup>
const props = defineProps({
  projectId: String,
});
</script>
