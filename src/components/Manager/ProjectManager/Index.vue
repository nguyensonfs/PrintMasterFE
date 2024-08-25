<template>
  <div>
    <v-row class="tw-gap-x-2 tw-flex-nowrap tw-justify-between">
      <v-text-field
        v-model="search"
        density="compact"
        label="Tìm kiếm dự án"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        max-width="300"
        flat
        hide-details
        single-line
      ></v-text-field>
      <v-select
        max-width="300"
        density="compact"
        label="Lọc leader"
        :items="leaders"
        item-value="id"
        item-title="fullName"
        variant="outlined"
      ></v-select>
      <VueDatePicker
        class="tw-w-[300px]"
        v-model="formData.startDate"
        :format="dateFormat"
        label="Ngày bắt đầu"
        placeholder="yyyy-mm-dd"
      />
      <VueDatePicker
        class="tw-w-[300px]"
        v-model="formData.endDate"
        :format="dateFormat"
        label="Ngày kết thúc"
        placeholder="yyyy-mm-dd"
      />
      <v-select
        max-width="300"
        density="compact"
        label="Lọc leader"
        :items="leaders"
        item-value="id"
        item-title="fullName"
        variant="outlined"
      ></v-select>
      <v-btn
        icon="mdi-plus"
        size="small"
        @click="openDialog('add')"
        color="primary"
      >
      </v-btn>
    </v-row>
    <v-empty-state
      class="tw-mt-[150px]"
      v-if="!projects || projects.length === 0"
      title="Không có dự án nào"
      description="Bạn có thể thêm một dự án mới để bắt đầu."
      icon="mdi-folder-open"
    >
    </v-empty-state>

    <v-row v-else>
      <v-col v-for="(project, index) in projects" :key="index" cols="12" md="4">
        <v-card>
          <v-card-title>{{ project.name }}</v-card-title>
          <v-card-text>{{ project.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary">Xem chi tiết</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- Dynamic Dialog -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text>
          <!-- Add/Edit Form -->
          <v-form v-if="mode !== 'delete' && mode !== 'changeHead'" ref="form">
            <v-text-field
              v-model="formData.name"
              label="Tên Phòng Ban"
              required
            ></v-text-field>
            <v-text-field
              v-model="formData.description"
              label="Mô Tả"
            ></v-text-field>
            <v-select
              v-model="formData.managerId"
              :items="availableHeads"
              item-value="id"
              item-title="fullName"
              label="Chọn Trưởng Phòng Mới"
              required
            ></v-select>
          </v-form>

          <!-- Change Head Form -->
          <v-form v-if="mode === 'changeHead'" ref="form">
            <v-select
              v-model="formData.managerId"
              :items="availableHeads"
              item-value="id"
              item-title="fullName"
              label="Chọn Trưởng Phòng Mới"
              required
            ></v-select>
          </v-form>

          <!-- Delete Confirmation -->
          <div v-if="mode === 'delete'">
            Bạn có chắc chắn muốn xóa phòng ban "{{ formData.name }}" không?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            v-if="mode === 'add' || mode === 'edit'"
            @click="saveChanges"
          >
            {{ mode === 'add' ? 'Thêm' : 'Lưu' }}
          </v-btn>
          <v-btn
            color="secondary"
            v-if="mode === 'changeHead'"
            @click="changeHead"
            >Đổi</v-btn
          >
          <v-btn color="red" v-if="mode === 'delete'" @click="deleteDepartment"
            >Xóa</v-btn
          >
          <v-btn @click="dialogVisible = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import * as projectServices from '@/apis/projectServices'
import * as userService from '@/apis/userServices'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'

const toast = useToast()

// variable
const mode = ref('')
const projects = ref([])
const leaders = ref([])
const dialogVisible = ref(false)
const search = ref([])
const dateFormat = 'yyyy-mm-dd'
const formData = ref({
  id: null,
  projectName: '',
  startDate: null,
  endDate: null,
  leaderId: '',
  customerId: '',
})

// computed
const dialogTitle = computed(() => {
  switch (mode.value) {
    case 'add':
      return 'Thêm dự án'
    case 'edit':
      return 'Sửa dự án'
    case 'delete':
      return 'Xoá dự án'
    default:
      return ''
  }
})

// methods
const fetchProjects = async () => {
  const res = await projectServices.getAllProjectAPI()
  console.log('🚀 ~ fetchProjects ~ res:', res)
}

const fetchLeaders = async () => {
  const res = await userService.getUserRoleLeaderAPI()
  leaders.value = res
  console.log('🚀 ~ fetchProjects ~ res:', res)
}

const saveChanges = async () => {
  try {
    if (mode.value === 'add') {
      const payload = {
        name: formData.value.name,
        description: formData.value.description,
        managerId: formData.value.managerId,
      }
      const response = await teamService.createTeamAPI(payload)
      if (response.status === 200) {
        toast.success(response.message)
      }
      departments.value.push(response.data)
    } else if (mode.value === 'edit') {
      const payload = {
        name: formData.value.name,
        description: formData.value.description,
        managerId: formData.value.managerId,
      }
      const response = await teamService.updateTeamAPI(
        formData.value.id,
        payload
      )
      if (response.status === 200) {
        toast.success(response.message)
      }
      const index = departments.value.findIndex(
        (dep) => dep.id === formData.value.id
      )
      if (index !== -1) {
        departments.value[index] = response.data
      }
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('Failed to save changes', error)
  }
}

const openDialog = async (actionMode, item = null) => {
  mode.value = actionMode

  if (['addRole', 'delete', 'changeTeam'].includes(actionMode)) {
    setFormData(item)
  }
  if (actionMode === 'addRole') {
    await getRoles()
    await getUserRoles(item.id)
  }
  dialogVisible.value = true
}

const setFormData = (item) => {
  formData.value = {
    id: item?.id || null,
    fullName: item?.fullName || '',
    email: item?.email || '',
    phoneNumber: item?.phoneNumber || '',
    avatar: item?.avatar || '',
    teamName: item?.teamName || '',
    teamId: item?.teamId || '',
  }
}

// onMounted
onMounted(() => {
  fetchProjects()
  fetchLeaders()
})
</script>
