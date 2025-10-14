<template>
	<h1>Detalle de caja</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/cajas">Cajas</a></li>
			<li class="breadcrumb-item active" aria-current="page">Detalle</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<button class="btn btn-outline-secondary"><i class="bi bi-plus"></i> Registrar ingreso</button>
			<button class="btn btn-outline-secondary"><i class="bi bi-dash"></i> Registrar egreso</button>
			<router-link to="/venta/nueva" class="btn btn-outline-secondary"><i class="bi bi-star"></i> Nueva venta</router-link>
			<button class="btn btn-outline-secondary"><i class="bi bi-file-earmark-plus"></i> Agregar documentación</button>
		</div>
	</div>

	<div class="row rows-2">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong><i class="bi bi-diamond"></i> Apertura de la caja</strong></p>
					<p><strong>Fecha :</strong> 15/06/2021</p>
					<p><strong>Hora:</strong> 09:50 am</p>
					<p><strong>Monto:</strong> S/ 560.00</p>
					<p><strong>Usuario:</strong> Úrsula</p>
					<p><strong>Observaciones:</strong> -</p>
				</div>
			</div>

		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong><i class="bi bi-diamond"></i> Cierre de caja </strong></p>
					<p><strong>Fecha :</strong> 15/06/2021</p>
					<p><strong>Hora:</strong> 06:18 pm</p>
					<p><strong>Monto:</strong> S/ 600.00</p>
					<p><strong>Usuario:</strong> Úrsula</p>
					<p><strong>Observaciones:</strong> -</p>

				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong><i class="bi bi-diamond"></i> Cierre de sistema</strong></p>
					<p><strong>Monto:</strong> S/ 602.80</p>
					<p><strong>Diferencia:</strong> Falta 2.80</p>
				</div>
			</div>
		</div>
	</div>

	<div class="row mt-4">
		<div class="col">
			<p><strong>Registro de entradas y salidas</strong></p>
			<table class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>Hora</th>
						<th>Concepto</th>
						<th>Monto</th>
						<th>Tipo</th>
						<th>Moneda</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>09:00 am</td>
						<td>Inyección de dinero</td>
						<td class="text-primary">30.00</td>
						<td>Ingreso</td>
						<td>Efectivo</td>
					</tr>
					<tr>
						<td>2</td>
						<td>10:30 am</td>
						<td>Compra de bolantes</td>
						<td class="text-danger">800.00</td>
						<td>Salida</td>
						<td>Depósito</td>
					</tr>
					<tr>
						<td>3</td>
						<td>12:15 pm</td>
						<td>Pago de transporte</td>
						<td class="text-danger">240.50</td>
						<td>Ingreso</td>
						<td>Tarjeta</td>
					</tr>
					<tr>
						<td>4</td>
						<td>02:00 pm</td>
						<td>Pago de luz</td>
						<td class="text-danger">30.40</td>
						<td>Salida</td>
						<td>Efectivo</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>
	<div class="row">
		<div class="col">
			<p><strong>Registro de ventas y adelantos de servicios</strong></p>
			<table class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>Hora</th>
						<th>Servicio</th>
						<th># Pasajes</th>
						<th>Concepto</th>
						<th>Cliente</th>
						<th>Monto</th>
						<th>Estado de pago</th>
						<th>Moneda</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>09:30</td>
						<td>Tour</td>
						<td>3</td>
						<td>Tour selva 3n/2d</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 1 } }">Juan Pérez</router-link></td>
						<td class="text-primary">1200.00</td>
						<td>Pago completo</td>
						<td>Yape</td>
					</tr>
					<tr>
						<td>2</td>
						<td>11:15</td>
						<td>Paquete</td>
						<td>5</td>
						<td>Jauja inolvidable</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 2 } }">María López</router-link></td>
						<td class="text-primary">800.00</td>
						<td>Adelanto</td>
						<td>Tarjeta</td>
					</tr>
					<tr>
						<td>3</td>
						<td>14:00</td>
						<td>Tour y transporte</td>
						<td>3</td>
						<td>Lima la primera ciudad del virreinato</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 3 } }">Carlos Ruiz</router-link></td>
						<td class="text-primary">450.00</td>
						<td>Pago completo</td>
						<td>Efectivo</td>
					</tr>
					<tr>
						<td>4</td>
						<td>16:45</td>
						<td>Transporte</td>
						<td>2</td>
						<td>Laguna de paca</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 4 } }">Ana Gómez</router-link></td>
						<td class="text-primary">60.00</td>
						<td>Pago completo</td>
						<td>Depósito</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<p><strong>Resumen</strong></p>
	<div class="row px-4">
		<div class="col">
			<p><strong>Todal en entradas:</strong> S/ 30.00</p>
			<hr>
			<p><strong>Efectivo:</strong> S/ 30.00</p>
		</div>
		<div class="col">
			<p><strong>Total en salidas:</strong> S/ 1070.90</p>
			<hr>
			<p><strong>Efectivo:</strong> S/ 30.40</p>
			<p><strong>Depósito:</strong> S/ 800.00</p>
			<p><strong>Tarjeta:</strong> S/ 240.50</p>
			<p><strong>Yape:</strong> S/ 2430.00</p>
		</div>
		<div class="col">
			<p><strong>Total en ventas:</strong> S/ 2510.00</p>
			<hr>
			<p><strong>Efectivo:</strong> S/ 800.00</p>
			<p><strong>Depósito:</strong> S/ 2430.00</p>
			<p><strong>Tarjeta:</strong> S/ 2430.00</p>
			<p><strong>Yape:</strong> S/ 2430.00</p>
			<hr>
			<p><strong>Adelantos:</strong> S/ 800.00</p>
			<p><strong>Pagos completos:</strong> S/ 2430.00</p>
		</div>
		<div class="col">
			<p><strong>Cierre de sistema:</strong> S/ 1469.1</p>
			<hr>
			<p><strong>Efectivo final:</strong> S/ 800.40</p>
			<button class="btn btn-outline-success"><i class="bi bi-door-closed-fill"></i> Cerrar caja</button>
		</div>
	</div>

</template>