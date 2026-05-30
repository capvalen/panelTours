<template>

	<div class="dashboard-header mb-4">
		<h2 class="fw-bold">Panel de administración</h2>
		<p class="mb-0" style="color:#3b82f6;">Grupo Euroandino</p>
	</div>

	<div class="row g-3">
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon mx-auto mb-2" style="background: rgba(59,130,246,0.12);">
						<i class="bi bi-cart-check" style="color:#3b82f6;"></i>
					</div>
					<h3 class="fw-bold mb-0" style="color:#1e293b;">
						<small class="fs-6" style="color:#64748b;">S/</small>
						{{ formatMoneda(dashboard.montoVentasHoy).replace('S/ ', '') }}
					</h3>
					<p class="mb-0 mt-1 text-muted"><small>Ventas del día</small></p>
				</div>
			</div>
		</div>
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon mx-auto mb-2" style="background: rgba(16,185,129,0.12);">
						<i class="bi bi-graph-up-arrow" style="color:#10b981;"></i>
					</div>
					<h3 class="fw-bold mb-0" style="color:#1e293b;">
						<small class="fs-6" style="color:#64748b;">S/</small>
						{{ formatMoneda(dashboard.ventasDelMes).replace('S/ ', '') }}
					</h3>
					<p class="mb-0 mt-1 text-muted"><small>Ventas del mes</small></p>
				</div>
			</div>
		</div>
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon mx-auto mb-2" style="background: rgba(59,130,246,0.12);">
						<i class="bi bi-cash-stack" style="color:#3b82f6;"></i>
					</div>
					<h3 class="fw-bold mb-0" style="color:#1e293b;">
						<small class="fs-6" style="color:#64748b;">S/</small>
						{{ formatMoneda(dashboard.ingresosHoy).replace('S/ ', '') }}
					</h3>
					<p class="mb-0 mt-1 text-muted"><small>Ingresos de caja</small></p>
				</div>
			</div>
		</div>
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon mx-auto mb-2" style="background: rgba(239,68,68,0.12);">
						<i class="bi bi-wallet2" style="color:#ef4444;"></i>
					</div>
					<h3 class="fw-bold mb-0" style="color:#1e293b;">
						<small class="fs-6" style="color:#64748b;">S/</small>
						{{ formatMoneda(dashboard.gastosHoy).replace('S/ ', '') }}
					</h3>
					<p class="mb-0 mt-1 text-muted"><small>Gastos</small></p>
				</div>
			</div>
		</div>
		<div class="col-6 col-md">
			<div class="card dashboard-card border-0 shadow-sm">
				<div class="card-body text-center">
					<div class="dashboard-icon mx-auto mb-2" style="background: rgba(245,158,11,0.12);">
						<i class="bi bi-people" style="color:#f59e0b;"></i>
					</div>
					<h3 class="fw-bold mb-0" style="color:#1e293b;">{{ dashboard.pasajerosEnRuta }}</h3>
					<p class="mb-0 mt-1 text-muted"><small>Pasajeros en ruta</small></p>
				</div>
			</div>
		</div>
	</div>

	<div class="d-flex gap-2 flex-wrap justify-content-end my-3">
		<router-link to="/venta/nueva" class="btn btn-primary" style="background:#3b82f6;border-color:#3b82f6;"><i class="bi bi-file-text"></i> Nueva cotización</router-link>
		<router-link to="/venta/nueva" class="btn btn-success" style="background:#10b981;border-color:#10b981;"><i class="bi bi-calendar-check"></i> Nueva Reserva</router-link>
		<router-link to="/cliente/nuevo" class="btn btn-outline-primary" style="border-color:#3b82f6;color:#3b82f6;"><i class="bi bi-wechat"></i> Nuevo Cliente</router-link>
	</div>

	<!-- alertas -->
	<div class="mt-4">
		<div class="d-flex justify-content-between align-items-center mb-3">
			<h5 class="fw-bold mb-0" style="color:#1e293b;"><i class="bi bi-bell" style="color:#3b82f6;"></i> Alertas y Recordatorios</h5>
			<router-link to="/recordatorios" class="btn btn-sm" style="background:rgba(59,130,246,0.1);color:#3b82f6;border:1px solid rgba(59,130,246,0.2);"><i class="bi bi-bell"></i> Ver todos</router-link>
		</div>
		<div v-if="recordatorios.length === 0" class="text-muted py-3 text-center">
			<small>No hay recordatorios pendientes</small>
		</div>
		<div v-else class="d-flex flex-column gap-2">
			<div v-for="recordatorio in recordatorios.slice(0, 6)" :key="recordatorio.id">
				<div class="card border-0 shadow-sm recordatorio-card">
					<div class="card-body py-2 px-3">
						<div class="d-flex justify-content-between align-items-start">
							<h6 class="fw-bold mb-1" style="color:#1e293b;">{{ capitalize(recordatorio.titulo) }}</h6>
							<span class="badge ms-2" style="background:rgba(239,68,68,0.12);color:#ef4444;" v-if="recordatorio.prioridad === 'alta'">
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
.dashboard-header {
	padding-bottom: 12px;
	border-bottom: 3px solid #bfdbfe;
}

.dashboard-card {
	border-radius: 16px;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	background: white;
}

.dashboard-card:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 25px rgba(59,130,246,0.12) !important;
}

.dashboard-icon {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dashboard-icon i {
	font-size: 1.4rem;
}

.recordatorio-card {
	border-radius: 12px;
	background: white;
	border-left: 3px solid #3b82f6;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recordatorio-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(59,130,246,0.1) !important;
}
</style>
