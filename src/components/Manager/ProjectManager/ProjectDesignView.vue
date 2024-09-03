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
</template>

<script setup>
import { useProjectStore } from "@/stores/project";
import { FILE_URL } from "@/constants";
import dayjs from "dayjs";
const props = defineProps({
  projectId: String,
});
const toast = useToast();
const projectStore = useProjectStore();
const project = computed(() => projectStore.getProjectById(props.projectId));
const designs = computed(() => projectStore.getProjectDesigns(props.projectId));

const isOpen = ref(false);
const designApproval = ref("");
const actions = ref([
  { text: "Chọn hành động", value: "" },
  { text: "Phê duyệt", value: "Agree" },
  { text: "Không phê duyệt", value: "Refuse" },
]);

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
    const response = await projectStore.createProjectDesign(props.projectId, formData);

    if (response.status === 200) {
      toast.success(response.message);
      designs.value.push(response.data);
    }
  } catch (error) {
    toast.error("Đã xảy ra lỗi trong quá trình tạo thiết kế.");
  }
};

const handleApproval = async () => {
  if (!selectedDesign.value || !designApproval.value) {
    toast.error("Vui lòng chọn thiết kế và trạng thái phê duyệt.");
    return;
  }

  const status = designApproval.value;

  const formData = new FormData();
  formData.append("designApproval", status);

  try {
    const response = await projectStore.approveProjectDesign(
      props.projectId,
      selectedDesign.value,
      formData
    );

    if (response.status === 200) {
      toast.success(response.message);

      designs.value.forEach((design) => {
        if (design.id === selectedDesign.value) {
          design.designStatus = status === "Agree" ? "HasBeenApproved" : "Refused";
        } else if (status === "Agree") {
          design.designStatus = "Refused";
        }
      });
    }
  } catch (error) {
    toast.error("Đã xảy ra lỗi trong quá trình phê duyệt thiết kế.");
  } finally {
    deselectDesign();
  }
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
