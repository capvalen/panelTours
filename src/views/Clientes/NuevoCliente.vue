<template>
	<h1>Nuevo Cliente</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/clientes">Clientes</a></li>
			<li class="breadcrumb-item active" aria-current="page">Nuevo</li>
		</ol>
	</nav>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos del cliente</strong></h5>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="nombres" class="form-label">Nombres</label>
							<input type="text" class="form-control" id="nombres" value="Gabriel" required>
						</div>
						<div class="col-md-6">
							<label for="apellidos" class="form-label">Apellidos</label>
							<input type="text" class="form-control" id="apellidos" value="Temu Sanfer" required>
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="dni" class="form-label">DNI</label>
							<input type="text" class="form-control" id="dni" value="75123456" required>
						</div>
						<div class="col-md-6">
							<label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
							<input type="date" class="form-control" id="fechaNacimiento" value="1990-03-15" required>
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="correo" class="form-label">Correo</label>
							<input type="email" class="form-control" id="correo" value="carlos.pariona@email.com" required>
						</div>
						<div class="col-md-6">
							<label for="celular" class="form-label">Celular</label>
							<input type="tel" class="form-control" id="celular" value="987 654 321" required>
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="telefono" class="form-label">Teléfono</label>
							<input type="tel" class="form-control" id="telefono" value="+51 1 456 7890">
						</div>
						<div class="col-md-6">
							<label for="direccion" class="form-label">Dirección</label>
							<input type="text" class="form-control" id="direccion" value="Av. Los Pinos 123, San Isidro" required>
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="nacionalidad" class="form-label">Nacionalidad</label>
							<input type="text" class="form-control" id="nacionalidad" value="Peruana" required>
						</div>
						<div class="col-md-6">
							<label for="ciudad" class="form-label">Ciudad</label>
							<input type="text" class="form-control" id="ciudad" value="Lima" required>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row my-2">
		<div class="col col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Documentación y Seguridad</strong></h5>

					<div class="mb-3">
						<label for="carnetExtranjeria" class="form-label">Carnet de Extranjería</label>
						<input type="text" class="form-control" id="carnetExtranjeria" value="CE1234567">
					</div>

					<div class="row mb-3">
						<div class="col-md-8">
							<label for="pasaporte" class="form-label">Pasaporte</label>
							<input type="text" class="form-control" id="pasaporte" value="P12345678">
						</div>
						<div class="col-md-4">
							<label for="vigenciaPasaporte" class="form-label">Vigencia</label>
							<input type="date" class="form-control" id="vigenciaPasaporte" value="2026-04-10">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-8">
							<label for="tipoVisado" class="form-label">Tipo de Visado</label>
							<input type="text" class="form-control" id="tipoVisado" value="Turista">
						</div>
						<div class="col-md-4">
							<label for="vigenciaVisado" class="form-label">Válido hasta</label>
							<input type="date" class="form-control" id="vigenciaVisado" value="2025-11-30">
						</div>
					</div>

					<div class="mb-3">
						<label for="vacunacion" class="form-label">Vacunación</label>
						<input type="text" class="form-control" id="vacunacion" value="Completada (2 dosis + refuerzo)">
					</div>

					<div class="mb-3">
						<div class="form-check mb-2">
							<input class="form-check-input" type="checkbox" id="tieneSeguro" checked>
							<label class="form-check-label" for="tieneSeguro">
								Tiene seguro de viaje
							</label>
						</div>
						<div id="seguroDetalle">
							<label for="nombreSeguro" class="form-label">Seguro</label>
							<input type="text" class="form-control" id="nombreSeguro" value="Mapfre Viajes Internacional">
						</div>
					</div>

					<div class="mb-3">
						<label for="autorizacionViaje" class="form-label">Autorización de viaje</label>
						<select class="form-select" id="autorizacionViaje">
							<option value="no-aplica" selected>No aplica</option>
							<option value="no-presento">No presentó</option>
							<option value="si">Sí</option>
						</select>
					</div>

				
				</div>
			</div>
		</div>
	</div>

<div class="row mb-5">
	<div class="col-8 mx-auto">
			<div class="d-grid">
						<button type="submit" class="btn btn-primary">Generar nuevo cliente</button>
					</div>
	</div>
</div>
</template>