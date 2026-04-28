<script setup>
import { ref, watch } from 'vue';
import { useFormat } from '@/composables/formatos'

const { formatMoneda } = useFormat()
const props = defineProps({
	item: {
		type: Object,
		required: true
	},
	hospedajes: {
		type: Array,
		required: true
	}
});

const searchText = ref('');
const updating = ref(false);

watch(searchText, (value) => {
	const selected = props.hospedajes.find(h => String(h.id) === String(value));
	if (selected) {
		props.item.hospedaje_id = selected.id;
		props.item.ruc = selected.ruc;
		props.item.hospedaje = selected.hospedaje;
		props.item.contacto = selected.contacto;
	} else {
		props.item.hospedaje_id = null;
		props.item.ruc = '';
		props.item.nombre = '';
		props.item.contacto = '';
	}
});

watch([() => props.item.fecha_ingreso, () => props.item.cantidad_noches], ([fechaIngreso, noches]) => {
	if (updating.value) return;
	updating.value = true;

	if (fechaIngreso && noches > 0) {
		const [year, month, day] = fechaIngreso.split('-').map(Number);
		const fecha = new Date(year, month - 1, day);
		fecha.setDate(fecha.getDate() + noches);
		const salidaYear = fecha.getFullYear();
		const salidaMonth = String(fecha.getMonth() + 1).padStart(2, '0');
		const salidaDay = String(fecha.getDate()).padStart(2, '0');
		props.item.fecha_salida = `${salidaYear}-${salidaMonth}-${salidaDay}`;
	}

	setTimeout(() => { updating.value = false; }, 0);
});

watch([() => props.item.fecha_ingreso, () => props.item.fecha_salida], ([fechaIngreso, fechaSalida]) => {
	if (updating.value) return;
	updating.value = true;

	if (fechaIngreso && fechaSalida) {
		const [ingresoYear, ingresoMonth, ingresoDay] = fechaIngreso.split('-').map(Number);
		const [salidaYear, salidaMonth, salidaDay] = fechaSalida.split('-').map(Number);
		const ingreso = new Date(ingresoYear, ingresoMonth - 1, ingresoDay);
		const salida = new Date(salidaYear, salidaMonth - 1, salidaDay);
		const diffTime = salida - ingreso;
		const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
		if (diffDays >= 0) {
			props.item.cantidad_noches = diffDays;
		}
	}

	setTimeout(() => { updating.value = false; }, 0);
});

watch([() => props.item.num_habitaciones, () => props.item.cantidad_noches, () => props.item.precio_por_noche], ([numHab, noches, precioNoche]) => {
	props.item.precio = (numHab || 0) * (noches || 0) * (precioNoche || 0);
});
</script>

<template>
	<div class="row row-cols-3">
		<div class="col">
			<label class="form-label">Hospedaje <span class="text-danger">*</span></label>
			<input type="text" class="form-control" list="listaHospedajes" v-model="searchText"
				placeholder="Buscar hospedaje...">
			<datalist id="listaHospedajes">
				<option v-for="hospedaje in hospedajes" :key="hospedaje.id" :value="hospedaje.id">
					{{ hospedaje.hospedaje + ' - ' + hospedaje.ruc + ' - ' + hospedaje.contacto }}
				</option>
			</datalist>
		</div>
		<div class="col">
			<label class="form-label">RUC</label>
			<input type="text" class="form-control" v-model="item.ruc" disabled>
		</div>
		<div class="col">
			<label class="form-label">Hospedaje</label>
			<input type="text" class="form-control" v-model="item.hospedaje" disabled>
		</div>
		<div>
			<label class="form-label">Tipo de habitación</label>
			<select class="form-select" v-model="item.tipo_habitacion">
				<option value="">Seleccionar...</option>
				<option value="compartida">Compartida</option>
				<option value="cuádruple">Cuádruple</option>
				<option value="doble">Doble</option>
				<option value="económica">Económica</option>
				<option value="familiar">Familiar</option>
				<option value="individual">Individual</option>
				<option value="king">King</option>
				<option value="queen">Queen</option>
				<option value="suite">Suite</option>
				<option value="simple">Simple</option>
				<option value="triple">Triple</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Fecha de ingreso <span class="text-danger">*</span></label>
			<input type="date" class="form-control" v-model="item.fecha_ingreso">
		</div>
		<div class="col d-none">
			<label class="form-label">Hora de ingreso</label>
			<input type="time" class="form-control" v-model="item.hora_ingreso">
		</div>
		<div class="col">
			<label class="form-label">N° habitaciones<span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.num_habitaciones" min="0">
		</div>
		<div class="col">
			<label class="form-label">Cantidad de noches <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.cantidad_noches" min="0">
		</div>
		<div class="col d-none">
			<label class="form-label">Fecha de salida</label>
			<input type="date" class="form-control" v-model="item.fecha_salida">
		</div>
		<div class="col d-none">
			<label class="form-label">Hora de salida</label>
			<input type="time" class="form-control" v-model="item.hora_salida">
		</div>
		
		<div class="col">
			<label class="form-label">Cantidad adultos</label>
			<input type="number" class="form-control" v-model.number="item.cantidad_adultos" min="0">
		</div>
		<div class="col">
			<label class="form-label">Cantidad niños</label>
			<input type="number" class="form-control" v-model.number="item.cantidad_ninos" min="0">
		</div>
		<div class="col">
			<label class="form-label">Precio por noche (S/)</label>
			<input type="number" class="form-control" v-model.number="item.precio_por_noche" min="0" step="1">
		</div>
		
		<div class="col">
			<div class="form-check mt-4">
				<input type="checkbox" class="form-check-input" id="chkRequiereCuna" v-model="item.requiere_cuna">
				<label class="form-check-label" for="chkRequiereCuna">Requiere cuna</label>
			</div>
		</div>
		<div class="col">
			<div class="form-check mt-4">
				<input type="checkbox" class="form-check-input" id="chkHabitacionFumador" v-model="item.habitacion_fumador">
				<label class="form-check-label" for="chkHabitacionFumador">Habitación fumador</label>
			</div>
		</div>
		<div class="col">
			<label class="form-label">Preferencias especiales</label>
			<input type="text" class="form-control" v-model="item.preferencias_especiales">
		</div>
		<div class="col"></div>
		<div class="col">
			<label class="form-label">Precio a pagar </label>
			<p class="mb-0">{{ formatMoneda(item.precio) }}</p>
		</div>
		
	</div>
</template>
<style scoped>
.col {
	margin: 10px 0;
}
</style>