<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useClienteStore } from '@/stores/clienteStore';
import { useVehiculosStore } from '@/stores/vehiculoStore';
import { useGuiasStore } from '@/stores/guiaStore';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2';
import RestauranteItem from './components/RestauranteItem.vue';
import GuiaItem from './components/GuiaItem.vue';
import HospedajeItem from './components/HospedajeItem.vue';
import TransporteItem from './components/VehiculoItem.vue';
import TourItem from './components/TourItem.vue';
import VueloItem from './components/VueloItem.vue';

const clienteStore = useClienteStore();
const vehiculoStore = useVehiculosStore();
const guiasStore = useGuiasStore();

const { formatHoy } = useFormat();

const venta = reactive({
	cliente_id: '',
	cliente_busqueda: '',
	tipo: 'venta',
	nacionalidad: 'peruano',
	estado_pago: '',
	fecha: formatHoy(),
	precio: 0,
	idServicio: 1,
	motivo_descuento: '',
	descuento: 0,
});

const items = ref([
	{
		tipo: '',
		nro_clientes: 0,
		precio: 0,
		descripcion: '',
	}
]);
const canasta = ref([]);

const clienteSeleccionado = ref(null);
const tours = ref([]);
const conFechaFinal = ref(false);

const buscarCliente = () => {
	// Función de búsqueda manual si se requiere
};

const nuevoItem = {
	'restaurante': {
		tipo: 'restaurante',
		tipo_servicio: 'carta',
		turno: null,
		espacio: null,
		numero_personas: 0,
		fecha_reserva: null,
		hora_reserva: null,
		pedido_especial: null,
		precio:0
	},
	'guía': {
		tipo: 'guía',
		guia_id: null,
		guia_nombre: '',
		ruta: '',
		fecha: null,
		hora: null,
		lugar_encuentro: null,
		precio: 0,
		duracion_horas:0,
		tipo_servicio: 'privado',
		cantidad_personas: 0,		
		pedido_especial: null
	},
	'hospedaje':{
		tipo: 'hospedaje',
		tipo_habitacion: 'simple',		
		fecha_ingreso: null,
		fecha_salida: null,
		hora_ingreso: null,
		hora_salida: null,
		cantidad_noches: 0,
		cantidad_adultos: 0,
		cantidad_ninos: 0,
		precio_por_noche:0,
		precio:0,
		requiere_cuna:false,
		habitacion_fumador:false,
		preferencias_especiales:''
	},
	'transporte':{
		tipo:'transporte',
		origen:'', destino:'',
		vehiculo_id:null,
		vehiculo_nombre:'',
		fecha_inicio: null,
		fecha_fin: null,
		hora_recogida: null,
		hora_devolucion: null,
		precio: 0,
		observaciones: '',
	},
	'tour':{
		tipo:'tour',
		tour_id: null,
		nombre_tour: null,
		tipo_tour:null,
		descripcion:null,
		fecha_salida:null,
		fecha_retorno:null,
		cantidad_personas:0,
		cantidad_adultos: 0,
		cantidad_ninos: 0,
		peruanos_adultos: 0,
		peruanos_kids: 0,
		extranjeros_adultos: 0,
		extranjeros_kids: 0,
		precio:0,
		incluye:null,
		no_incluye:null,
		punto_partida:'',
		punto_llegada: '',
		hora_salida:null,
		hora_retorno:null,
		requisitos:'',
		observaciones:'',
	},
	'vuelo': {
		tipo:'vuelo',
		origen: '',
		destino: '',
		pasajeros: 0,
		lleva_equipaje: 0,
		kilos: null,
		que_equipaje: '',
		precio_soles: 0,
		precio_dolares: 0,
		precio:0,
		aerolinea: null,
		fecha_salida: null,
		fecha_llegada: null,
		hora_salida: null,
		horario_llegada: null,
		clase_vuelo: 'económica',
		escala: false,
		observaciones: '',
	}

};

const addCanasta = (tipo) => {
	canasta.value.push({ ...nuevoItem[tipo] });
};

const getItemIcon = (tipo) => {
	const icons = {
		'restaurante': '🍽️',
		'guía': '🧑‍✈️',
		'hospedaje': '🏨',
		'tour': '🧳',
		'transporte': '🚌',
		'vuelo': '✈️'
	};
	return icons[tipo] || '📦';
};

const onClienteInput = (event) => {
	const valor = event.target.value;
	const clienteEncontrado = clienteStore.clientes.find(c =>
		String(c.id) === valor
	);

	if (clienteEncontrado) {
		venta.nacionalidad = clienteEncontrado.nacionalidad
		clienteSeleccionado.value = clienteEncontrado;
		venta.cliente_id = clienteEncontrado.id;
		venta.cliente_busqueda = clienteEncontrado.razon_social || (clienteEncontrado.apellidos + ' ' + clienteEncontrado.nombres);
	} else {
		clienteSeleccionado.value = null;
		venta.cliente_id = '';
	}
};

const precioTotal = computed(() => {
	const sumaItems = canasta.value.reduce((total, item) => {
		return total + (item.precio || 0);
	}, 0);
	return Math.max(0, sumaItems - (venta.descuento || 0));
});

watch([() => canasta.value, () => venta.descuento], () => {
	venta.precio = precioTotal.value;
}, { deep: true });

onMounted(async () => {
	await clienteStore.listarClientes();
	await guiasStore.listar();
	await vehiculoStore.listar();

	try {
		const response = await fetch('https://grupoeuroandino.com/app/api/mostrarTours_todos.php');
		tours.value = await response.json();
	} catch (error) {
		console.error('Error al cargar los tours:', error);
	}
});

const guardarVenta = async () => {
	// Validar canasta vacía
	if (canasta.value.length === 0) {
		Swal.fire('Error', 'Debe rellenar items a la canasta', 'error');
		return;
	}

	// Validar cada item de la canasta
	for (const item of canasta.value) {
		// Validación común: precio <= 0
		if (!item.precio || item.precio <= 0) {
			Swal.fire('Error', 'Debe rellenar el precio de cada item mayor a cero', 'error');
			return;
		}

		// Validaciones según tipo de item
		switch (item.tipo) {
			case 'guía':
				if (!item.guia_id) {
					Swal.fire('Error', 'Falta seleccionar un guía', 'error');
					return;
				}
				if (!item.fecha) {
					Swal.fire('Error', 'Falta ingresar la fecha del guía', 'error');
					return;
				}
				break;

			case 'hospedaje':
				if (!item.fecha_ingreso) {
					Swal.fire('Error', 'Falta fecha de ingreso', 'error');
					return;
				}
				if (!item.cantidad_noches || item.cantidad_noches <= 0) {
					Swal.fire('Error', 'La cantidad de noches no puede ser 0', 'error');
					return;
				}
				break;

			case 'transporte':
				if (!item.fecha_inicio) {
					Swal.fire('Error', 'Indique la fecha de inicio', 'error');
					return;
				}
				if (!item.vehiculo_id) {
					Swal.fire('Error', 'Falta seleccionar un transporte', 'error');
					return;
				}
				break;

			case 'tour':
				if (!item.tour_id) {
					Swal.fire('Error', 'Falta seleccionar un tour o paquete', 'error');
					return;
				}
				if (!item.fecha_salida) {
					Swal.fire('Error', 'Indique la fecha de salida', 'error');
					return;
				}
				if (!item.cantidad_personas || item.cantidad_personas < 1) {
					Swal.fire('Error', 'La cantidad de personas no puede ser 0', 'error');
					return;
				}
				break;

			case 'vuelo':
				if (!item.origen || item.origen === '') {
					Swal.fire('Error', 'Indique el punto de origen', 'error');
					return;
				}
				if (!item.fecha_salida) {
					Swal.fire('Error', 'Indique la fecha de salida', 'error');
					return;
				}
				break;

			case 'restaurante':
				if (!item.fecha_reserva) {
					Swal.fire('Error', 'Falta ingresar la fecha de reserva', 'error');
					return;
				}
				break;
		}
	}

	// Si todas las validaciones pasan, guardar la venta
	try {
		// TODO: Implementar la lógica para guardar la venta en el backend
		// const response = await fetch('API_URL', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ venta, items: canasta.value })
		// });
		console.info('canasta:', canasta.value )

		Swal.fire('Éxito', 'Venta guardada', 'success');
	} catch (error) {
		Swal.fire('Error', 'No se pudo guardar la venta', 'error');
	}
};
</script>
<template>
	<h1>Nueva venta</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/rutas-de-servicio">Rutas de Servicio</a></li>
			<li class="breadcrumb-item"><a href="/ventas">Ventas y cotizaciones</a></li>
			<li class="breadcrumb-item active" aria-current="page">Nueva venta</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-10 mx-auto">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Datos básicos de la venta</h6>
					<div class="row row-cols-4">
						<div class="col">
							<label for="usuario" class="form-label">Usuario</label>
							<input type="text" class="form-control" id="usuario" value="Úrsula" disabled>
						</div>
						<div class="col">
							<label for="usuario" class="form-label">Tipo</label>
							<select name="" id="sltTipo" class="form-select" v-model="venta.tipo">
								<option value="venta">Venta</option>
								<option value="cotización">Cotización</option>
							</select>
						</div>
						<div class="col">
							<label for="txtFecha" class="form-label">Fecha</label>
							<input type="date" class="form-control" id="txtFecha" v-model="venta.fecha">
						</div>

						<div class="w-100"></div>
						<div class="col">
							<label for="txtCliente" class="form-label">Buscar Cliente</label>
							<input type="text" class="form-control" id="txtCliente" list="listaClientes"
								v-model="venta.cliente_busqueda" @input="onClienteInput" placeholder="Buscar por nombre o DNI/RUC...">
							<datalist id="listaClientes">
								<option v-for="cliente in clienteStore.clientes" :key="cliente.id" :value="cliente.id">
									{{ (cliente.razon_social || (cliente.apellidos + ' ' + cliente.nombres) || '') + ' - ' + (cliente.ruc
										||
										cliente.dni || '')}}
								</option>
							</datalist>
						</div>
						<div class="col">
							<label for="txtDniRuc" class="form-label">DNI / RUC</label>
							<input type="text" class="form-control" id="txtDniRuc"
								:value="clienteSeleccionado ? (clienteSeleccionado.ruc || clienteSeleccionado.dni) : ''" disabled>
						</div>
						<div class="col">
							<label for="txtRazonSocial" class="form-label">Razón Social / Apellidos y Nombres</label>
							<input type="text" class="form-control" id="txtRazonSocial"
								:value="clienteSeleccionado ? (clienteSeleccionado.razon_social || clienteSeleccionado.apellidos + ' ' + clienteSeleccionado.nombres) : ''"
								disabled>
						</div>


					</div>

				</div>
			</div>
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Datos de extras</h6>
					<div class="row row-cols-4">
						<div class="col">
							<label for="nacionalidad" class="form-label">Nacionalidad</label>
							<select name="nacionalidad" id="" class="form-select" v-model="venta.nacionalidad">
								<option value="peruano">Peruana</option>
								<option value="extranjero">Extranjera</option>
							</select>
						</div>
						<div class="col">
							<label for="usuario" class="form-label">N° de pasajeros</label>
							<input type="number" class="form-control" id="usuario" v-model.number="items[0].nro_clientes" min="0">
						</div>
						<div class="col">
							<label for="txtFechaInicial" class="form-label">Fecha inicial</label>
							<input type="date" class="form-control" id="txtFechaInicial" value="2025-01-05">
						</div>
						<div class="col">
							<label for="txtFechaFinal" class="form-label">Fecha final</label>
							<div class="d-flex align-items-center gap-2">
								<input type="date" class="form-control" id="txtFechaFinal" value="2025-01-05" v-show="conFechaFinal">
								<div class="form-check" style="min-width: fit-content;">
									<input type="checkbox" class="form-check-input" id="chkConFechaFinal" v-model="conFechaFinal">
									<label class="form-check-label" for="chkConFechaFinal">{{ conFechaFinal ? 'Sí hay fecha final' : 'No hay fecha final' }}</label>
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>

			<div>
				<h6 class="card-title mb-3"> Canasta de items</h6>
				<template v-if="canasta.length > 0">

					<div class="card" id="divCanasta" v-for="(item, index) in canasta" :key="index">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-center mb-3">
								<h6 class="mb-0 text-capitalize"> {{ getItemIcon(item.tipo) }} #{{ index + 1 }}: {{ item.tipo }}</h6>
								<button class="btn btn-sm btn-danger" @click="canasta.splice(index, 1)">
									<i class="bi bi-trash"></i> Eliminar
								</button>
							</div>

							<!-- Restaurante -->
							<RestauranteItem v-if="item.tipo === 'restaurante'" :item="item" />

							<!-- Guía -->
							<GuiaItem v-else-if="item.tipo === 'guía'" :item="item" :guias="guiasStore.guias" />

							<!-- Hospedaje -->
							<HospedajeItem v-else-if="item.tipo === 'hospedaje'" :item="item" />

							<!-- Transporte -->
							<TransporteItem v-else-if="item.tipo === 'transporte'" :item="item" :vehiculos="vehiculoStore.vehiculos" />

							<!-- Tour -->
							<TourItem v-else-if="item.tipo === 'tour'" :item="item" :tours="tours" :nacionalidad="venta.nacionalidad" />

							<!-- Vuelo -->
							<VueloItem v-else-if="item.tipo === 'vuelo'" :item="item"  />
						</div>
					</div>
				</template>

				<div class="d-flex flex-wrap gap-2 my-3">
					<p class="w-100 mb-0"><small class="text-muted">Seleccione un item:</small></p>
					<button class="btn btn-outline-secondary" @click="addCanasta('tour')"><i class="bi bi-suitcase-lg"></i> Tour o Paquete</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('transporte')"><i class="bi bi-bus-front"></i> Transporte</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('vuelo')"><i class="bi bi-airplane"></i> Vuelo</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('hospedaje')"><i class="bi bi-buildings"></i>
					 Hospedaje</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('guía')"><i class="bi bi-people"></i> Guía</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('restaurante')"><i class="bi bi-fork-knife"></i> Restaurant</button>
				</div>
			</div>

			
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">Datos del pago</h5>
					<div class="row row-cols-4">
						<div class="col">
							<label for="usuario" class="form-label">Estado de pago</label>
							<select name="" id="sltEstadoPago" class="form-select" v-model="venta.estado_pago">
								<option value="">Seleccionar...</option>
								<option value="pendiente">Pendiente</option>
								<option value="pagado">Pagado</option>
								<option value="con adelanto">Con adelanto</option>
								<option value="cancelado">Cancelado</option>
							</select>
						</div>
						<div class="col">
							<label for="usuario" class="form-label">Método de pago</label>
							<select name="" id="sltMetodoPago" class="form-select">
								<option value="">Seleccionar...</option>
								<option value="yape">Yape</option>
								<option value="plin">Plin</option>
								<option value="tarjeta">Tarjeta</option>
								<option value="efectivo">Efectivo</option>
								<option value="deposito">Depósito bancario</option>
							</select>
						</div>
						<div class="col">
							<label for="txtPrecio" class="form-label">Motivo de descuento </label>
							<input type="text" class="form-control" id="txtPrecio" v-model="venta.motivo_descuento">
						</div>
						<div class="col">
							<label for="txtPrecio" class="form-label">Descuento (S/)</label>
							<input type="number" class="form-control" id="txtPrecio" v-model.number="venta.descuento" min="0"
								step="0.01">
						</div>
						<div class="col">
							<label for="txtPrecio" class="form-label">Precio total (S/)</label>
							<input type="number" class="form-control" id="txtPrecio" v-model.number="venta.precio" min="0"
								step="0.01">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>



	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary" @click="guardarVenta()">Guardar venta</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.card,
.card .col {
	margin-bottom: 20px;
}
</style>