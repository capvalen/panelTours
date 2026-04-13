import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useVuelosStore = defineStore('vuelos', {
	state: () => ({
		vuelos: [],
	}),

	actions: {
		async listar() {
			const response = await api.get('/vuelos');
			this.vuelos = response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/vuelos?buscar=' + termino);
			this.vuelos = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/vuelos', datos);
			this.vuelos.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/vuelos/${id}`, datos);

			const index = this.vuelos.findIndex(v => v.id === id);
			if (index !== -1) {
				this.vuelos[index] = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/vuelos/${id}`);
			this.vuelos = this.vuelos.filter(v => v.id !== id);
			return true;
		},
	},
});
