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
            @click="handleProjectClick(project)"
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
          <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- Nội dung Dialog -->
      <v-container>
        <v-row class="tw-justify-center tw-items-center tw-h-[60px]">
          <v-col
            cols="auto"
            class="tw-flex tw-items-center"
            v-for="(step, index) in steps"
            :key="step.id"
            :class="{
              'tw-text-[#4caf50]': step.active || formData?.progress === 100,
              'tw-text-[#0d31e0]':
                step.completed && !step.active && formData?.progress !== 100,
            }"
          >
            <v-btn
              class="tw-px-2 tw-py-1"
              :class="{
                'tw-text-[#4caf50]': step.active || formData?.progress === 100,
                'tw-text-[#0d31e0]':
                  step.completed && !step.active && formData?.progress !== 100,
              }"
              @click="handleStepClick(step.id)"
              :disabled="formData?.progress === 100"
              tile
              flat
              text
            >
              <div class="tw-flex tw-items-center tw-flex-col">
                <v-img
                  width="30"
                  height="30"
                  :src="`${step.imgUrl}`"
                  class="tw-mx-auto"
                ></v-img>
                <span class="tw-m-auto tw-mt-1 tw-capitalize">{{
                  step.name
                }}</span>
              </div>
            </v-btn>

            <!-- Hiển thị icon mũi tên giữa các bước -->
            <v-icon
              class="tw-ml-2"
              :class="{
                'tw-text-[#4caf50]': step.active || formData?.progress === 100,
                'tw-text-[#0d31e0]':
                  step.completed && !step.active && formData?.progress !== 100,
              }"
              v-if="index < steps.length - 1"
              icon="mdi-chevron-right"
            ></v-icon>
          </v-col>
        </v-row>
      </v-container>

      <v-divider
        :thickness="2"
        class="border-opacity-75 tw-mt-3"
        color="info"
      ></v-divider>

      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-card>
  </v-dialog>
  <v-snackbar
    rounded="pill"
    v-model="snackbar.visible"
    :color="snackbar.color"
    timeout="2000"
  >
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbar.visible = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup>
import { FILE_URL } from '@/constants'
import { useProjectStore } from '@/stores/project'
import { useProjectProcessStore } from '@/stores/projectProcess'
import { projectStatusTranslations } from '@/utils/translations'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'

const projectStore = useProjectStore()
const projectProcess = useProjectProcessStore()
const router = useRouter()

// variable
const projects = computed(() => projectStore.getProject)
const steps = computed(() => projectProcess.getSteps)
const dialogVisible = ref(false)
const formData = ref(null)
const snackbar = ref({
  visible: false,
  message: '',
  color: 'error',
})

const handleProjectClick = (project) => {
  formData.value = project
  projectProcess.setActiveStep(1)
  openDialog(project)
}

const handleStepClick = (stepId) => {
  if (formData.value.progress === 100 && stepId !== steps.length) {
    return
  }
  projectProcess.setActiveStep(stepId)
  switch (stepId) {
    case 1:
      router.push({
        name: 'projectDetail',
        params: { projectId: formData.value.id },
      })
      break
    case 2:
      router.push({ name: 'designs', params: { projectId: formData.value.id } })
      break
    case 3:
      router.push({ name: 'print', params: { projectId: formData.value.id } })
      break
    case 4:
      router.push({
        name: 'delivery',
        params: { projectId: formData.value.id },
      })
      break
    default:
      console.error('Unknown step id:', stepId)
  }
}

// computed
const openDialog = async (item = null) => {
  dialogVisible.value = true
  formData.value = item

  if (formData.value.progress === 100) {
    projectProcess.setActiveStep(steps.value.length)
    router.push({
      name: 'delivery',
      params: { projectId: formData.value.id },
    })
  } else if (formData.value.progress === 25) {
    projectProcess.setActiveStep(3)
    router.push({
      name: 'print',
      params: { projectId: formData.value.id },
    })
  } else {
    projectProcess.setActiveStep(1)
    router.push({ name: 'projectDetail', params: { projectId: item.id } })
  }
}

const closeDialog = async () => {
  router.push({ name: 'projects' })
  dialogVisible.value = false
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
