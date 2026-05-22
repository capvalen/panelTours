import { defineStore } from 'pinia';
import api from '@/services/axios';
import { useVentasStore } from './ventaStore';

export const usePagosStore = defineStore('pagos', {
	state: () => ({
		pagos: [],
		pagoActual: null,
	}),

	actions: {
		async actualizarEstadoPagoSegunAdelanto() {
			const ventaStore = useVentasStore();
			const ventaActual = ventaStore.ventaActual;
			if (!ventaActual?.id) return;

			const precio = Number(ventaActual.precio || 0);
			const adelanto = Number(ventaActual.adelanto || 0);

			let estado_pago = 'pendiente';
			if (precio > 0 && adelanto >= precio) {
				estado_pago = 'completo';
			} else if (adelanto > 0) {
				estado_pago = 'adelanto';
			}

			const ventaActualizada = await ventaStore.actualizar(ventaActual.id, { estado_pago });
			ventaStore.ventaActual = ventaActualizada;
		},

		async listar(idVenta) {
			const response = await api.get(`/ventas/${idVenta}/pagos`);
			this.pagos = response.data;
			return response.data;
		},

		async obtenerPorId(idVenta, pago) {
			const response = await api.get(`/ventas/${idVenta}/pagos/${pago}`);
			this.pagoActual = response.data;
			return response.data;
		},

		async guardar(idVenta, datos) {
			const response = await api.post(`/ventas/${idVenta}/pagos`, datos);
			this.pagos.unshift(response.data);
			const ventaStore = useVentasStore();
			if (ventaStore.ventaActual) {
				ventaStore.ventaActual.adelanto = Number(ventaStore.ventaActual.adelanto || 0) + Number(datos.monto_abonado || 0);
				await this.actualizarEstadoPagoSegunAdelanto();
			}
			return response.data;
		},

		async actualizar(idVenta, pago, datos) {
			const indexAnterior = this.pagos.findIndex(p => p.id === pago);
			const pagoAnterior = indexAnterior !== -1 ? this.pagos[indexAnterior] : null;
			datos.fecha = new Date().toISOString();
			const response = await api.put(`/ventas/${idVenta}/pagos`, datos);

			const index = this.pagos.findIndex(p => p.id === pago);
			if (index !== -1) {
				this.pagos[index] = response.data;
			}

			if (this.pagoActual && this.pagoActual.id === pago) {
				this.pagoActual = response.data;
			}
			const ventaStore = useVentasStore();
			if (ventaStore.ventaActual) {
				const montoAnterior = Number(pagoAnterior?.monto_abonado || 0);
				const montoNuevo = Number(datos?.monto_abonado || 0);
				ventaStore.ventaActual.adelanto = Number(ventaStore.ventaActual.adelanto || 0) - montoAnterior + montoNuevo;
				await this.actualizarEstadoPagoSegunAdelanto();
			}

			return response.data;
		},

		async eliminar(idVenta, idPago) {
			const indexAnterior = this.pagos.findIndex(p => p.id === idPago);
			const pagoAnterior = indexAnterior !== -1 ? this.pagos[indexAnterior] : null;
			const response = await api.delete(`/ventas/${idVenta}/pagos/${idPago}`);
			const index = this.pagos.findIndex(p => p.id === idPago);
			if (index !== -1) {
				this.pagos[index] = response.data || { ...this.pagos[index], estado_pago: 'anulado', activo: false };
			}
			const ventaStore = useVentasStore();
			if (ventaStore.ventaActual) {
				const montoAnterior = Number(pagoAnterior?.monto_abonado || 0);
				ventaStore.ventaActual.adelanto = Math.max(0, Number(ventaStore.ventaActual.adelanto || 0) - montoAnterior);
				const ventaActualizada = await ventaStore.actualizar(ventaStore.ventaActual.id, { estado_pago: 'pendiente' });
				ventaStore.ventaActual = ventaActualizada;
			}

			return true;
		},
	},
});
