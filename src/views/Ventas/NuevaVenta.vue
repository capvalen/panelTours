<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useClienteStore } from '@/stores/clienteStore';
import { useGuiasStore } from '@/stores/guiaStore';
import { useFormat } from '@/composables/formatos';
import RestauranteItem from './components/RestauranteItem.vue';
import GuiaItem from './components/GuiaItem.vue';
import HospedajeItem from './components/HospedajeItem.vue';

const clienteStore = useClienteStore();
const guiasStore = useGuiasStore();
const ciudades = ["Abancay", "Andahuaylas", "Arequipa", "Chincha", "Cusco", "Huancavelica", "Ayacucho", "Cajamarca", "Callao", "Cerro de Pasco", "Chachapoyas", "Chiclayo", "Huancayo", "Huánuco", "Huaraz", "Ica", "Iquitos", "Jauja", "Juliaca", "Puerto Maldonado", "La Merced", "Lima", "Moquegua", "Nazca", "Охаратра", "Pichanaqui", "Piura", "Pucallpa", "Puno", "Satipo", "Tacna", "Tarapoto", "Tarma", "Tingo María", "Trujillo", "Tumbes"];
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
		fecha_hora_reserva: null,
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
	'hospedajes':{
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

	try {
		/* const response = await fetch('https://grupoeuroandino.com/app/api/mostrarTours_todos.php');
		tours.value = await response.json(); */
	} catch (error) {
		console.error('Error al cargar los tours:', error);
	}
});
</script>
<template>
	<h1>Nueva venta</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/proveedores">Ventas</a></li>
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
						</div>
					</div>
				</template>

				<div class="d-flex flex-wrap gap-2 my-3">
					<p class="w-100 mb-0"><small class="text-muted">Seleccione un item:</small></p>
					<button class="btn btn-outline-secondary" @click="addCanasta('tours')"><i class="bi bi-suitcase-lg"></i> Tour o Paquete</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('transporte')"><i class="bi bi-bus-front"></i> Transporte</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('vuelo')"><i class="bi bi-airplane"></i> Vuelo</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('hospedajes')"><i class="bi bi-buildings"></i>
					 Hospedaje</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('guía')"><i class="bi bi-people"></i> Guía</button>
					<button class="btn btn-outline-secondary" @click="addCanasta('restaurante')"><i class="bi bi-fork-knife"></i> Restaurant</button>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<div class="row">
						<div class="col">

							<div class="div">

							</div>

							<label for="tservicio" class="form-label">Servicio</label>
							<select name="tservicio" id="" class="form-select" v-model="venta.idServicio">
								<option value="1">Tour</option>
								<option value="2">Paquete</option>
								<option value="3">Transporte</option>
								<option value="4">Vuelo</option>
								<option value="5">Alojamiento</option>
							</select>
						</div>

						<div class="col">
							<label for="servicio" class="form-label">Servicio</label>
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 1">
								<option value="1">Tour selva central</option>
								<option value="2">Tour valle del perené</option>
								<option value="3">Tour laguna</option>
							</select>
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 2">
								<option value="1">2d/1n Selva central primaveral</option>
								<option value="2">Año nuevo 2026 Huancayo</option>
								<option value="3">3d/2n Selva central huancayo</option>
							</select>

							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 3">
								<option value="1">WF1-256 - Bus interprovincial</option>
								<option value="2">HMR-178 - Taxi privado</option>
							</select>
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 4">
								<option value="1">JetSmart Airlines</option>
								<option value="2">Kayak</option>
								<option value="3">Latam Airlines</option>
							</select>
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 5">
								<option value="1">Hotel Mil Maravillas</option>
								<option value="2">Hospedaje El Virrey</option>
								<option value="3">Hostal La casa de Juana</option>
							</select>
						</div>
					</div>
					<div class="row" v-if="['3', '4', '5'].includes(venta.idServicio)">
						<div class="col">
							<label for="ciudad" class="form-label">Ciudad</label>
							<select name="" class="form-select" id="sltCiudad">
								<option v-for="ciudad in ciudades" value="ciudad">{{ ciudad }}</option>
							</select>
						</div>
						<div class="col">
							<label for="ciudad" class="form-label">Requisito especial</label>
							<input type="text" class="form-control">
						</div>
					</div>
					<div class="row row-cols-2" v-if="['3', '4'].includes(venta.idServicio)">

						<div class="col">
							<label for="lugarSalida" class="form-label">Origen</label>
							<input type="text" class="form-control">
						</div>
						<div class="col">
							<label for="lugarLlegada" class="form-label">Destino</label>
							<input type="text" class="form-control">
						</div>
						<div class="col">
							<label for="fechaSalida" class="form-label">Fecha de salida</label>
							<input type="date" class="form-control">
						</div>
						<div class="col">
							<label for="fechaLlegada" class="form-label">Fecha de llegada</label>
							<input type="date" class="form-control">
						</div>
						<div class="col">
							<label for="horaSalida" class="form-label">Hora de salida</label>
							<input type="time" class="form-control">
						</div>
						<div class="col">
							<label for="horaLlegada" class="form-label">Hora de llegada</label>
							<input type="time" class="form-control">
						</div>
						<div class="col">
							<label for="precio" class="form-label">Precio (S/)</label>
							<input type="number" class="form-control" v-model.number="items[0].precio" min="0" step="0.01">
						</div>
						<div class="col">
							<label for="descripcion" class="form-label">Descripción</label>
							<input type="text" class="form-control" v-model="items[0].descripcion">
						</div>

					</div>
					<div class="row row-cols-2" v-if="['5'].includes(venta.idServicio)">
						<div class="col">
							<label for="fechaSalida" class="form-label">Fecha de llegada</label>
							<input type="date" class="form-control">
						</div>
						<div class="col">
							<label for="fechaLlegada" class="form-label">Fecha de salida</label>
							<input type="date" class="form-control">
						</div>
						<div class="col">
							<label for="horaSalida" class="form-label">Hora de salida</label>
							<input type="time" class="form-control">
						</div>
						<div class="col">
							<label for="horaLlegada" class="form-label">Hora de llegada</label>
							<input type="time" class="form-control">
						</div>
						<div class="col">
							<label for="precio" class="form-label">Precio (S/)</label>
							<input type="number" class="form-control" v-model.number="items[0].precio" min="0" step="0.01">
						</div>
						<div class="col">
							<label for="descripcion" class="form-label">Descripción</label>
							<input type="text" class="form-control" v-model="items[0].descripcion">
						</div>
					</div>
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