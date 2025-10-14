
import { createApp } from 'vue'
import Principal from './Principal.vue'
import router from './router'

// Importar estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
// Importar JS de Bootstrap (opcional, solo si usas componentes interactivos)
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'; 

const app = createApp(Principal)

app.use(router)

app.mount('#app')
