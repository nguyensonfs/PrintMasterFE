// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
  },
  icons: {
    iconfont: 'mdi',
    values: {
      mdi: 'mdi',
    },
  },
})
