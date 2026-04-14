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
			<label class="form-label">Fecha de reserva</label>
			<input type="date" class="form-control" v-model="item.fecha_reserva">
		</div>
		<div class="col">
			<label class="form-label">Hora de reserva</label>
			<input type="time" class="form-control" v-model="item.hora_reserva">
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
			<label class="form-label">Precio <span class="text-danger">*</span></label>
			<input type="number" class="form-control" v-model.number="item.precio" min="0" step="1">
		</div>
		
		<div class="col">
			<label class="form-label">Pedido especial</label>
			<input type="text" class="form-control" v-model="item.pedido_especial">
		</div>
	</div>
</template>
<style scoped>
.col {
	margin: 10px 0;
}
</style>