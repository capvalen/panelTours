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
			(v.cliente?.nombres || '').toLowerCase().includes(t) ||
			(v.cliente?.celular || '').toLowerCase().includes(t) ||
			(v.concepto || '').toLowerCase().includes(t)
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

const estadoBadgeClass = (estado) => {
	const map = {
		'pagado': 'bg-success',
		'pendiente': 'bg-warning text-dark',
		'con adelanto': 'bg-warning text-dark',
		'cancelado': 'bg-danger',
	};
	return map[estado?.toLowerCase()] || 'bg-secondary';
};

const tipoBadgeClass = (tipo) => {
	return tipo?.toLowerCase() === 'cotización' ? 'bg-warning text-dark' : 'bg-success';
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

const eliminarVenta = async (id, concepto) => {
	const result = await Swal.fire({
		title: '¿Eliminar venta?',
		text: `Se eliminará "${concepto}"`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar'
	});
	if (result.isConfirmed) {
		await ventaStore.eliminar(id);
		Swal.fire('Eliminado', 'Venta eliminada correctamente', 'success');
	}
};
</script>

<template>
	<h1>Panel de ventas y reservas</h1>

	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-body">
					<label><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="DNI, RUC, Razón social, Nombres o celular" v-model="search">
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
						<th>Servicio</th>
						<th>N° Personas</th>
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
							<span class="badge" :class="tipoBadgeClass(venta.tipo)">
								{{ capitalize(venta.tipo) }}
							</span>
						</td>
						<td class="tdLargo">
							<router-link :to="{ name: 'detalleVenta', params: { id: venta.id } }">
							{{ fechaLatamSimple(venta.fecha) }}
							</router-link>
						</td>
						<td>{{ formatoServicio(venta.items) }}</td>
						<td>{{ venta.nro_clientes || 0 }}</td>
						<td>{{ capitalize(formatoConcepto(venta.items)) }}</td>
						<td>
							<router-link v-if="venta.cliente_id" :to="{ name: 'perfilCliente', params: { id: venta.cliente_id } }">
								{{ venta.cliente?.razon_social || venta.cliente?.apellidos + ' ' + venta.cliente?.nombres || 'Sin cliente' }}
							</router-link>
							<span v-else>-</span>
						</td>
						<td>{{ formatMoneda(venta.precio) }}</td>
						<td>
							<span class="badge text-capitalize" :class="estadoBadgeClass(venta.estado_pago)">
								{{ venta.estado_pago || '-' }}
							</span>
						</td>
						<td>
							<button class="btn btn-sm btn-outline-danger" @click="eliminarVenta(venta.id, `${capitalize(formatoConcepto(venta.items))} ${venta.cliente ? ' de ' + (venta.cliente.razon_social || venta.cliente.nombres) : ''}`)">
								<i class="bi bi-trash"></i>
							</button>
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
