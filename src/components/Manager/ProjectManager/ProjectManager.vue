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
        <v-img height="200" :src="`${FILE_URL}${project.imageDescription}`" cover></v-img>
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
  <v-dialog v-model="dialogVisible" transition="dialog-bottom-transition" fullscreen>
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
        <v-row>
          <v-breadcrumbs class="tw-justify-center tw-items-center tw-h-[60px] tw-mx-auto">
            <v-breadcrumbs-item v-for="(item, index) in items" :key="index">
              <router-link
                :to="getItemUrl(item)"
                cols="auto"
                class="tw-h-[60px]"
                exact-active-class="tw-font-bold tw-text-blue-600 tw-border-blue-600"
              >
                <v-img
                  width="30"
                  height="30"
                  :src="`${item.imgUrl}`"
                  class="tw-mx-auto"
                  :class="{
                    'tw-fill-current tw-text-blue-600': isActive(item),
                    'tw-fill-current tw-text-gray-500': !isActive(item),
                  }"
                ></v-img>
                <span>{{ item.title }}</span>
              </router-link>
              <template v-if="index < items.length - 1">
                <v-breadcrumbs-divider>
                  <v-icon icon="mdi-chevron-right"></v-icon>
                </v-breadcrumbs-divider>
              </template>
            </v-breadcrumbs-item>
          </v-breadcrumbs>
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
</template>
<script setup>
import { FILE_URL } from "@/constants";
import { useProjectStore } from "@/stores/project";
import { projectStatusTranslations } from "@/utils/translations";
import "@vuepic/vue-datepicker/dist/main.css";
import dayjs from "dayjs";
import { onMounted } from "vue";
const activeItems = ref([]);

const toast = useToast();
const projectStore = useProjectStore();
const router = useRouter();
const route = useRoute();

// variable
const projects = computed(() => projectStore.getProject);
const dialogVisible = ref(false);
const formData = ref(null);

const items = [
  {
    imgUrl: "/src/assets/icons/project.svg",
    title: "Dự án",
    url: { name: "projectDetail" },
  },
  {
    imgUrl: "/src/assets/icons/design.svg",
    title: "Thiết kế",
    url: { name: "designs" },
  },
  // {
  //   imgUrl: '/src/assets/icons/print.svg',
  //   title: 'In ấn',
  //   url: { name: 'projectDetail' },
  // },
  // {
  //   imgUrl: '/src/assets/icons/delivery.svg',
  //   title: 'Giao hàng',
  //   url: { name: 'projectDetail' },
  // },
];

const getItemUrl = (item) => {
  if (item.title === "Dự án" && formData.value) {
    return { name: "projectDetail", params: { projectId: formData.value.id } };
  }
  if (item.title === "Thiết kế" && formData.value) {
    return { name: "designs", params: { projectId: formData.value.id } };
  }
  return item.url;
};

const isActive = (item) => {
  const { name, params } = getItemUrl(item);
  const active =
    route.name === name && JSON.stringify(route.params) === JSON.stringify(params);
  return active;
};

// computed
const openDialog = async (item = null) => {
  dialogVisible.value = true;
  formData.value = item;

  router.push({ name: "projectDetail", params: { projectId: item.id } });
  if (item) {
    activeItems.value = items.map((i) => (isActive(i) ? i.title : null)).filter(Boolean);
  }
};

const closeDialog = async () => {
  router.push({ name: "projects" });
  dialogVisible.value = false;
};

const formatDate = (date) => {
  return date ? dayjs(date).format("DD/MM/YYYY") : "Không có ngày";
};

const translateStatus = (status) => {
  return projectStatusTranslations[status] || status;
};

// onMounted
onMounted(() => {
  projectStore.fetchAllProject();
});
</script>
