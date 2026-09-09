<script setup>
import { usePagosStore } from '@/stores/pagoStore';
import { onMounted, ref, computed } from 'vue';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2'

const pagoStore = usePagosStore();
const { fechaLatamSimple, formatMoneda, capitalize, capitalizeFirst } = useFormat();

const search = ref('');
const estadoFilter = ref('todos');
const fechaFilter = ref('');

onMounted(() => {
	pagoStore.listarTodos();
});

const aplicarFiltros = (lista) => {
	let resultados = [...lista];

	if (search.value.trim()) {
		const t = search.value.toLowerCase();
		resultados = resultados.filter(p =>
			(p.codigo_referencia || '').toLowerCase().includes(t) ||
			(p.beneficiario || '').toLowerCase().includes(t) ||
			(p.concepto || '').toLowerCase().includes(t)
		);
	}

	if (estadoFilter.value !== 'todos') {
		resultados = resultados.filter(p => p.estado_pago === estadoFilter.value);
	}

	if (fechaFilter.value) {
		resultados = resultados.filter(p => {
			if (!p.fecha) return false;
			const fechaPago = new Date(p.fecha).toISOString().split('T')[0];
			return fechaPago === fechaFilter.value;
		});
	}

	return resultados;
};

// ── 3 tablas separadas ──
const pagosPorCobrar = computed(() => {
	return aplicarFiltros(pagoStore.pagos.filter(p => p.es_cobro === true));
});

const pagosPorPagar = computed(() => {
	return aplicarFiltros(pagoStore.pagos.filter(p => p.es_cobro === false && p.origen === 'pago'));
});

const comisiones = computed(() => {
	return aplicarFiltros(pagoStore.pagos.filter(p => p.origen === 'comision'));
});

// ── Totales por tabla ──
const totalMonto = (lista) => lista.reduce((sum, p) => sum + Number(p.monto || 0), 0);
const totalPendiente = (lista) => lista.reduce((sum, p) => sum + Number(p.saldo_pendiente || 0), 0);

const totalCobrarMonto = computed(() => totalMonto(pagosPorCobrar.value));
const totalCobrarPendiente = computed(() => totalPendiente(pagosPorCobrar.value));

const totalPagarMonto = computed(() => totalMonto(pagosPorPagar.value));
const totalPagarPendiente = computed(() => totalPendiente(pagosPorPagar.value));

const totalComisionesMonto = computed(() => totalMonto(comisiones.value));
const totalComisionesPendiente = computed(() => totalPendiente(comisiones.value));

const buscar = () => {
	if (search.value.trim() === '') {
		pagoStore.listarTodos();
	} else {
		pagoStore.listarTodos({ buscar: search.value });
	}
};

const tipoBadgeClass = (esCobro) => {
	return esCobro ? 'border-success text-success' : 'border-danger text-danger';
};

const estadoBadgeClass = (estado) => {
	const map = {
		'completado': 'border-success text-success',
		'pagado': 'border-success text-success',
		'pendiente': 'border-warning text-warning',
		'adelantado': 'border-info text-info',
		'fallido': 'border-danger text-danger',
		'anulado': 'border-danger text-danger',
	};
	return map[estado?.toLowerCase()] || 'border-secondary text-secondary';
};

const metodoBadgeClass = (metodo) => {
	const map = {
		'tarjeta': 'border-primary text-primary',
		'efectivo': 'border-success text-success',
		'depósito': 'border-info text-info',
		'deposito': 'border-info text-info',
		'yape': 'border-warning text-warning',
		'plin': 'border-warning text-warning',
		'transferencia': 'border-info text-info',
	};
	return map[metodo?.toLowerCase()] || 'border-secondary text-secondary';
};

const eliminarPago = async (id, codigoRef) => {
	const result = await Swal.fire({
		title: '¿Eliminar pago?',
		text: `Se eliminará el pago con referencia "${codigoRef}"`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#d33'
	});
	if (result.isConfirmed) {
		await pagoStore.eliminar(id);
		Swal.fire('Eliminado', 'Pago eliminado correctamente', 'success');
	}
};
</script>

<template>
	<h1>Control de Pagos</h1>
	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item active" aria-current="page">Control de Pagos</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-body">
					<label><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col my-1">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="Código de referencia, Beneficiario" v-model="search">
								<button class="btn btn-outline-secondary" @click="buscar"><i class="bi bi-search"></i> Buscar</button>
							</div>
						</div>
						<div class="col-md-2 my-1">
							<select class="form-select" v-model="estadoFilter">
								<option value="todos">Todos los estados</option>
								<option value="pendiente">Pendiente</option>
								<option value="pagado">Pagado</option>
								<option value="adelantado">Adelantado</option>
								<option value="completado">Completado</option>
								<option value="fallido">Fallido</option>
								<option value="anulado">Anulado</option>
							</select>
						</div>
						<div class="col-md-2">
							<input type="date" class="form-control" v-model="fechaFilter">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ══════════ 1. PAGOS POR COBRAR ══════════ -->
	<div class="row mt-3">
		<div class="col-12">
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					<h6 class="mb-0 fw-bold"><i class="bi bi-arrow-up-circle text-success"></i> Pagos por cobrar</h6>
					<span class="badge text-bg-success">{{ pagosPorCobrar.length }}</span>
				</div>
				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-hover align-middle mb-0">
							<thead class="table-light">
								<tr>
									<th>#</th>
									<th>Fecha</th>
									<th>Concepto / Beneficiario</th>
									<th>Método de Pago</th>
									<th>Monto</th>
									<th>Pendiente</th>
									<th>Estado</th>
									<th>Referencia</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(pago, index) in pagosPorCobrar" :key="'cobro-' + pago.id" style="cursor:pointer;" @click="$router.push('/cobro/' + pago.id)">
									<td>{{ index + 1 }}</td>
									<td class="tdLargo">{{ fechaLatamSimple(pago.fecha) }}</td>
									<td>
										<div class="small fw-semibold">{{ pago.concepto || '-' }}</div>
										<div class="small text-muted">{{ pago.beneficiario || '-' }}</div>
									</td>
									<td>
										<span v-if="pago.metodo_pago" class="badge border" :class="metodoBadgeClass(pago.metodo_pago)">
											{{ capitalize(pago.metodo_pago) }}
										</span>
										<span v-else>-</span>
									</td>
									<td class="text-primary">{{ formatMoneda(pago.monto) }}</td>
									<td class="text-danger">{{ pago.saldo_pendiente != null ? formatMoneda(pago.saldo_pendiente) : '-' }}</td>
									<td>
										<span class="badge border text-capitalize" :class="estadoBadgeClass(pago.estado_pago)">
											{{ pago.estado_pago || '-' }}
										</span>
									</td>
									<td>{{ pago.codigo_referencia || '-' }}</td>
									<td @click.stop>
										<button class="btn btn-sm btn-outline-primary" title="Ver cobro" @click="$router.push('/cobro/' + pago.id)">
											<i class="bi bi-eye"></i>
										</button>
									</td>
								</tr>
								<tr v-if="pagosPorCobrar.length === 0">
									<td colspan="9" class="text-muted text-center">No hay pagos por cobrar</td>
								</tr>
								<tr v-if="pagosPorCobrar.length > 0" class="table-light fw-bold">
									<td colspan="4" class="text-end">TOTAL</td>
									<td class="text-primary">{{ formatMoneda(totalCobrarMonto) }}</td>
									<td class="text-danger">{{ formatMoneda(totalCobrarPendiente) }}</td>
									<td colspan="3"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ══════════ 2. PAGOS POR PAGAR ══════════ -->
	<div class="row mt-3">
		<div class="col-12">
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					<h6 class="mb-0 fw-bold"><i class="bi bi-arrow-down-circle text-danger"></i> Pagos por pagar</h6>
					<span class="badge text-bg-danger">{{ pagosPorPagar.length }}</span>
				</div>
				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-hover align-middle mb-0">
							<thead class="table-light">
								<tr>
									<th>#</th>
									<th>Fecha</th>
									<th>Concepto / Beneficiario</th>
									<th>Método de Pago</th>
									<th>Adelantos</th>
									<th>Pendiente</th>
									<th>Estado</th>
									<th>Referencia</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(pago, index) in pagosPorPagar" :key="'pago-' + pago.id" style="cursor:pointer;" @click="$router.push('/pago/' + pago.id)">
									<td>{{ index + 1 }}</td>
									<td class="tdLargo">{{ fechaLatamSimple(pago.fecha) }}</td>
									<td>
										<div class="small fw-semibold">{{ capitalizeFirst(pago.concepto) || '-' }}</div>
										<div class="small text-muted">{{ capitalizeFirst(pago.beneficiario) || '-' }}</div>
									</td>
									<td>
										<span v-if="pago.metodo_pago" class="badge border" :class="metodoBadgeClass(pago.metodo_pago)">
											{{ capitalize(pago.metodo_pago) }}
										</span>
										<span v-else>-</span>
									</td>
									<td class="text-primary">{{ formatMoneda(pago.monto) }}</td>
									<td class="text-danger">{{ pago.saldo_pendiente != null ? formatMoneda(pago.saldo_pendiente) : '-' }}</td>
									<td>
										<span class="badge border text-capitalize" :class="estadoBadgeClass(pago.estado_pago)">
											{{ pago.estado_pago || '-' }}
										</span>
									</td>
									<td>{{ pago.codigo_referencia || '-' }}</td>
									<td @click.stop>
										<button class="btn btn-sm btn-outline-primary" title="Ver pago" @click="$router.push('/pago/' + pago.id)">
											<i class="bi bi-eye"></i>
										</button>
									</td>
								</tr>
								<tr v-if="pagosPorPagar.length === 0">
									<td colspan="9" class="text-muted text-center">No hay pagos por pagar</td>
								</tr>
								<tr v-if="pagosPorPagar.length > 0" class="table-light fw-bold">
									<td colspan="4" class="text-end">TOTAL</td>
									<td class="text-primary">{{ formatMoneda(totalPagarMonto) }}</td>
									<td class="text-danger">{{ formatMoneda(totalPagarPendiente) }}</td>
									<td colspan="3"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ══════════ 3. COMISIONES ══════════ -->
	<div class="row mt-3">
		<div class="col-12">
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					<h6 class="mb-0 fw-bold"><i class="bi bi-percent text-primary"></i> Comisiones</h6>
					<span class="badge text-bg-primary">{{ comisiones.length }}</span>
				</div>
				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-hover align-middle mb-0">
							<thead class="table-light">
								<tr>
									<th>#</th>
									<th>Fecha</th>
									<th>Concepto / Beneficiario</th>
									<th>Método de Pago</th>
									<th>Monto</th>
									<th>Pendiente</th>
									<th>Estado</th>
									<th>Referencia</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(pago, index) in comisiones" :key="'comision-' + pago.id" style="cursor:pointer;" @click="$router.push('/comision/' + pago.id)">
									<td>{{ index + 1 }}</td>
									<td class="tdLargo">{{ fechaLatamSimple(pago.fecha) }}</td>
									<td>
										<div class="small fw-semibold">{{ pago.concepto || '-' }}</div>
										<div class="small text-muted">{{ pago.beneficiario || '-' }}</div>
									</td>
									<td>
										<span v-if="pago.metodo_pago" class="badge border" :class="metodoBadgeClass(pago.metodo_pago)">
											{{ capitalize(pago.metodo_pago) }}
										</span>
										<span v-else>-</span>
									</td>
									<td class="text-primary">{{ formatMoneda(pago.monto) }}</td>
									<td class="text-danger">{{ pago.saldo_pendiente != null ? formatMoneda(pago.saldo_pendiente) : '-' }}</td>
									<td>
										<span class="badge border text-capitalize" :class="estadoBadgeClass(pago.estado_pago)">
											{{ pago.estado_pago || '-' }}
										</span>
									</td>
									<td>{{ pago.codigo_referencia || '-' }}</td>
									<td @click.stop>
										<button class="btn btn-sm btn-outline-primary" title="Ver comisión" @click="$router.push('/comision/' + pago.id)">
											<i class="bi bi-eye"></i>
										</button>
									</td>
								</tr>
								<tr v-if="comisiones.length === 0">
									<td colspan="9" class="text-muted text-center">No hay comisiones</td>
								</tr>
								<tr v-if="comisiones.length > 0" class="table-light fw-bold">
									<td colspan="4" class="text-end">TOTAL</td>
									<td class="text-primary">{{ formatMoneda(totalComisionesMonto) }}</td>
									<td class="text-danger">{{ formatMoneda(totalComisionesPendiente) }}</td>
									<td colspan="3"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>