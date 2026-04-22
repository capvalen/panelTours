<script setup>
import { usePagosStore } from '@/stores/pagoStore';
import { onMounted, ref, computed } from 'vue';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2'

const pagoStore = usePagosStore();
const { fechaLatamSimple, formatMoneda, capitalize } = useFormat();

const search = ref('');
const tipoFilter = ref('todos');
const estadoFilter = ref('todos');
const fechaFilter = ref('');

onMounted(() => {
	pagoStore.listar();
});

const filteredPagos = computed(() => {
	let resultados = [...pagoStore.pagos];

	if (search.value.trim()) {
		const t = search.value.toLowerCase();
		resultados = resultados.filter(p =>
			(p.codigo_referencia || '').toLowerCase().includes(t) ||
			(p.usuario?.name || '').toLowerCase().includes(t)
		);
	}

	if (tipoFilter.value !== 'todos') {
		let clave = tipoFilter.value === 'true' ? true : false;
		resultados = resultados.filter(p => p.es_compromiso === clave);
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
});

const buscar = () => {
	if (search.value.trim() === '') {
		pagoStore.listar();
	} else {
		pagoStore.buscar(search.value);
	}
};

const tipoBadgeClass = (tipo) => {
	return tipo === false ? 'border-success text-success' : 'border-warning text-warning';
};

const estadoBadgeClass = (estado) => {
	const map = {
		'completado': 'border-success text-success',
		'pendiente': 'border-warning text-warning',
		'fallido': 'border-danger text-danger',
	};
	return map[estado?.toLowerCase()] || 'border-secondary text-secondary';
};

const metodoBadgeClass = (metodo) => {
	const map = {
		'tarjeta': 'border-primary text-primary',
		'efectivo': 'border-success text-success',
		'depósito': 'border-info text-info',
		'deposito': 'border-info text-info',
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
						<div class="col">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="Código de referencia, Usuario" v-model="search">
								<button class="btn btn-outline-secondary" @click="buscar"><i class="bi bi-search"></i> Buscar</button>
							</div>
						</div>
						<div class="col-md-2">
							<select class="form-select" v-model="tipoFilter">
								<option value="todos">Todos los tipos</option>
								<option value="true">Venta</option>
								<option value="false">Compromiso</option>
							</select>
						</div>
						<div class="col-md-2">
							<select class="form-select" v-model="estadoFilter">
								<option value="todos">Todos los estados</option>
								<option value="pendiente">Pendiente</option>
								<option value="completado">Completado</option>
								<option value="fallido">Fallido</option>
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
	<div class="row mt-3">
		<div class="col table-responsive">
			<p class="mb-0">Últimos registros</p>
			<table class="table table-hover align-middle">
				<thead>
					<tr>
						<th>#</th>
						<th>Tipo</th>
						<th>Fecha</th>
						<th>Fecha Compromiso</th>
						<th>Método de Pago</th>
						<th>Monto pagado</th>
						<th>Saldo Pendiente</th>
						<th>Estado</th>
						<th>Código Referencia</th>
						<th>Usuario</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(pago, index) in filteredPagos" :key="pago.id">
						<td>{{ index + 1 }}</td>
						<td>
							<span class="badge border" :class="tipoBadgeClass(pago.es_compromiso)">
								{{ capitalize(pago.es_compromiso ? 'compromiso': 'venta') }}
							</span>
						</td>
						<td class="tdLargo">{{ fechaLatamSimple(pago.fecha) }}</td>
						<td class="tdLargo">{{ pago.fecha_compromiso ? fechaLatamSimple(pago.fecha_compromiso) : '-' }}</td>
						<td>
							<span class="badge border" :class="metodoBadgeClass(pago.metodo_pago)">
								{{ capitalize(pago.metodo_pago) }}
							</span>
						</td>
						<td class="text-primary">{{ formatMoneda(pago.monto_abonado) }}</td>
						<td class="text-danger">{{ formatMoneda(pago.saldo_pendiente) }}</td>
						<td>
							<span class="badge border text-capitalize" :class="estadoBadgeClass(pago.estado_pago)">
								{{ pago.estado_pago || '-' }}
							</span>
						</td>
						<td>{{ pago.codigo_referencia || '-' }}</td>
						<td>{{ pago.usuario?.name || '-' }}</td>
						<td>
							<div class="d-flex gap-2">
								<button class="btn btn-sm btn-outline-danger" @click="eliminarPago(pago.id, pago.codigo_referencia)" title="Eliminar">
									<i class="bi bi-folder-x"></i>
								</button>
							</div>
						</td>
					</tr>
					<tr v-if="pagoStore.pagos.length === 0">
						<td colspan="11" class="text-muted">No hay pagos registrados</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>