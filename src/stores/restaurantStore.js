import { defineStore } from 'pinia';
import api from '@/services/axios';

//Options API
export const userestaurantestore = defineStore('restaurantes', {
	state: () => ({
		restaurantes: [],
		restaurantActual: null,
	}),

	actions: {
		async listar() {
			const response = await api.get('/restaurantes');
			this.restaurantes = response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/restaurantes?buscar=' + termino);
			this.restaurantes = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/restaurantes/${id}`);
			this.restaurantActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/restaurantes', datos);
			// Opcional: Agregar a la lista local para mantener la UI actualizada
			this.restaurantes.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/restaurantes/${id}`, datos);
			
			// Opcional: Actualizar en la lista local
			const index = this.restaurantes.findIndex(r => r.id === id);
			if (index !== -1) {
				this.restaurantes[index] = response.data;
			}
			
			// Actualizar también el actual si coincide
			if (this.restaurantActual && this.restaurantActual.id === id) {
				this.restaurantActual = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/restaurantes/${id}`);

			this.restaurantes = this.restaurantes.filter(r => r.id !== id);
			
			// Limpiar restaurantActual si era el que se eliminó
			if (this.restaurantActual && this.restaurantActual.id === id) {
				this.restaurantActual = null;
			}

			return true;
		},
	},
});