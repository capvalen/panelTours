<template>
	<h1>Panel de ventas y reservas</h1>

	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="DNI, RUC, Razón social, Nombres o celular">
							</div>
						</div>
						<div class="col">
							<select name="" id="sltCategoria" class="form-select">
								<option value="-1">Todas las categorías</option>
								<option value="-1">Tours</option>
								<option value="-1">Paquetes</option>
								<option value="-1">Reservas</option>
							</select>
						</div>
						<div class="col">
							<select name="" id="sltCategoria" class="form-select">
								<option value="-1">Cualquier fecha</option>
								<option value="-1">Fecha específica</option>
							</select>
						</div>
						<div class="col">
							<input type="date" class="form-control" value="2025-06-11">
						</div>
						<div class="col-2">
							<button class="btn btn-outline-secondary"><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col d-flex justify-content-center">
							<router-link to="/venta/nueva" class="btn btn-outline-primary"><i class="bi bi-star"></i> Nueva venta</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col table-responsive">
			<p class="mb-0">Últimos registrados</p>
			<table class="table table-hover align-middle">
				<thead>
					<tr>
						<th>#</th>
						<th>Tipo</th>
						<th>Fecha de registro</th>
						<th>Servicio</th>
						<th>Pasajes</th>
						<th>Concepto</th>
						<th>Cliente</th>
						<th>Monto</th>
						<th>Estado de pago</th>
						<th>Método de pago</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td><span class="badge bg-info text-white">Venta</span></td>
						<td class="tdLargo">14/10/2025 09:30 a.m.</td>
						<td>Tour</td>
						<td>3</td>
						<td><router-link :to="{ name: 'detalleVenta', params: { id: 100 } }">Tour selva 3n/2d</router-link></td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 1 } }">Juan Pérez</router-link></td>
						<td class="text-primary">1200.00</td>
						<td><span class="badge bg-success">Pagado</span></td>
						<td>Yape</td>
					</tr>
					<tr>
						<td>2</td>
						<td><span class="badge bg-warning text-dark">Reserva</span></td>
						<td class="tdLargo">14/10/2025 11:15 a.m.</td>
						<td>Paquete</td>
						<td>5</td>
						<td class="tdLargo"><router-link :to="{ name: 'detalleVenta', params: { id: 100 } }">Jauja inolvidable</router-link></td>
						<td class="tdLargo"><router-link :to="{ name: 'perfilCliente', params: { id: 2 } }">María López</router-link></td>
						<td class="text-primary">800.00</td>
						<td><span class="badge bg-warning text-dark">Con adelanto</span></td>
						<td>Tarjeta</td>
					</tr>
					<tr>
						<td>3</td>
						<td><span class="badge bg-info text-white">Venta</span></td>
						<td class="tdLargo">14/10/2025 02:00 p.m.</td>
						<td>Tour y transporte</td>
						<td>3</td>
						<td class="tdLargo"><router-link :to="{ name: 'detalleVenta', params: { id: 100 } }">Lima la primera ciudad del virreinato</router-link></td>
						<td class="tdLargo"><router-link :to="{ name: 'perfilCliente', params: { id: 3 } }">Carlos Ruiz</router-link></td>
						<td class="text-primary">450.00</td>
						<td><span class="badge bg-success">Pagado</span></td>
						<td>Efectivo</td>
					</tr>
					<tr>
						<td>4</td>
						<td><span class="badge bg-info text-white">Venta</span></td>
						<td class="tdLargo">14/10/2025 04:45 p.m.</td>
						<td>Transporte</td>
						<td>2</td>
						<td class="tdLargo"><router-link :to="{ name: 'detalleVenta', params: { id: 100 } }">Laguna de paca</router-link></td>
						<td class="tdLargo"><router-link :to="{ name: 'perfilCliente', params: { id: 4 } }">Ana Gómez</router-link></td>
						<td class="text-primary">60.00</td>
						<td><span class="badge bg-success">Pagado</span></td>
						<td>Depósito</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>