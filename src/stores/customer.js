import { getCustomersAPI } from '@/apis/customerService'
import { defineStore } from 'pinia'
export const useCustomerStore = defineStore('customer', {
  state: () => ({
    allCustomers: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAllCustomers() {
      this.loading = true
      try {
        const response = await getCustomersAPI()
        this.allCustomers = response
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
})
