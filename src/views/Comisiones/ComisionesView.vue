<script setup>
import { onMounted, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useComisionesStore } from '@/stores/comisionStore';
import { useGuiasStore } from '@/stores/guiaStore';
import { useVehiculosStore } from '@/stores/vehiculoStore';
import { useProveedoresStore } from '@/stores/proveedorStore';
import { useFormat } from '@/composables/formatos';

const router = useRouter();
const comisionStore = useComisionesStore();
const guiaStore = useGuiasStore();
const vehiculoStore = useVehiculosStore();
const proveedorStore = useProveedoresStore();
const { fechaLatamSimple, formatMoneda, capitalize } = useFormat();

const obtenerFechaLocal = () => {
	const hoy = new Date();
	const año = hoy.getFullYear();
	const mes = String(hoy.getMonth() + 1).padStart(2, '0');
	const dia = String(hoy.getDate()).padStart(2, '0');
	return `${año}-${mes}-${dia}`;
};

const filtros = reactive({
	fecha: '',
	tipo: 'todos',
	comisionable_id: '',
	estadoPago: 'pendiente,adelantado',
});

const cargarPersonajes = async () => {
	if (filtros.tipo === 'guia') {
		if (guiaStore.guias.length === 0) await guiaStore.listar();
	} else if (filtros.tipo === 'vehiculo') {
		if (vehiculoStore.vehiculos.length === 0) await vehiculoStore.listar();
	} else if (filtros.tipo === 'proveedor') {
		if (proveedorStore.proveedores.length === 0) await proveedorStore.listar();
	}
};

const cargarComisiones = async () => {
	const params = {};
	if (filtros.fecha) params.fecha = filtros.fecha;
	if (filtros.tipo !== 'todos') params.tipo = filtros.tipo;
	if (filtros.comisionable_id) params.comisionable_id = filtros.comisionable_id;
	if (filtros.estadoPago !== 'todos') params.estado_pago = filtros.estadoPago;
	await comisionStore.listar(params);
};

watch(() => filtros.fecha, () => {
	cargarComisiones();
}, { immediate: true });

watch(() => filtros.tipo, () => {
	filtros.comisionable_id = '';
	if (filtros.tipo !== 'todos') {
		cargarPersonajes();
	}
	cargarComisiones();
});

watch(() => filtros.comisionable_id, () => {
	cargarComisiones();
});

watch(() => filtros.estadoPago, () => {
	cargarComisiones();
});

const filteredComisiones = computed(() => {
	return comisionStore.comisiones;
});

const tipoComisionable = (item) => {
	if (!item.comisionable_type) return '-';
	if (item.comisionable_type.includes('Guia')) return 'Guía';
	if (item.comisionable_type.includes('Proveedor')) return 'Proveedor';
	return 'Vehículo';
};

const nombreComisionable = (item) => {
	if (!item.comisionable) return '-';
	if (item.comisionable_type?.includes('Guia')) {
		return item.comisionable.nombre || '-';
	}
	if (item.comisionable_type?.includes('Proveedor')) {
		return item.comisionable.razon_social || '-';
	}
	return item.comisionable.nombre_conductor || item.comisionable.placa || '-';
};

const detalleComisionable = (item) => {
	if (!item.comisionable) return '';
	if (item.comisionable_type?.includes('Guia')) {
		return item.comisionable.especialidad || '';
	}
	if (item.comisionable_type?.includes('Proveedor')) {
		return item.comisionable.categoria || '';
	}
	return item.comisionable.tipo_vehiculo || item.comisionable.placa || '';
};

const irADetalle = (id) => {
	router.push({ name: 'detalleComision', params: { id } });
};

const estadoTexto = (estado) => {
	const map = {
		'pagado': 'Pagado',
		'adelantado': 'Con adelanto',
		'pendiente': 'Pendiente de pagar',
		'anulado': 'Anulado',
	};
	return map[estado?.toLowerCase()] || estado || '-';
};

const estadoBadge = (estado) => {
	const map = {
		'pagado': 'border-success text-success',
		'adelantado': 'border-warning text-warning',
		'pendiente': 'border-secondary text-secondary',
		'anulado': 'border-danger text-danger',
	};
	return map[estado?.toLowerCase()] || 'border-secondary text-secondary';
};

const eliminarComision = async (id) => {
	const Swal = (await import('sweetalert2')).default;
	const result = await Swal.fire({
		title: '¿Eliminar comisión?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#d33',
	});
	if (result.isConfirmed) {
		await comisionStore.eliminar(id);
		Swal.fire('Eliminado', 'Comisión eliminada correctamente', 'success');
	}
};

onMounted(() => {
	cargarComisiones();
});
</script>

<template>
	<h1>Comisiones</h1>
	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item active">Comisiones</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12">
			<div class="card mb-3">
				<div class="card-body">
					<div class="row g-2 align-items-end">
						<div class="col-md-2">
							<label class="form-label small">Fecha</label>
							<input type="date" class="form-control form-control-sm" v-model="filtros.fecha">
						</div>
						<div class="col-md-2">
							<label class="form-label small">Tipo</label>
							<select class="form-select form-select-sm" v-model="filtros.tipo">
								<option value="todos">Todos</option>
								<option value="guia">Guía</option>
								<option value="vehiculo">Vehículo</option>
								<option value="proveedor">Proveedor</option>
							</select>
						</div>
						<div class="col-md-3">
							<label class="form-label small">
								{{ filtros.tipo === 'guia' ? 'Guía' : filtros.tipo === 'vehiculo' ? 'Vehículo' : filtros.tipo === 'proveedor' ? 'Proveedor' : 'Colaborador/entidad' }}
							</label>
							<select class="form-select form-select-sm" v-model="filtros.comisionable_id" :disabled="filtros.tipo === 'todos'">
								<option value="">Todos</option>
								<template v-if="filtros.tipo === 'guia'">
									<option v-for="g in guiaStore.guias" :key="g.id" :value="g.id">{{ g.nombre }}</option>
								</template>
								<template v-else-if="filtros.tipo === 'vehiculo'">
									<option v-for="v in vehiculoStore.vehiculos" :key="v.id" :value="v.id">{{ v.nombre_conductor }} - {{ v.placa }}</option>
								</template>
								<template v-else-if="filtros.tipo === 'proveedor'">
									<option v-for="p in proveedorStore.proveedores" :key="p.id" :value="p.id">{{ p.razon_social }}</option>
								</template>
							</select>
						</div>
						<div class="col-md-2">
							<label class="form-label small">Estado pago</label>
									<select class="form-select form-select-sm" v-model="filtros.estadoPago">
										<option value="todos">Todos</option>
										<option value="pendiente,adelantado">Por pagar</option>
										<option value="pendiente">Pendiente</option>
										<option value="adelantado">Adelantado</option>
										<option value="pagado">Pagado</option>
										<option value="anulado">Anulado</option>
									</select>
						</div>
						<div class="col-md-2 d-flex align-items-end">
							<button class="btn btn-sm btn-outline-primary w-100" @click="cargarComisiones">
								<i class="bi bi-arrow-clockwise"></i> Actualizar
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row mt-3">
		<div class="col table-responsive">
			<p class="mb-3">Listado de comisiones</p>
			<div class="table-responsive">
				<table class="table table-bordered table-hover align-middle mb-0">
					<thead class="table-light">
						<tr>
							<th>#</th>
							<th>Fecha</th>
							<th>Paquete</th>
							<th>Tipo</th>
							<th>Comisionista</th>
							<th>Personas</th>
							<th>Monto</th>
							<th>Pago</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in filteredComisiones" :key="item.id" class="clickable-row" @click="irADetalle(item.id)">
							<td>{{ index + 1 }}</td>
							<td class="tdLargo">{{ fechaLatamSimple(item.fecha) }}</td>
							<td @click.stop>
								<router-link v-if="item.logistica_id" :to="{ name: 'LogisticaDetalle', params: { id: item.logistica_id } }">
									{{ item.observaciones || 'Log #' + item.logistica_id }}
								</router-link>
								<span v-else>-</span>
							</td>
							<td><span class="badge bg-info">{{ tipoComisionable(item) }}</span></td>
							<td>{{ nombreComisionable(item) }}</td>
							<td>{{ item.cant_personas }}</td>
							<td class="nowrap-cell">{{ formatMoneda(item.monto) }}</td>
							<td>
								<span class="badge border" :class="estadoBadge(item.estado_pago)">
									{{ estadoTexto(item.estado_pago) }}
								</span>
							</td>
							<td @click.stop>
								<button class="btn btn-sm btn-outline-danger" @click="eliminarComision(item.id)" title="Eliminar comisión">
									<i class="bi bi-trash"></i>
								</button>
							</td>
						</tr>
						<tr v-if="filteredComisiones.length === 0">
							<td colspan="11" class="text-muted text-center">No hay comisiones registradas</td>
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
.tdLargo {
	white-space: nowrap;
}
.clickable-row {
	cursor: pointer;
}
</style>
