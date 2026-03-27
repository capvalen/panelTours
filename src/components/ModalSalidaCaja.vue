<script setup>
import { ref, watch } from 'vue';
import {useCajaStore} from '@/stores/cajaStore'

import { useFormat} from '@/composables/formatos.js'
const { formatHoy } = useFormat()
const props = defineProps(['id']) //'titulo', 'color'
const cajaStore = useCajaStore()

const registro = ref({
	tipo:'egreso',
	monto:0,
	concepto: '',
	categoria: 'salida',
	fecha: formatHoy(),
	comprobante_pago:'interno',
	serie:'',
	observaciones: '',
	caja_id: props.id,
	proveedor_id: 1
	//venta_id: null,
})
const guardar = async ()=>{
	cajaStore.guardarDetalle(registro.value)
}
watch(
	()=> props.id, (newId) => {
		registro.value.caja_id = newId
	}
)
</script>
<template>
	<div class="modal fade" id="modalSalida" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header  border-0">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Registrar salida de caja</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Seleccione el motivo de salida</p>
				<select name="salida" id="" class="form-select" v-model="registro.categoria">
					<option value="salida">Salida</option>
					<option value="pago de personal">Pago de personal</option>
					<option value="pago de proveedores">Pago de proveedores</option>
				</select>
				<div v-if="registro.categoria == 'pago de proveedores'">
					<p>Proveedor</p>
					<select name="proveedor" id="" class="form-select" v-model="registro.proveedor_id">
						<option value="1">Ninguno</option>
						<option value="2">Inversiones Turisticas Costa del Sur SAC - 20601426341</option>
						<option value="3">Sisari Travel Peru E.I.R.L.	- 20600821874</option>
						<option value="4">Huancaraylla Travel S.R.L. - 20606832509</option>
						<option value="5">Huánuco Travel Perú	- 10462508927</option>
						<option value="6">Willka Tours-	10452039678</option>
						
					</select>
				</div>
				<p>Concepto</p>
				<input type="text" class="form-control" autocomplete="off" v-model="registro.concepto">
					<p>Monto (S/.)</p>
					<input type="number" class="form-control" autocomplete="off" v-model="registro.monto">
				<p>Datos extras</p>
				<input type="text" class="form-control" autocomplete="off" v-model="registro.observaciones">
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-outline-primary"  data-bs-dismiss="modal" @click="guardar()">Registrar egreso</button>
      </div>
    </div>
  </div>
</div>
</template>
