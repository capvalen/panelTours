<template>
	<h1>Perfil del cliente</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/clientes">Clientes</a></li>
			<li class="breadcrumb-item active" aria-current="page">Perfil</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<button class="btn btn-outline-secondary"><i class="bi bi-pencil-square"></i> Editar datos</button>
			<button class="btn btn-outline-secondary"><i class="bi bi-file-earmark-plus"></i> Agregar documentación</button>
		</div>
	</div>

	<div class="row rows-2">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Detalle del cliente</strong></p>
					<p><strong>Nombres:</strong> Gabriel</p>
					<p><strong>Apellidos:</strong> Temu Sanfer</p>
					<p><strong>DNI:</strong> 75123456</p>
					<p><strong>Fecha de Nacimiento:</strong> 15/03/1990</p>
					<p><strong>Correo:</strong> carlos.pariona@email.com</p>
					<p><strong>Celular:</strong> +51 987 654 321</p>
					<p><strong>Teléfono:</strong> +51 1 456 7890</p>
					<p><strong>Dirección:</strong> Av. Los Pinos 123, San Isidro</p>
					<p><strong>Nacionalidad:</strong> Peruana</p>
					<p><strong>Ciudad:</strong> Lima</p>

				</div>
			</div>

		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Documentación </strong></p>
					<p><strong>Carnet de Extranjería:</strong> CE1234567</p>
					<p><strong>Pasaporte:</strong> P12345678 (vigencia: 10/04/2026)</p>
					<p><strong>Visado:</strong> Turista (válido hasta 30/11/2025)</p>
					<p><strong>Vacunación:</strong> Completada (2 dosis + refuerzo)</p>
					<p><strong>Tiene seguro:</strong> Sí</p>
					<p><strong>Seguro:</strong> Mapfre Viajes Internacional</p>
					<p><strong>Autorización de viaje:</strong> No aplica</p>
					<p><strong>Archivos adjuntos:</strong></p>


					<ul class="list-group list-group-flush ">
						<li class="list-group-item">
							<div class="d-flex w-100 justify-content-between">
								<a href="#!">Pasaporte</a>
								<button class="btn btn-outline-danger border-0 rounded-circle"><i class="bi bi-x"></i></button>
							</div>
						</li>
						<li class="list-group-item">
							<div class="d-flex w-100 justify-content-between">
								<a href="#!">Visado</a>
								<button class="btn btn-outline-danger border-0 rounded-circle"><i class="bi bi-x"></i></button>
							</div>
						</li>
						<li class="list-group-item">
							<div class="d-flex w-100 justify-content-between">
								<a href="#!">Seguro de salud</a>
								<button class="btn btn-outline-danger border-0 rounded-circle"><i class="bi bi-x"></i></button>
							</div>
						</li>
					</ul>

				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col table-responsive">
			<p><strong>Compras realizadas</strong></p>
			<table class="table table-hover align-middle">
				<thead>
					<tr>
						<th>#</th>
						<th>Tipo</th>
						<th>Servicio</th>
						<th>Concepto</th>
						<th>Fecha de registro</th>
						<th>Fecha de salida</th>
						<th>Monto (S/)</th>
						<th>Estado</th>
						<th>Método de Pago</th>
						<th>Observaciones</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td><span class="badge bg-info text-white">Venta</span></td>
						<td>Paquete</td>
						<td class="tdLargo">Turismo vivencial en Cusco</td>
						<td>10/10/2025</td>
						<td class="tdLargo">25/11/2025 05:00 a.m.</td>
						<td>1,450.00</td>
						<td><span class="badge bg-secondary">Pendiente</span></td>
						<td>Transferencia</td>
						<td>Incluye Machu Picchu</td>
						<td>
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
							<button class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
						</td>
					</tr>
					<tr>
						<td>2</td>
						<td><span class="badge bg-warning text-dark">Reserva</span></td>
						<td>Movibilidad</td>
						<td class="tdLargo">Servicio ida y vuelta</td>
						<td>12/10/2025</td>
						<td class="tdLargo">12/10/2025 3:45 p.m.</td>
						<td>120.00</td>
						<td><span class="badge bg-success">Pagado</span></td>
						<td>Efectivo</td>
						<td>Vehículo SUV</td>
						<td>
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
							<button class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
						</td>
					</tr>
					<tr>
						<td>3</td>
						<td><span class="badge bg-info text-white">Venta</span></td>
						<td>Tour y vehículo</td>
						<td class="tdLargo">Tour Paracas</td>
						<td>14/10/2025</td>
						<td class="tdLargo">15/10/2025 05:00 a.m.</td>
						<td>280.50</td>
						<td><span class="badge bg-warning text-dark">Con adelanto</span></td>
						<td>Tarjeta</td>
						<td>Con almuerzo incluido</td>
						<td>
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
							<button class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>