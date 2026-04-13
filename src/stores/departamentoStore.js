import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useDepartamentosStore = defineStore('departamentos', {
	state: () => ({
		departamentos: [],
	}),

	actions: {
		async listar() {
			const response = await api.get('/departamentos');
			this.departamentos = response.data;
			return response.data;
		},
	},
});
