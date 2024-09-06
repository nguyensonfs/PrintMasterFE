<template>
  <v-container fluid @click="deselectDesign">
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-btn @click="isOpen = true" class="tw-capitalize">Tải File</v-btn>
        </v-row>
        <v-row>
          <v-col v-for="design in designs" :key="design.id" cols="3">
            <v-card
              :elevation="selectedDesign === design.id ? 10 : 2"
              @click.stop="selectDesign(design)"
              min-height="256px"
            >
              <v-img width="100%" :src="`${FILE_URL}${design.designImage}`"></v-img>
              <v-card-text>
                <p>Người tạo: {{ design.designer }}</p>
                <p>Ngày tạo: {{ formatDate(design.designTime) }}</p>
                <p>Trạng thái: {{ design.designStatus }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-card>
          <div class="tw-text-center">
            <span>Thông tin dự án</span>
          </div>
          <v-card variant="tonal">
            <v-card-text>
              <p>Dự án: {{ project.projectName }}</p>
              <p>Khách hàng: {{ project.customer }}</p>
              <p>Quản lý: {{ project.leader }}</p>
              <p>Mô tả: {{ project.description }}</p>
              <p>Yêu cầu khách hàng: {{ project.requestDescriptionFromCustomer }}</p>
            </v-card-text>
          </v-card>
        </v-card>
        <v-select
          class="tw-mt-6"
          density="comfortable"
          :items="actions"
          item-value="value"
          item-title="text"
          v-model="designApproval"
          label="Mời chọn phê duyệt hoặc không phê duyệt"
          variant="outlined"
          color="primary"
          :disabled="!selectedDesign"
          @click.stop
        >
        </v-select>
        <v-btn
          v-if="designApproval !== ''"
          class="tw-capitalize"
          flat
          color="primary"
          density="comfortable"
          block
          @click.stop
          @click="handleApproval"
        >
          {{ designApproval === "Agree" ? "Phê duyệt" : "Không phê duyệt" }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="isOpen" transition="dialog-bottom-transition" max-width="500">
    <v-card>
      <v-card-title>Tải lên bản thiết kế</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="imageFile"
          accept="image/*"
          clearable
          label="File"
          base-color="green"
          variant="outlined"
          density="comfortable"
          color="deep-purple-accent-4"
          :show-size="1024"
          prepend-icon="mdi-camera"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="flat"
          base-color="primary"
          density="comfortable"
          class="tw-capitalize"
          @click="createDesign"
        >
          Thêm Mới
        </v-btn>
        <v-btn
          variant="flat"
          base-color="primary"
          density="comfortable"
          class="tw-capitalize"
          @click="closeFileDialog"
        >
          Thoát
        </v-btn>
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
import { useProjectProcessStore } from "@/stores/projectProcess";
import { useErrorHandler } from "@/mixins/errorMixin";
import * as projectService from "@/apis/projectServices";
import { FILE_URL } from "@/constants";
import dayjs from "dayjs";
const props = defineProps({
  projectId: String,
});
const projectProcess = useProjectProcessStore();
const projectStore = useProjectStore();
const project = computed(() => projectStore.getProjectById(props.projectId));
const designs = computed(() => projectStore.getProjectDesigns(props.projectId));
const router = useRouter();
const { handleApiError } = useErrorHandler();

const isOpen = ref(false);
const designApproval = ref("");
const actions = ref([
  { text: "Chọn hành động", value: "" },
  { text: "Phê duyệt", value: "Agree" },
  { text: "Không phê duyệt", value: "Refuse" },
]);
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

const imageFile = ref(null);
const selectedDesign = ref(null);

const formatDate = (date) => {
  return date ? dayjs(date).format("DD/MM/YYYY") : "Không có ngày";
};

const createDesign = async () => {
  const formData = new FormData();
  if (imageFile.value) {
    formData.append("designImage", imageFile.value);
  }

  try {
    const response = await projectService.createProjectDesignAPI(
      props.projectId,
      formData
    );

    if (response.status === 200) {
      showSnackbar(response.message, "success");
      designs.value.push(response.data);
    }
  } catch (error) {
    const errorMessage = handleApiError(error);
    showSnackbar(errorMessage, "error");
  }
};

const handleApproval = async () => {
  if (!selectedDesign.value || !designApproval.value) {
    snackbar.value = {
      visible: true,
      message: "Vui lòng chọn thiết kế và trạng thái phê duyệt.",
      color: "error",
    };
    return;
  }

  const status = designApproval.value;

  const formData = new FormData();
  formData.append("designApproval", status);

  try {
    const response = await projectService.approvedProjectDesignAPI(
      props.projectId,
      selectedDesign.value,
      formData
    );
    await projectStore.fetchAllProject();

    if (response.status === 200) {
      showSnackbar(response.message, "success");

      designs.value.forEach((design) => {
        if (design.id === selectedDesign.value) {
          design.designStatus = status === "Agree" ? "HasBeenApproved" : "Refused";
        } else if (status === "Agree") {
          design.designStatus = "Refused";
        }
      });

      if (status === "Agree") {
        markStepAsCompleted(2);
        router.push({ name: "print", params: { projectId: props.projectId } });
        projectProcess.setActiveStep(3);
      }
    }
  } catch (error) {
    const errorMessage = handleApiError(error);
    showSnackbar(errorMessage, "error");
  } finally {
    deselectDesign();
  }
};

const markStepAsCompleted = (stepId) => {
  projectProcess.completeStep(stepId);
};

const selectDesign = (design) => {
  selectedDesign.value = design.id;
};

const deselectDesign = () => {
  selectedDesign.value = null;
  designApproval.value = "";
};

const closeFileDialog = () => {
  imageFile.value = null;
  isOpen.value = false;
};
</script>
