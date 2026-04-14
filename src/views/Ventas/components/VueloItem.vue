<script setup>
import { ref, watch } from 'vue';
import { useFormat } from '@/composables/formatos';

const { capitalize } = useFormat()

const props = defineProps({
	item: {
		type: Object,
		required: true
	}
});

const updating = ref(false);

const ciudades = ["Abancay", "Andahuaylas", "Arequipa", "Chincha", "Cusco", "Huancavelica", "Ayacucho", "Cajamarca", "Callao", "Cerro de Pasco", "Chachapoyas", "Chiclayo", "Huancayo", "Huánuco", "Huaraz", "Ica", "Iquitos", "Jauja", "Juliaca", "Puerto Maldonado", "La Merced", "Lima", "Moquegua", "Nazca", "Охаратра", "Pichanaqui", "Piura", "Pucallpa", "Puno", "Satipo", "Tacna", "Tarapoto", "Tarma", "Tingo María", "Trujillo", "Tumbes"];

const aerolineas = ["LATAM", "Sky Airline", "JetSMART", "Avianca", "Star Peru", "Peruvian Airlines"];

const clasesVuelo = ['económica', 'económica plus', 'turista', 'ejecutiva', 'primera'];

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
</script>

<template>
	<div class="row row-cols-3">
		<div class="col">
			<label class="form-label">Origen <span class="text-danger">*</span></label>
			<select class="form-select" v-model="item.origen">
				<option value="">Seleccionar ciudad...</option>
				<option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Destino</label>
			<select class="form-select" v-model="item.destino">
				<option value="">Seleccionar ciudad...</option>
				<option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Aerolínea</label>
			<select class="form-select" v-model="item.aerolinea">
				<option value="">Seleccionar...</option>
				<option v-for="aerolinea in aerolineas" :key="aerolinea" :value="aerolinea">{{ aerolinea }}</option>
			</select>
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
			<div class="form-check mt-4">
				<input type="checkbox" class="form-check-input" id="chkEscala" v-model="item.escala">
				<label class="form-check-label" for="chkEscala">Tiene escala</label>
			</div>
		</div>
		<div class="col">
			<div class="form-check mt-4">
				<input type="checkbox" class="form-check-input" id="chkEquipaje" v-model.number="item.lleva_equipaje">
				<label class="form-check-label" for="chkEquipaje">Lleva equipaje</label>
			</div>
		</div>
		<div class="col">
			<label class="form-label">Kilos de equipaje</label>
			<input type="number" class="form-control" v-model.number="item.kilos" min="0" placeholder="Peso total">
		</div>

		<div class="col">
			<label class="form-label">Tipo de equipaje</label>
			<input type="text" class="form-control" v-model="item.que_equipaje" placeholder="Descripción del equipaje">
		</div>
		<div class="col">
			<label class="form-label">Precio <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.precio" min="0" step="0.01">
		</div>
		<div class="col">
			<label class="form-label">Precio (USD)</label>
			<input type="number" class="form-control" v-model.number="item.precio_dolares" min="0" step="0.01">
		</div>

		<div class="col-12">
			<label class="form-label">Observaciones</label>
			<textarea class="form-control" v-model="item.observaciones" rows="2" placeholder="Notas adicionales, restricciones, etc."></textarea>
		</div>
	</div>
</template>
<style scoped>
.col {
	margin: 10px 0;
}
</style>