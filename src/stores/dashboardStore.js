import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useDashboardStore = defineStore('dashboard', {
	state: () => ({
		ventasHoy: 0,
		montoVentasHoy: 0,
		ventasDelMes: 0,
		montoVentasMes: 0,
		ingresosHoy: 0,
		gastosHoy: 0,
		saldoCaja: 0,
		caja: null,
		pasajerosEnRuta: 0,
		cargando: false,
	}),

	actions: {
		async cargarEstadisticas() {
			this.cargando = true;
			try {
				// Las estadísticas se calculan en el backend con la fecha de
				// America/Lima y sin restricción de perfil (los endpoints
				// /ventas y /cajas están limitados a ciertos perfiles, lo que
				// dejaba las tarjetas en 0 para el resto de usuarios).
				const { data } = await api.get('/dashboard/estadisticas');

				this.ventasHoy = Number(data.ventas_hoy || 0);
				this.montoVentasHoy = Number(data.monto_ventas_hoy || 0);
				this.montoVentasMes = Number(data.monto_ventas_mes || 0);
				this.ventasDelMes = this.montoVentasMes;
				this.ingresosHoy = Number(data.ingresos_caja || 0);
				this.gastosHoy = Number(data.egresos_caja || 0);
				this.saldoCaja = Number(data.saldo_caja || 0);
				this.caja = data.caja || null;
			} catch (error) {
				console.error('Error al cargar estadísticas del dashboard:', error);
			} finally {
				this.cargando = false;
			}

			// Pasajeros en ruta (dato ficticio con variación)
			this.pasajerosEnRuta = Math.floor(Math.random() * 30) + 25;
		},
	},
});
