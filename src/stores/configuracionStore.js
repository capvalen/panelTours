import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useConfiguracionStore = defineStore('configuraciones', {
	state: () => ({
		items: [],
	}),

	getters: {
		temporadas: (state) => {
			return state.items.filter((i) => i.clave === 'temporada');
		},
	},

	actions: {
		async cargarTodas() {
			try {
				const { data } = await api.get('/configuraciones');
				this.items = Array.isArray(data) ? data : [];
			} catch (err) {
				console.error('Error al cargar configuraciones:', err);
			}
			return this.items;
		},

		async cargarTemporadas() {
			try {
				const { data } = await api.get('/configuraciones');
				this.items = Array.isArray(data) ? data : [];
			} catch (err) {
				console.error('Error al cargar temporadas:', err);
			}
			return this.temporadas;
		},

		async guardarTemporada(titulo, contenido) {
			const resp = await api.post('/configuraciones', {
				clave: 'temporada',
				valor: { titulo, contenido },
			});
			this.items.push(resp.data);
			return resp.data;
		},

		async actualizarTemporada(id, titulo, contenido) {
			const resp = await api.put(`/configuraciones/${id}`, {
				clave: 'temporada',
				valor: { titulo, contenido },
			});
			const idx = this.items.findIndex((i) => i.id === id);
			if (idx !== -1) this.items[idx] = resp.data;
			return resp.data;
		},

		async eliminarTemporada(id) {
			await api.delete(`/configuraciones/${id}`);
			this.items = this.items.filter((i) => i.id !== id);
		},
	},
});
