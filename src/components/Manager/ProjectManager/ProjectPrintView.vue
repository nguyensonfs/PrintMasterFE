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
      <v-table class="tw-mt-3" fixed-header height="260px">
        <thead>
          <tr>
            <th class="text-left">Tài nguyên</th>
            <th class="tw-text-center">Số lượng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in resourceConsumable" :key="item.id">
            <td>{{ item.name }}</td>
            <td class="tw-text-center">
              <v-btn
                size="small"
                color="primary"
                class="tw-p-0"
                @click="decreaseQuantity(index)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="tw-mx-2 tw-text-center">{{ item.quantity }}</span>
              <v-btn
                size="small"
                color="primary"
                class="tw-p-0"
                @click="increaseQuantity(index)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
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
          <v-btn
            color="white"
            @click="sendPrintJob"
            block
            class="tw-capitalize tw-bg-violet-500"
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
import { getResourcesByNameAPI } from '@/apis/resourceServices'
import { createPrintJobsAPI } from '@/apis/printJobServices'
import { useResourceStore } from '@/stores/resource'
import { useProjectProcessStore } from '@/stores/projectProcess'
import { useErrorHandler } from '@/mixins/errorMixin'
import dayjs from 'dayjs'
import { FILE_URL } from '@/constants'

const props = defineProps({
  projectId: String,
})

const { handleApiError } = useErrorHandler()

const projectStore = useProjectStore()
const resourceStore = useResourceStore()
const projectProcess = useProjectProcessStore()
const router = useRouter()

const project = computed(() => projectStore.getProjectById(props.projectId))
const designs = computed(() => projectStore.getProjectDesigns(props.projectId))
const resourceDetails = computed(() => {
  return resourceStore.getResourceDetails
})

const selectedResourceId = ref(null)
const resourceConsumable = ref([])

const snackbar = ref({
  visible: false,
  message: '',
  color: 'error',
})

const showSnackbar = (message, color = 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.visible = true
}

const formatDate = (date) => {
  return date ? dayjs(date).format('DD/MM/YYYY') : 'Không có ngày'
}

const approvedDesign = computed(() => {
  return designs.value.find(
    (design) => design.designStatus === 'HasBeenApproved'
  )
})

const getResourceConsumable = async (resourceName) => {
  const response = await getResourcesByNameAPI(resourceName)
  if (response) {
    const filteredResources = response.filter(
      (resource) => resource.resourceName === resourceName
    )

    resourceConsumable.value = filteredResources.flatMap((resource) =>
      resource.resourceProperties.flatMap((property) =>
        property.resourcePropertyDetails.map((detail) => ({
          ...detail,
          quantity: 1,
        }))
      )
    )
    return resourceConsumable.value
  }
  return []
}

const sendPrintJob = async () => {
  try {
    const requestData = {
      designId: approvedDesign.value.id,
      resourceForPrints: [
        ...resourceConsumable.value.map((item) => ({
          resourcePropertyDetailId: item.id,
          quantity: item.quantity,
        })),
        {
          resourcePropertyDetailId: selectedResourceId.value,
          quantity: 1,
        },
      ],
    }

    const response = await createPrintJobsAPI(requestData)
    await projectStore.fetchAllProject()
    if (response.status === 200) {
      showSnackbar(response.message, 'success')
      markStepAsCompleted(3)
      router.push({ name: 'delivery', params: { projectId: props.projectId } })
      projectProcess.setActiveStep(4)
    }
  } catch (error) {
    const errorMessage = handleApiError(error)
    showSnackbar(errorMessage, 'error')
  }
}

const markStepAsCompleted = (stepId) => {
  projectProcess.completeStep(stepId)
}

const increaseQuantity = (index) => {
  resourceConsumable.value[index].quantity++
}

const decreaseQuantity = (index) => {
  if (resourceConsumable.value[index].quantity > 1) {
    resourceConsumable.value[index].quantity--
  }
}

onMounted(async () => {
  await resourceStore.fetchResourceDetailsByName('Machinery')
  getResourceConsumable('Office supplies')
})
</script>
