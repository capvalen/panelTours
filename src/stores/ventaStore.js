import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useVentasStore = defineStore('ventas', {
	state: () => ({
		ventas: [],
		ventaActual: null,
	}),

	actions: {
		async listar() {
			const response = await api.get('/ventas');
			this.ventas = response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/ventas?buscar=' + termino);
			this.ventas = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/ventas/${id}`);
			this.ventaActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/ventas', datos);
			this.ventas.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/ventas/${id}`, datos);

			const index = this.ventas.findIndex(v => v.id === id);
			if (index !== -1) {
				this.ventas[index] = response.data;
			}

			if (this.ventaActual && this.ventaActual.id === id) {
				this.ventaActual = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/ventas/${id}`);

			this.ventas = this.ventas.filter(v => v.id !== id);

			if (this.ventaActual && this.ventaActual.id === id) {
				this.ventaActual = null;
			}

			return true;
		},
	},
});
