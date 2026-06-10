import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useComisionesStore = defineStore('comisiones', {
	state: () => ({
		comisiones: [],
		comisionActual: null,
	}),

	actions: {
		async listar(params = {}) {
			const response = await api.get('/comisiones', { params });
			this.comisiones = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/comisiones/${id}`);
			this.comisionActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/comisiones', datos);
			this.comisiones.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/comisiones/${id}`, datos);
			const index = this.comisiones.findIndex(c => c.id === id);
			if (index !== -1) {
				this.comisiones[index] = response.data;
			}
			if (this.comisionActual && this.comisionActual.id === id) {
				this.comisionActual = response.data;
			}
			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/comisiones/${id}`);
			this.comisiones = this.comisiones.filter(c => c.id !== id);
			if (this.comisionActual && this.comisionActual.id === id) {
				this.comisionActual = null;
			}
			return true;
		},
	},
});
