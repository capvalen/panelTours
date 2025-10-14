<template>
	<h1>Detalle de la venta</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/proveedores">Ventas</a></li>
			<li class="breadcrumb-item active" aria-current="page">Detalle</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<button class="btn btn-outline-secondary"><i class="bi bi-printer"></i> Imprimir A4</button>
			<button class="btn btn-outline-secondary"><i class="bi bi-wallet2"></i> Agregar pago</button>
			<button class="btn btn-outline-secondary"><i class="bi bi-file-earmark-plus"></i> Agregar documentación</button>
		</div>
	</div>

	<div class="row rows-2">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Detalle del cliente</strong></p>
					<p><strong>RUC:</strong> 20567890123</p>
					<p><strong>Razón Social:</strong> Empresas del Norte S.A.C.</p>
					<p><strong>Categoría:</strong> Paquete y transporte</p>
					<p><strong>Dni:</strong> 150660080</p>
					<p><strong>Contacto:</strong> Sra. Lucía Mendoza</p>
					<p><strong>Celular:</strong> 963 852 741</p>
					<p><strong>Nacionalidad:</strong> Peruana</p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Detalle del servicio</strong></p>
					<p><strong>Categoría:</strong> Venta interna</p>
					<p><strong>Tipo:</strong> Paquete</p>
					<p><strong>Nombre:</strong> Selva central Tingo maría 3d/2n</p>
					<p><strong># Pasajeros:</strong> 3</p>
					<p><strong>Estado:</strong> Con adelanto</p>
					<p><strong>Precio final:</strong> S/ 600.00</p>
					<p><strong>Adelanto:</strong> S/ 100.00</p>
					<p><strong>Debe:</strong> S/ 500.00</p>
					<p><strong>Fecha de salida:</strong> 19/06/2025 8:00 am</p>
					<p><strong>Fecha de registro:</strong> 11/06/2025</p>
				</div>
			</div>

		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Documentación adicional</strong></p>


					<ul class="list-group list-group-flush ">
						<li class="list-group-item">
							<div class="d-flex w-100 justify-content-between">
								<a href="#!">Carnets de vacunación</a>
								<button class="btn btn-outline-danger border-0 rounded-circle"><i class="bi bi-x"></i></button>
							</div>
						</li>
						<li class="list-group-item">
							<div class="d-flex w-100 justify-content-between">
								<a href="#!">Certificado de Aprobación</a>
								<button class="btn btn-outline-danger border-0 rounded-circle"><i class="bi bi-x"></i></button>
							</div>
						</li>
					</ul>

				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col">
			<p><strong>Pagos realizados</strong></p>
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
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
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
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
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
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

</template>