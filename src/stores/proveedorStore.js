import { defineStore } from 'pinia';
import api from '@/services/axios';

//Options API
export const useProveedoresStore = defineStore('proveedores', {
	state: () => ({
		proveedores: [],
		proveedorActual: null,
	}),

	actions: {
		async listar() {
			const response = await api.get('/proveedores');
			this.proveedores = response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/proveedores?buscar=' + termino);
			this.proveedores = response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/proveedores/${id}`);
			this.proveedorActual = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/proveedores', datos);
			// Opcional: Agregar a la lista local para mantener la UI actualizada
			this.proveedores.unshift(response.data);
			return response.data;
		},

		async actualizar(id, datos) {
			const response = await api.put(`/proveedores/${id}`, datos);
			
			// Opcional: Actualizar en la lista local
			const index = this.proveedores.findIndex(p => p.id === id);
			if (index !== -1) {
				this.proveedores[index] = response.data;
			}
			
			// Actualizar también el actual si coincide
			if (this.proveedorActual && this.proveedorActual.id === id) {
				this.proveedorActual = response.data;
			}

			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/proveedores/${id}`);

			this.proveedores = this.proveedores.filter(p => p.id !== id);
			
			// Limpiar proveedorActual si era el que se eliminó
			if (this.proveedorActual && this.proveedorActual.id === id) {
				this.proveedorActual = null;
			}

			return true;
		},
	},
});