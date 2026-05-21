<script setup>
import { watch } from 'vue';

const props = defineProps({
	confirmacionEditar: {
		type: Object,
		required: true
	}
});

defineEmits(['guardar']);

const normalizarFechaInput = (valor) => {
	if (!valor) return null;
	const str = String(valor).trim();
	if (!str) return null;
	if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
	if (/^\d{4}-\d{2}-\d{2}\s/.test(str) || /^\d{4}-\d{2}-\d{2}T/.test(str)) return str.slice(0, 10);
	const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (m) return `${m[3]}-${m[2]}-${m[1]}`;
	return str;
};

watch(
	() => [props.confirmacionEditar.tipo, props.confirmacionEditar.payload],
	() => {
		const tipo = props.confirmacionEditar?.tipo;
		const p = props.confirmacionEditar?.payload;
		if (!p) return;

		if (tipo === 'tour') {
			p.fecha_salida = normalizarFechaInput(p.fecha_salida);
			p.fecha_retorno = normalizarFechaInput(p.fecha_retorno);
		}
		if (tipo === 'restaurant') {
			p.fecha_confirmacion = normalizarFechaInput(p.fecha_confirmacion);
			p.fecha_reserva = normalizarFechaInput(p.fecha_reserva);
		}
		if (tipo === 'hospedaje') {
			p.fecha_ingreso = normalizarFechaInput(p.fecha_ingreso);
			p.fecha_salida = normalizarFechaInput(p.fecha_salida);
		}
		if (tipo === 'vuelo') {
			p.fecha_salida = normalizarFechaInput(p.fecha_salida);
			p.fecha_llegada = normalizarFechaInput(p.fecha_llegada);
		}
		if (tipo === 'transporte') {
			p.fecha_inicio = normalizarFechaInput(p.fecha_inicio);
			p.fecha_fin = normalizarFechaInput(p.fecha_fin);
		}
	},
	{ immediate: true, deep: true }
);
</script>

<template>
	<div class="modal fade" id="modalEditarConfirmaciones" tabindex="-1" aria-labelledby="modalEditarConfirmacionesLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="modalEditarConfirmacionesLabel">Editar confirmaciones</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<template v-if="props.confirmacionEditar.tipo === 'restaurant'">
						<div class="row g-2">
							<div class="col-md-6">
								<label class="form-label">Estado</label>
								<select class="form-select" v-model="props.confirmacionEditar.payload.estado">
									<option value="pendiente">Pendiente</option>
									<option value="confirmado">Confirmado</option>
									<option value="cancelado">Cancelado</option>
									<option value="completado">Completado</option>
								</select>
							</div>
							<div class="col-md-6"><label class="form-label">Fecha confirmación</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_confirmacion"></div>
							<div class="col-md-6"><label class="form-label">Hora reserva</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.hora_reserva"></div>
							<div class="col-md-6"><label class="form-label">Precio</label><input type="number" step="0.01" class="form-control" v-model.number="props.confirmacionEditar.payload.precio"></div>
							<div class="col-12"><label class="form-label">Pedido especial</label><textarea class="form-control" rows="2" v-model="props.confirmacionEditar.payload.pedido_especial"></textarea></div>
						</div>
					</template>
					<template v-else-if="props.confirmacionEditar.tipo === 'hospedaje'">
						<div class="row g-2">
							<div class="col-md-6"><label class="form-label">Fecha ingreso</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_ingreso"></div>
							<div class="col-md-6"><label class="form-label">Fecha salida</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_salida"></div>
							<div class="col-md-6"><label class="form-label">Hora checkin</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.hora_checkin"></div>
							<div class="col-md-6"><label class="form-label">Hora checkout</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.hora_checkout"></div>
							<div class="col-md-6"><label class="form-label">Precio por noche</label><input type="number" step="0.01" class="form-control" v-model.number="props.confirmacionEditar.payload.precio_por_noche"></div>
							<div class="col-md-6"><label class="form-label">Precio</label><input type="number" step="0.01" class="form-control" v-model.number="props.confirmacionEditar.payload.precio"></div>
							<div class="col-md-6 form-check mt-4 ms-2"><input class="form-check-input" type="checkbox" id="chkCuna" v-model="props.confirmacionEditar.payload.requiere_cuna"><label class="form-check-label" for="chkCuna">Requiere cuna</label></div>
							<div class="col-md-6 form-check mt-4 ms-2"><input class="form-check-input" type="checkbox" id="chkFumador" v-model="props.confirmacionEditar.payload.habitacion_fumador"><label class="form-check-label" for="chkFumador">Habitación fumador</label></div>
							<div class="col-12"><label class="form-label">Preferencias especiales</label><textarea class="form-control" rows="2" v-model="props.confirmacionEditar.payload.preferencias_especiales"></textarea></div>
						</div>
					</template>
					<template v-else-if="props.confirmacionEditar.tipo === 'vuelo'">
						<div class="row g-2">
							<div class="col-md-6">
								<label class="form-label">Estado</label>
								<select class="form-select" v-model="props.confirmacionEditar.payload.estado_tramo">
									<option value="pendiente">Pendiente</option>
									<option value="confirmado">Confirmado</option>
									<option value="emitido">Emitido</option>
									<option value="checkin_disponible">Checkin disponible</option>
									<option value="checkin_realizado">Checkin realizado</option>
									<option value="abordado">Abordado</option>
									<option value="cancelado">Cancelado</option>
									<option value="completado">Completado</option>
								</select>
							</div>
							<div class="w-100"></div>
							<div class="col-md-4"><label class="form-label">Lleva equipaje</label><select class="form-select" v-model="props.confirmacionEditar.payload.lleva_equipaje"><option value="si">Sí</option><option value="no">No</option></select></div>
							<div class="col-md-4"><label class="form-label">Kilos</label><input type="number" class="form-control" v-model.number="props.confirmacionEditar.payload.kilos"></div>
							<div class="col-md-4"><label class="form-label">Equipaje</label><input type="text" class="form-control" v-model="props.confirmacionEditar.payload.que_equipaje"></div>
							<div class="col-md-6"><label class="form-label">Fecha salida</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_salida"></div>
							<div class="col-md-6"><label class="form-label">Hora salida</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.hora_salida"></div>
							<div class="col-md-6"><label class="form-label">Fecha llegada</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_llegada"></div>
							<div class="col-md-6"><label class="form-label">Hora llegada</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.horario_llegada"></div>
							<div class="col-12"><label class="form-label">Observaciones</label><textarea class="form-control" rows="2" v-model="props.confirmacionEditar.payload.observaciones"></textarea></div>
						</div>
					</template>
					<template v-else-if="props.confirmacionEditar.tipo === 'tour'">
						<div class="row g-2">
							<div class="col-md-6">
								<label class="form-label">Estado</label>
								<select class="form-select" v-model="props.confirmacionEditar.payload.estado">
									<option value="pendiente">Pendiente</option>
									<option value="confirmado">Confirmado</option>
									<option value="en_curso">En curso</option>
									<option value="finalizado">Finalizado</option>
									<option value="cancelado">Cancelado</option>
								</select>
							</div>
							<div class="col-md-6"><label class="form-label">Costo</label><input type="number" step="0.01" class="form-control" v-model.number="props.confirmacionEditar.payload.costo"></div>
							<div class="col-md-6"><label class="form-label">Fecha salida</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_salida"></div>
							<div class="col-md-6"><label class="form-label">Hora salida</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.hora_salida"></div>
							<div class="col-md-6"><label class="form-label">Fecha retorno</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_retorno"></div>
							<div class="col-md-6"><label class="form-label">Hora retorno</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.hora_retorno"></div>
							<div class="col-md-6"><label class="form-label">Punto partida</label><input type="text" class="form-control" v-model="props.confirmacionEditar.payload.punto_partida"></div>
							<div class="col-md-6"><label class="form-label">Punto llegada</label><input type="text" class="form-control" v-model="props.confirmacionEditar.payload.punto_llegada"></div>
							<div class="col-12"><label class="form-label">Observaciones</label><textarea class="form-control" rows="2" v-model="props.confirmacionEditar.payload.observaciones"></textarea></div>
						</div>
					</template>
					<template v-else-if="props.confirmacionEditar.tipo === 'transporte'">
						<div class="row g-2">
							<div class="col-md-6">
								<label class="form-label">Estado alquiler</label>
								<select class="form-select" v-model="props.confirmacionEditar.payload.estado_alquiler">
									<option value="pendiente">Pendiente</option>
									<option value="reservado">Reservado</option>
									<option value="activo">Activo</option>
									<option value="finalizado">Finalizado</option>
									<option value="cancelado">Cancelado</option>
								</select>
							</div>
							<div class="col-md-6"><label class="form-label">Costo</label><input type="number" step="0.01" class="form-control" v-model.number="props.confirmacionEditar.payload.costo"></div>
							<div class="col-md-6"><label class="form-label">Precio</label><input type="number" step="0.01" class="form-control" v-model.number="props.confirmacionEditar.payload.precio"></div>
							<div class="col-md-6"><label class="form-label">Fecha inicio</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_inicio"></div>
							<div class="col-md-6"><label class="form-label">Hora recogida</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.hora_recogida"></div>
							<div class="col-md-6"><label class="form-label">Fecha fin</label><input type="date" class="form-control" v-model="props.confirmacionEditar.payload.fecha_fin"></div>
							<div class="col-md-6"><label class="form-label">Hora devolución</label><input type="time" class="form-control" v-model="props.confirmacionEditar.payload.hora_devolucion"></div>
							<div class="col-12"><label class="form-label">Observaciones</label><textarea class="form-control" rows="2" v-model="props.confirmacionEditar.payload.observaciones"></textarea></div>
						</div>
					</template>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="$emit('guardar')">Guardar cambios</button>
				</div>
			</div>
		</div>
	</div>
</template>
