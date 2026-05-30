import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useCotizacionStore = defineStore('cotizacion', {
	state: () => ({
		cotizaciones: [],
		cotizacionActual: null,
	}),

	actions: {
		async listar() {
			const response = await api.get('/cotizacion');
			this.cotizaciones = response.data;
			return response.data;
		},

		async listarConFiltros(fecha = '', search = '') {
			const params = {};
			if (fecha) params.fecha = fecha;
			if (search) params.search = search;
			params.limit = 50;
			const response = await api.get('/cotizacion', { params });
			this.cotizaciones = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/cotizacion/${id}`);
			this.cotizacionActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/cotizacion', datos);
			this.cotizaciones.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/cotizacion/${id}`, datos);

			const index = this.cotizaciones.findIndex(v => v.id === id);
			if (index !== -1) {
				this.cotizaciones[index] = response.data;
			}

			if (this.cotizacionActual && this.cotizacionActual.id === id) {
				this.cotizacionActual = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/cotizacion/${id}`);
			this.cotizaciones = this.cotizaciones.filter(v => v.id !== id);
			if (this.cotizacionActual && this.cotizacionActual.id === id) {
				this.cotizacionActual = null;
			}
			return true;
		},

		async convertirReserva(id) {
			const response = await api.post(`/cotizacion/${id}/convertir-reserva`);
			return response.data;
		},
	},
});
