<script setup>
import { ref, watch } from 'vue';
import {useCajaStore} from '@/stores/cajaStore'

import { useFormat} from '@/composables/formatos.js'
const { ahora } = useFormat()
const props = defineProps(['id']) //'titulo', 'color'
const cajaStore = useCajaStore()

const registro = ref({	
	monto_final:0,
	fecha_cierre: ahora(),
	observaciones: '',
	id: props.id,
	//venta_id: null,
})
const guardar = async ()=>{
	cajaStore.cerrarCaja(registro.value)
}
watch(
	()=> props.id, (newId) => {
		registro.value.caja_id = newId
	}
)
</script>
<template>
	<div class="modal fade" id="modalCerrarCaja" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header  border-0">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Cerrar caja</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Ingrese los campos</p>
				<p>Monto (S/.)</p>
				<input type="number" class="form-control" autocomplete="off" v-model="registro.monto_final">
				<p>Observaciones</p>
				<input type="text" class="form-control" autocomplete="off" v-model="registro.observaciones">
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" @click="guardar()">Cerrar caja</button>
      </div>
    </div>
  </div>
</div>
</template>