
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

//importando dayjs
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'

// Importar estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
// Importar JS de Bootstrap (opcional, solo si usas componentes interactivos)
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'; 

const pinia = createPinia()
const app = createApp(App)

//config pinia persistente
pinia.use(piniaPluginPersistedstate)

//config dayjs
dayjs.extend(relativeTime)
dayjs.locale('es')

app.use(pinia)
app.use(router)
app.config.globalProperties.$dayjs = dayjs

app.mount('#app')
