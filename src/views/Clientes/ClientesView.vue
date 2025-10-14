<template>
	<h1>Panel de clientes</h1>

	<div class="row">
		<div class="col-md-9">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="Apellidos, nombres, dni o celular">
								<button class="btn btn-outline-secondary"><i class="bi bi-search"></i> Buscar</button>
							</div>
						</div>
						<div class="col-3 d-flex justify-content-center">
							<button class="btn btn-outline-primary"><i class="bi bi-star"></i> Nuevo cliente</button>
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
            <th>#</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>DNI</th>
            <th>Celular</th>
            <th>Teléfono</th>
            <th>Nacionalidad</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Ana</td>
            <td>García López</td>
            <td><router-link :to="{name: 'perfilCliente', params: {id:1}}">12345678A</router-link></td>
            <td>601-123-456</td>
            <td>91-789-0123</td>
            <td>Peruana</td>
        </tr>
        <tr>
            <td>2</td>
            <td>Carlos</td>
            <td>Rodríguez Pérez</td>
            <td><router-link :to="{name: 'perfilCliente', params: {id:2}}">23456789B</router-link></td>
            <td>602-234-567</td>
            <td>93-890-1234</td>
            <td>Mexicana</td>
        </tr>
        <tr>
            <td>3</td>
            <td>María</td>
            <td>Sánchez Gómez</td>
            <td><router-link :to="{name: 'perfilCliente', params: {id:3}}">34567890C</router-link></td>
            <td>603-345-678</td>
            <td>95-901-2345</td>
            <td>Argentina</td>
        </tr>
        <tr>
            <td>4</td>
            <td>Luis</td>
            <td>Fernández Ruiz</td>
            <td><router-link :to="{name: 'perfilCliente', params: {id:4}}">45678901D</router-link></td>
            <td>604-456-789</td>
            <td>97-012-3456</td>
            <td>Colombiana</td>
        </tr>
    </tbody>
</table>
		</div>
	</div>
</template>