<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
	asignacionEditar: { type: Object, required: true },
	hospedajes: { type: Array, default: () => [] },
	restaurantes: { type: Array, default: () => [] },
	vehiculos: { type: Array, default: () => [] },
	guias: { type: Array, default: () => [] },
	aerolineas: { type: Array, default: () => [] },
});

defineEmits(['guardar']);

const qHospedaje = ref('');
const qRestaurante = ref('');
const qVehiculo = ref('');
const qGuia = ref('');
const qAerolinea = ref('');

const normalizar = (v) => (v || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const hospedajesFiltrados = computed(() => {
	const q = normalizar(qHospedaje.value);
	return [...props.hospedajes]
		.sort((a, b) => (a.hospedaje || '').localeCompare(b.hospedaje || '', 'es', { sensitivity: 'base' }))
		.filter(h => !q || normalizar(`${h.hospedaje} ${h.contacto} ${h.celular}`).includes(q));
});
const restaurantesFiltrados = computed(() => {
	const q = normalizar(qRestaurante.value);
	return [...props.restaurantes]
		.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' }))
		.filter(r => !q || normalizar(`${r.nombre} ${r.ruc} ${r.contacto}`).includes(q));
});
const vehiculosFiltrados = computed(() => {
	const q = normalizar(qVehiculo.value);
	return [...props.vehiculos]
		.sort((a, b) => (a.placa || '').localeCompare(b.placa || '', 'es', { sensitivity: 'base' }))
		.filter(v => !q || normalizar(`${v.placa} ${v.nombre_conductor} ${v.modelo}`).includes(q));
});
const guiasFiltrados = computed(() => {
	const q = normalizar(qGuia.value);
	return [...props.guias]
		.sort((a, b) => (`${a.nombre || ''}`).localeCompare(`${b.nombre || ''}`, 'es', { sensitivity: 'base' }))
		.filter(g => !q || normalizar(`${g.nombre} ${g.dni}`).includes(q));
});
const aerolineasFiltradas = computed(() => {
	const q = normalizar(qAerolinea.value);
	return [...props.aerolineas]
		.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' }))
		.filter(a => !q || normalizar(a.nombre).includes(q));
});

const hospedajeSeleccionado = computed(() => props.hospedajes.find(h => Number(h.id) === Number(props.asignacionEditar.payload?.hospedaje_id)));
const restauranteSeleccionado = computed(() => props.restaurantes.find(r => Number(r.id) === Number(props.asignacionEditar.payload?.restaurante_id)));
const vehiculoSeleccionado = computed(() => props.vehiculos.find(v => Number(v.id) === Number(props.asignacionEditar.payload?.vehiculo_id)));
const guiaSeleccionado = computed(() => props.guias.find(g => Number(g.id) === Number(props.asignacionEditar.payload?.guia_id)));
</script>

<template>
	<div class="modal fade" id="modalEditarAsignaciones" tabindex="-1" aria-labelledby="modalEditarAsignacionesLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="modalEditarAsignacionesLabel">Editar asignaciones</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<template v-if="props.asignacionEditar.tipo === 'restaurant'">
						<div class="row g-2">
							<div class="col-12">
								<label class="form-label">Asignar proveedor (Restaurant)</label>
								<input type="text" class="form-control mb-2" placeholder="Buscar restaurant..." v-model="qRestaurante">
								<select class="form-select" v-model="props.asignacionEditar.payload.restaurante_id">
									<option :value="null">Seleccione restaurant</option>
									<option v-for="r in restaurantesFiltrados" :key="r.id" :value="r.id">{{ r.nombre }}</option>
								</select>
							</div>
							<div class="col-12" v-if="restauranteSeleccionado">
								<div class="alert alert-light border mb-0">
									<div><strong>RUC:</strong> {{ restauranteSeleccionado.ruc || '-' }}</div>
									<div><strong>Contacto:</strong> {{ restauranteSeleccionado.contacto || '-' }}</div>
									<div><strong>Celular:</strong> {{ restauranteSeleccionado.celular || '-' }}</div>
									<div><strong>Dirección:</strong> {{ restauranteSeleccionado.direccion || '-' }}</div>
									<div><strong>Ciudad:</strong> {{ restauranteSeleccionado.ciudad || '-' }}</div>
								</div>
							</div>
							<div class="col-12"><label class="form-label">Comprobante</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.comprobante"></div>
						</div>
					</template>

					<template v-else-if="props.asignacionEditar.tipo === 'hospedaje'">
						<div class="row g-2">
							<div class="col-12">
								<label class="form-label">Asignar proveedor (Hospedaje)</label>
								<input type="text" class="form-control mb-2" placeholder="Buscar hospedaje..." v-model="qHospedaje">
								<select class="form-select" v-model="props.asignacionEditar.payload.hospedaje_id">
									<option :value="null">Seleccione hospedaje</option>
									<option v-for="h in hospedajesFiltrados" :key="h.id" :value="h.id">{{ h.hospedaje }}</option>
								</select>
							</div>
							<div class="col-12" v-if="hospedajeSeleccionado">
								<div class="alert alert-light border mb-0">
									<div><strong>Contacto:</strong> {{ hospedajeSeleccionado.contacto || '-' }}</div>
									<div><strong>Celular:</strong> {{ hospedajeSeleccionado.celular || '-' }}</div>
									<div><strong>Dirección:</strong> {{ hospedajeSeleccionado.direccion || '-' }}</div>
									<div><strong>Email:</strong> {{ hospedajeSeleccionado.correo || '-' }}</div>
									<div><strong>Categoria:</strong> {{ hospedajeSeleccionado.categoria || '-' }}</div>
								</div>
							</div>
							<div class="col-md-6"><label class="form-label">N° habitación</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.numero_habitacion"></div>
							
							<div class="col-12"><label class="form-label">Observaciones</label><textarea class="form-control" rows="2" v-model="props.asignacionEditar.payload.motivo_cancelacion"></textarea></div>
						</div>
					</template>

					<template v-else-if="props.asignacionEditar.tipo === 'vuelo'">
						<div class="row g-2">
							<div class="col-12">
								<label class="form-label">Asignar proveedor (Aerolínea)</label>
								<input type="text" class="form-control mb-2" placeholder="Buscar aerolínea..." v-model="qAerolinea">
								<select class="form-select" v-model="props.asignacionEditar.payload.aerolinea">
									<option value="">Seleccione aerolínea</option>
									<option v-for="a in aerolineasFiltradas" :key="a.id" :value="a.nombre">{{ a.nombre }}</option>
								</select>
							</div>
							<div class="col-md-6"><label class="form-label">Código vuelo</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.codigo_vuelo"></div>
							<div class="col-md-6"><label class="form-label">Número vuelo</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.numero_vuelo"></div>
							<div class="col-md-6"><label class="form-label">Aeronave</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.aeronave"></div>
							<div class="col-md-6">
								<label class="form-label">Clase vuelo</label>
								<select class="form-select" v-model="props.asignacionEditar.payload.clase_vuelo">
									<option value="">Seleccione clase</option>
									<option value="económica">Económica</option>
									<option value="económica plus">Económica Plus</option>
									<option value="turista">Turista</option>
									<option value="ejecutiva">Ejecutiva</option>
									<option value="primera">Primera</option>
								</select>
							</div>
							<div class="col-md-6"><label class="form-label">Escala</label><select class="form-select" v-model="props.asignacionEditar.payload.escala"><option :value="true">Sí</option><option :value="false">No</option></select></div>
							<div class="col-md-6"><label class="form-label">Terminal salida</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.terminal_salida"></div>
							<div class="col-md-6"><label class="form-label">Puerta embarque</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.puerta_embarque"></div>
							<div class="col-md-6"><label class="form-label">Terminal llegada</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.terminal_llegada"></div>
							<div class="col-md-6"><label class="form-label">Asientos asignados</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.asientos_asignados"></div>
							<div class="col-md-6"><label class="form-label">Duración (min)</label><input type="number" class="form-control" v-model.number="props.asignacionEditar.payload.duracion_minutos"></div>
							<div class="col-md-6"><label class="form-label">Costo soles</label><input type="number" step="0.01" class="form-control" v-model.number="props.asignacionEditar.payload.costo_soles"></div>
							<div class="col-md-6"><label class="form-label">Costo dólares</label><input type="number" step="0.01" class="form-control" v-model.number="props.asignacionEditar.payload.costo_dolares"></div>
						</div>
					</template>

					<template v-else-if="props.asignacionEditar.tipo === 'tour'">
						<div class="row g-2">
							<div class="col-12">
								<label class="form-label">Asignar proveedor (Guía)</label>
								<input type="text" class="form-control mb-2" placeholder="Buscar guía..." v-model="qGuia">
								<select class="form-select" v-model="props.asignacionEditar.payload.guia_id">
									<option :value="null">Seleccione guía</option>
									<option v-for="g in guiasFiltrados" :key="g.id" :value="g.id">{{ `${g.dni} - ${g.nombre || ''}`.trim() }}</option>
								</select>
							</div>
							<div class="col-12" v-if="guiaSeleccionado">
								<div class="alert alert-light border mb-0">
									<div><strong>DNI:</strong> {{ guiaSeleccionado.dni || '-' }}</div>
									<div><strong>Celular:</strong> {{ guiaSeleccionado.celular || '-' }}</div>
									<div><strong>Correo:</strong> {{ guiaSeleccionado.correo || '-' }}</div>
									<div><strong>Dirección:</strong> {{ guiaSeleccionado.direccion || '-' }}</div>
								</div>
							</div>
							<div class="col-md-6"><label class="form-label">Fecha</label><input type="date" class="form-control" v-model="props.asignacionEditar.payload.fecha"></div>
							<div class="col-md-6"><label class="form-label">Hora</label><input type="time" class="form-control" v-model="props.asignacionEditar.payload.hora"></div>
							<div class="col-md-6"><label class="form-label">Lugar de encuentro</label><input type="text" class="form-control" v-model="props.asignacionEditar.payload.lugar_encuentro"></div>
							<div class="col-md-6"><label class="form-label">Costo</label><input type="number" step="0.01" class="form-control" v-model.number="props.asignacionEditar.payload.costo"></div>
							<div class="col-md-6">
								<label class="form-label">Tipo servicio</label>
								<select class="form-select" v-model="props.asignacionEditar.payload.tipo_servicio">
									<option value="privado">Privado</option>
									<option value="grupal">Grupal</option>
									<option value="empresarial">Empresarial</option>
									<option value="individual">Individual</option>
								</select>
							</div>
						</div>
					</template>

					<template v-else-if="props.asignacionEditar.tipo === 'transporte'">
						<div class="row g-2">
							<div class="col-12">
								<label class="form-label">Asignar proveedor (Vehículo)</label>
								<input type="text" class="form-control mb-2" placeholder="Buscar vehículo..." v-model="qVehiculo">
								<select class="form-select" v-model="props.asignacionEditar.payload.vehiculo_id">
									<option :value="null">Seleccione vehículo</option>
									<option v-for="v in vehiculosFiltrados" :key="v.id" :value="v.id">{{ `${v.placa || '-'} - ${v.nombre_conductor || ''}` }}</option>
								</select>
							</div>
							<div class="col-12" v-if="vehiculoSeleccionado">
								<div class="alert alert-light border mb-0">
									<div><strong>Conductor:</strong> {{ vehiculoSeleccionado.nombre_conductor || '-' }}</div>
									<div><strong>Celular:</strong> {{ vehiculoSeleccionado.celular || '-' }}</div>
									<div><strong>Modelo:</strong> {{ vehiculoSeleccionado.modelo || '-' }}</div>
									<div><strong>Combustible:</strong> {{ vehiculoSeleccionado.tipo_combustible || '-' }}</div>
								</div>
							</div>
							<div class="col-md-6"><label class="form-label">Costo</label><input type="number" step="0.01" class="form-control" v-model.number="props.asignacionEditar.payload.costo"></div>
						</div>
					</template>

					<template v-else>
						<p class="text-muted mb-0">Este recurso no tiene campos de asignación editables.</p>
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
