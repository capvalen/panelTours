<script setup>
import { watch } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		required: true
	},
	guias: {
		type: Array,
		required: true
	}
});

watch(() => props.item.guia_nombre, (nuevoValor) => {
	const guiaSeleccionado = props.guias.find(g => String(g.id) === String(nuevoValor));
	if (guiaSeleccionado) {
		props.item.guia_id = guiaSeleccionado.id;
		props.item.guia_nombre = guiaSeleccionado.nombre;
	} else {
		props.item.guia_id = null;
	}
});
</script>

<template>
	<div class="row row-cols-3">
		<div class="col">
			<label class="form-label">Guía</label>
			<input type="text" class="form-control" list="listaGuias" v-model="item.guia_nombre"
				placeholder="Buscar guía...">
			<datalist id="listaGuias">
				<option v-for="guia in guias" :key="guia.id" :value="guia.id" :data-id="guia.id">
					{{ guia.nombre }} - {{guia.dni}}
				</option>
			</datalist>
		</div>
		<div class="col">
			<label class="form-label">Ruta</label>
			<input type="text" class="form-control" v-model="item.ruta">
		</div>
		<div class="col">
			<label class="form-label">Fecha</label>
			<input type="date" class="form-control" v-model="item.fecha">
		</div>
		<div class="col">
			<label class="form-label">Hora</label>
			<input type="time" class="form-control" v-model="item.hora">
		</div>
		<div class="col">
			<label class="form-label">Lugar de encuentro</label>
			<input type="text" class="form-control" v-model="item.lugar_encuentro">
		</div>
		
		<div class="col">
			<label class="form-label">Duración (en horas)</label>
			<input type="number" class="form-control" v-model.number="item.duracion_horas" min="0">
		</div>
		<div class="col">
			<label class="form-label">Tipo de servicio</label>
			<select class="form-select" v-model="item.tipo_servicio">
				<option value="privado">Privado</option>
				<option value="grupal">Grupal</option>
				<option value="empresarial">Empresarial</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Cantidad de personas</label>
			<input type="number" class="form-control" v-model.number="item.cantidad_personas" min="0">
		</div>
		<div class="col">
			<label class="form-label">Costo (S/)</label>
			<input type="number" class="form-control" v-model.number="item.precio" min="0" step="1">
		</div>
		<div class="col">
			<label class="form-label">Pedido especial</label>
			<input type="text" class="form-control" v-model="item.pedido_especial">
		</div>
	</div>
</template>
