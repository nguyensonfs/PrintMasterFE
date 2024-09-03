import {
  createProjectAPI,
  getAllProjectAPI,
  createProjectDesignAPI,
  approvedProjectDesignAPI,
} from '@/apis/projectServices'
import { defineStore } from 'pinia'
export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    loading: false,
    error: null,
    projectDesigns: [],
  }),
  getters: {
    getProject: (state) => state.projects,
    getProjectById: (state) => (id) => {
      return state.projects.find((project) => project.id === id)
    },
    getProjectDesigns: (state, getters) => (id) => {
      const project = state.projects.find((project) => project.id === id)
      return project ? project.designs : []
    },
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
    async createProjectDesign(id, data) {
      try {
        const response = await createProjectDesignAPI(id, data)
        return response
      } catch (error) {
        this.error = error
      }
    },
    async approveProjectDesign(projectId, designId, data) {
      try {
        const response = await approvedProjectDesignAPI(
          projectId,
          designId,
          data
        )
        return response
      } catch (error) {
        this.error = error
      }
    },
  },
})
