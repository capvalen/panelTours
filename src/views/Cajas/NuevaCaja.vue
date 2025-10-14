<template>
	<h1>Nueva caja</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/cajas">Cajas</a></li>
			<li class="breadcrumb-item active" aria-current="page">Aperturar nueva caja</li>
		</ol>
	</nav>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos de apertura</strong></h5>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="usuario" class="form-label">Usuario</label>
							<input type="text" class="form-control" id="usuario" value="Úrsula" disabled>
						</div>
						<div class="col-md-6">
							<label for="fecha" class="form-label">Fecha</label>
							<input type="date" class="form-control" id="fecha" value="2025-10-15" disabled>
						</div>
						<div class="col-md-6">
							<label for="fecha" class="form-label">Monto de apertura</label>
							<input type="number" class="form-control" id="fecha" value="0.00" >
						</div>
						<div class="col-md-6">
							<label for="observacion" class="form-label">Observación</label>
							<input type="text" class="form-control" id="observacion" value="" >
						</div>
					</div>


				</div>
			</div>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary">Aperturar nueva caja</button>
			</div>
		</div>
	</div>
</template>