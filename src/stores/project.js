import { createProjectAPI, getAllProjectAPI } from '@/apis/projectServices'
import { defineStore } from 'pinia'
export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    loading: false,
    error: null,
  }),
  getters: {
    getProject: (state) => state.projects,
  },
  actions: {
    async fetchAllProject() {
      this.loading = true
      try {
        const response = await getAllProjectAPI()
        this.projects = response
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async createProject(data) {
      try {
        const response = await createProjectAPI(data)
        return response
      } catch (error) {
        this.error = error
      }
    },
    toggleDrawer() {
      this.isOpen = !this.isOpen
    },
  },
})
