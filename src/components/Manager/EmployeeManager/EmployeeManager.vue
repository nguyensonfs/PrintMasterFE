<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-video-input-component"></v-icon> &nbsp; Quản lý nhân viên
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="employees"
      :sort-by="[{ key: 'fullName', order: 'asc' }]"
      v-model:search="search"
    >
      <template v-slot:[`item.avatar`]="{ item }">
        <v-avatar size="40px">
          <img :src="item.avatar" alt="Avatar" />
        </v-avatar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon variant="plain" @click="openDialog('changeTeam', item)">
          <v-icon> mdi-account-group </v-icon>
          <v-tooltip activator="parent" location="top">Cập nhật phòng ban</v-tooltip>
        </v-btn>
        <v-btn icon variant="plain" @click="openDialog('addRole', item)">
          <v-icon> mdi-account </v-icon>
          <v-tooltip activator="parent" location="top">Cập nhật quyền hạn</v-tooltip>
        </v-btn>
        <v-btn icon variant="plain" @click="openDialog('delete', item)">
          <v-icon> mdi-delete </v-icon>
          <v-tooltip activator="parent" location="top">Xoá nhân viên</v-tooltip>
        </v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="fetchEmployees"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-subtitle v-if="mode === 'changeTeam'">
        Nhân viên: {{ formData.fullName }}
      </v-card-subtitle>
      <v-card-text>
        <!-- Change Team Form -->
        <v-form v-if="mode === 'changeTeam'" ref="form">
          <v-select
            v-model="formData.teamId"
            :items="teams"
            item-value="id"
            item-title="name"
            label="Chọn Phòng Ban"
            density="compact"
            variant="outlined"
            required
          ></v-select>
        </v-form>

        <!-- Add Roles -->
        <v-form v-if="mode === 'addRole'" ref="form">
          <v-select
            v-model="selectedPermissionNames"
            :items="allPermissions"
            item-value="roleName"
            item-title="roleName"
            label="Thêm Quyền"
            chips
            multiple
            @update:model-value="updateSelectedPermissions"
          ></v-select>
        </v-form>

        <!-- Delete Confirmation -->
        <div v-if="mode === 'delete'">
          Bạn có chắc chắn muốn xóa nhân viên "{{ formData.fullName }}" không?
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" v-if="mode === 'edit'" @click="saveChanges"> Lưu </v-btn>
        <v-btn color="primary" v-if="mode === 'addRole'" @click="saveChanges">
          Thêm
        </v-btn>
        <v-btn color="secondary" v-if="mode === 'changeTeam'" @click="changeTeam"
          >Đổi</v-btn
        >
        <v-btn color="red" v-if="mode === 'delete'" @click="deleteEmployee">Xóa</v-btn>
        <v-btn @click="dialogVisible = false">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import * as userService from "@/apis/userServices";
import * as teamService from "@/apis/teamServices";
import * as roleService from "@/apis/roleServices";

const toast = useToast();
const dialogVisible = ref(false);
const mode = ref("");
const headers = ref([
  {
    title: "HỌ VÀ TÊN",
    align: "start",
    sortable: false,
    key: "fullName",
  },
  { title: "EMAIL", key: "email" },
  { title: "SỐ ĐIỆN THOẠI", key: "phoneNumber" },
  { title: "ẢNH ĐẠI DIỆN", align: "center", key: "avatar" },
  { title: "ĐỘI NGŨ", key: "teamName" },
  { title: "ACTIONS", key: "actions", align: "center", sortable: false },
]);
const search = ref("");
const employees = ref([]);
const teams = ref([]);
const allPermissions = ref([]);
const userRoles = ref([]);
const selectedPermissionNames = ref([]);

const formData = ref({
  id: null,
  fullName: "",
  email: "",
  phoneNumber: "",
  avatar: "",
  teamName: "",
  teamId: "",
});
const dialogTitle = computed(() => {
  switch (mode.value) {
    case "addRole":
      return "Thêm Quyền Cho Nhân Viên";
    case "delete":
      return "Xóa Nhân Viên";
    case "changeTeam":
      return "Đổi Phòng Ban";
    default:
      return "";
  }
});
const openDialog = async (actionMode, item = null) => {
  mode.value = actionMode;

  if (["addRole", "delete", "changeTeam"].includes(actionMode)) {
    setFormData(item);
  }
  if (actionMode === "addRole") {
    await getRoles();
    userRoles.value = await getUserRoles(item.id);
    mapUserPermissionsToNames();
  }
  dialogVisible.value = true;
};

const setFormData = (item) => {
  formData.value = {
    id: item?.id || null,
    fullName: item?.fullName || "",
    email: item?.email || "",
    phoneNumber: item?.phoneNumber || "",
    avatar: item?.avatar || "",
    teamName: item?.teamName || "",
    teamId: item?.teamId || "",
  };
};

const mapUserPermissionsToNames = () => {
  if (userRoles.value && Array.isArray(userRoles.value)) {
    selectedPermissionNames.value = userRoles.value.slice();
  } else {
    selectedPermissionNames.value = [];
  }
};

const updateSelectedPermissions = (newPermissionNames) => {
  selectedPermissionNames.value = newPermissionNames;
};

const saveChanges = async () => {
  try {
    if (mode.value === "edit") {
      const payload = {
        name: formData.value.name,
        description: formData.value.description,
        managerId: formData.value.managerId,
      };
      const response = await teamService.updateTeamAPI(formData.value.id, payload);
      if (response.status === 200) {
        toast.success(response.message);
      }
      const index = departments.value.findIndex((dep) => dep.id === formData.value.id);
      if (index !== -1) {
        departments.value[index] = response.data;
      }
    }
    if (mode.value === "addRole") {
      const payload = selectedPermissionNames.value;
      const response = await userService.addRoleForUserAPI(formData.value.id, payload);
      if (response.status === 200) {
        toast.success(response.message);
      }
      const updatedEmployees = await fetchEmployees();
      employees.value = updatedEmployees;
    }
    dialogVisible.value = false;
  } catch (error) {
    console.error("Failed to save changes", error);
  }
};

const deleteEmployee = async () => {
  try {
    await teamService.delTeamAPI(formData.value.id);
    const index = employees.value.findIndex((dep) => dep.id === formData.value.id);
    if (index !== -1) {
      employees.value.splice(index, 1);
    }
    dialogVisible.value = false;
  } catch (error) {
    console.error("Failed to delete department", error);
  }
};

const changeTeam = async () => {
  try {
    const payload = {
      teamId: formData.value.teamId,
    };
    const response = await userService.changeTeamForUserAPI(formData.value.id, payload);
    if (response.status === 200) {
      toast.success(response.message);
    }
    const updatedEmployees = await fetchEmployees();
    employees.value = updatedEmployees;
    dialogVisible.value = false;
  } catch (error) {
    console.error("Failed to change department head", error);
  }
};

const fetchEmployees = async () => {
  const response = await userService.getAllUsersAPI();
  employees.value = response;
  return response;
};

const getUserRoles = async (userId) => {
  const response = await userService.getRoleUserByIdAPI(userId);

  if (response && Array.isArray(response)) {
    userRoles.value = response;
  } else {
    userRoles.value = [];
  }
  return response;
};

const getRoles = async () => {
  const response = await roleService.getRolesAPI();
  allPermissions.value = response;
};

const fetchTeams = async () => {
  const response = await teamService.getTeamAPI();
  teams.value = response;
};

onMounted(async () => {
  await fetchEmployees();
  await fetchTeams();
  await getRoles();
});
</script>
