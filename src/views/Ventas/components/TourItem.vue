<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		required: true
	},
	tours: {
		type: Array,
		required: true
	},
	nacionalidad: {
		type: String,
		required: true
	}
});

const updating = ref(false);
const texto = ref('');

watch(texto, (nuevoValor) => {
	if (updating.value) return;
	updating.value = true;

	const tourSeleccionado = props.tours.find(t => String(t.id + ' - ' + t.nombre) === String(nuevoValor));
	if (tourSeleccionado) {
		props.item.tour_id = tourSeleccionado.id;
		props.item.nombre_tour = tourSeleccionado.nombre || '';
		props.item.tipo_tour = tourSeleccionado.tipo == 1 ? 'tour': 'paquete';
		props.item.descripcion = tourSeleccionado.descripcion || '';
		props.item.peruanos_adultos = tourSeleccionado.peruanos_adultos
		props.item.peruanos_kids = tourSeleccionado.peruanos_kids
		props.item.extranjeros_adultos = tourSeleccionado.extranjeros_adultos
		props.item.extranjeros_kids = tourSeleccionado.extranjeros_kids

	} else {
		props.item.tour_id = null;
		props.item.nombre_tour = '';
		props.item.tipo_tour = '';
		props.item.descripcion = '';
		props.item.peruanos_adultos = 0
		props.item.peruanos_kids = 0
		props.item.extranjeros_adultos = 0
		props.item.extranjeros_kids = 0
	}

	setTimeout(() => { updating.value = false; }, 0);
});

</script>

<template>
	<div class="row row-cols-3">
		<div class="col">
			<label class="form-label">Tour <span class="text-danger">*</span></label>
			<input type="search" class="form-control" list="listaTours" v-model="texto"
				placeholder="Buscar tour...">
			<datalist id="listaTours">
				<option v-for="tour in tours" :key="tour.id" :value="tour.id+' - ' + tour.nombre">
					{{ tour.nombre }}
				</option>
			</datalist>
		</div>
		<div class="col">
			<label class="form-label">Nombre</label>
			<input type="text" class="form-control" v-model="item.nombre_tour" disabled>
		</div>
		<div class="col">
			<label class="form-label">Tipo</label>
			<select class="form-select" v-model="item.tipo_tour">
				<option value="tour">Tour</option>
				<option value="paquete">Paquete</option>
			</select>
		</div>

		<div class="col" v-if="nacionalidad === 'peruano'">
			<label class="form-label">Precio adulto (S/)</label>
			<input type="number" class="form-control" v-model.number="item.peruanos_adultos" min="0" step="0.01">
		</div>
		<div class="col" v-else>
			<label class="form-label">Precio adulto (S/)</label>
			<input type="number" class="form-control" v-model.number="item.extranjeros_adultos" min="0" step="0.01">
		</div>
		<div class="col" v-if="nacionalidad === 'peruano'">
			<label class="form-label">Precio niño (S/)</label>
			<input type="number" class="form-control" v-model.number="item.peruanos_kids" min="0" step="0.01">
		</div>
		<div class="col" v-else>
			<label class="form-label">Precio niño (S/)</label>
			<input type="number" class="form-control" v-model.number="item.extranjeros_kids" min="0" step="0.01">
		</div>
		<div class="col">
			<label class="form-label">Cantidad de personas <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.cantidad_personas" min="0">
		</div>

		<div class="col">
			<label class="form-label">Fecha de salida <span class="text-danger">*</span></label>
			<input type="date" class="form-control sinColor" v-model="item.fecha_salida" >
		</div>
		<div class="col">
			<label class="form-label">Hora de salida</label>
			<input type="time" class="form-control" v-model="item.hora_salida">
		</div>
		<div class="col">
			<label class="form-label">Punto de partida</label>
			<input type="text" class="form-control" v-model="item.punto_partida" placeholder="Dirección o lugar">
		</div>

		<div class="col">
			<label class="form-label">Fecha de retorno</label>
			<input type="date" class="form-control" v-model="item.fecha_retorno" placeholder=" ">
		</div>
		<div class="col">
			<label class="form-label">Hora de retorno</label>
			<input type="time" class="form-control" v-model="item.hora_retorno">
		</div>
		<div class="col">
			<label class="form-label">Punto de llegada</label>
			<input type="text" class="form-control" v-model="item.punto_llegada" placeholder="Dirección o lugar">
		</div>

		
		<div class="col">
			<label class="form-label">Cantidad adultos</label>
			<input type="number" class="form-control" v-model.number="item.cantidad_adultos" min="0">
		</div>

		<div class="col">
			<label class="form-label">Cantidad niños</label>
			<input type="number" class="form-control" v-model.number="item.cantidad_ninos" min="0">
		</div>
		<div class="w-100"></div>

		<div class="col">
			<label class="form-label">Incluye</label>
			<textarea class="form-control" v-model="item.incluye" rows="2" placeholder="Servicios incluidos"></textarea>
		</div>
		<div class="col">
			<label class="form-label">No incluye</label>
			<textarea class="form-control" v-model="item.no_incluye" rows="2" placeholder="Servicios no incluidos"></textarea>
		</div>
		<div class="col">
			<label class="form-label">Precio <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.precio" min="0" step="1">
		</div>
		<div class="col-6">
			<label class="form-label">Requisitos extra</label>
			<textarea class="form-control" v-model="item.requisitos" rows="2" placeholder="Documentos, edad, etc."></textarea>
		</div>

		<div class="col-6">
			<label class="form-label">Observaciones</label>
			<textarea class="form-control" v-model="item.observaciones" rows="2" placeholder="Notas adicionales"></textarea>
		</div>
	</div>
</template>
<style scoped>
.col {
	margin: 10px 0;
}
input.sinColor {
	color: white;
}

input.conColor {
	color: black;
}

</style>