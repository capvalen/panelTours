<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import {useCajaStore} from '@/stores/cajaStore'
import Swal from 'sweetalert2';

import { useFormat} from '@/composables/formatos.js'
const { ahora } = useFormat()
const props = defineProps(['id', 'efectivoFinal']) //'titulo', 'color'
const cajaStore = useCajaStore()
const router = useRouter()

const registro = ref({	
	monto_final:0,
	fecha_cierre: ahora(),
	observaciones: '',
	id: props.id,
	//venta_id: null,
})
const guardar = async ()=>{
	await cajaStore.cerrarCaja(registro.value)
	await Swal.fire('Caja cerrada', 'La caja se cerró correctamente', 'success')
	router.push('/cajas')
}
watch(
	()=> props.id, (newId) => {
		registro.value.caja_id = newId
	}
)
watch(
	()=> props.efectivoFinal, (newMonto) => {
		registro.value.monto_final = newMonto
	}, { immediate: true }
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