<template>
	<h1>Nuevo Proveedor</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/proveedores">Proveedores</a></li>
			<li class="breadcrumb-item active" aria-current="page">Nuevo</li>
		</ol>
	</nav>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos del proveedor</strong></h5>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="ruc" class="form-label">RUC</label>
							<input type="text" class="form-control" id="ruc" value="20567890123">
						</div>
						<div class="col-md-6">
							<label for="razonSocial" class="form-label">Razón Social</label>
							<input type="text" class="form-control" id="razonSocial" value="Empresas del Norte S.A.C.">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="categoria" class="form-label">Categoría</label>
							<select class="form-select" id="categoria">
								<option value="alojamiento">Alojamiento</option>
								<option value="transporte">Transporte</option>
								<option value="restaurant" selected>Restaurant</option>
								<option value="local">Local</option>
								<option value="agencia">Agencia</option>
							</select>
						</div>
						<div class="col-md-6">
							<label for="contacto" class="form-label">Contacto</label>
							<input type="text" class="form-control" id="contacto" value="Sra. Lucía Mendoza">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="correoEmpresa" class="form-label">Correo</label>
							<input type="email" class="form-control" id="correoEmpresa" value="lucia.mendoza@empresasnorte.com">
						</div>
						<div class="col-md-6">
							<label for="celularEmpresa" class="form-label">Celular</label>
							<input type="tel" class="form-control" id="celularEmpresa" value="963 852 741">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="direccionEmpresa" class="form-label">Dirección</label>
							<input type="text" class="form-control" id="direccionEmpresa" value="Jr. Huallaga 456, Miraflores">
						</div>
						<div class="col-md-6">
							<label for="ciudadEmpresa" class="form-label">Ciudad</label>
							<input type="text" class="form-control" id="ciudadEmpresa" value="Juliaca">
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
					<h5 class="mb-4"><strong>Documentación </strong></h5>

					<div class="row mb-3">
						<div class="col-md-6">
							<div class="mb-3">
								<label for="banco" class="form-label">Banco</label>
								<select class="form-select" id="banco">
									<option value="" selected>Ninguno</option>
									<option value="bcp">BCP</option>
									<option value="banco-de-la-nacion">Banco de la Nación</option>
									<option value="bbva">BBVA</option>
									<option value="interbank">Interbank</option>
									<option value="scotiabank">Scotiabank</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<label for="cuentaBanacaria" class="form-label">Cuenta bancaria</label>
							<input type="text" class="form-control" id="cuentaBanacaria" value="500-50888182158">
						</div>
						<div class="col-md-6">
							<label for="datoExtra" class="form-label">Dato extra</label>
							<input type="text" class="form-control" id="datoExtra" value="Verificar nombre de Roberto Alcázar">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary">Generar nuevo proveedor</button>
			</div>
		</div>
	</div>
</template>