import { defineStore } from "pinia";
import api from '@/services/axios';

export const useClienteStore = defineStore('cliente', {
	state:() => ({
		clientes: [],
		clienteActual: []
	}),
	//acciones
	actions: {
		async listarClientes(){
			const resp = await api.get('/clientes')
			this.clientes = resp.data
			return this.clientes
		},
		async obtenerClienteId(id){
			const resp = await api.get('/clientes/'+id)
			this.clienteActual = resp.data
			return this.clienteActual
		},
		async guardarCliente(cliente){
			const resp = await api.post('/clientes', cliente)
			this.clienteActual = resp.data.data
			this.clientes.unshift(this.clienteActual)
			return this.clienteActual.id
		},
		async actualizarCliente(cliente){
			const resp = await api.put('/clientes/'+cliente.id, cliente)
			this.clienteActual = resp.data
			return this.clienteActual
		},
		async eliminarCliente(id){
			await api.delete('/clientes/'+id)
			this.clientes = this.clientes.filter(c => c.id !== id)
		}
	}
})