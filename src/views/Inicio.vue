<template>

	<h2>Panel de administración</h2>
	<h2><small class="text-muted">Grupo Euroandio</small></h2>
	<div>Bienvenido al sistema</div>
	<p class="mt-4"><strong><i class="bi bi-bar-chart"></i> Indicadores del día</strong></p>

	<div class="row g-3">
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon bg-primary-subtle rounded-circle mx-auto mb-2">
						<i class="bi bi-cart-check text-primary"></i>
					</div>
					<h3 class="fw-bold mb-0">
						<small class="fs-6 text-muted">S/</small>
						{{ formatMoneda(dashboard.montoVentasHoy).replace('S/ ', '') }}
					</h3>
					<p class="mb-0 mt-1 text-muted"><small>Ventas del día</small></p>
				</div>
			</div>
		</div>
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon bg-success-subtle rounded-circle mx-auto mb-2">
						<i class="bi bi-graph-up-arrow text-success"></i>
					</div>
					<h3 class="fw-bold mb-0">
						<small class="fs-6 text-muted">S/</small>
						{{ formatMoneda(dashboard.ventasDelMes).replace('S/ ', '') }}
					</h3>
					<p class="mb-0 mt-1 text-muted"><small>Ventas del mes</small></p>
				</div>
			</div>
		</div>
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon bg-info-subtle rounded-circle mx-auto mb-2">
						<i class="bi bi-cash-stack text-info"></i>
					</div>
					<h3 class="fw-bold mb-0">
						<small class="fs-6 text-muted">S/</small>
						{{ formatMoneda(dashboard.ingresosHoy).replace('S/ ', '') }}
					</h3>
					<p class="mb-0 mt-1 text-muted"><small>Ingresos de caja</small></p>
				</div>
			</div>
		</div>
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon bg-danger-subtle rounded-circle mx-auto mb-2">
						<i class="bi bi-wallet2 text-danger"></i>
					</div>
					<h3 class="fw-bold mb-0">
						<small class="fs-6 text-muted">S/</small>
						{{ formatMoneda(dashboard.gastosHoy).replace('S/ ', '') }}
					</h3>
					<p class="mb-0 mt-1 text-muted"><small>Gastos</small></p>
				</div>
			</div>
		</div>
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon bg-warning-subtle rounded-circle mx-auto mb-2">
						<i class="bi bi-people text-warning"></i>
					</div>
					<h3 class="fw-bold mb-0">{{ dashboard.pasajerosEnRuta }}</h3>
					<p class="mb-0 mt-1 text-muted"><small>Pasajeros en ruta</small></p>
				</div>
			</div>
		</div>
	</div>

	<div class="d-flex gap-2 flex-wrap justify-content-end my-3">
		<router-link to="/venta/nueva" class="btn btn-primary"><i class="bi bi-file-text"></i> Nueva
			cotización</router-link>
		<router-link to="/venta/nueva" class="btn btn-success"><i class="bi bi-calendar-check"></i> Nueva
			Reserva</router-link>
		<router-link to="/cliente/nuevo" class="btn btn-outline-primary"><i class="bi bi-wechat"></i> Nuevo
			Cliente</router-link>
	</div>

	<!-- alertas -->
	<div class="mt-4">
		<div class="d-flex justify-content-between align-items-center mb-2">
			<p class="mb-0"><strong><i class="bi bi-bell"></i> Alertas y Recordatorios</strong></p>
			<router-link to="/recordatorios" class="btn btn-sm btn-outline-secondary"><i class="bi bi-bell"></i> Ver todos los recordatorios</router-link>
		</div>
		<div v-if="recordatorios.length === 0" class="text-muted py-3 text-center">
			<small>No hay recordatorios pendientes</small>
		</div>
		<div v-else class="d-flex flex-column gap-2">
			<div v-for="recordatorio in recordatorios.slice(0, 6)" :key="recordatorio.id">
				<div class="card border-0 shadow-sm recordatorio-card">
					<div class="card-body py-2 px-3">
						<div class="d-flex justify-content-between align-items-start">
							<h6 class="fw-bold mb-1">{{ capitalize(recordatorio.titulo) }}</h6>
							<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle ms-2" v-if="recordatorio.prioridad === 'alta'">
								Alta
							</span>
						</div>
						<p v-if="recordatorio.comentario" class="text-muted mb-1 small">
							{{ recordatorio.comentario.length > 80 ? recordatorio.comentario.substring(0, 80) + '...' : recordatorio.comentario }}
						</p>
						<p class="mb-0 text-muted small">
							<i class="bi bi-clock"></i> {{ formatRelative(recordatorio.fecha_hora) }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useRecordatoriosStore } from '@/stores/recordatoriosStore';
import { useFormat } from '@/composables/formatos';

const dashboard = useDashboardStore();
const recordatoriosStore = useRecordatoriosStore();
const { formatMoneda, formatRelative, capitalize } = useFormat();

const recordatorios = ref([]);

onMounted(async () => {
	dashboard.cargarEstadisticas();
	
	// Cargar recordatorios pendientes
	try {
		await recordatoriosStore.listar();
		const pendientes = (recordatoriosStore.recordatorios || [])
			.filter(r => r.activo !== false && r.estado !== 'finalizado' && r.estado !== 'anulado')
			.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
		recordatorios.value = pendientes;
	} catch (error) {
		console.error('Error al cargar recordatorios:', error);
	}
});
</script>
<style scoped>
.dashboard-card {
	border-radius: 16px;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.dashboard-icon {
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dashboard-icon i {
	font-size: 1.4rem;
}

.recordatorio-card {
	border-radius: 12px;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recordatorio-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important;
}
</style>
