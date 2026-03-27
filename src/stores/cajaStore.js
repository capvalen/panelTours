import { defineStore } from "pinia";
import api from '@/services/axios';

export const useCajaStore = defineStore('caja', {
	state:() => ({
		cajas: [],
		cajaActual: [],
		cajaDetalles: []
	}),
	//acciones
	actions: {
		async obtenerCajas(){
			const resp = await api.get('/cajas')
			this.cajas = resp.data
		},
		async obtenerCajasPorDia(dia){
			const resp = await api.get('/cajas?fecha='+dia)
			this.cajas = resp.data
		},
		async aperturarCaja(caja){
			const resp = await api.post('/cajas', caja)
			this.cajaActual = resp.data.data
			this.cajas.unshift(this.cajaActual)
			return this.cajaActual.id
		},
		async obtenerCajaId(id){
			const resp = await api.get('/cajas/'+id)
			this.cajaActual = resp.data
			return this.cajaActual
		},
		async cerrarCaja(caja){
			const resp = await api.put('/cajas/cerrar/'+caja.caja_id, {...caja})
			this.cajaActual = resp.data
			return this.cajaActual
		},
		async obtenerDetalleCajaId(id){
			const resp = await api.get('/caja_detalles?caja_id='+id)
			this.cajaDetalles = resp.data
			return this.cajaDetalles
		},
		async guardarDetalle(registro){
			console.log('obtengo', registro)
			const resp = await api.post('/caja_detalles/', registro)
			this.cajaActual = resp.data.data
			return this.cajaActual
		}

	}
})
