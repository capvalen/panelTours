<script setup>

import { ref, watch } from 'vue';
import { useFormat } from '@/composables/formatos';

const { capitalize } = useFormat()

const props = defineProps({
	item: {
		type: Object,
		required: true
	},
	aerolineas: {
		type: Array,
		required: true
	},
	departamentos: {
		type: Array,
		required: true
	}
});

const updating = ref(false);
const searchText = ref('');
const dolarPrecio = ref(0)
watch(searchText, (value) => {
	const selected = props.aerolineas.find(a => a.nombre === value);
	if (selected) {
		props.item.aerolinea = selected.nombre;
	} else {
		props.item.aerolinea = '';
	}
});

watch([() => props.item.fecha_salida, () => props.item.fecha_llegada], ([fechaSalida, fechaLlegada]) => {
	if (updating.value) return;
	updating.value = true;

	if (fechaSalida && fechaLlegada) {
		const [salidaYear, salidaMonth, salidaDay] = fechaSalida.split('-').map(Number);
		const [llegadaYear, llegadaMonth, llegadaDay] = fechaLlegada.split('-').map(Number);
		const salida = new Date(salidaYear, salidaMonth - 1, salidaDay);
		const llegada = new Date(llegadaYear, llegadaMonth - 1, llegadaDay);
		const diffTime = llegada - salida;
		const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
		if (diffDays >= 0) {
			props.item.duracion_dias = diffDays;
		}
	}

	setTimeout(() => { updating.value = false; }, 0);
});

watch([() => props.item.pasajeros, () => props.item.precio_ticket], () => {
	props.item.precio = (props.item.pasajeros || 0) * (props.item.precio_ticket || 0);
	props.item.precio_soles = props.item.precio
});

watch([() => props.item.precio], () => {
	const dolar = Number(localStorage.getItem('dolar')) || 0;
	props.item.precio_dolares = props.item.precio / dolar,2;
	dolarPrecio.value = props.item.precio_dolares;
});
</script>

<template>
	<div class="row row-cols-3">
		<div class="col">
			<label class="form-label">Aerolínea <span class="text-danger">*</span></label>
			<input type="text" class="form-control text-capitalize" list="listaAerolineas" v-model="item.aerolinea"
				placeholder="Buscar aerolínea...">
			<datalist id="listaAerolineas">
				<option class="text-capitalize" v-for="aerolinea in aerolineas" :key="aerolinea.id" :value="aerolinea.nombre">
				</option>
			</datalist>
		</div>
		<div class="col">
			<label class="form-label">Origen <span class="text-danger">*</span></label>
			<input type="text" class="form-control" list="listaOrigen" v-model="item.origen"
				placeholder="Buscar ciudad...">
			<datalist id="listaOrigen">
				<option v-for="depa in departamentos" :key="depa.id" :value="depa.departamento + ' (' + depa.abreviatura + ')'">
				</option>
			</datalist>
		</div>
		<div class="col">
			<label class="form-label">Destino</label>
			<input type="text" class="form-control" list="listaDestino" v-model="item.destino"
				placeholder="Buscar ciudad...">
			<datalist id="listaDestino">
				<option v-for="depa in departamentos" :key="depa.id" :value="depa.departamento + ' (' + depa.abreviatura + ')'">
				</option>
			</datalist>
		</div>

		<div class="col">
			<label class="form-label">Fecha de salida <span class="text-danger">*</span></label>
			<input type="date" class="form-control" v-model="item.fecha_salida">
		</div>
		<div class="col">
			<label class="form-label">Hora de salida</label>
			<input type="time" class="form-control" v-model="item.hora_salida">
		</div>
		<div class="w-100"></div>
		<div class="col">
			<label class="form-label">Fecha de llegada</label>
			<input type="date" class="form-control" v-model="item.fecha_llegada">
		</div>

		<div class="col">
			<label class="form-label">Horario de llegada</label>
			<input type="time" class="form-control" v-model="item.horario_llegada">
		</div>
		<div class="w-100"></div>
		<div class="col">
			<label class="form-label">Clase de vuelo</label>
			<select class="form-select" v-model="item.clase_vuelo">
				<option value="">Seleccionar...</option>
				<option v-for="clase in clasesVuelo" :key="clase" :value="clase">{{ capitalize(clase) }}</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Número de pasajeros</label>
			<input type="number" class="form-control" v-model.number="item.pasajeros" min="0">
		</div>
		<div class="col">
			<label class="form-label">Precio por ticket (S/)</label>
			<input type="number" class="form-control" v-model.number="item.precio_ticket" min="0" step="1">
		</div>
		<div class="col">
			<div class="form-check mt-4">
				<input type="checkbox" class="form-check-input" id="chkEscala" v-model="item.escala">
				<label class="form-check-label" for="chkEscala">Tiene escala</label>
			</div>
		</div>
		<div class="col">
			<label class="form-label">Lleva equipaje</label>
			<select name="" id="" class="form-select" v-model="item.lleva_equipaje">
				<option value="si">Si</option>
				<option value="no">No</option>
			</select>
			
		</div>
		<div class="col">
			<label class="form-label">Kilos de equipaje (Kg.)</label>
			<input type="number" class="form-control" v-model.number="item.kilos" min="0" placeholder="Peso total">
		</div>

		<div class="col">
			<label class="form-label">Tipo de equipaje</label>
			<input type="text" class="form-control" v-model="item.que_equipaje" placeholder="Descripción del equipaje">
		</div>
		<div class="col-8">
			<label class="form-label">Observaciones</label>
			<textarea class="form-control" v-model="item.observaciones" rows="2"
				placeholder="Notas adicionales, restricciones, etc."></textarea>
		</div>
		<div class="col">
			<label class="form-label">Precio a pagar (USD)</label>
				<input type="number" class="form-control" :value="dolarPrecio.toFixed(2)" disabled>
			</div>
		<div class="col">
			<label class="form-label">Precio a pagar (S/)<span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.precio" disabled>
		</div>
	</div>
</template>
<style scoped>
.col {
	margin: 10px 0;
}
</style>