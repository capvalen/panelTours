import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useLogisticaStore = defineStore('logistica', {
	state: () => ({
		lista: [],
	}),

	actions: {
		async listarPorFecha(fecha) {
			const response = await api.get('/logistica', { params: { fecha } });
			this.lista = response.data;
			return response.data;
		},

		async guardar(datos) {
			const response = await api.post('/logistica', datos);
			this.lista.unshift(response.data);
			return response.data;
		},

		async vincularVenta(logisticaId, ventaId) {
			await api.post('/logistica/vincular-venta', {
				logistica_id: logisticaId,
				venta_id: ventaId,
			});
		},
	},
});
