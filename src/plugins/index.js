/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import registerLayouts from '@/utils/registerLayouts'
import router from '@/router'
import Toast from './toastification'
import pinia from './pinia'

export function registerPlugins(app) {
  app.use(vuetify)
  app.use(registerLayouts)
  app.use(router)
  app.use(Toast)
  app.use(pinia)
}
