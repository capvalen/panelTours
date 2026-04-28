<script setup>
import { ref, watch } from 'vue';
import { useFormat } from '@/composables/formatos'

const { formatMoneda } = useFormat()
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

watch([() => props.item.cantidad_adultos, () => props.item.cantidad_ninos, ()=> props.item.tour_id, () => props.nacionalidad], () => {
	if (props.nacionalidad === 'peruano') {
		props.item.precio = (props.item.cantidad_adultos || 0) * (props.item.peruanos_adultos || 0) +
			(props.item.cantidad_ninos || 0) * (props.item.peruanos_kids || 0);
	} else {
		props.item.precio = (props.item.cantidad_adultos || 0) * (props.item.extranjeros_adultos || 0) +
			(props.item.cantidad_ninos || 0) * (props.item.extranjeros_kids || 0);
	}
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
			<p class="mb-0 text-capitalize">{{ item.tipo_tour ?? '-' }}</p>
		</div>
		<div class="col" v-if="nacionalidad === 'peruano'">
			<label class="form-label">Precio adulto (S/)</label>
			<p class="mb-0">{{ formatMoneda(item.peruanos_adultos) }}</p>
		</div>
		<div class="col" v-else>
			<label class="form-label">Precio adulto (S/)</label>
			<p class="mb-0">{{ formatMoneda(item.extranjeros_adultos) }}</p>
		</div>
		<div class="col" v-if="nacionalidad === 'peruano'">
			<label class="form-label">Precio niño (S/)</label>
			<p class="mb-0">{{ formatMoneda(item.peruanos_kids) }}</p>
		</div>
		<div class="col" v-else>
			<label class="form-label">Precio niño (S/)</label>
			<p class="mb-0">{{ formatMoneda(item.extranjeros_kids) }}</p>
		</div>
		<div class="w-100"></div>
		<div class="col">
			<label class="form-label">Cantidad de adultos</label>
			<input type="number" class="form-control" v-model.number="item.cantidad_adultos" min="0">
		</div>
		<div class="col">
			<label class="form-label">Cantidad de niños <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.cantidad_ninos" min="0">
		</div>
		<div class="col d-none">
			<label class="form-label">Cantidad de personas <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.cantidad_personas" min="0">
		</div>
		<div class="w-100"></div>

		<div class="col">
			<label class="form-label">Fecha de salida <span class="text-danger">*</span></label>
			<input type="date" class="form-control" v-model="item.fecha_salida" >
		</div>
		<div class="col">
			<label class="form-label">Hora de salida</label>
			<input type="time" class="form-control" v-model="item.hora_salida">
		</div>
		<div class="col">
			<label class="form-label">Punto de partida</label>
			<input type="text" class="form-control" v-model="item.punto_partida" placeholder="">
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
			<input type="text" class="form-control" v-model="item.punto_llegada" placeholder="">
		</div>

		<div class="w-100"></div>

		
		<div class="col-6">
			<label class="form-label">Requisitos extra</label>
			<textarea class="form-control" v-model="item.requisitos" rows="2" placeholder="Documentos, edad, etc."></textarea>
		</div>
		<div class="col-6">
			<label class="form-label">Observaciones</label>
			<textarea class="form-control" v-model="item.observaciones" rows="2" placeholder="Notas adicionales"></textarea>
		</div>
		<div class="col"></div>
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