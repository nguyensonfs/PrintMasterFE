<template>
  <v-row>
    <v-col class="tw-p-2" cols="auto">
      <v-img
        width="300px"
        height="300px"
        :src="`${FILE_URL}${project.imageDescription}`"
      ></v-img>
    </v-col>
    <v-divider
      :thickness="2"
      class="border-opacity-75 tw-mt-3"
      color="info"
      vertical
    ></v-divider>
    <v-col class="tw-p-8" cols="4">
      <div>
        <p>{{ project.projectName }}</p>
        <p>Leader: {{ project.leader }}</p>
        <p class="tw-mt-1">Ngày tạo: {{ formatDate(project.startDate) }}</p>
        <p class="tw-mt-1">Ngày dự kiến: {{ formatDate(project.expectedEndDate) }}</p>
        <p class="tw-mt-1">Mô tả: {{ project.description }}</p>
        <p class="tw-mt-1">
          Yêu cầu khách hàng: {{ project.requestDescriptionFromCustomer }}
        </p>
      </div>
    </v-col>

    <v-col class="tw-p-2" cols="4">
      <v-card variant="outlined" class="tw-p-5">
        <p class="tw-font-medium tw-text-[25px]">Thông tin dự án</p>
        <v-card class="tw-p-3">
          <p class="tw-mt-3">Người phụ trách : {{ project.leader }}</p>
          <p class="tw-mt-3">Số điện thoại : {{ project.phoneLeader }}</p>
          <p class="tw-mt-3">Email : {{ project.emailLeader }}</p>
        </v-card>
        <v-card class="tw-p-3 tw-mt-2">
          <p class="tw-mt-3">Khách hàng : {{ project.customer }}</p>
          <p class="tw-mt-3">Số điện thoại : {{ project.phoneCustomer }}</p>
          <p class="tw-mt-3">Email : {{ project.emailCustomer }}</p>
          <p class="tw-mt-3">Địa chỉ : {{ project.addressCustomer }}</p>
        </v-card>
        <v-divider
          :thickness="2"
          class="border-opacity-75 tw-mt-3"
          color="info"
        ></v-divider>
        <v-card-text class="tw-flex tw-justify-between"
          ><span>Giá dự án: </span><span>{{ project.startingPrice }}đ</span></v-card-text
        >
        <template v-slot:actions>
          <v-btn
            variant="flat"
            base-color="primary"
            size="small"
            block
            class="tw-capitalize"
            @click="gotoDesign"
            >Thiết kế
            <v-icon icon="mdi-arrow-right"></v-icon>
          </v-btn>
        </template>
      </v-card>
    </v-col>
    <v-snackbar
      rounded="pill"
      v-model="snackbar.visible"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar.visible = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script setup>
import { useProjectStore } from "@/stores/project";
import { FILE_URL } from "@/constants";
import dayjs from "dayjs";
import { useProjectProcessStore } from "@/stores/projectProcess";

const router = useRouter();
const projectProcess = useProjectProcessStore();
const projectStore = useProjectStore();
const snackbar = ref({
  visible: false,
  message: "",
  color: "error",
});
const props = defineProps({
  projectId: String,
});

const gotoDesign = () => {
  markStepAsCompleted(1);
  router.push({ name: "designs", params: { projectId: props.projectId } });
  projectProcess.setActiveStep(2);
};

const formatDate = (date) => {
  return date ? dayjs(date).format("DD/MM/YYYY") : "Không có ngày";
};

const markStepAsCompleted = (stepId) => {
  projectProcess.completeStep(stepId);
};

const project = computed(() => projectStore.getProjectById(props.projectId));
</script>
