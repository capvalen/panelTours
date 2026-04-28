<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		required: true
	},
	restaurantes: {
		type: Array,
		required: true
	}
});

const searchText = ref('');

watch(searchText, (value) => {
	const selected = props.restaurantes.find(r => String(r.id) === String(value));
	if (selected) {
		props.item.restaurante_id = selected.id;
		props.item.ruc = selected.ruc;
		props.item.nombre = selected.nombre;
		props.item.contacto = selected.contacto;
	} else {
		props.item.restaurante_id = null;
		props.item.ruc = '';
		props.item.nombre = '';
		props.item.contacto = '';
	}
});
</script>

<template>
	<div class="row row-cols-3">
		<div class="col">
			<label class="form-label"><i class="bi bi-funnel"></i> Restaurante <span class="text-danger">*</span></label>
			<input type="text" class="form-control" list="listaRestaurantes" v-model="searchText"
				placeholder="Buscar restaurante...">
			<datalist id="listaRestaurantes">
				<option v-for="restaurant in restaurantes" :key="restaurant.id" :value="restaurant.id">
					{{ restaurant.nombre + ' - ' + restaurant.ruc + ' - ' + restaurant.contacto }}
				</option>
			</datalist>
		</div>
		<div class="col">
			<label class="form-label">RUC</label>
			<input type="text" class="form-control" v-model="item.ruc" disabled>
		</div>
		<div class="col">
			<label class="form-label">Nombre</label>
			<input type="text" class="form-control" v-model="item.nombre" disabled>
		</div>		
		<div class="col d-none">
			<label class="form-label">Hora de reserva</label>
			<input type="time" class="form-control" v-model="item.hora_reserva">
		</div>
		<div class="col">
			<label class="form-label">Número de personas</label>
			<input type="number" class="form-control" v-model.number="item.numero_personas" min="0">
		</div>
		<div class="col">
			<label class="form-label">Tipo de servicio</label>
			<select class="form-select" v-model="item.tipo_servicio">
				<option value="buffet">Buffet</option>
				<option value="carta">Carta</option>
				<option value="degustación">Degustación</option>
				<option value="evento">Evento</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Turno</label>
			<select class="form-select" v-model="item.turno">
				<option value="comida">Comida</option>
				<option value="cena">Cena</option>
				<option value="brunch">Brunch</option>
				<option value="desayuno">Desayuno</option>
				<option value="madrugada">Madrugada</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Espacio</label>
			<select class="form-select" v-model="item.espacio">
				<option value="interior">Interior</option>
				<option value="salón principal">Salón Principal</option>
				<option value="salón privado">Salón Privado</option>
				<option value="terraza">Terraza</option>
				<option value="jardín">Jardín</option>
				<option value="barra">Barra</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Pedido especial</label>
			<input type="text" class="form-control" v-model="item.pedido_especial">
		</div>
		<div class="col">
			<label class="form-label">Precio a pagar <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.precio" min="0" step="1">
		</div>
	</div>
</template>
<style scoped>
.col {
	margin: 10px 0;
}
</style>