<template>
	<h2>Panel de administración</h2>
	<h2><small class="text-muted">Grupo Euroandio</small></h2>
	<div>Bienvenido al sistema</div>
	<p class="mt-3"><small>Estadísticas para hoy</small></p>

	<div class="row row-cols-4">
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3>5</h3>
					<p class="mb-0"><small>Ventas</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3>3</h3>
					<p class="mb-0"><small>Reservas</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3><small class="moneda">S/</small> 640.00</h3>
					<p class="mb-0"><small>Ventas</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3><small class="moneda">S/</small> 20.60</h3>
					<p class="mb-0"><small>Gastos</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3>1</h3>
					<p class="mb-0"><small>Pagos a proveedores</small></p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body text-center">
					<h3>4</h3>
					<p class="mb-0"><small>Recordatorios</small></p>
				</div>
			</div>
		</div>
	</div>

	<p class="mt-3"><small>Acciones rápidas</small></p>

	<div class="d-flex gap-2">
		<button class="btn btn-outline-primary"><i class="bi bi-wechat"></i> Nuevo cliente</button>
		<button class="btn btn-outline-primary"><i class="bi bi-truck"></i> Nuevo proveedor</button>
		<button class="btn btn-outline-primary"><i class="bi bi-bookmark"></i> Agendar Reserva</button>
		<button class="btn btn-outline-primary"><i class="bi bi-cart"></i> Nueva Venta</button>
	</div>

</template>

<script setup></script>
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