<template>

	<h2>Panel de administración</h2>
	<h2><small class="text-muted">Grupo Euroandio</small></h2>
	<div>Bienvenido al sistema</div>
	<p class="mt-3"><small>Estadísticas para hoy</small></p>

	<div class="row row-cols-4">
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3>{{ dashboard.ventasHoy }}</h3>
					<p class="mb-0"><small>Ventas</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3>{{ dashboard.reservasHoy }}</h3>
					<p class="mb-0"><small>Reservas</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3><small class="moneda">S/</small> {{ formatMoneda(dashboard.montoVentasHoy).replace('S/ ', '') }}</h3>
					<p class="mb-0"><small>Ventas</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3><small class="moneda">S/</small> {{ formatMoneda(dashboard.gastosHoy).replace('S/ ', '') }}</h3>
					<p class="mb-0"><small>Gastos</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3>{{ dashboard.pagosProveedoresHoy }}</h3>
					<p class="mb-0"><small>Pagos a proveedores</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3>{{ dashboard.recordatoriosHoy }}</h3>
					<p class="mb-0"><small>Recordatorios</small></p>
				</div>
			</div>
		</div>
	</div>

	<p class="mt-3"><small>Acciones rápidas</small></p>

	<div class="d-flex gap-2">
		<router-link to="/cliente/nuevo" class="btn btn-outline-primary"><i class="bi bi-wechat"></i> Nuevo cliente</router-link>
		<router-link to="/proveedor/nuevo" class="btn btn-outline-primary"><i class="bi bi-truck"></i> Nuevo proveedor</router-link>
		<router-link to="/venta/nueva" class="btn btn-outline-primary"><i class="bi bi-cart"></i> Nueva Venta</router-link>
	</div>

</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useFormat } from '@/composables/formatos';

const dashboard = useDashboardStore();
const { formatMoneda } = useFormat();

onMounted(() => {
	dashboard.cargarEstadisticas();
});
</script>
<style scoped>
.card{
	margin-bottom: 10px;
}
.card p{
	font-weight: bold;
}
.moneda{
	font-size: 19px;
}
</style>
