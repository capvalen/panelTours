import { defineStore } from 'pinia';
import api from '@/services/axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useCajaStore } from '@/stores/cajaStore';

export const useDashboardStore = defineStore('dashboard', {
	state: () => ({
		ventasHoy: 0,
		montoVentasHoy: 0,
		ventasDelMes: 0,
		ingresosHoy: 0,
		gastosHoy: 0,
		pasajerosEnRuta: 42,
		cargando: false,
	}),

	actions: {
		async cargarEstadisticas() {
			this.cargando = true;
			const hoy = dayjs.utc().format('YYYY-MM-DD');
			const mesActual = hoy.substring(0, 7); // YYYY-MM

			try {
				const ventasRes = await api.get('/ventas');

				// Ventas del día
				const ventasHoyArr = (ventasRes.data || []).filter(v =>
					v.estado !== 'anulado' && v.fecha && v.fecha.substring(0, 10) === hoy && v.progreso !== 'cotizacion'
				);
				this.ventasHoy = ventasHoyArr.length;
				this.montoVentasHoy = ventasHoyArr.reduce((sum, v) => sum + parseFloat(v.precio || 0), 0);

				// Ventas del mes
				const ventasMesArr = (ventasRes.data || []).filter(v =>
					v.estado !== 'anulado' && v.fecha && v.fecha.substring(0, 7) === mesActual && v.progreso !== 'cotizacion'
				);
				this.ventasDelMes = ventasMesArr.reduce((sum, v) => sum + parseFloat(v.precio || 0), 0);

				// Caja del día: usar cajaStore para obtener ingresos y egresos
				const cajaStore = useCajaStore()
				await cajaStore.obtenerCajasPorDia(hoy);

				const cajasLista = cajaStore.cajas?.data || cajaStore.cajas || [];
				console.log('lista', cajasLista)

				if (cajasLista.length > 0) {
					const cajaHoy = cajasLista[0];
					const cajaId = cajaHoy.id || cajaHoy.caja_id;

					await cajaStore.obtenerDetalleCajaId(cajaId);
					const detalles = cajaStore.cajaDetalles?.internos || [];
					console.log('detalles', detalles)

					this.ingresosHoy = detalles
						.filter(d => d.tipo === 'ingreso')
						.reduce((sum, d) => sum + parseFloat(d.monto || 0), 0);

					this.gastosHoy = detalles
						.filter(d => d.tipo === 'egreso')
						.reduce((sum, d) => sum + parseFloat(d.monto || 0), 0);
				}

				// Pasajeros en ruta (dato ficticio con variación)
				this.pasajerosEnRuta = Math.floor(Math.random() * 30) + 25;
			} catch (error) {
				console.error('Error al cargar estadísticas del dashboard:', error);
			} finally {
				this.cargando = false;
			}
		},
	},
});
