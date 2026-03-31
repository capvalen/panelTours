import { defineStore } from 'pinia';
import api from '@/services/axios';

//Options API
export const useDeudasStore = defineStore('deudas', {
	state: () => ({
		deudas: [],
		deudaActual: null,
	}),

	actions: {
		

		async guardar(datos) {
			const response = await api.post('/deudas', datos);
			// Opcional: Agregar a la lista local para mantener la UI actualizada
			this.deudas.unshift(response.data);
			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/deudas/${id}`);

			this.deudas = this.deudas.filter(d => d.id !== id);
			
			// Limpiar deudaActual si era la que se eliminó
			if (this.deudaActual && this.deudaActual.id === id) {
				this.deudaActual = null;
			}

			return true;
		},
	},
});