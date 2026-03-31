// stores/archivoStore.js
import { defineStore } from 'pinia'
import api from '@/services/axios'

export const useArchivoStore = defineStore('archivo', {
	state: () => ({
		cargando: false,
		error: null,
		resultado: null,
	}),

	actions: {
		async subir(archivo) {
			this.cargando = true
			this.error = null

			if(archivo == undefined || !archivo){
				 this.error ='archivo vacío'
				 this.cargando=false
				 return
			}

			const formData = new FormData()
			formData.append('archivo', archivo)

			try {
				const { data } = await api.post('/archivos', formData, )
				this.resultado = data
				return data
			} catch (err) {
				console.log(err.response?.data)
				this.error = err.response?.data?.message ?? 'Error al subir'
			} finally {
				this.cargando = false
			}
		},
	},
})