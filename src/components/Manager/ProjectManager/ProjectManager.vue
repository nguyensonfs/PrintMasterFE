<template>
  <ProjectActionToolbar />
  <v-empty-state
    class="tw-mt-[150px]"
    v-if="!projects || projects.length === 0"
    title="Không có dự án nào"
    description="Bạn có thể thêm một dự án mới để bắt đầu."
    icon="mdi-folder-open"
  >
  </v-empty-state>

  <v-row v-else class="tw-mt-[10px]">
    <v-col v-for="project in projects" :key="project.id" cols="12" md="3">
      <v-card>
        <v-img
          height="200"
          :src="`${FILE_URL}${project.imageDescription}`"
          cover
        ></v-img>
        <v-card-title>
          {{ project.projectName }}
        </v-card-title>
        <v-card-item>
          <p>Leader: {{ project.leader }}</p>
          <p class="tw-mt-1">Ngày tạo: {{ formatDate(project.startDate) }}</p>
          <p class="tw-mt-1">{{ translateStatus(project.projectStatus) }}</p>
          <p class="tw-mt-1">
            Tiến độ:
            <span class="tw-text-green-600">{{ project.progress }}%</span>
          </p>
          <v-progress-linear
            color="light-green-darken-4"
            height="10"
            :model-value="project.progress"
            rounded
            striped
          ></v-progress-linear>
        </v-card-item>
        <template v-slot:actions>
          <v-btn
            variant="flat"
            base-color="primary"
            icon="mdi-eye-outline"
            size="small"
            @click="openDialog(project)"
          ></v-btn>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <!-- Dynamic Dialog -->
  <v-dialog
    v-model="dialogVisible"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card>
      <v-toolbar :height="40">
        <v-toolbar-title>{{ formData?.projectName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon="mdi-close" @click="dialogVisible = false"></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- Nội dung Dialog -->
      <v-container>
        <v-row class="tw-justify-center tw-items-center tw-h-[60px]">
          <v-col cols="auto">
            <div>
              <v-img
                width="30"
                height="30"
                src="../../../assets/icons/project.svg"
                class="tw-mx-auto"
              ></v-img>
              <span>Dự án</span>
            </div>
          </v-col>
          <v-icon icon="mdi-chevron-right"> </v-icon>
          <v-col cols="auto">
            <div>
              <v-img
                width="30"
                height="30"
                src="../../../assets/icons/design.svg"
                class="tw-mx-auto"
              ></v-img>
              <span>Thiết kế</span>
            </div>
          </v-col>
          <v-icon icon="mdi-chevron-right"> </v-icon>
          <v-col cols="auto">
            <div>
              <v-img
                width="30"
                height="30"
                src="../../../assets/icons/print.svg"
                class="tw-mx-auto"
              ></v-img>
              <span>In ấn</span>
            </div>
          </v-col>
          <v-icon icon="mdi-chevron-right"> </v-icon>
          <v-col cols="auto">
            <div>
              <v-img
                width="30"
                height="30"
                src="../../../assets/icons/delivery.svg"
                class="tw-mx-auto"
              ></v-img>
              <span>Giao hàng</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-divider
        :thickness="2"
        class="border-opacity-75 tw-mt-3"
        color="info"
      ></v-divider>
      <v-card-text>
        <p><strong>Leader:</strong> {{ formData?.leader }}</p>
        <p><strong>Ngày tạo:</strong> {{ formatDate(formData?.startDate) }}</p>
        <p>
          <strong>Trạng thái:</strong>
          {{ translateStatus(formData?.projectStatus) }}
        </p>
        <p><strong>Tiến độ:</strong> {{ formData?.progress }}%</p>
        <!-- Thêm các trường khác nếu cần -->
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { FILE_URL } from '@/constants'
import { useProjectStore } from '@/stores/project'
import { projectStatusTranslations } from '@/utils/translations'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'
import { onMounted } from 'vue'

const toast = useToast()
const projectStore = useProjectStore()

// variable
const projects = computed(() => projectStore.getProject)
const dialogVisible = ref(false)
const formData = ref(null)

// computed
const openDialog = async (item = null) => {
  dialogVisible.value = true
  formData.value = item
}

const formatDate = (date) => {
  return date ? dayjs(date).format('DD/MM/YYYY') : 'Không có ngày'
}

const translateStatus = (status) => {
  return projectStatusTranslations[status] || status
}

// onMounted
onMounted(() => {
  projectStore.fetchAllProject()
})
</script>
