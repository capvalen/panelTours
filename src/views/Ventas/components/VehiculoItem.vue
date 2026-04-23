<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		required: true
	},
	vehiculos: {
		type: Array,
		required: true
	}
});

const searchText = ref('');

watch(searchText, (value) => {
	const selected = props.vehiculos.find(v => String(v.id) === String(value));
	if (selected) {
		props.item.vehiculo_id = selected.id;
		props.item.placa = selected.placa;
		props.item.conductor = selected.nombre_conductor;
		props.item.tipo_vehiculo = selected.tipo_vehiculo;
	} else {
		props.item.vehiculo_id = null;
		props.item.placa = '';
		props.item.conductor = '';
		props.item.tipo_vehiculo = '';
	}
});
</script>

<template>
	<div class="row row-cols-3">
		<div class="col">
			<label class="form-label">Vehículo <span class="text-danger">*</span></label>
			<input type="text" class="form-control" list="listaVehiculos" v-model="searchText"
				placeholder="Buscar vehículo...">
			<datalist id="listaVehiculos">
				<option v-for="vehiculo in vehiculos" :key="vehiculo.id" :value="vehiculo.id">
					{{ vehiculo.tipo_vehiculo + ' - ' + vehiculo.placa + ' - ' + vehiculo.nombre_conductor }}
				</option>
			</datalist>
		</div>
		<div class="col">
			<label class="form-label">Tipo de vehículo</label>
			<input type="text" class="form-control" v-model="item.tipo_vehiculo" disabled>
		</div>
		<div class="col">
			<label class="form-label">Placa</label>
			<input type="text" class="form-control" v-model="item.placa" disabled>
		</div>

		<div class="col">
			<label class="form-label">Conductor</label>
			<input type="text" class="form-control" v-model="item.conductor" disabled>
		</div>
		<div class="col">
			<label class="form-label">Origen <span class="text-danger">*</span></label>
			<input type="text" class="form-control" v-model="item.origen">
		</div>
		<div class="col">
			<label class="form-label">Destino</label>
			<input type="text" class="form-control" v-model="item.destino">
		</div>
		<div class="col">
			<label class="form-label">Cantidad de pasajeros</label>
			<input type="number" class="form-control" v-model.number="item.pasajeros" min="1">
		</div>
		<div class="col">
			<label class="form-label">Fecha de inicio <span class="text-danger">*</span></label>
			<input type="date" class="form-control" v-model="item.fecha_inicio">
		</div>
		<div class="col">
			<label class="form-label">Hora de recogida</label>
			<input type="time" class="form-control" v-model="item.hora_recogida">
		</div>

		<div class="col">
			<label class="form-label">Punto de recogida</label>
			<input type="text" class="form-control" v-model="item.punto_recogida" placeholder="Dirección o lugar">
		</div>
		<div class="col">
			<label class="form-label">Fecha de fin</label>
			<input type="date" class="form-control" v-model="item.fecha_fin">
		</div>
		<div class="col">
			<label class="form-label">Hora de devolución</label>
			<input type="time" class="form-control" v-model="item.hora_devolucion">
		</div>

		<div class="col">
			<label class="form-label">Punto de devolución</label>
			<input type="text" class="form-control" v-model="item.punto_devolucion" placeholder="Dirección o lugar">
		</div>
		
		<div class="col">
			<label class="form-label">Precio (S/) <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.precio" min="0" step="0.01">
		</div>
		<div class="col-12">
			<label class="form-label">Observaciones</label>
			<textarea class="form-control" v-model="item.observaciones" rows="2" placeholder="Instrucciones especiales, restricciones, etc."></textarea>
		</div>
	</div>
</template>
<style scoped>
.col{
	margin: 10px 0;
}
</style>