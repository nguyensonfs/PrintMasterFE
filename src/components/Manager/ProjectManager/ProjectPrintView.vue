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
        :value="project.id"
        :disabled="true"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Quản lý</div>
      <v-text-field
        density="compact"
        required
        outlined
        clearable
        variant="outlined"
        :value="project.leader"
        :disabled="true"
        readonly
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Loại máy móc</div>
      <v-select
        density="compact"
        color="primary"
        :items="resourceDetails"
        item-title="name"
        item-value="id"
        variant="outlined"
        v-model="selectedResourceId"
        placeholder="Chọn loại máy móc"
      ></v-select>
    </v-col>
    <v-col>
      <div class="text-subtitle-1 text-medium-emphasis">Tên đơn hàng</div>
      <v-text-field
        density="compact"
        :disabled="true"
        required
        clearable
        readonly
        variant="outlined"
        :value="project.projectName"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Ngày đặt</div>
      <v-text-field
        density="compact"
        :disabled="true"
        required
        outlined
        clearable
        variant="outlined"
        :value="formatDate(project.startDate)"
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col>
      <v-card class="tw-p-2">
        <v-card-title class="tw-pl-0 tw-text-[16px]"
          >Thông tin dự án</v-card-title
        >
        <v-img
          min-height="200px"
          width="200px"
          :src="`${FILE_URL}${approvedDesign.designImage}`"
        ></v-img>
        <v-card-text class="tw-flex tw-justify-between"
          ><span>Giá dự án: </span
          ><span>{{ project.startingPrice }}đ</span></v-card-text
        >
        <v-card-text class="tw-flex tw-justify-between tw-pt-0"
          ><span>Tên dự án: </span
          ><span>{{ project.projectName }}</span></v-card-text
        >
      </v-card>
      <v-card class="tw-p-2">
        <v-card-text class="tw-flex tw-justify-between"
          ><span>Thành tiền: </span
          ><span>{{ project.startingPrice }}đ</span></v-card-text
        >
        <v-card-actions>
          <v-btn color="white" block class="tw-capitalize tw-bg-violet-500"
            >Bắt đầu in</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
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
</template>
<script setup>
import { useProjectStore } from '@/stores/project'
import { useResourceStore } from '@/stores/resource'
import dayjs from 'dayjs'
import { FILE_URL } from '@/constants'

const props = defineProps({
  projectId: String,
})

const projectStore = useProjectStore()
const resourceStore = useResourceStore()

const project = computed(() => projectStore.getProjectById(props.projectId))
const designs = computed(() => projectStore.getProjectDesigns(props.projectId))
const resourceDetails = computed(() => {
  return resourceStore.getResourceDetails
})

const selectedResourceId = ref(null)

const snackbar = ref({
  visible: false,
  message: '',
  color: 'error',
})

const formatDate = (date) => {
  return date ? dayjs(date).format('DD/MM/YYYY') : 'Không có ngày'
}

const approvedDesign = computed(() => {
  return designs.value.find(
    (design) => design.designStatus === 'HasBeenApproved'
  )
})

onMounted(async () => {
  await resourceStore.fetchResourceDetailsByName('Machinery')
})
</script>
