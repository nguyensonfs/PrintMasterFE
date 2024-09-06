<script setup>
import * as deliveryService from "@/apis/deliveryServices";
import { useErrorHandler } from "@/mixins/errorMixin";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const { handleApiError } = useErrorHandler();

const deliveryData = ref(null);
const deliveries = ref([]);
const dialogVisible = ref(false);
const selectedStatus = ref(null);
const snackbar = ref({
  visible: false,
  message: "",
  color: "error",
});

const showSnackbar = (message, color = "error") => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.visible = true;
};
const headers = [
  {
    title: "Tên Đơn Hàng",
    align: "start",
    value: "project.projectName",
  },
  {
    title: "Khách Hàng",
    align: "start",
    value: "customer.fullName",
  },
  {
    title: "Địa Chỉ",
    align: "start",
    value: "customer.address",
  },
  {
    title: "PTVC",
    align: "start",
    value: "shippingMethodName",
  },
  {
    title: "Vận Chuyển",
    align: "start",
    value: "deliver.fullName",
  },
  {
    title: "Trạng Thái",
    align: "start",
    value: "deliveryStatus",
  },
  {
    title: "",
    align: "start",
    value: "actions",
  },
];
const items = [
  { text: "Không nhận", value: 2 },
  { text: "Từ Chối", value: 3 },
  { text: "Đã giao", value: 4 },
];

const getAllDeliveries = async () => {
  const response = await deliveryService.getDeliveriesAPI();
  deliveries.value = response;
};

const confirmAssignment = async (id) => {
  try {
    const response = await deliveryService.confirmAssignmentAPI(id);
    const data = await deliveryService.getDeliveriesAPI();
    deliveries.value = data;
    showSnackbar(response.message, "success");
  } catch (error) {
    const errorMessage = handleApiError(error);
    showSnackbar(errorMessage, "error");
  }
};

const confirmDelivery = async (id) => {
  try {
    const payload = {
      status: selectedStatus.value,
    };
    const response = await deliveryService.confirmDeliveryAPI(id, payload);
    const data = await deliveryService.getDeliveriesAPI();
    deliveries.value = data;
    showSnackbar(response.message, "success");
  } catch (error) {
    const errorMessage = handleApiError(error);
    showSnackbar(errorMessage, "error");
  }
};

const openDialog = (item) => {
  deliveryData.value = item;
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

onMounted(() => {
  getAllDeliveries();
});
</script>
<template>
  <h1>Quản lý giao hàng</h1>
  <v-data-table :headers="headers" :items="deliveries">
    <template v-slot:no-data>
      <v-alert :value="true" color="error" icon="warning">
        Sorry, nothing to display here :(
      </v-alert>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        v-if="authStore.isShipper"
        flat
        variant="text"
        icon
        @click="openDialog(item)"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
  </v-data-table>
  <v-dialog v-model="dialogVisible" transition="dialog-bottom-transition" width="500">
    <v-card>
      <v-card-title class="tw-text-center">Chi tiết đơn hàng</v-card-title>
      <v-card-text>
        <p>Mã đơn hàng:{{ deliveryData.project.id }}</p>
        <p>Giá đơn hàng: {{ formatCurrency(deliveryData.project.startingPrice) }}</p>
        <p>Tên đơn hàng: {{ deliveryData.project.projectName }}</p>
        <p>Khách hàng: {{ deliveryData.customer.fullName }}</p>
        <p>số điện thoại: {{ deliveryData.customer.phoneNumber }}</p>
        <p>Địa chỉ giao hàng: {{ deliveryData.customer.address }}</p>
        <p>Phương thức vận chuyển: {{ deliveryData.shippingMethodName }}</p>
        <p>Người vận chuyển: {{ deliveryData.deliver.fullName }}</p>
        <p>Trạng thái đơn hàng: {{ deliveryData.deliveryStatus }}</p>
        <v-select
          v-if="deliveryData.deliveryStatus === 'Delivering'"
          density="compact"
          color="primary"
          :items="items"
          item-title="text"
          item-value="value"
          variant="outlined"
          v-model="selectedStatus"
          class="tw-mt-3"
          placeholder="Xác nhận giao hàng"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="deliveryData.deliveryStatus === 'Waiting'"
          variant="outlined"
          class="tw-capitalize tw-bg-green-500 tw-text-white"
          @click="confirmAssignment(deliveryData.id)"
          >Xác nhận đơn hàng</v-btn
        >
        <v-btn
          v-if="deliveryData.deliveryStatus === 'Delivering'"
          variant="outlined"
          class="tw-capitalize tw-bg-green-500 tw-text-white"
          @click="confirmDelivery(deliveryData.id)"
          >Xác nhận
        </v-btn>
        <v-btn variant="outlined" class="tw-capitalize" @click="closeDialog">Thoát</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar
    rounded="pill"
    v-model="snackbar.visible"
    :color="snackbar.color"
    timeout="3000"
  >
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbar.visible = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>
