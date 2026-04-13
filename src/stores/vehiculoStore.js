import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useVehiculosStore = defineStore('vehiculos', {
	state: () => ({
		vehiculos: [],
		vehiculoActual: null,
	}),

	actions: {
		async listar() {
			const response = await api.get('/vehiculos');
			this.vehiculos = response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/vehiculos?buscar=' + termino);
			this.vehiculos = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/vehiculos/${id}`);
			this.vehiculoActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/vehiculos', datos);
			this.vehiculos.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/vehiculos/${id}`, datos);

			const index = this.vehiculos.findIndex(v => v.id === id);
			if (index !== -1) {
				this.vehiculos[index] = response.data;
			}

			if (this.vehiculoActual && this.vehiculoActual.id === id) {
				this.vehiculoActual = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/vehiculos/${id}`);

			this.vehiculos = this.vehiculos.filter(v => v.id !== id);

			if (this.vehiculoActual && this.vehiculoActual.id === id) {
				this.vehiculoActual = null;
			}

			return true;
		},
	},
});
