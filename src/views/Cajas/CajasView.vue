<template>
	<h1>Panel de caja chica</h1>

	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<input type="date" class="form-control" value="2025-12-05">
						</div>
						<div class="col">
							<select name="" id="sltUsuarios" class="form-select">
								<option value="-1">Todos los usuarios</option>
								<option value="-1">Administrador</option>
								<option value="-1">Roberto</option>
								<option value="-1">Úrsula</option>
							</select>
						</div>
						<div class="col-2">
							<button class="btn btn-outline-secondary"><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col d-flex justify-content-center">
							<button class="btn btn-outline-primary"><i class="bi bi-star"></i> Aperturar nueva caja</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col">
			<p>Últimos registrados</p>
			<table class="table-hover table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Fecha apertura</th>
						<th scope="col">Fecha cierre</th>
						<th scope="col">Apertura S/</th>
						<th scope="col">Cierre S/</th>
						<th scope="col">Estado</th>
						<th scope="col">Usuario</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>
							<router-link :to="{ name: 'detalleCaja', params: { id: 1 } }">
								10/10/2025 08:00 am
							</router-link>
						</td>
						<td>10/10/2025 05:30 pm</td>
						<td>500.00</td>
						<td>2450.75</td>
						<td>Activo</td>
						<td>Carlos Pariona</td>
					</tr>
					<tr>
						<td>2</td>
						<td>
							<router-link :to="{ name: 'detalleCaja', params: { id: 2 } }">
								09/10/2025 08:15 am
							</router-link>
						</td>
						<td>09/10/2025 06:00 pm</td>
						<td>600.00</td>
						<td>3120.50</td>
						<td>Cerrado</td>
						<td>Lucía Mendoza</td>
					</tr>
					<tr>
						<td>3</td>
						<td>
							<router-link :to="{ name: 'detalleCaja', params: { id: 3 } }">
								08/10/2025 07:50 am
							</router-link>
						</td>
						<td>08/10/2025 04:45 pm</td>
						<td>450.00</td>
						<td>1980.25</td>
						<td>Cerrado</td>
						<td>Jorge Rojas</td>
					</tr>
					<tr>
						<td>4</td>
						<td>
							<router-link :to="{ name: 'detalleCaja', params: { id: 4 } }">
								07/10/2025 08:05 am
							</router-link>
						</td>
						<td>07/10/2025 05:55 pm</td>
						<td>550.00</td>
						<td>2760.00</td>
						<td>Activo</td>
						<td>Ana Torres</td>
					</tr>
					<tr>
						<td>5</td>
						<td>
							<router-link :to="{ name: 'detalleCaja', params: { id: 5 } }">
								06/10/2025 08:00 am
							</router-link>
						</td>
						<td>06/10/2025 05:00 pm</td>
						<td>500.00</td>
						<td>2100.80</td>
						<td>Cerrado</td>
						<td>Miguel Ruiz</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>