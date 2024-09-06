<template>
  <v-row>
    <v-col cols="8">
      <div class="tw-bg-green-300 tw-p-4 tw-rounded-md">
        <p class="tw-text-green-600">Đơn hàng đã tạo thành công</p>
        <p class="tw-text-[12px] tw-mt-2 tw-text-green-600">
          Đơn hàng đang được giao cho nhân viên giao hàng
        </p>
      </div>
      <div>
        <v-table class="tw-mt-3" fixed-header height="260px">
          <thead>
            <tr>
              <th class="text-left">Tên Đơn Hàng</th>
              <th class="tw-text-center">Khách Hàng</th>
              <th class="tw-text-center">Địa Chỉ</th>
              <th class="tw-text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ project.projectName }}</td>
              <td class="tw-text-center">{{ project.customer }}</td>
              <td class="tw-text-center">{{ project.addressCustomer }}</td>
              <td class="tw-text-center">
                <v-btn
                  class="tw-capitalize"
                  :disabled="
                    delivery.find((item) => item.projectId === props.projectId)
                      ?.deliveryStatus === 'Delivered'
                  "
                  @click="openDialog"
                  size="small"
                  >Giao Hàng</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-col>
    <v-col cols="4">
      <v-card variant="outlined"
        ><div class="tw-p-3">
          <h3>Thông tin đơn hàng</h3>
          <p>Mã đơn hàng: {{ project.id }}</p>
        </div></v-card
      >
      <v-card variant="outlined"
        ><div class="tw-p-3">
          <p>Khách hàng: {{ project.customer }}</p>
          <p>Số điện thoại: {{ project.phoneCustomer }}</p>
          <p>Địa chỉ: {{ project.addressCustomer }}</p>
          <p>Thành tiền: {{ formatCurrency(project.startingPrice) }}</p>
        </div></v-card
      >
    </v-col>
  </v-row>
  <v-dialog v-model="isOpen" transition="dialog-bottom-transition" max-width="500">
    <v-card>
      <div class="tw-p-3">
        <h3 class="tw-mb-3">Giao hàng</h3>
        <div class="text-medium-emphasis">
          <span class="tw-text-red-600 tw-text-[14px] tw-me-1">(*)</span
          ><span class="tw-text-[14px]">Ngày dự kiến giao hàng</span>
        </div>
        <v-text-field
          class="tw-mt-3"
          density="compact"
          placeholder="Nhập ngày dự kiến giao hàng (yyyy-mm-dd)"
          required
          variant="outlined"
          v-model="deliveryDate"
          color="primary"
        ></v-text-field>
        <div class="text-medium-emphasis">
          <span class="tw-text-red-600 tw-text-[14px] tw-me-1">(*)</span
          ><span class="tw-text-[14px]">Nhân viên giao hàng</span>
        </div>
        <v-select
          density="compact"
          color="primary"
          :items="shippers"
          item-title="fullName"
          item-value="id"
          variant="outlined"
          placeholder="Chọn nhân viên giao hàng"
          v-model="selectedShipper"
          class="tw-mt-3"
        ></v-select>
        <div class="text-medium-emphasis">
          <span class="tw-text-red-600 tw-text-[14px] tw-me-1">(*)</span
          ><span class="tw-text-[14px]">Phương thức giao hàng</span>
        </div>
        <v-select
          density="compact"
          color="primary"
          :items="shippingMethods"
          item-title="shippingMethodName"
          item-value="id"
          variant="outlined"
          placeholder="Chọn phương thức giao hàng"
          v-model="selectedShippingMethod"
          class="tw-mt-3"
        ></v-select>
      </div>
      <v-card-actions>
        <v-btn variant="tonal" @click="createDelivery" class="tw-capitalize">gửi</v-btn>
        <v-btn variant="outlined" @click="closeDialog" flat class="tw-capitalize"
          >Thoát</v-btn
        >
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
<script setup>
import { useProjectStore } from "@/stores/project";
import { useErrorHandler } from "@/mixins/errorMixin";
import * as userService from "@/apis/userServices";
import * as shippingService from "@/apis/shippingServices";
import * as deliveriService from "@/apis/deliveryServices";

const projectStore = useProjectStore();
const { handleApiError } = useErrorHandler();

const props = defineProps({
  projectId: String,
});

const shippingMethods = ref([]);
const shippers = ref([]);
const deliveryDate = ref(null);
const selectedShipper = ref(null);
const selectedShippingMethod = ref(null);
const delivery = ref(null);

const project = computed(() => projectStore.getProjectById(props.projectId));

const isOpen = ref(false);

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

const openDialog = () => {
  isOpen.value = true;
};

const closeDialog = () => {
  deliveryDate.value = "";
  selectedShipper.value = "";
  isOpen.value = false;
};

const createDelivery = async () => {
  // const formattedDate = dayjs(deliveryDate.value).toISOString()
  const payload = {
    shippingMethodId: selectedShippingMethod.value,
    customerId: project.value.customerId,
    deliverId: selectedShipper.value,
    projectId: props.projectId,
    estimateDeliveryTime: deliveryDate.value,
  };
  try {
    const response = await deliveriService.createDeliveryAPI(payload);
    if (response.status === 200) {
      showSnackbar(response.message, "success");
    }
  } catch (error) {
    const errorMessage = handleApiError(error);
    showSnackbar(errorMessage, "error");
  }
};

const getShippers = async () => {
  const response = await userService.getUserRoleDeliverAPI();
  shippers.value = response;
};

const getDeliveryById = async () => {
  const response = await deliveriService.getDeliveryByProjectIdAPI(props.projectId);
  delivery.value = response;
};

const deliveryItem = computed(() =>
  delivery.value.find((item) => item.projectId === props.projectId)
);

const isDeliveryDisabled = computed(
  () => deliveryItem.value?.deliveryStatus === "Delivered"
);

const getShippingMethod = async () => {
  const response = await shippingService.getshippingMethodAPI();
  shippingMethods.value = response;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
onMounted(async () => {
  getShippers();
  getShippingMethod();
  await getDeliveryById();
});
</script>
