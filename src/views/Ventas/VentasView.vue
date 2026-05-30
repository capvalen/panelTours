<script setup>
import { useVentasStore } from '@/stores/ventaStore';
import { reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2'

const router = useRouter();
const ventaStore = useVentasStore();
const { fechaLatamSimple, formatMoneda, capitalize } = useFormat();

const irADetalle = (id) => {
	router.push({ name: 'detalleVenta', params: { id } });
};

const obtenerFechaLocal = () => {
	const hoy = new Date();
	const año = hoy.getFullYear();
	const mes = String(hoy.getMonth() + 1).padStart(2, '0');
	const dia = String(hoy.getDate()).padStart(2, '0');
	return `${año}-${mes}-${dia}`;
};

const filtros = reactive({
	fecha: obtenerFechaLocal(),
	search: '',
	estadoPago: 'todos',
});

watch(() => filtros.fecha, (nuevaFecha) => {
	ventaStore.listar(nuevaFecha);
}, { immediate: true });

const filteredVentas = computed(() => {
	let resultados = [...ventaStore.ventas];

	if (filtros.search.trim()) {
		const t = filtros.search.toLowerCase();
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

	if (filtros.estadoPago !== 'todos') {
		resultados = resultados.filter(v =>
			(v.estado_pago || '').toLowerCase() === filtros.estadoPago
		);
	}

	return resultados;
});

const handleSearch = () => {
	if (filtros.search.trim() === '') {
		ventaStore.listar(filtros.fecha);
	} else {
		ventaStore.buscar(filtros.search, filtros.fecha);
	}
};
const estadoBadgePago = (estado) => {
	const map = {
		'completo': 'border-success text-success',
		'pagado': 'border-success text-success',
		'pendiente': 'border-warning text-warning',
		'con adelantar': 'border-warning text-warning',
		'adelantado': 'border-warning text-warning',
		'cancelado': 'border-danger text-danger',
		'anulado': 'border-danger text-danger',
	};
	return map[estado?.toLowerCase()] || 'border-secondary text-secondary';
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
</script>

<template>
	<h1>Panel de ventas y reservas</h1>
	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/ventas">Ventas</a></li>
			<li class="breadcrumb-item active" aria-current="page">Ventas y Cotizaciones</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12">
			<div class="card mb-3">
				<div class="card-body">
					<div class="row g-2">
						<div class="col-md-2">
							<label class="form-label small">Fecha</label>
							<input type="date" class="form-control form-control-sm" v-model="filtros.fecha">
						</div>
						<div class="col-md-2">
							<label class="form-label small">Estado pago</label>
							<select class="form-select form-select-sm" v-model="filtros.estadoPago">
								<option value="todos">Todos</option>
								<option value="pendiente">Pendiente</option>
								<option value="adelantado">Adelantado</option>
								<option value="pagado">Pagado</option>
								<option value="anulado">Anulado</option>
							</select>
						</div>
						<div class="col-md-4">
							<label class="form-label small">Buscar</label>
							<input
								type="text"
								class="form-control form-control-sm"
								v-model="filtros.search"
								placeholder="RUC, Razón social, Ciudad..."
								@keyup.enter="handleSearch"
							>
						</div>
						<div class="col-md-2 d-flex align-items-end">
							<button class="btn btn-sm btn-primary w-100" @click="handleSearch">
								<i class="bi bi-search"></i> Buscar
							</button>
						</div>
						<div class="col-md-2 d-flex align-items-end justify-content-end">
							<router-link to="/venta/nueva" class="btn btn-sm btn-outline-primary w-100">
								<i class="bi bi-star"></i> Nueva venta
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col table-responsive">
			<p class="mb-3">Listado de las ventas</p>
			<div class="table-responsive">
				<table class="table table-bordered table-hover align-middle mb-0">
				<thead class="table-light">
					<tr>
						<th>#</th>
						<th>Fecha de registro</th>
						<th>Departamento - Ciudad</th>
						<th>Cliente</th>
						<th>Adultos</th>
						<th>Niños</th>
						<th>Monto</th>
						<th>Pago</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(venta, index) in filteredVentas" :key="venta.id" class="clickable-row" @click="irADetalle(venta.id)">
						<td>{{ index + 1 }}</td>
						<td class="tdLargo">{{ fechaLatamSimple(venta.fecha) }}</td>
						<td>{{ venta.departamento?.departamento }} {{ venta.ciudad ? ' - '+venta.ciudad : '' }}</td>
						<td class="nowrap-cell" @click.stop>
							<router-link v-if="venta.cliente_id" :to="{ name: 'perfilCliente', params: { id: venta.cliente_id } }">
								{{ venta.cliente?.razon_social || venta.cliente?.apellidos + ' ' + venta.cliente?.nombres || 'Sin cliente' }}
							</router-link>
							<span v-else>-</span>
						</td>
						<td>{{ venta.adults || 0 }}</td>
						<td>{{ venta.kids || 0 }}</td>
						<td class="nowrap-cell">{{ formatMoneda(venta.precio) }}</td>
						<td>
							<span class="badge border text-capitalize" :class="estadoBadgePago(venta.estado_pago)">
								{{ venta.estado_pago || '-' }}
							</span>
						</td>
						<td @click.stop>
							<div class="d-flex gap-2" v-if="venta.estado != 'anulado'">
								<button class="btn btn-sm btn-outline-danger" @click="anularVenta(venta.id, `${capitalize(formatoConcepto(venta.items))} ${venta.cliente ? ' de ' + (venta.cliente.razon_social || venta.cliente.nombres) : ''}`)" title="Anular servicio">
									<i class="bi bi-x-lg"></i>
								</button>
								<button class="btn btn-sm btn-outline-danger d-none" @click="eliminarVenta(venta.id, `${capitalize(formatoConcepto(venta.items))} ${venta.cliente ? ' de ' + (venta.cliente.razon_social || venta.cliente.nombres) : ''}`)" title="Eliminar servicio">
									<i class="bi bi-x-lg"></i>
								</button>
							</div>
							<p v-else class="text-danger"><small>Anulado</small></p>
						</td>
					</tr>
					<tr v-if="ventaStore.ventas.length === 0">
						<td colspan="9" class="text-muted">No hay ventas registradas</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</div>
</template>

<style scoped>
.nowrap-cell {
	white-space: nowrap;
}
.clickable-row {
	cursor: pointer;
}
</style>
