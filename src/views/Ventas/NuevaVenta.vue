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
import { useAuthStore } from '@/stores/auth'
import { useDepartamentosStore } from '@/stores/departamentoStore';
import { useVentasStore } from '@/stores/ventaStore';

const clienteStore = useClienteStore();
const vehiculoStore = useVehiculosStore();
const guiasStore = useGuiasStore();
const authStore = useAuthStore();
const departametosStore = useDepartamentosStore()
const ventaStore = useVentasStore()

const { formatHoy, formatMoneda, capitalize } = useFormat();

const venta = reactive({
	cliente_id: '',
	cliente_busqueda: '',
	tipo: 'venta',
	nacionalidad: 'peruano',
	estado_pago: 'pendiente',
	fecha: formatHoy(),
	precio: 0,
	idServicio: 1,
	personas: 1,
	motivo_descuento: '',
	descuento: 0,
	departamento_id:null,
	ciudad: '',
	nivel:1,
	created_at: formatHoy(),
	usuario_id: authStore.user?.id,
});

const canasta = ref([]);
const venta_items = ref([])

const clienteSeleccionado = ref(null);
const tours = ref([]);

const nuevoItem = {
	'restaurante': {
		tipo: 'restaurante',
		tipo_servicio: 'carta',
		turno: null,
		espacio: null,
		get numero_personas() { return venta.personas || 1 },
		get fecha_reserva() { return venta.fecha || 1 },
		hora_reserva: null,
		pedido_especial: null,
		precio:0
	},
	'guía': {
		tipo: 'guía',
		guia_id: null,
		guia_nombre: '',
		ruta: '',
		get fecha() { return venta.fecha || 1 },
		hora: null,
		lugar_encuentro: null,
		precio: 0,
		duracion_horas:0,
		tipo_servicio: 'privado',
		get cantidad_personas() { return venta.personas || 1 },
		pedido_especial: null
	},
	'hospedaje':{
		tipo: 'hospedaje',
		tipo_habitacion: 'simple',		
		get fecha_ingreso() { return venta.fecha || 1 },
		fecha_salida: null,
		hora_ingreso: null,
		hora_salida: null,
		cantidad_noches: 0,
		get cantidad_adultos() { return venta.personas || 1 },
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
		get fecha_inicio() { return venta.fecha || 1 },
		fecha_fin: null,
		hora_recogida: null,
		hora_devolucion: null,
		get pasajeros() { return venta.personas || 1 },
		precio: 0,
		observaciones: '',
	},
	'tour':{
		tipo:'tour',
		tour_id: null,
		nombre_tour: null,
		tipo_tour:null,
		descripcion:null,
		get fecha_salida() { return venta.fecha || 1 },
		fecha_retorno:null,
		get cantidad_personas() { return venta.personas || 1 },
		get cantidad_adultos() { return venta.personas || 1 },
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
		get pasajeros() { return venta.personas || 1 },
		lleva_equipaje: 0,
		kilos: null,
		que_equipaje: '',
		precio_soles: 0,
		precio_dolares: 0,
		precio:0,
		aerolinea: null,
		get fecha_salida() { return venta.fecha || 1 },
		fecha_llegada: null,
		hora_salida: null,
		horario_llegada: null,
		clase_vuelo: 'económica',
		escala: false,
		observaciones: '',
	}

};

const eliminarItem=(index)=>{
	canasta.splice(index, 1)
	venta_items.splice(index, 1)
}


const addCanasta = (tipo) => {
	canasta.value.push({...nuevoItem[tipo]});
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
	await departametosStore.listar();

	try {
		const response = await fetch('https://grupoeuroandino.com/app/api/mostrarTours_todos.php');
		tours.value = await response.json();
	} catch (error) {
		console.error('Error al cargar los tours:', error);
	}
});

const departamentoSeleccionado = computed(() => {
	return departametosStore.departamentos.find(d => d.id === venta.departamento_id);
});

const filtrarDepartamentos = (event) => {
	const valor = event.target.value.toLowerCase();
	if (valor == '') {
		venta.departamento_id = null;
		return
	}
	const encontrado = departametosStore.departamentos.find(d =>
		d.departamento.toLowerCase().includes(valor) || String(d.id) === valor
	);
	if (encontrado) {
		venta.departamento_id = encontrado.id;
	}
};

const calcularDescuento = ()=>{
	if(venta.descuento >0 )
		venta.precio -= venta.descuento
	else{
		venta.descuento = 0
		venta.motivo_descuento = ''
	}
}
const guardarVenta = async () => {
	// Validar canasta vacía
	if (canasta.value.length === 0) {
		Swal.fire('Error', 'Debe rellenar items a la canasta', 'error');
		return;
	}
	if (venta.precio <= 0) {
		Swal.fire('Error', 'Revise los precios, la venta no puede ser ni 0 ni negativa', 'error');
		return;
	}
	if (venta.descuento > 0 && venta.motivo_descuento == '') {
		Swal.fire('Error', 'Debe ingresar un motivo de descuento', 'error');
		return;
	}

	// Validar cada item de la canasta
	for (const item of canasta.value) {
		// Validación común: precio <= 0
		/* if (!item.precio || item.precio <= 0) {
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
				if (!item.origen ) {
					Swal.fire('Error', 'Debe seleccionar una departamento, ciudad de origen', 'error');
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
		} */
	}

	// Si todas las validaciones pasan, guardar la venta
	try {
		venta.cliente_id ??= 1
		venta.cliente_id = venta.cliente_id || 1
		venta_items.value = []
		console.info('canasta:', canasta.value )
		canasta.value.forEach(item=>{
			var descripcion = ''
			switch (item.tipo) {
				case 'restaurante': descripcion = `Restaurant ${item.tipo_servicio ?? ''} ${item.turno ?? ''} - ${item.numero_personas} persona${item.numero_personas>1?'s':''}`; break;
				case 'hospedaje': descripcion = `Hospedaje de habitación ${item.tipo_habitacion ?? ''} - ${item.cantidad_adultos} persona${item.cantidad_adultos>1?'s':''} - ${item.cantidad_noches} noche${item.cantidad_noches > 1 ? 's' : ''}`; break;
				case 'vuelo': descripcion = `Vuelo ${item.origen} - ${item.destino} - ${item.aerolinea ? item.aerolinea+'- ':''}${item.pasajeros} pasajero${item.pasajeros >1?'s':''}`; break;
				case 'transporte': descripcion = `Transporte de ${item.origen}${item.destino ? ` - ${item.destino}`: ''} - ${item.pasajeros} pasajero${item.pasajeros >1?'s':''}`; break;
				case 'tour': descripcion = `${capitalize(item.tipo_tour)} ${item.nombre_tour} - ${item.cantidad_personas} persona${item.cantidad_personas >1?'s':''}`; break;
				default: descripcion = ''; break;
			}
			venta_items.value.push({
				tipo: item.tipo,
				nro_clientes: item.numero_personas || item.cantidad_personas || item.cantidad_adultos || item.pasajeros || 0,
				precio: item.precio,
				descripcion: descripcion.replaceAll('  ', ' ')
			})
		})		
		
		const ventaCompleta = {venta, venta_items: venta_items.value, canasta: canasta.value}
	
		ventaStore.guardar(ventaCompleta)

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
			<li class="breadcrumb-item"><a href="/rutas-de-servicio">Ruta de Servicio</a></li>
			<li class="breadcrumb-item"><a href="/ventas">Ventas y cotizaciones</a></li>
			<li class="breadcrumb-item active" aria-current="page">Nueva venta</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-10 mx-auto">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title"><i class="bi bi-caret-right"></i> Datos básicos de la venta</h6>
					<div class="row row-cols-4">
						<div class="col">
							<label for="usuario" class="form-label">Usuario</label>
							<input type="text" class="form-control" id="usuario" :value="authStore.user?.nombre" disabled>
						</div>
						<div class="col">
							<label for="usuario" class="form-label">Tipo</label>
							<select name="" id="sltTipo" class="form-select" v-model="venta.tipo">
								<option value="venta">Venta</option>
								<option value="cotización">Cotización</option>
							</select>
						</div>

						<div class="w-100"></div>
						<div class="col">
							<label for="txtCliente" class="form-label">Buscar Cliente <span class="text-danger">*</span></label>
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
					<h6 class="card-title"><i class="bi bi-caret-right"></i> Datos generales</h6>
					<div class="row row-cols-4">
						<div class="col">
							<label for="nacionalidad" class="form-label">Nacionalidad</label>
							<select name="nacionalidad" id="" class="form-select" v-model="venta.nacionalidad">
								<option value="peruano">Peruana</option>
								<option value="extranjero">Extranjera</option>
							</select>
						</div>
						<div class="col">
							<label for="txtPasajeros" class="form-label">N° de pasajeros <span class="text-danger">*</span></label>
							<input type="number" class="form-control" id="txtPasajeros" v-model.number="venta.personas" min="0">
						</div>
						<div class="col">
							<label for="txtFechaInicial" class="form-label">Fecha inicial <span class="text-danger">*</span></label>
							<input type="date" class="form-control" id="txtFechaInicial" v-model="venta.fecha">
						</div>
						<div class="col">
							<label for="txtDepartamento" class="form-label">Departamento destino <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="txtDepartamento" list="listaDepartamentos"
								:placeholder="departamentoSeleccionado?.nombre || 'Buscar departamento...'"
								@input="filtrarDepartamentos">
							<datalist id="listaDepartamentos">
								<option v-for="departamento in departametosStore.departamentos" :key="departamento.id" :value="departamento.nombre">
									{{departamento.departamento}}
								</option>
							</datalist>
						</div>
						<div class="col">
							<label for="txtCiudad" class="form-label">Ciudad</label>
							<input type="text" class="form-control" id="txtCiudad" v-model="venta.ciudad">
						</div>
					</div>
				</div>
			</div>

			<div>
				<h6 class="card-title mb-3"><i class="bi bi-caret-right"></i> Canasta de items</h6>
				<template v-if="canasta.length > 0">

					<div class="card" id="divCanasta" v-for="(item, index) in canasta" :key="index">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-center mb-3">
								<h6 class="mb-0 text-capitalize"> {{ getItemIcon(item.tipo) }} #{{ index + 1 }}: {{ item.tipo }}</h6>
								<button class="btn btn-sm btn-danger" @click="eliminarItem(index)">
									<i class="bi bi-folder-x"></i> Eliminar
								</button>
							</div>

							<!-- Restaurante -->
							<RestauranteItem v-if="item.tipo === 'restaurante'" :item="item" />

							<!-- Guía: Se agrega en otro punto-->
							<!-- <GuiaItem v-else-if="item.tipo === 'guía'" :item="item" :guias="guiasStore.guias" /> -->

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
					<!-- <button class="btn btn-outline-secondary" @click="addCanasta('guía')"><i class="bi bi-people"></i> Guía</button> -->
					<button class="btn btn-outline-secondary" @click="addCanasta('restaurante')"><i class="bi bi-fork-knife"></i> Restaurant</button>
				</div>
			</div>

			
			<div class="card">
				<div class="card-body">
					<h6 class="card-title mb-3"><i class="bi bi-caret-right"></i> Datos del pago</h6>

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
						<div class="w-100"></div>
						<div class="col">
							<label for="txtPrecio" class="form-label">Descuento (S/)</label>
							<input type="number" class="form-control" id="txtPrecio" v-model.number="venta.descuento" min="0"
								step="1" @input="calcularDescuento()">
						</div>
						<div class="col" v-if="venta.descuento >0">
							<label for="txtPrecio" class="form-label">Motivo de descuento <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="txtPrecio" v-model="venta.motivo_descuento">
						</div>
						
						<div class="col">
							<label for="txtPrecio" class="form-label">Precio final a pagar (S/)</label>
							<input type="text" class="form-control" id="txtPrecio" :value="formatMoneda(venta.precio)" min="0"
								step="1" disabled>
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