<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useClienteStore } from '@/stores/clienteStore';
import { useVehiculosStore } from '@/stores/vehiculoStore';
import { useGuiasStore } from '@/stores/guiaStore';
import { useFormat } from '@/composables/formatos';
import { useAuthStore } from '@/stores/auth'
import { useDepartamentosStore } from '@/stores/departamentoStore';
import { useVentasStore } from '@/stores/ventaStore';
import { usePagosStore } from '@/stores/pagoStore';
import { userestaurantestore } from '@/stores/restaurantStore';
import { useHospedajesStore } from '@/stores/hospedajeStore';
import { useAerolineasStore } from '@/stores/aerolineaStore';
import Swal from 'sweetalert2';
import RestauranteItem from './components/RestauranteItem.vue';
import GuiaItem from './components/GuiaItem.vue';
import HospedajeItem from './components/HospedajeItem.vue';
import TransporteItem from './components/VehiculoItem.vue';
import TourItem from './components/TourItem.vue';
import VueloItem from './components/VueloItem.vue';

const API_URL = import.meta.env.VITE_API_URL
const clienteStore = useClienteStore();
const vehiculoStore = useVehiculosStore();
const guiasStore = useGuiasStore();
const authStore = useAuthStore();
const departametosStore = useDepartamentosStore()
const ventaStore = useVentasStore()
const pagosStore = usePagosStore()
const restaurantStore = userestaurantestore()
const hospedajesStore = useHospedajesStore()
const aerolineaStore = useAerolineasStore()
const router = useRouter();
const route = useRoute();
const esEdicion = computed(() => Boolean(route.params.id));

const { formatHoy, formatMoneda, capitalize } = useFormat();

const venta = reactive({
	cliente_id: '',
	cliente_busqueda: '',	
	nacionalidad: 'peruana',
	progreso: 'cotización',
	estado_pago: 'pendiente',
	metodo_pago:'efectivo',
	fecha: formatHoy(),
	precio: 0,
	idServicio: 1,
	personas: 1,
	motivo_descuento: '',
	descuento: 0,
	adelanto: 0,
	departamento_id:null,
	ciudad: '',
	nivel:1,
	created_at: formatHoy(),
	usuario_id: authStore.user?.id,
});

const canasta = ref([]);
const precioDolar= ref(null) ;


const clienteSeleccionado = ref(null);
const departamentoBusqueda = ref('');
const tours = ref([]);

const nuevoItem = {
	'restaurante': {
		tipo: 'restaurante',
		tipo_servicio: 'carta',
		turno: 'comida',
		espacio: 'interior',
		get numero_personas() { return venta.personas || 1 },
		get fecha_reserva() { return venta.fecha || 1 },
		hora_reserva: null,
		pedido_especial: null,
		precio:0,
		restaurante_id:1
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
		pedido_especial: null,
		guia_id:1
	},
	'hospedaje':{
		tipo: 'hospedaje',
		tipo_habitacion: 'simple',
		get fecha_ingreso() { return venta.fecha || 1 },
		fecha_salida: null,
		hora_ingreso: null,
		hora_salida: null,
		num_habitaciones:1,
		cantidad_noches: 0,
		get cantidad_adultos() { return venta.personas || 1 },
		cantidad_ninos: 0,
		precio_por_noche:0,
		precio:0,
		requiere_cuna:false,
		habitacion_fumador:false,
		preferencias_especiales:'',
		hospedaje_id:1
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
		vehiculo_id:1
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
		observaciones:''
	},
	'vuelo': {
		tipo:'vuelo',
		origen: '',
		destino: '',
		get pasajeros() { return venta.personas || 1 },
		lleva_equipaje: 'no',
		kilos: 0,
		que_equipaje: '',
		precio_ticket:0,
		precio_soles: 0,
		precio_dolares: 0,
		precio:0,
		aerolinea: 'ninguno',
		get fecha_salida() { return venta.fecha || 1 },
		fecha_llegada: null,
		hora_salida: null,
		horario_llegada: null,
		clase_vuelo: 'económica',
		escala: false,
		observaciones: '',
		vuelo_id:1
	}

};

const eliminarItem=(index)=>{
	canasta.value.splice(index, 1)
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

const actualizarPrecioFinal = () => {
	venta.precio = Math.max(0, precioTotal.value - (venta.adelanto || 0));
};

watch([() => canasta.value, () => venta.descuento, () => venta.adelanto], () => {
	actualizarPrecioFinal();
}, { deep: true });

onMounted(async () => {	
	await clienteStore.listarClientes();
	await guiasStore.listar();
	await vehiculoStore.listar();
	await departametosStore.listar();
	await hospedajesStore.listar();
	await restaurantStore.listar();
	await aerolineaStore.listar();

	if (import.meta.env.DEV)
		venta.departamento_id = 12

	try {
		const response = await fetch( API_URL+'mostrarTours_todos.php');
		tours.value = await response.json();
	} catch (error) {
		console.error('Error al cargar los tours:', error);
	}

	if (esEdicion.value) {
		try {
			const ventaActual = await ventaStore.obtenerPorId(route.params.id);
			// Helper para extraer solo YYYY-MM-DD de fechas ISO
			const toDateStr = (v) => v ? v.substring(0, 10) : null;

			venta.cliente_id = ventaActual?.cliente_id || '';
			venta.nacionalidad = ventaActual?.nacionalidad || venta.nacionalidad;
			venta.progreso = ventaActual?.progreso || venta.progreso;
			venta.estado_pago = ventaActual?.estado_pago || venta.estado_pago;
			venta.fecha = toDateStr(ventaActual?.fecha) || venta.fecha;
			venta.precio = Number(ventaActual?.precio || 0);
			venta.personas = Number(ventaActual?.cuantas_personas || ventaActual?.personas || 1);
			venta.motivo_descuento = ventaActual?.motivo_descuento || '';
			venta.descuento = Number(ventaActual?.descuento || 0);
			venta.adelanto = Number(ventaActual?.adelanto || 0);
			venta.departamento_id = ventaActual?.departamento_id ?? venta.departamento_id;
			departamentoBusqueda.value = ventaActual?.departamento?.departamento || '';
			venta.ciudad = ventaActual?.ciudad || '';
			venta.nivel = Number(ventaActual?.nivel || venta.nivel);
			venta.usuario_id = ventaActual?.usuario_id || venta.usuario_id;
			venta.created_at = toDateStr(ventaActual?.created_at) || venta.created_at;

			const cliente = ventaActual?.cliente || null;
			if (cliente) {
				clienteSeleccionado.value = cliente;
				venta.cliente_busqueda = cliente.razon_social || `${cliente.apellidos || ''} ${cliente.nombres || ''}`.trim();
			}

			// Cargar items existentes en la canasta
			if (ventaActual?.items?.length) {
				canasta.value = ventaActual.items.map(item => {
					const detalle = item.detalle || {};
					const base = { tipo: item.tipo, precio: Number(item.precio || 0) };

					switch (item.tipo) {
						case 'tour':
							return {
								...base,
								tour_id: detalle.tour_id,
								nombre_tour: detalle.nombre_tour,
								tipo_tour: detalle.tipo_tour,
								descripcion: detalle.descripcion,
								fecha_salida: toDateStr(detalle.fecha_salida),
								fecha_retorno: toDateStr(detalle.fecha_retorno),
								cantidad_personas: Number(detalle.cantidad_personas || 0),
								cantidad_adultos: Number(detalle.cantidad_adultos || 0),
								cantidad_ninos: Number(detalle.cantidad_ninos || 0),
								peruanos_adultos: Number(detalle.peruanos_adultos || 0),
								peruanos_kids: Number(detalle.peruanos_kids || 0),
								extranjeros_adultos: Number(detalle.extranjeros_adultos || 0),
								extranjeros_kids: Number(detalle.extranjeros_kids || 0),
								precio: Number(detalle.precio || item.precio || 0),
								costo: Number(detalle.costo || 0),
								incluye: detalle.incluye,
								no_incluye: detalle.no_incluye,
								punto_partida: detalle.punto_partida || '',
								punto_llegada: detalle.punto_llegada || '',
								hora_salida: detalle.hora_salida,
								hora_retorno: detalle.hora_retorno,
								requisitos: detalle.requisitos || '',
								observaciones: detalle.observaciones || '',
							};
						case 'hospedaje':
							return {
								...base,
								hospedaje_id: detalle.hospedaje_id,
								tipo_habitacion: detalle.tipo_habitacion || 'simple',
								fecha_ingreso: toDateStr(detalle.fecha_ingreso),
								fecha_salida: toDateStr(detalle.fecha_salida),
								hora_checkin: detalle.hora_checkin,
								hora_checkout: detalle.hora_checkout,
								cantidad_noches: Number(detalle.cantidad_noches || 0),
								num_habitaciones: Number(detalle.num_habitaciones || 1),
								cantidad_adultos: Number(detalle.cantidad_adultos || 0),
								cantidad_ninos: Number(detalle.cantidad_ninos || 0),
								precio_por_noche: Number(detalle.precio_por_noche || 0),
								precio: Number(detalle.precio || item.precio || 0),
								requiere_cuna: detalle.requiere_cuna || false,
								habitacion_fumador: detalle.habitacion_fumador || false,
								preferencias_especiales: detalle.preferencias_especiales || '',
							};
						case 'transporte':
							return {
								...base,
								vehiculo_id: detalle.vehiculo_id,
								vehiculo_nombre: detalle.vehiculo_nombre || '',
								origen: detalle.origen || '',
								destino: detalle.destino || '',
								fecha_inicio: toDateStr(detalle.fecha_inicio),
								fecha_fin: toDateStr(detalle.fecha_fin),
								hora_recogida: detalle.hora_recogida,
								hora_devolucion: detalle.hora_devolucion,
								pasajeros: Number(detalle.pasajeros || 0),
								precio: Number(detalle.precio || item.precio || 0),
								observaciones: detalle.observaciones || '',
							};
						case 'restaurante':
							return {
								...base,
								restaurante_id: detalle.restaurante_id,
								tipo_servicio: detalle.tipo_servicio || 'carta',
								turno: detalle.turno || 'comida',
								espacio: detalle.espacio || 'interior',
								numero_personas: Number(detalle.numero_personas || item.nro_clientes || 0),
								fecha_reserva: toDateStr(detalle.fecha_reserva),
								hora_reserva: detalle.hora_reserva,
								pedido_especial: detalle.pedido_especial,
								precio: Number(detalle.precio || item.precio || 0),
							};
						case 'vuelo':
							return {
								...base,
								vuelo_id: detalle.vuelo_id,
								origen: detalle.origen || '',
								destino: detalle.destino || '',
								pasajeros: Number(detalle.pasajeros || 0),
								lleva_equipaje: detalle.lleva_equipaje || 'no',
								kilos: Number(detalle.kilos || 0),
								que_equipaje: detalle.que_equipaje || '',
								precio_ticket: Number(detalle.precio_ticket || 0),
								precio_soles: Number(detalle.precio_soles || 0),
								precio_dolares: Number(detalle.precio_dolares || 0),
								precio: Number(detalle.precio || item.precio || 0),
								aerolinea: detalle.aerolinea || 'ninguno',
								fecha_salida: toDateStr(detalle.fecha_salida),
								fecha_llegada: toDateStr(detalle.fecha_llegada),
								hora_salida: detalle.hora_salida,
								horario_llegada: detalle.horario_llegada,
								clase_vuelo: detalle.clase_vuelo || 'económica',
								escala: detalle.escala || false,
								observaciones: detalle.observaciones || '',
							};
						default:
							return { ...base, ...detalle };
					}
				});
			}
		} catch (error) {
			Swal.fire('Error', 'No se pudo cargar la venta para edición', 'error');
			router.push('/ventas');
		}
	}
});

const departamentoSeleccionado = computed(() => {
	return departametosStore.departamentos.find(d => d.id === venta.departamento_id);
});

const filtrarDepartamentos = () => {
	const valor = departamentoBusqueda.value.toLowerCase();
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
	if (venta.descuento <= 0) {
		venta.descuento = 0
		venta.motivo_descuento = ''
	}
	actualizarPrecioFinal();
}
const calcularAdelanto = ()=>{
	if (venta.adelanto <= 0) venta.adelanto = 0
	actualizarPrecioFinal();
}
const guardarVenta = async () => {
	if (esEdicion.value) {
		// continúa el flujo general para validar y enviar también canasta en edición
	}

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
	if (venta.nacionalidad == '') {
		Swal.fire('Error', 'Debe seleccionar una nacionalidad', 'error');
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
		}
	}

	// Si todas las validaciones pasan, guardar/actualizar la venta
	try {
		venta.cliente_id ??= 1
		venta.cliente_id = venta.cliente_id || 1
		const adelantoInicial = Number(venta.adelanto || 0);
		
		
		canasta.value.forEach(item=>{
			var descripcion = ''
			switch (item.tipo) {
				case 'restaurante': descripcion = `Reserva para ${item.tipo_servicio ?? ''} ${item.turno ?? ''} - ${item.numero_personas} persona${item.numero_personas>1?'s':''}`; break;
				case 'hospedaje': descripcion = `Alquiler de ${item.tipo_habitacion ?? ''} - ${item.cantidad_adultos} persona${item.cantidad_adultos>1?'s':''} - ${item.cantidad_noches} noche${item.cantidad_noches > 1 ? 's' : ''}`; break;
				case 'vuelo': descripcion = `Reserva de vuelo ${item.origen} - ${item.destino} - ${item.aerolinea ? item.aerolinea+'- ':''}${item.pasajeros} pasajero${item.pasajeros >1?'s':''}`; break;
				case 'transporte': descripcion = `Transporte de ${item.origen}${item.destino ? ` - ${item.destino}`: ''} - ${item.pasajeros} pasajero${item.pasajeros >1?'s':''}`; break;
				case 'tour': descripcion = `${item.nombre_tour} - ${item.cantidad_personas} persona${item.cantidad_personas >1?'s':''}`; break;
				default: descripcion = ''; break;
			}
			item.resumen ={
				tipo: item.tipo,
				nro_clientes: item.numero_personas || item.cantidad_personas || item.cantidad_adultos || item.pasajeros || 0,
				precio: item.precio,
				descripcion: descripcion.replaceAll('  ', ' ')
			}
		})
		
		const ventaPayload = { ...venta };
		// El adelanto se registrará como pago para que también impacte en seguimientos.
		if (adelantoInicial > 0) {
			ventaPayload.adelanto = 0;
			ventaPayload.estado_pago = 'pendiente';
		}

		const ventaCompleta = {venta: ventaPayload, canasta: canasta.value}
		let ventaGuardada = null
		let ventaId = null

		if (esEdicion.value) {
			ventaGuardada = await ventaStore.actualizar(route.params.id, ventaCompleta)
			ventaId = route.params.id
		} else {
			ventaGuardada = await ventaStore.guardar(ventaCompleta)
			ventaId = ventaGuardada?.id
		}

		if (!esEdicion.value && ventaId && adelantoInicial > 0) {
			await pagosStore.guardar(ventaId, {
				fecha: venta.fecha,
				monto_abonado: adelantoInicial,
				saldo_pendiente: Math.max(0, Number(venta.precio || 0) - adelantoInicial),
				metodo_pago: venta.metodo_pago,
				estado_pago: adelantoInicial >= Number(venta.precio || 0) ? 'pagado' : 'adelanto',
				codigo_referencia: 'INICIAL',
				observaciones: 'Adelanto registrado al crear la venta',
				es_compromiso: false,
				fecha_compromiso: null,
			});
		}

		await Swal.fire({
			title: 'Éxito',
			text: esEdicion.value ? 'Venta actualizada' : 'Venta guardada',
			icon: 'success',
			timer: 5000,
			timerProgressBar: true
		});

		if (ventaId) {
			router.push(`/venta/detalle/${ventaId}`)
		} else {
			router.push('/ventas')
		}
	} catch (error) {
		Swal.fire('Error', esEdicion.value ? 'No se pudo actualizar la venta' : 'No se pudo guardar la venta', 'error');
	}
};
</script>
<template>
	<h1>{{ esEdicion ? 'Editar venta' : 'Nueva venta' }}</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/ventas">Ventas</a></li>
			<li class="breadcrumb-item active" aria-current="page">{{ esEdicion ? 'Editar venta' : 'Nueva venta' }}</li>
		</ol>
	</nav>

	<div class="row">
			<div class="col-10 mx-auto">
				<div v-if="esEdicion" class="alert alert-info">
					<i class="bi bi-info-circle"></i> Modo edición: se actualizan datos generales e items de la canasta.
				</div>
			<div class="card">
				<div class="card-body">
					<h6 class="card-title"><i class="bi bi-caret-right"></i> Datos básicos de la venta</h6>
					<div class="row row-cols-4">
						<div class="col">
							<label for="usuario" class="form-label">Usuario</label>
							<input type="text" class="form-control" id="usuario" :value="authStore.user?.nombre" disabled>
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
								<option value="peruana">Peruana</option>
								<option value="extranjera">Extranjera</option>
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
						<div class="w-100"></div>
						<div class="col">
							<label for="txtDepartamento" class="form-label">Departamento destino <span class="text-danger">*</span></label>
							<input type="text" class="form-select" id="txtDepartamento" list="listaDepartamentos"
								v-model="departamentoBusqueda"
								placeholder="Buscar departamento..."
								@input="filtrarDepartamentos">
							<datalist id="listaDepartamentos">
								<option v-for="departamento in departametosStore.departamentos" :key="departamento.id" :value="departamento.departamento">
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
									<i class="bi bi-x-lg"></i> Eliminar
								</button>
							</div>

							<!-- Restaurante -->
							<RestauranteItem v-if="item.tipo === 'restaurante'" :item="item" :restaurantes="restaurantStore.restaurantes" />

							<!-- Guía: Se agrega en otro punto-->
							<!-- <GuiaItem v-else-if="item.tipo === 'guía'" :item="item" :guias="guiasStore.guias" /> -->

							<!-- Hospedaje -->
							<HospedajeItem v-else-if="item.tipo === 'hospedaje'" :item="item" :hospedajes="hospedajesStore.hospedajes" />

							<!-- Transporte -->
							<TransporteItem v-else-if="item.tipo === 'transporte'" :item="item" :vehiculos="vehiculoStore.vehiculos" />

							<!-- Tour -->
							<TourItem v-else-if="item.tipo === 'tour'" :item="item" :tours="tours" :nacionalidad="venta.nacionalidad" />

							<!-- Vuelo -->
							<VueloItem v-else-if="item.tipo === 'vuelo'" :item="item" :aerolineas="aerolineaStore.aerolineas" :departamentos="departametosStore.departamentos" />
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

			
			<div class="card" v-if="!esEdicion">
				<div class="card-body">
					<h6 class="card-title mb-3"><i class="bi bi-caret-right"></i> Datos del pago</h6>

					<div class="row row-cols-4">
						<div class="col">
							<label for="usuario" class="form-label">Estado de pago</label>
							<select name="" id="sltEstadoPago" class="form-select" v-model="venta.estado_pago">
								<option value="">Seleccionar...</option>
								<option value="pendiente">Pendiente</option>
								<option value="pagado">Pagado</option>
								<option value="adelanto">Con adelanto</option>
								<option value="cancelado">Cancelado</option>
							</select>
						</div>
						<div class="col">
							<label for="usuario" class="form-label">Método de pago</label>
							<select name="" id="sltMetodoPago" class="form-select" v-model="venta.metodo_pago">
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
							<label for="txtPrecio" class="form-label">Adelanto (S/)</label>
							<input type="number" class="form-control" id="txtPrecio" v-model.number="venta.adelanto" min="0"
								step="1" @input="calcularAdelanto()">
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
				<button type="submit" class="btn btn-primary" @click="guardarVenta()">
					{{ esEdicion ? 'Actualizar venta' : 'Guardar venta' }}
				</button>
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
