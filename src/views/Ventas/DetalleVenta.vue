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
				<i class="bi bi-printer"></i> Imprimir A4
			</button>
			<button class="btn btn-outline-secondary">
				<i class="bi bi-wallet2"></i> Agregar pago
			</button>
			
			<a
				class="btn btn-outline-secondary"
				href="https://wa.me/send?phone=51977692100&text=EnvíoDeEncuesta"
				target="_blank"
				><i class="bi bi-send"></i> Enviar encuesta</a
			>
		</div>
	</div>

	<div class="row ">
		<div class="col-12 col-md-auto my-2">
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
		<div class="col-12 col-md-auto my-2">
			<div class="card">
				<div class="card-body">
					<p><strong>Detalle del servicio</strong></p>
					<p><strong>Tipo:</strong> Cotización</p>
					<p><strong># Pasajeros:</strong> 3</p>
					<p><strong>Fecha de venta:</strong> 11/06/2025</p>
				</div>
			</div>
			
		</div>
		<div class="col-12 col-md-auto my-2">
			<div class="card">
				<div class="card-body">
					<p><strong>Pagos</strong></p>
					<p><strong>Precio contratado:</strong> S/ 600.00</p>
					<p><strong>Descuento:</strong> S/ 0.00</p>
					<p><strong>Total a pagar final:</strong> S/ 600.00</p>
					<p><strong>Adelanto:</strong> S/ 100.00</p>
					<p><strong>Saldo pendiente:</strong> S/ 500.00</p>
				</div>
			</div>
		</div>
		<div class="col-12 col-md-3 my-2">
			
					<h5 class="card-title fw-bold mb-3">Listado de items</h5>

					<ol class="list-group list-group-numbered">
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<!-- Columna izquierda: Info principal -->
							<div class="ms-2 me-auto">
								<div class="fw-bold">Vuelo Lima - Tingo María</div>
								<span class="badge text-dark border border-dark">Vuelo</span>
								<div class="text-muted mt-2">Clientes: 2 persona</div>
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
			<p><strong>Pagos realizados</strong></p>
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
							<td>50.00</td>
							<td><span class="badge bg-success">Pagado</span></td>
							<td>Pago completo</td>
							<td>Efectivo</td>
							<td></td>
							<td>
								<button class="btn btn-sm btn-outline-primary me-1">
									<i class="bi bi-pencil-square"></i>
								</button>
							</td>
						</tr>
						<tr>
							<td>2</td>
							<td>F01-2025102</td>
							<td>05/10/2025</td>
							<td>50.00</td>
							<td><span class="badge bg-success">Pagado</span></td>
							<td>Adelanto</td>
							<td>Depósito</td>
							<td></td>
							<td>
								<button class="btn btn-sm btn-outline-primary me-1">
									<i class="bi bi-pencil-square"></i>
								</button>
							</td>
						</tr>
						<tr>
							<td>3</td>
							<td>FV-0053</td>
							<td>10/06/2025</td>
							<td>600.00</td>
							<td><span class="badge bg-danger">Anulado</span></td>
							<td>Pago completo</td>
							<td>Transferencia</td>
							<td>Depósito falso</td>
							<td>
								<button class="btn btn-sm btn-outline-primary me-1">
									<i class="bi bi-pencil-square"></i>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
