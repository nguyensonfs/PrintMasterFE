<template>
  <v-row>
    <v-col class="d-flex justify-end" cols="12">
      <v-btn icon="mdi-plus" color="primary" @click="openDialog('add')"></v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col
      class="tw-justify-center tw-flex"
      cols="3"
      v-for="department in departments"
      :key="department.id"
    >
      <!-- Button triggers -->
      <v-card
        max-width="400"
        :title="department.name"
        :subtitle="department.description"
        variant="outlined"
      >
        <template v-slot:text>
          <span>Số nhân viên : {{ department.numberOfMember }}</span
          ><br />
          <span>Trưởng phòng : {{ department.managerName }}</span>
        </template>
        <v-divider :thickness="3"></v-divider>
        <v-card-actions>
          <v-btn color="primary" @click="openDialog('edit', department)"
            >Sửa</v-btn
          >
          <v-btn color="secondary" @click="openDialog('changeHead', department)"
            >Đổi Trưởng Phòng</v-btn
          >
          <v-btn color="red" @click="openDialog('delete', department)"
            >Xóa</v-btn
          >
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
</template>
<script setup>
import * as teamService from '@/apis/teamServices'
import * as userServices from '@/apis/userServices'

const toast = useToast()

const dialogVisible = ref(false)
const mode = ref('') // 'add', 'edit', 'delete', or 'changeHead'
const departments = ref([])
const availableHeads = ref(['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'])

const formData = ref({
  id: null,
  name: '',
  description: '',
  managerId: '',
  numberOfMember: '',
  managerName: '',
})

const dialogTitle = computed(() => {
  switch (mode.value) {
    case 'add':
      return 'Thêm Phòng Ban'
    case 'edit':
      return 'Sửa Phòng Ban'
    case 'delete':
      return 'Xóa Phòng Ban'
    case 'changeHead':
      return 'Đổi Trưởng Phòng'
    default:
      return ''
  }
})

const openDialog = (actionMode, department = null) => {
  mode.value = actionMode

  if (['edit', 'delete', 'changeHead'].includes(actionMode)) {
    setFormData(department)
  } else if (actionMode === 'add') {
    resetForm()
  }

  dialogVisible.value = true
}

const setFormData = (department) => {
  formData.value = {
    id: department?.id || null,
    name: department?.name || '',
    description: department?.description || '',
    managerId: department?.managerId || '',
    numberOfMember: department?.numberOfMember || '',
    managerName: department?.managerName || '',
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    description: '',
    managerId: '',
    numberOfMember: '',
    managerName: '',
  }
}

const fetchDepartments = async () => {
  try {
    const response = await teamService.getTeamAPI()
    departments.value = response
  } catch (error) {
    console.error('Failed to fetch departments', error)
  }
}

const fetchManagers = async () => {
  const res = await userServices.getUserRoleManagerAPI()
  availableHeads.value = res
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

const deleteDepartment = async () => {
  try {
    await teamService.delTeamAPI(formData.value.id)
    const index = departments.value.findIndex(
      (dep) => dep.id === formData.value.id
    )
    if (index !== -1) {
      departments.value.splice(index, 1)
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('Failed to delete department', error)
  }
}

const changeHead = async () => {
  try {
    const response = await teamService.changeManagerTeamAPI(
      formData.value.id,
      formData.value.managerId
    )
    if (response.status === 200) {
      toast.success(response.message)
    }
    const index = departments.value.findIndex(
      (dep) => dep.id === formData.value.id
    )
    if (index !== -1) {
      departments.value[index].managerName = response.data.managerName
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('Failed to change department head', error)
  }
}

onMounted(() => {
  fetchDepartments()
  fetchManagers()
})
</script>
