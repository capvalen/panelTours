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
				<select name="salida" id="" class="form-select" v-model="registro.salida">
					<option value="1">Egreso</option>
					<option value="2">Pago de proveedores</option>
				</select>
				<div v-if="registro.salida == 2">
					<p>Proveedor</p>
					<select name="proveedor" id="" class="form-select">
						<option value="1">Inversiones Turisticas Costa del Sur SAC - 20601426341</option>
						<option value="2">Sisari Travel Peru E.I.R.L.	- 20600821874</option>
						<option value="3">Huancaraylla Travel S.R.L. - 20606832509</option>
						<option value="4">Huánuco Travel Perú	- 10462508927</option>
						<option value="5">Willka Tours-	10452039678</option>
						
					</select>
				</div>
					<p>Monto (S)</p>
					<input type="number" class="form-control" autocomplete="off">
				<p>Datos extras</p>
				<input type="text" class="form-control" autocomplete="off">
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-outline-primary">Registrar egreso</button>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
	import {ref} from 'vue'
	const registro = ref({
		salida:1
	})
</script>