import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useAerolineasStore = defineStore('aerolineas', {
	state: () => ({
		aerolineas: [],
	}),

	actions: {
		async listar() {
			const response = await api.get('/aerolineas');
			this.aerolineas = response.data;
			return response.data;
		},
	},
});
