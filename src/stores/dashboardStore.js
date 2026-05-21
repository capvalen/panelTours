import { defineStore } from 'pinia';
import api from '@/services/axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const useDashboardStore = defineStore('dashboard', {
	state: () => ({
		ventasHoy: 0,
		reservasHoy: 0,
		montoVentasHoy: 0,
		gastosHoy: 0,
		pagosProveedoresHoy: 0,
		recordatoriosHoy: 0,
		cargando: false,
	}),

	actions: {
		async cargarEstadisticas() {
			this.cargando = true;
			const hoy = dayjs.utc().format('YYYY-MM-DD');

			try {
				const [ventasRes, cajaRes, deudasRes, recordatoriosRes] = await Promise.all([
					api.get('/ventas'),
					api.get('/caja_detalles'),
					api.get('/deudas'),
					api.get('/recordatorios'),
				]);

				const ventas = (ventasRes.data || []).filter(v =>
					v.estado !== 'anulado' && v.fecha && v.fecha.substring(0, 10) === hoy
				);

				this.ventasHoy = ventas.filter(v => v.progreso !== 'cotizacion').length;
				this.reservasHoy = ventas.filter(v => v.progreso === 'cotizacion').length;
				this.montoVentasHoy = ventas.reduce((sum, v) => sum + parseFloat(v.precio || 0), 0);

				const egresos = (cajaRes.data.data || cajaRes.data || []).filter(d =>
					d.tipo === 'egreso' && d.fecha && d.fecha.substring(0, 10) === hoy
				);
				this.gastosHoy = egresos.reduce((sum, d) => sum + parseFloat(d.monto || 0), 0);

				const deudas = (deudasRes.data || []).filter(d =>
					d.fecha_pago && d.fecha_pago.substring(0, 10) === hoy
				);
				this.pagosProveedoresHoy = deudas.length;

				const recordatorios = (recordatoriosRes.data.data || recordatoriosRes.data || []).filter(r => {
					if (!r.activo || !r.fecha_hora) return false;
					const fecha = r.fecha_hora.substring(0, 10);
					if (fecha === hoy) return true;
					return fecha < hoy && (r.estado === 'pendiente' || r.estado === 'activo');
				});
				this.recordatoriosHoy = recordatorios.length;
			} catch (error) {
				console.error('Error al cargar estadísticas del dashboard:', error);
			} finally {
				this.cargando = false;
			}
		},
	},
});
