// src/plugins/toastification.js
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

export default {
  install(app) {
    app.use(Toast, options)
  },
}
