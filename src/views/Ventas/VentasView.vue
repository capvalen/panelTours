<script setup>
import { useVentasStore } from '@/stores/ventaStore';
import { onMounted, ref, computed } from 'vue';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2'

const ventaStore = useVentasStore();
const { fechaLatamSimple, formatMoneda, capitalize } = useFormat();

const search = ref('');
const tipoFilter = ref('todos');
const fechaFilter = ref('');

onMounted(() => {
	ventaStore.listar();
});

const filteredVentas = computed(() => {
	let resultados = [...ventaStore.ventas];

	if (search.value.trim()) {
		const t = search.value.toLowerCase();
		resultados = resultados.filter(v =>
			(v.cliente?.dni || '').toLowerCase().includes(t) ||
			(v.cliente?.ruc || '').toLowerCase().includes(t) ||
			(v.cliente?.razon_social || '').toLowerCase().includes(t) ||
			(v.cliente?.apellidos || '').toLowerCase().includes(t) ||
			(v.cliente?.nombres || '').toLowerCase().includes(t) ||
			(v.departamento?.departamento || '').toLowerCase().includes(t) ||
			(v.ciudad || '').toLowerCase().includes(t)
		);
	}

	if (tipoFilter.value !== 'todos') {
		resultados = resultados.filter(v => v.tipo === tipoFilter.value);
	}

	if (fechaFilter.value) {
		resultados = resultados.filter(v => {
			if (!v.created_at) return false;
			const fechaVenta = new Date(v.fecha).toISOString().split('T')[0];
			return fechaVenta === fechaFilter.value;
		});
	}

	return resultados;
});

const buscar = () => {
	if (search.value.trim() === '') {
		ventaStore.listar();
	} else {
		ventaStore.buscar(search.value);
	}
};
const tipoBadgeClass = (tipo) => {
	return tipo?.toLowerCase() === 'cotización' ? 'border-warning text-warning' : 'border-success text-success';
};
const estadoBadgePago = (estado) => {
	const map = {
		'completo': 'border-success text-success',
		'pagado': 'border-success text-success',
		'pendiente': 'border-warning text-warning',
		'con adelantar': 'border-warning text-warning',
		'cancelado': 'border-danger text-danger',
		'anulado': 'border-danger text-danger',
	};
	return map[estado?.toLowerCase()] || 'border-secondary text-secondary';
};


// Extrae los tipos únicos de items y los formatea como "ida" o "ida y vuelta"
const formatoServicio = (items) => {
	if (!items || !items.length) return '-';

	const tipos = items.map(i => i.tipo?.toLowerCase()).filter(Boolean);
	const unicos = [...new Set(tipos)];

	if (unicos.length === 0) return '-';

	// Contar ocurrencias de cada tipo
	const conteo = {};
	tipos.forEach(t => { conteo[t] = (conteo[t] || 0) + 1; });

	// Construir resultado
	const partes = unicos.map(tipo => {
		return conteo[tipo] >= 2 ? `${capitalize(tipo)} ida y vuelta` : capitalize(tipo);
	});

	return partes.join(', ');
};

const formatoConcepto = (items) => {
	if (!items || items.length === 0) return 'ningún concepto';
	if (items.length === 1) return items[0].descripcion || 'sin descripción';
	return 'varios items';
};

const anularVenta = async (id, concepto) => {
	const result = await Swal.fire({
		title: '¿Anular venta?',
		text: `Se anulará el servicio "${concepto}"`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, anular',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#d33',
	});
	if (result.isConfirmed) {
		await ventaStore.anular(id);
		Swal.fire('Eliminado', 'Venta anulada', 'success');
	}
};
const eliminarVenta = async (id, concepto) => {
	const result = await Swal.fire({
		title: '¿Eliminar venta?',
		text: `Se eliminará "${concepto}"`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#d33'
	});
	if (result.isConfirmed) {
		await ventaStore.eliminar(id);
		Swal.fire('Eliminado', 'Venta eliminada correctamente', 'success');
	}
};
const promoverVenta = async (index)=>{
	const result = await Swal.fire({
		title: `¿Desea promover la ${filteredVentas.value[index].tipo}?`,
		text: `Deseas promover: ${formatoServicio(filteredVentas.value[index].items)} - ${formatoConcepto(filteredVentas.value[index].items)}`,
		icon: 'success',
		showCancelButton: true,
		confirmButtonText: 'Sí, promover',
		cancelButtonText: 'Cancelar'
	});
	if (result.isConfirmed) {
		await ventaStore.eliminar(id);
		Swal.fire('Eliminado', 'Venta eliminada correctamente', 'success');
	}
}
</script>

<template>
	<h1>Panel de ventas y reservas</h1>
	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/rutas-de-servicio">Ruta de Servicio</a></li>
			<li class="breadcrumb-item active" aria-current="page">Ventas y Cotizaciones</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-body">
					<label><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="RUC, Razón social, Ciudad" v-model="search">
								<button class="btn btn-outline-secondary" @click="buscar"><i class="bi bi-search"></i> Buscar</button>
							</div>
						</div>
						<div class="col-md-3">
							<select class="form-select" v-model="tipoFilter">
								<option value="todos">Todas las categorías</option>
								<option value="venta">Ventas</option>
								<option value="cotización">Cotizaciones</option>
							</select>
						</div>
						<div class="col-md-2">
							<input type="date" class="form-control" v-model="fechaFilter">
						</div>
						<div class="col d-flex justify-content-center">
							<router-link to="/venta/nueva" class="btn btn-outline-primary"><i class="bi bi-star"></i> Nueva venta</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col table-responsive">
			<p class="mb-0">Últimos registrados</p>
			<table class="table table-hover align-middle">
				<thead>
					<tr>
						<th>#</th>
						<th>Tipo</th>
						<th>Fecha de registro</th>
						<th>Categorías</th>
						<th>N° Personas</th>
						<th>Departamento - Ciudad</th>
						<th>Concepto</th>
						<th>Cliente</th>
						<th>Monto</th>
						<th>Estado de pago</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(venta, index) in filteredVentas" :key="venta.id">
						<td>{{ index + 1 }}</td>
						<td>
							<span class="badge border" :class="tipoBadgeClass(venta.tipo)">
								{{ capitalize(venta.tipo) }}
							</span>
						</td>
						<td class="tdLargo">
							<router-link :to="{ name: 'detalleVenta', params: { id: venta.id } }">
							{{ fechaLatamSimple(venta.fecha) }}
							</router-link>
						</td>
						<td>{{ formatoServicio(venta.items) }}</td>
						<td>{{ venta.personas || 0 }}</td>
						<td>{{ venta.departamento?.departamento }} {{ venta.ciudad ? ' - '+venta.ciudad : '' }}</td>
						<td>{{ capitalize(formatoConcepto(venta.items)) }}</td>
						<td>
							<router-link v-if="venta.cliente_id" :to="{ name: 'perfilCliente', params: { id: venta.cliente_id } }">
								{{ venta.cliente?.razon_social || venta.cliente?.apellidos + ' ' + venta.cliente?.nombres || 'Sin cliente' }}
							</router-link>
							<span v-else>-</span>
						</td>
						<td>{{ formatMoneda(venta.precio) }}</td>
						<td>
							<span class="badge border text-capitalize" :class="estadoBadgePago(venta.estado_pago)">
								{{ venta.estado_pago || '-' }}
							</span>
						</td>
						<td>
							<div class="d-flex gap-2" v-if="venta.estado != 'anulado'">
								<button class="btn btn-sm btn-outline-success" @click="promoverVenta(index)" title="Promover">
									<i class="bi bi-arrow-up"></i>
								</button>
								<button class="btn btn-sm btn-outline-danger" @click="anularVenta(venta.id, `${capitalize(formatoConcepto(venta.items))} ${venta.cliente ? ' de ' + (venta.cliente.razon_social || venta.cliente.nombres) : ''}`)" title="Anular servicio">
									<i class="bi bi-ban"></i>
								</button>
								<button class="btn btn-sm btn-outline-danger" @click="eliminarVenta(venta.id, `${capitalize(formatoConcepto(venta.items))} ${venta.cliente ? ' de ' + (venta.cliente.razon_social || venta.cliente.nombres) : ''}`)">
									<i class="bi bi-folder-x"></i>
								</button>
							</div>
							<p v-else class="text-danger"><small>Anulado</small></p>
						</td>
					</tr>
					<tr v-if="ventaStore.ventas.length === 0">
						<td colspan="11" class="text-muted">No hay ventas registradas</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
