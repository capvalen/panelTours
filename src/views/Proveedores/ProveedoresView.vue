<template>
	<h1>Panel de proveedores</h1>

	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="Ruc, Razón social o celular">
							</div>
						</div>
						<div class="col">
							<select name="" id="sltCategoria" class="form-select">
								<option value="-1">Todas las categorías</option>
								<option value="-1">Alojamiento</option>
								<option value="-1">Agencia</option>
								<option value="-1">Restaurant</option>
								<option value="-1">Transporte</option>
							</select>
						</div>
						<div class="col-2">
							<button class="btn btn-outline-secondary"><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col d-flex justify-content-center">
							<button class="btn btn-outline-primary"><i class="bi bi-star"></i> Nuevo proveedor</button>
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
						<th scope="col">RUC</th>
						<th scope="col">Razón Social</th>
						<th scope="col">Contacto</th>
						<th scope="col">Celular</th>
						<th scope="col">Categoría</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>
							<router-link :to="{ name: 'perfilProveedor', params: { id: 1 } }">
								20543210987
							</router-link>
						</td>
						<td>Distribuidora Andina S.A.C.</td>
						<td>Carlos Méndez</td>
						<td>987 654 321</td>
						<td>Alimentos</td>
					</tr>
					<tr>
						<td>2</td>
						<td>
							<router-link :to="{ name: 'perfilProveedor', params: { id: 2 } }">
								20123456789
							</router-link>
						</td>
						<td>Tecnología del Sur EIRL</td>
						<td>María Quispe</td>
						<td>912 345 678</td>
						<td>Alojamiento</td>
					</tr>
					<tr>
						<td>3</td>
						<td>
							<router-link :to="{ name: 'perfilProveedor', params: { id: 3 } }">
								20654321098
							</router-link>
						</td>
						<td>Importadora Global S.A.</td>
						<td>Jorge Rojas</td>
						<td>945 678 901</td>
						<td>Restaurant</td>
					</tr>
					<tr>
						<td>4</td>
						<td>
							<router-link :to="{ name: 'perfilProveedor', params: { id: 4 } }">
								20765432109
							</router-link>
						</td>
						<td>Papelera del Centro S.R.L.</td>
						<td>Ana Torres</td>
						<td>923 456 789</td>
						<td>Papelería</td>
					</tr>
					<tr>
						<td>5</td>
						<td>
							<router-link :to="{ name: 'perfilProveedor', params: { id: 5 } }">
								20876543210
							</router-link>
						</td>
						<td>Logística Express S.A.C.</td>
						<td>Luis Fernández</td>
						<td>934 567 890</td>
						<td>Logística</td>
					</tr>
					<tr>
						<td>6</td>
						<td>
							<router-link :to="{ name: 'perfilProveedor', params: { id: 6 } }">
								20987654321
							</router-link>
						</td>
						<td>Construcciones Modernas EIRL</td>
						<td>Rosa Díaz</td>
						<td>956 789 012</td>
						<td>Alojamiento</td>
					</tr>
					<tr>
						<td>7</td>
						<td>
							<router-link :to="{ name: 'perfilProveedor', params: { id: 7 } }">
								20112233445
							</router-link>
						</td>
						<td>Ferretería Industrial S.A.</td>
						<td>Miguel Ángel Ruiz</td>
						<td>967 890 123</td>
						<td>Hospedaje</td>
					</tr>
					<tr>
						<td>8</td>
						<td>
							<router-link :to="{ name: 'perfilProveedor', params: { id: 8 } }">
								20223344556
							</router-link>
						</td>
						<td>Servicios de Limpieza Total S.R.L.</td>
						<td>Carmen Flores</td>
						<td>978 901 234</td>
						<td>Servicios</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>