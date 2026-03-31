<script setup>
import { reactive, watch } from 'vue';
import { useProveedoresStore } from '@/stores/proveedorStore';
import { useDeudasStore } from '@/stores/deudasStore';
import Swal from 'sweetalert2';
import { storeToRefs } from 'pinia';

const deudasStore = useDeudasStore();
const proveedoresStore = useProveedoresStore();

const metodosPago = [
	'depósito bancario',
	'efectivo',
	'plin',
	'pos',
	'tarjeta',
	'transferencia',
	'yape'
]

const nuevo = reactive({
	proveedor_id: null,
	fecha_pago: null,
  monto: 0,
  informacion: '',
  contacto_pagar: '',
  comprobante: null,
  medio_pago: 'efectivo',
  estado_pago: 'pendiente',
  codigo_referencia: ''
})

function guardar(){
//	deudaActual.value.deudas.push({...nuevo})
	deudasStore.guardar(nuevo)
	.then( resp => {
		proveedoresStore.proveedorActual.deudas.unshift(resp)
		Swal.fire('Pago registrado', `El pago ha sido registrado`, 'success')
	})
	.catch( error => {
		console.error(error)
		Swal.fire('Error', 'Error al registrar pago', 'error')
	})
}

watch(() => proveedoresStore.proveedorActual, (newVal) => {
	if (newVal) {
		nuevo.proveedor_id = newVal.id;
	}
});
</script>
<template>
	<div class="modal fade" id="modalNuevoPago" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">Agregar nuevo pago</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row g-3">
						<!-- Fecha de Pago -->
						<div class="col-md-6 my-3">
							<label for="fecha_pago" class="form-label">Fecha de Pago</label>
							<input type="date" class="form-control" id="fecha_pago" v-model="nuevo.fecha_pago">
						</div>

						<!-- Monto -->
						<div class="col-md-6 my-3">
							<label for="monto" class="form-label">Monto</label>
							<input type="number" class="form-control" id="monto" v-model.number="nuevo.monto" placeholder="0.00"
								step="1" min="0">
						</div>

						<!-- Medio de Pago -->
						<div class="col-md-6 my-3">
							<label for="medio_pago" class="form-label">Medio de Pago</label>
							<select class="form-select text-capitalize" id="medio_pago" v-model="nuevo.medio_pago">
								<option class="text-capitalize" v-for="metodo in metodosPago" :key="metodo" :value="metodo">
									{{ metodo }}
								</option>
							</select>
						</div>

						<!-- Estado de Pago -->
						<div class="col-md-6 my-3">
							<label for="estado_pago" class="form-label">Estado de Pago</label>
							<select class="form-select" id="estado_pago" v-model="nuevo.estado_pago">
								<option value="pendiente">Pendiente</option>
								<option value="fallido">Fallido</option>
								<option value="completado">Completado</option>
								<option value="condonado">Condonado</option>
							</select>
						</div>

						<!-- Código de Referencia -->
						<div class="col-md-6 my-3">
							<label for="codigo_referencia" class="form-label">Comprobante</label>
							<input type="text" class="form-control" id="codigo_referencia" v-model="nuevo.codigo_referencia"
								placeholder="Ej: FA01-001">
						</div>

						<!-- Contacto a Pagar -->
						<div class="col-md-12 my-3">
							<label for="contacto_pagar" class="form-label">Contacto a Pagar</label>
							<input type="text" class="form-control" id="contacto_pagar" v-model="nuevo.contacto_pagar"
								placeholder="Nombre o teléfono">
						</div>

						<!-- Información -->
						<div class="col-12">
							<label for="informacion" class="form-label">Información</label>
							<textarea class="form-control" id="informacion" v-model="nuevo.informacion" rows="3"
								placeholder=""></textarea>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="guardar()" data-bs-dismiss="modal">Registrarpago</button>
				</div>
			</div>
		</div>
	</div>

</template>