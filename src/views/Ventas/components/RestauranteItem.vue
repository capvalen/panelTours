<script setup>
defineProps({
	item: {
		type: Object,
		required: true
	}
});
</script>

<template>
	<div class="row row-cols-3">
		<div class="col">
			<label class="form-label">Fecha y hora de reserva</label>
			<input type="datetime-local" class="form-control" v-model="item.fecha_hora_reserva">
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
				<option value="salon_principal">Salón Principal</option>
				<option value="salon_privado">Salón Privado</option>
				<option value="terraza">Terraza</option>
				<option value="jardín">Jardín</option>
				<option value="barra">Barra</option>
			</select>
		</div>
		<div class="col">
			<label class="form-label">Número de personas</label>
			<input type="number" class="form-control" v-model.number="item.numero_personas" min="0">
		</div>
		<div class="col">
			<label class="form-label">Precio</label>
			<input type="number" class="form-control" v-model.number="item.precio" min="0" step="1">
		</div>
		
		<div class="col">
			<label class="form-label">Pedido especial</label>
			<input type="text" class="form-control" v-model="item.pedido_especial">
		</div>
	</div>
</template>
