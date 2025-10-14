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
					<p><strong>Autorización de viaje:</strong> No aplica (mayor de edad)</p>
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

</template>