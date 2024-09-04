import { defineStore } from 'pinia'
import { getResourcesByNameAPI } from '@/apis/resourceServices'

export const useResourceStore = defineStore('resource', {
  state: () => ({
    selectedResourceDetails: [],
  }),
  actions: {
    async fetchResourceDetailsByName(resourceName) {
      try {
        const response = await getResourcesByNameAPI(resourceName)
        if (response) {
          const filteredResources = response.filter(
            (resource) => resource.resourceName === resourceName
          )

          this.selectedResourceDetails = filteredResources.flatMap((resource) =>
            resource.resourceProperties.flatMap(
              (property) => property.resourcePropertyDetails
            )
          )
          return this.selectedResourceDetails
        }
        return []
      } catch (error) {
        console.log('🚀 ~ fetchResourceDetailsByName ~ error:', error)
        return []
      }
    },
  },
  getters: {
    getResourceDetails: (state) => state.selectedResourceDetails,
  },
})
