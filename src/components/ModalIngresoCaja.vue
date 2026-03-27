<script setup>
import { ref, watch } from 'vue';
import {useCajaStore} from '@/stores/cajaStore'

import { useFormat} from '@/composables/formatos.js'
const { formatHoy } = useFormat()
const props = defineProps(['id']) //'titulo', 'color'
const cajaStore = useCajaStore()

const registro = ref({
	tipo:'ingreso',
	monto:0,
	concepto: '',
	categoria: 'ingreso',
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
	<div class="modal fade" id="modalIngreso" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header  border-0">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Registrar entrada de caja</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Seleccione el motivo de ingreso</p>
				<select name="salida" id="" class="form-select" v-model="registro.categoria">
					<option value="ingreso">Ingreso</option>
					<option value="inyeccion">Inyección de dinero</option>
				</select>
				<p>Monto (S/.)</p>
				<input type="number" class="form-control" autocomplete="off" v-model="registro.monto">
				<p>Concepto</p>
				<input type="text" class="form-control" autocomplete="off" v-model="registro.concepto">
				<p>Datos extras</p>
				<input type="text" class="form-control" autocomplete="off" v-model="registro.observaciones">
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" @click="guardar()">Registrar ingreso</button>
      </div>
    </div>
  </div>
</div>
</template>