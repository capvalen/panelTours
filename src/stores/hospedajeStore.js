import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useHospedajesStore = defineStore('hospedajes', {
	state: () => ({
		hospedajes: [],
		hospedajeActual: null,
	}),

	actions: {
		async listar() {
			const response = await api.get('/hospedajes');
			this.hospedajes = response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/hospedajes?buscar=' + termino);
			this.hospedajes = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/hospedajes/${id}`);
			this.hospedajeActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/hospedajes', datos);
			this.hospedajes.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/hospedajes/${id}`, datos);

			const index = this.hospedajes.findIndex(h => h.id === id);
			if (index !== -1) {
				this.hospedajes[index] = response.data;
			}

			if (this.hospedajeActual && this.hospedajeActual.id === id) {
				this.hospedajeActual = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/hospedajes/${id}`);

			this.hospedajes = this.hospedajes.filter(h => h.id !== id);

			if (this.hospedajeActual && this.hospedajeActual.id === id) {
				this.hospedajeActual = null;
			}

			return true;
		},
	},
});
