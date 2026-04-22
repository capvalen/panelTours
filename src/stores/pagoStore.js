import { defineStore } from 'pinia';
import api from '@/services/axios';

export const usePagosStore = defineStore('pagos', {
	state: () => ({
		pagos: [],
		pagoActual: null,
	}),

	actions: {
		async listar() {
			const response = await api.get('/pagos');
			this.pagos = response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/pagos?buscar=' + termino);
			this.pagos = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/pagos/${id}`);
			this.pagoActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/pagos', datos);
			this.pagos.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/pagos/${id}`, datos);

			const index = this.pagos.findIndex(p => p.id === id);
			if (index !== -1) {
				this.pagos[index] = response.data;
			}

			if (this.pagoActual && this.pagoActual.id === id) {
				this.pagoActual = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/pagos/${id}`);

			this.pagos = this.pagos.filter(p => p.id !== id);

			if (this.pagoActual && this.pagoActual.id === id) {
				this.pagoActual = null;
			}

			return true;
		},
	},
});