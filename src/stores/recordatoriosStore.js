import { defineStore } from 'pinia';
import api from '@/services/axios';

//Options API
export const useRecordatoriosStore = defineStore('recordatorios',{
	state: () => ({
		recordatorios: [],
		recordatorioActual: null,
	}),

	actions: {
		async listar(params = {}) {
			const response = await api.get('/recordatorios', { params });
			this.recordatorios = response.data.data || response.data;
			return response.data;
		},

		async buscar(termino) {
			const response = await api.get('/recordatorios', {
				params: { buscar: termino }
			});
			this.recordatorios = response.data.data || response.data;
			return response.data;
		},

		async obtenerPorId(id) {
			const response = await api.get(`/recordatorios/${id}`);
			this.recordatorioActual = response.data.data || response.data;
			return this.recordatorioActual;
		},

		async guardar(data) {
			const response = await api.post('/recordatorios', data);
			// Opcional: actualizar lista localmente
			this.recordatorios.unshift(response.data.data);
			return response.data;
		},

		async actualizar(id, data) {
			const response = await api.put(`/recordatorios/${id}`, data);

			// Actualizar en la lista local
			const index = this.recordatorios.findIndex(r => r.id === id);
			if (index !== -1) {
				this.recordatorios[index] = response.data.data || response.data;
			}
			return response.data;
		},

		async eliminar(id) {
			await api.delete(`/recordatorios/${id}`);
			this.recordatorios = this.recordatorios.filter(r => r.id !== id);
			return true;
		},
	}
});