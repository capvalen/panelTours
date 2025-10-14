<template>
	<h1>Perfil del proveedor</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/proveedores">Proveedores</a></li>
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
					<p><strong>RUC:</strong> 20567890123</p>
					<p><strong>Razón Social:</strong> Empresas del Norte S.A.C.</p>
					<p><strong>Categoría:</strong> Alimentación</p>
					<p><strong>Contacto:</strong> Sra. Lucía Mendoza</p>
					<p><strong>Fecha de Nacimiento:</strong> 22/07/1985</p>
					<p><strong>Correo:</strong> lucia.mendoza@empresasnorte.com</p>
					<p><strong>Celular:</strong> +51 963 852 741</p>
					<p><strong>Teléfono:</strong> +51 1 789 4561</p>
					<p><strong>Dirección:</strong> Jr. Huallaga 456, Miraflores</p>
					<p><strong>Ciudad:</strong> Juliaca</p>
				</div>
			</div>

		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Documentación </strong></p>

					<ul class="list-group list-group-flush ">
						<li class="list-group-item">
							<div class="d-flex w-100 justify-content-between">
								<a href="#!">Ficha RUC</a>
								<button class="btn btn-outline-danger border-0 rounded-circle"><i class="bi bi-x"></i></button>
							</div>
						</li>
						<li class="list-group-item">
							<div class="d-flex w-100 justify-content-between">
								<a href="#!">Certificado de salud</a>
								<button class="btn btn-outline-danger border-0 rounded-circle"><i class="bi bi-x"></i></button>
							</div>
						</li>
					</ul>

				</div>
			</div>
		</div>
	</div>

</template>