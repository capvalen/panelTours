import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useGuiasStore = defineStore('guias', {
	state: () => ({
		guias: [],
		guiaActual: null,
	}),

	actions: {
		async listar() {
			const response = await api.get('/guias');
			this.guias = response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/guias?buscar=' + termino);
			this.guias = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/guias/${id}`);
			this.guiaActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/guias', datos);
			this.guias.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/guias/${id}`, datos);

			const index = this.guias.findIndex(g => g.id === id);
			if (index !== -1) {
				this.guias[index] = response.data;
			}

			if (this.guiaActual && this.guiaActual.id === id) {
				this.guiaActual = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/guias/${id}`);

			this.guias = this.guias.filter(g => g.id !== id);

			if (this.guiaActual && this.guiaActual.id === id) {
				this.guiaActual = null;
			}

			return true;
		},
	},
});
