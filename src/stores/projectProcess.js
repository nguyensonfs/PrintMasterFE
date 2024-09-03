import { defineStore } from 'pinia'

export const useProjectProcessStore = defineStore('projectProcess', {
  state: () => ({
    steps: [
      {
        id: 1,
        name: 'Dự án',
        imgUrl: '/src/assets/icons/project.svg',
        completed: false,
        active: false,
      },
      {
        id: 2,
        name: 'Thiết kế',
        imgUrl: '/src/assets/icons/design.svg',
        completed: false,
        active: false,
      },
      {
        id: 3,
        name: 'In ấn',
        imgUrl: '/src/assets/icons/print.svg',
        completed: false,
        active: false,
      },
      {
        id: 4,
        name: 'Giao hàng',
        imgUrl: '/src/assets/icons/delivery.svg',
        completed: false,
        active: false,
      },
    ],
    currentStep: 1,
  }),
  getters: {
    getSteps: (state) => state.steps,
  },
  actions: {
    setActiveStep(stepId) {
      this.steps.forEach((step) => {
        step.active = step.id === stepId
        step.completed = step.id < stepId
      })
      this.currentStep = stepId
    },
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.setActiveStep(this.currentStep + 1)
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.setActiveStep(this.currentStep - 1)
      }
    },
    completeStep(stepId) {
      const step = this.steps.find((step) => step.id === stepId)
      if (step) {
        step.completed = true
      }
    },
  },
})
