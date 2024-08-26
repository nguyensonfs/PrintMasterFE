import { defineStore } from 'pinia'
export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    openDrawer() {
      this.isOpen = true
    },
    closeDrawer() {
      this.isOpen = false
    },
    toggleDrawer() {
      this.isOpen = !this.isOpen
    },
  },
})
