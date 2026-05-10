<script setup>
import ModalNuevoPago from  '@/components/ModalNuevoPago.vue'

</script>
<template>
	<h1>Detalle de la venta</h1>

	<nav aria-label="breadcrumb" >
		<ol class="breadcrumb">
			<li class="breadcrumb-item">
				<a href="/"><i class="bi bi-house"></i></a>
			</li>
			<li class="breadcrumb-item"><a href="/ventas">Ventas</a></li>
			<li class="breadcrumb-item active" aria-current="page">Detalle</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

			<div class="row mb-3">
				<div class="col d-flex flex-wrap gap-2">
					<button class="btn btn-outline-secondary">
						<i class="bi bi-pencil-square"></i> Editar venta
					</button>
					<button class="btn btn-outline-secondary">
						<i class="bi bi-printer"></i> Imprimir A4
					</button>
					
					<a
						class="btn btn-outline-secondary"
						href="https://wa.me/send?phone=51977692100&text=EnvíoDeEncuesta"
						target="_blank"
						><i class="bi bi-send"></i> Enviar encuesta</a
					>
				</div>
			</div>

	<div class="row row-cols-3">
		<div class="col-12 col-md-4 my-2">
			<div class="card">
				<div class="card-body">
					<p><strong>Detalle del cliente</strong></p>
					<p><strong>RUC:</strong> 20567890123</p>
					<p><strong>Razón Social:</strong> Empresas del Norte S.A.C.</p>
					<p><strong>Dni:</strong> 150660080</p>
					<p><strong>Contacto:</strong> Sra. Lucía Mendoza</p>
					<p><strong>Celular:</strong> 963 852 741</p>
					<p><strong>Nacionalidad:</strong> Peruana</p>
				</div>
			</div>
		</div>
		<div class="col-12 col-md my-2">
			<div class="row row-cols-2 ">
				<div class="col-12 col-md my-2">
					<div class="card">
						<div class="card-body">
							<p><strong>Detalle del servicio</strong></p>
							<p><strong>Tipo:</strong> Cotización</p>
							<p><strong># Pasajeros:</strong> 3</p>
							<p><strong>Fecha de venta:</strong> 11/06/2025</p>
						</div>
					</div>
				</div>
				<div class="col-12 col-md my-2">
					<div class="card">
						<div class="card-body">
							<p><strong>Detalle financiero</strong></p>
							<div class="row">
								<div class="col-12 col-md-6">
									<p><strong>Contratado con:</strong> S/ 300.00</p>
									<p><strong>Descuento:</strong> S/ 10.00</p>
									<p><strong>Total a pagar final:</strong> S/ 290.00</p>
								</div>
								<div class="col-12 col-md-6">
									<p><strong>Adelanto:</strong> S/ 100.00</p>
									<p><strong>Saldo pendiente:</strong> S/ 190.00</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-12 my-3">
					<p class="text-muted">Progreso:</p>
					<div class="timeline-wrapper position-relative w-100">
						<!-- Línea base gris -->
						<div class="timeline-track position-absolute w-100"
							style="top: 50%; transform: translateY(-50%); height: 4px; background: #e9ecef; border-radius: 2px; z-index: 0;">
						</div>

						<!-- Línea progreso azul con efecto de carga -->
						<div class="timeline-progress position-absolute overflow-hidden"
							style="top: 50%; transform: translateY(-50%); left: 0; width: 25%; height: 4px; background: #0d6efd; border-radius: 2px; z-index: 1;">
							<div class="shine-effect position-absolute h-100"
								style="top: 0; left: -100%; width: 50%; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%); animation: shineMove 2s ease-in-out infinite;">
							</div>
						</div>

						<!-- Items -->
						<div class="position-relative d-flex justify-content-between align-items-center" style="z-index: 2;">
							<!-- Item 1: Venta (completado) -->
							<div class="text-center position-relative text-primary" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px; "></i>
								<div class="mt-2 small fw-medium text-primary"><i class="bi bi-caret-right"></i> Venta</div>
							</div>

							<!-- Item 2: Confirmación (completado) -->
							<div class="text-center position-relative text-muted" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px; "></i>
								<div class="mt-2 small fw-medium text-muted"><i class="bi bi-caret-right"></i> Confirmación</div>
							</div>

							<!-- Item 3: Tesorería (pendiente) -->
							<div class="text-center position-relative text-muted" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px; "></i>
								<div class="mt-2 small fw-medium text-muted"><i class="bi bi-caret-right"></i> Tesorería</div>
							</div>

							<!-- Item 4: Operatividad (pendiente) -->
							<div class="text-center position-relative text-muted" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px; "></i>
								<div class="mt-2 small fw-medium text-muted"><i class="bi bi-caret-right"></i> Operatividad</div>
							</div>

						</div>
					</div>
					
				</div>
			</div>
			<!-- linea de tiempo -->
			 
		</div>
		
	</div>
	<div class="row my-3">
		<div class="col col-md-6 my-2">

			<h5 class="card-title fw-bold mb-3 ">Listado de items</h5>

				<ol class="list-group list-group-numbered puntero">
					<li class="list-group-item d-flex justify-content-between align-items-start" style="transition: box-shadow 0.3s ease;">
						<!-- Columna izquierda: Info principal -->
						<div class="ms-2 me-auto">
							<div class="fw-bold">Vuelo Lima - Tingo María</div>
							<span class="badge text-dark border border-dark">Vuelo</span>
							<div class="text-muted mt-2">Clientes: 2 personas</div>
						</div>

						<!-- Columna derecha: Métricas clave -->
						<div class="text-end">
							<div><span class="text-muted"><i  class="bi bi-calendar-event"></i></span> <span class="badge text-bg-light text-dark border rounded-pill mb-2"> 19/06/2025</span></div>
							<div class="fw-bold text-primary">S/ 300.00</div>
						</div>
					</li>

				<!-- 🔁 Duplica el <li> para agregar más items -->
				</ol>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col">
			<div class="d-flex justify-content-between">
				<p><strong>Cobros realizados a cliente</strong></p>
				<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalAddPago"><i class="bi bi-wallet2"></i> Agregar pago</button>
			</div>
			<div class="table-responsive">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>N° Factura</th>
							<th>Fecha de Pago</th>
							<th>Monto (S/)</th>
							<th>Estado</th>
							<th>Tipo de Pago</th>
							<th>Método de Pago</th>
							<th>Observaciones</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>BE-1451</td>
							<td>01/11/2025</td>
							<td>100.00</td>
							<td><span class="badge text-bg-light text-success border border-success">Pagado</span></td>
							<td>Pago completo</td>
							<td>Efectivo</td>
							<td></td>
							<td>
								<button class="btn btn-sm btn-outline-primary me-1" title="Editar pago"><i class="bi bi-pencil-square"></i></button>
								<button class="btn btn-sm btn-outline-danger me-1 btnAnular" title="Anular pago"><i class="bi bi-capslock"></i></button>
							</td>
						</tr>
						
						<tr>
							<td>2</td>
							<td>FV-0053</td>
							<td>10/06/2025</td>
							<td>300.00</td>
							<td><span class="badge text-bg-light text-danger border border-danger">Anulado</span></td>
							<td>Pago completo</td>
							<td>Transferencia</td>
							<td>Depósito falso</td>
							<td>
								<button class="btn btn-sm btn-outline-primary me-1" title="Editar pago"><i class="bi bi-pencil-square"></i></button>
								<button class="btn btn-sm btn-outline-danger me-1 btnAnular" title="Anular pago"><i class="bi bi-capslock"></i></button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<ModalNuevoPago></ModalNuevoPago>
</template>

<style >
@keyframes shineMove {
	0% {
		left: -50%;
	}
	
	100% {
		left: 150%;
	}
}
.btnAnular i{
	transform: rotate(-180deg);
	display: inline-block;
}
</style>