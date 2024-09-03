<template>
  <div>
    <v-btn @click="openDialog" size="small" icon="mdi-plus" color="green"></v-btn>
  </div>
  <v-dialog v-model="dialogVisible" max-width="900" min-height="500">
    <v-card class="tw-p-8">
      <v-card-title class="tw-text-center">Thêm dự án</v-card-title>
      <v-row>
        <v-col cols="auto" class="tw-me-5">
          <div
            class="tw-border-2 tw-border-dashed tw-border-gray-300 tw-rounded-lg tw-w-[120px] tw-h-[120px] tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
            @click="triggerFileInput"
          >
            <template v-if="imagePreview">
              <v-img
                :src="imagePreview"
                max-width="100"
                class="tw-w-full tw-h-full tw-object-cover tw-rounded-lg"
              ></v-img>
            </template>
            <template v-else>
              <div
                class="upload-placeholder tw-flex tw-flex-col tw-items-center tw-justify-center"
              >
                <v-icon size="48" color="grey">mdi-upload</v-icon>
                <span
                  class="upload-text tw-mt-2 tw-text-lg tw-font-light tw-text-gray-500"
                  >Tải ảnh lên</span
                >
              </div>
            </template>
          </div>
        </v-col>
        <v-col>
          <v-file-input
            v-model="imageFile"
            label="Chọn file"
            accept="image/*"
            prepend-icon="mdi-camera"
            @change="previewImage"
            @click:clear="clearImage"
            show-size
            clearable
            variant="outlined"
            ref="fileInput"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="projectName"
            label="Tên dự án"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <VueDatePicker
            v-model="expectedEndDate"
            :format="dateFormat"
            placeholder="Ngày dự kiến"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            label="Người nhận dự án"
            v-model="leaderId"
            :items="userStore.leaders"
            item-value="id"
            item-title="fullName"
            density="compact"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            label="Khách hàng"
            v-model="customerId"
            :items="customerStore.allCustomers"
            item-value="id"
            item-title="fullName"
            density="compact"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="startingPrice"
            label="Giá dự án"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="commissionPercentage"
            label="Phần trăm hoa hồng nhân viên"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            label="Yêu cầu khách hàng"
            v-model="requestDescriptionFromCustomer"
            row-height="25"
            rows="3"
            variant="outlined"
            auto-grow
            shaped
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-textarea
            label="Mô tả dự án"
            v-model="description"
            row-height="25"
            rows="3"
            variant="outlined"
            auto-grow
            shaped
          ></v-textarea>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn
          color="green"
          variant="outlined"
          @click="createProject"
          text="Thêm mới"
        ></v-btn>
        <v-btn color="red" variant="outlined" @click="closeDialog" text="Thoát"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useCustomerStore } from "@/stores/customer";
import { useProjectStore } from "@/stores/project";
import { useUserStore } from "@/stores/user";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const dialogVisible = ref(false);

const imageFile = ref(null);
const imagePreview = ref(null);
const projectName = ref("");
const description = ref("");
const requestDescriptionFromCustomer = ref("");
const commissionPercentage = ref(null);
const startingPrice = ref(null);
const customerId = ref(null);
const leaderId = ref(null);
const expectedEndDate = ref(null);

const dateFormat = "yyyy-MM-dd";

const toast = useToast();
const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const userStore = useUserStore();
const projects = computed(() => projectStore.getProject);

const openDialog = async () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  clearData();
};

const previewImage = () => {
  const file = imageFile.value;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const createProject = async () => {
  const formData = new FormData();
  formData.append("projectName", projectName.value);
  formData.append("description", description.value);
  formData.append("requestDescriptionFromCustomer", requestDescriptionFromCustomer.value);
  formData.append("commissionPercentage", commissionPercentage.value);
  formData.append("startingPrice", startingPrice.value);
  formData.append("customerId", customerId.value);
  formData.append("leaderId", leaderId.value);
  formData.append(
    "expectedEndDate",
    expectedEndDate.value ? expectedEndDate.value.toISOString() : null
  );

  if (imageFile.value) {
    formData.append("imageDescription", imageFile.value);
  }
  const response = await projectStore.createProject(formData);
  console.log("🚀 ~ createProject ~ response:", response);
  if (response.status === 200) {
    toast.success("Dự án đã được tạo thành công!");
    projects.value.push(response.data);
  }
};

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};

const clearImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};

const clearData = () => {
  imageFile.value = null;
  imagePreview.value = null;
  projectName.value = "";
  description.value = "";
  requestDescriptionFromCustomer.value = "";
  commissionPercentage.value = "";
  startingPrice.value = "";
  customerId.value = "";
  leaderId.value = "";
  expectedEndDate.value = "";
};

onMounted(() => {
  customerStore.fetchAllCustomers();
  userStore.fetchAllLeaders();
});
</script>
