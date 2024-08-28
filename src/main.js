// Plugins
import { registerPlugins } from '@/plugins'

//Css
import './assets/css/main.css'
import 'vue-toastification/dist/index.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(fas, fab, far)

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

registerPlugins(app)
app.component('font-awesome-icon', FontAwesomeIcon)
const authStore = useAuthStore()
authStore.autoLogin()
app.mount('#app')
