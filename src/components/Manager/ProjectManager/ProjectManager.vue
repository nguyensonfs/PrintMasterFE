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
          ></v-btn>
        </template>
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
</template>
<script setup>
import * as userService from '@/apis/userServices'
import { FILE_URL } from '@/constants'
import { useProjectStore } from '@/stores/project'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'
import { onMounted } from 'vue'

const toast = useToast()
const projectStore = useProjectStore()

// variable
const projects = computed(() => projectStore.getProject)
const mode = ref('')
const leaders = ref([])
const dialogVisible = ref(false)

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

const fetchLeaders = async () => {
  const res = await userService.getUserRoleLeaderAPI()
  leaders.value = res
}

const formatDate = (date) => {
  return date ? dayjs(date).format('DD/MM/YYYY') : 'Không có ngày'
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
  projectStore.fetchAllProject()
  fetchLeaders()
})
</script>
