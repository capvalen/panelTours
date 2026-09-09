<template>

	<div class="dashboard-header mb-4">
		<h2 class="fw-bold">Panel de administración</h2>
		<p class="mb-0" style="color:#3b82f6;">Grupo Euro Andino</p>
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
					<p class="mb-0 mt-1 text-muted"><small>Egresos de caja</small></p>
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

	<!-- pagos por cobrar -->
	<div class="mt-4">
		<div class="d-flex justify-content-between align-items-center mb-3">
			<h5 class="fw-bold mb-0" style="color:#1e293b;"><i class="bi bi-arrow-up-circle" style="color:#10b981;"></i> Pagos por cobrar</h5>
			<router-link to="/pagos" class="btn btn-sm" style="background:rgba(59,130,246,0.1);color:#3b82f6;border:1px solid rgba(59,130,246,0.2);"><i class="bi bi-arrow-right"></i> Ver todas</router-link>
		</div>
		<div v-if="pagosPorCobrar.length === 0" class="text-muted py-3 text-center">
			<small>No hay pagos por cobrar</small>
		</div>
		<div v-else class="row g-2">
			<div v-for="item in pagosPorCobrar.slice(0, 6)" :key="'cobro-' + item.id" class="col-md-4">
				<router-link :to="'/cobro/' + item.id" style="text-decoration:none;">
					<div class="card border-0 shadow-sm recordatorio-card h-100" style="border-left-color:#10b981;cursor:pointer;">
						<div class="card-body py-2 px-3">
							<div class="d-flex align-items-center gap-2">
								<i class="bi bi-arrow-up-circle" style="color:#10b981;font-size:0.9rem;"></i>
								<div class="flex-grow-1 overflow-hidden">
									<div class="pagoItem text-truncate">{{ capitalizeFirst(item.concepto) || '-' }}</div>
									<div class="small text-muted text-truncate">{{ capitalizeFirst(item.beneficiario) || '-' }}</div>
								</div>
								<span class="small ms-auto" style="color:#10b981;">{{ formatMoneda(item.saldo_pendiente) }}</span>
							</div>
						</div>
					</div>
				</router-link>
			</div>
		</div>
	</div>

	<!-- pagos por pagar -->
	<div class="mt-4">
		<div class="d-flex justify-content-between align-items-center mb-3">
			<h5 class="fw-bold mb-0" style="color:#1e293b;"><i class="bi bi-arrow-down-circle" style="color:#ef4444;"></i> Pagos por pagar</h5>
			<router-link to="/pagos" class="btn btn-sm" style="background:rgba(59,130,246,0.1);color:#3b82f6;border:1px solid rgba(59,130,246,0.2);"><i class="bi bi-arrow-right"></i> Ver todas</router-link>
		</div>
		<div v-if="pagosPorPagar.length === 0" class="text-muted py-3 text-center">
			<small>No hay pagos por pagar</small>
		</div>
		<div v-else class="row g-2">
			<div v-for="item in pagosPorPagar.slice(0, 6)" :key="'pago-' + item.id" class="col-md-4">
				<router-link :to="'/pago/' + item.id" style="text-decoration:none;">
					<div class="card border-0 shadow-sm recordatorio-card h-100" style="border-left-color:#ef4444;cursor:pointer;">
						<div class="card-body py-2 px-3">
							<div class="d-flex align-items-center gap-2">
								<i class="bi bi-arrow-down-circle" style="color:#ef4444;font-size:0.9rem;"></i>
								<div class="flex-grow-1 overflow-hidden">
									<div class="pagoItem text-truncate">{{ capitalizeFirst(item.concepto) || '-' }}</div>
									<div class="small text-muted text-truncate">{{ capitalizeFirst(item.beneficiario) || '-' }}</div>
								</div>
								<span class="small ms-auto" style="color:#ef4444;">{{ formatMoneda(item.saldo_pendiente) }}</span>
							</div>
						</div>
					</div>
				</router-link>
			</div>
		</div>
	</div>

	<!-- comisiones -->
	<div class="mt-4">
		<div class="d-flex justify-content-between align-items-center mb-3">
			<h5 class="fw-bold mb-0" style="color:#1e293b;"><i class="bi bi-percent" style="color:#3b82f6;"></i> Comisiones</h5>
			<router-link to="/pagos" class="btn btn-sm" style="background:rgba(59,130,246,0.1);color:#3b82f6;border:1px solid rgba(59,130,246,0.2);"><i class="bi bi-arrow-right"></i> Ver todas</router-link>
		</div>
		<div v-if="comisionesPendientes.length === 0" class="text-muted py-3 text-center">
			<small>No hay comisiones pendientes</small>
		</div>
		<div v-else class="row g-2">
			<div v-for="item in comisionesPendientes.slice(0, 6)" :key="'comision-' + item.id" class="col-md-4">
				<router-link :to="'/comision/' + item.id" style="text-decoration:none;">
					<div class="card border-0 shadow-sm recordatorio-card h-100" style="border-left-color:#3b82f6;cursor:pointer;">
						<div class="card-body py-2 px-3">
							<div class="d-flex align-items-center gap-2">
								<i class="bi bi-percent" style="color:#3b82f6;font-size:0.9rem;"></i>
								<div class="flex-grow-1 overflow-hidden">
									<div class="pagoItem text-truncate">{{ capitalizeFirst(item.concepto) || '-' }}</div>
									<div class="small text-muted text-truncate">{{ capitalizeFirst(item.beneficiario) || '-' }}</div>
								</div>
								<span class="small ms-auto" style="color:#3b82f6;">{{ formatMoneda(item.saldo_pendiente) }}</span>
							</div>
						</div>
					</div>
				</router-link>
			</div>
		</div>
	</div>

	<!-- ventas con checkin pendiente -->
	<div class="mt-4">
		<div class="d-flex justify-content-between align-items-center mb-3">
			<h5 class="fw-bold mb-0" style="color:#1e293b;"><i class="bi bi-people" style="color:#10b981;"></i> Check-in pendientes</h5>
			<router-link to="/ventas" class="btn btn-sm" style="background:rgba(59,130,246,0.1);color:#3b82f6;border:1px solid rgba(59,130,246,0.2);"><i class="bi bi-arrow-right"></i> Ver ventas</router-link>
		</div>
		<div v-if="ventasCheckin.length === 0" class="text-muted py-3 text-center">			
			<small>No hay ventas con check-in pendiente hoy</small>
		</div>
		<div v-else class="d-flex flex-column gap-2">
			<router-link v-for="item in ventasCheckin.slice(0, 6)" :key="item.venta.id" :to="'/ventas/' + item.venta.id" style="text-decoration:none;">
				<div class="card border-0 shadow-sm recordatorio-card" style="border-left-color:#10b981;cursor:pointer;">
					<div class="card-body py-2 px-3">
						<div class="d-flex justify-content-between align-items-center">
							<div>
								<h6 class="mb-0 text-muted small">{{ item.cliente }}</h6>
								<small class="text-muted">GEA-{{ String(item.venta.id).padStart(3, '0') }}</small>
							</div>
							<span class="small text-danger">{{ item.personas }} / {{ item.total }} faltan {{ item.faltan }}</span>
						</div>
					</div>
				</div>
			</router-link>
		</div>
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
import api from '@/services/axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useDashboardStore } from '@/stores/dashboardStore';
import { usePagosStore } from '@/stores/pagoStore';
import { useRecordatoriosStore } from '@/stores/recordatoriosStore';
import { useFormat } from '@/composables/formatos';

const dashboard = useDashboardStore();
const pagoStore = usePagosStore();
const recordatoriosStore = useRecordatoriosStore();
const { formatMoneda, formatRelative, capitalize, capitalizeFirst } = useFormat();

const recordatorios = ref([]);
const ventasCheckin = ref([]);

// ── 3 tipos de pagos ──
const pagosPorCobrar = ref([]);
const pagosPorPagar = ref([]);
const comisionesPendientes = ref([]);

const cargarPagos = async () => {
	try {
		await pagoStore.listarTodos();
		const lista = Array.isArray(pagoStore.pagos) ? pagoStore.pagos : [];
		pagosPorCobrar.value = lista.filter(p => p.es_cobro === true && p.saldo_pendiente > 0);
		pagosPorPagar.value = lista.filter(p => p.es_cobro === false && p.origen === 'pago' && p.saldo_pendiente > 0);
		comisionesPendientes.value = lista.filter(p => p.origen === 'comision' && p.saldo_pendiente > 0);
	} catch (error) {
		console.error('Error al cargar pagos:', error);
	}
};

onMounted(async () => {
	dashboard.cargarEstadisticas();
	
	// Cargar ventas de hoy con check-in pendiente
	try {
		const hoy = dayjs.utc().format('YYYY-MM-DD');
		const res = await api.get('/ventas');
		const ventasHoy = (res.data || []).filter(v =>
			v.estado !== 'anulado' && v.fecha && v.fecha.substring(0, 10) === hoy && v.progreso !== 'cotizacion'
		);
		const resultados = await Promise.all(ventasHoy.map(async (venta) => {
			try {
				const pRes = await api.get('/personas', { params: { venta_id: venta.id } });
				const personas = pRes.data || [];
				const total = Number(venta.cuantas_personas || (venta.adults + venta.kids) || 0);
				const faltan = Math.max(0, total - personas.length);
				return { venta, personas: personas.length, total, faltan, cliente: venta.cliente?.razon_social || [venta.cliente?.apellidos, venta.cliente?.nombres].filter(Boolean).join(' ') || 'Sin cliente' };
			} catch {
				return null;
			}
		}));
		ventasCheckin.value = resultados.filter(r => r && r.faltan > 0);
	} catch (error) {
		console.error('Error al cargar check-in:', error);
	}

	// Cargar los 3 tipos de pagos
	await cargarPagos();
	
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

.pagoItem {
	color: #17273f;
	font-size: 0.8rem;
	font-weight: 600;
}
</style>
