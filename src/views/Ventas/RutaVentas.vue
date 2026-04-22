<template>
	<div class="container-fluid p-3" id="ruta-ventas">
		<!-- Título principal -->
		<div class="text-center mb-5">
			<h1 class="display-4 fw-bold text-primary">Ruta de Servicio</h1>
			<p class="lead text-secondary">Flujo de ventas de principio a fin</p>
		</div>

		<!-- Línea de tiempo horizontal (oculta en móviles, visible en md+) -->
		<div class="timeline-container mb-5">
			<div class="timeline-line"></div>
			<div class="row d-none d-md-flex justify-content-center">
				<div class="col-md-3 text-center position-relative">
					<div class="step-circle mx-auto step-gradient-1 text-white d-flex align-items-center justify-content-center shadow">1</div>
					<h4 class="mt-4 fw-semibold">Ventas y cotizaciones</h4>
					<p class="text-muted small mb-0">Generación de ventas y cotizaciones</p>
				</div>
				<div class="col-md-3 text-center position-relative">
					<div class="step-circle mx-auto step-gradient-2 text-white d-flex align-items-center justify-content-center shadow">2</div>
					<h4 class="mt-4 fw-semibold">Confirmación de Servicios</h4>
					<p class="text-muted small mb-0">Contratos y calendarización</p>
				</div>
				<div class="col-md-3 text-center position-relative">
					<div class="step-circle mx-auto step-gradient-3 text-white d-flex align-items-center justify-content-center shadow">3</div>
					<h4 class="mt-4 fw-semibold">Tesorería</h4>
					<p class="text-muted small mb-0">Liquidación y facturación</p>
				</div>
				<div class="col-md-3 text-center position-relative">
					<div class="step-circle mx-auto step-gradient-4 text-white d-flex align-items-center justify-content-center shadow">4</div>
					<h4 class="mt-4 fw-semibold">Operatividad</h4>
					<p class="text-muted small mb-0">Logística y cierre operativo</p>
				</div>
			</div>
		</div>

		<p>Seleccione el nivel de la venta:</p>
		
		<div class="row g-4 justify-content-center">
			<!-- Sección 1 -->
			<div class="col-6 col-md-2">
				<router-link to="/ventas">
				<div class="card h-100 shadow-sm border-0 rounded-4">
					<div class="card-body p-4">
							<div class="d-flex align-items-center gap-3 mb-3">
								<div class="rounded-circle step-gradient-1 p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
									<span class="text-white">
										<i class="bi bi-cart-fill" style="font-size: 28px;"></i>
									</span>
								</div>
							<h3 class="h4 fw-bold text-primary mb-0">01</h3>
						</div>
						<h2 class="h3 fw-semibold">Ventas y Cotizaciones</h2>
						<p class="text-muted mb-0">Se usa para:</p>
						<ul class="list-unstyled mt-2">
							<li class="mb-2"><i class="bi bi-check-circle-fill text-primary me-2"></i> Generar ventas</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-primary me-2"></i> Generar cotizaciones</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-primary me-2"></i> Calendarización</li>
						</ul>
					</div>
				</div>
			</router-link>
			</div>

			<!-- Flecha decorativa entre cards (solo desktop) -->
			<div class="col-1 d-none d-md-flex align-items-center justify-content-center ">
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#6c757d"
					class="bi bi-arrow-right-circle arrow-desktop" viewBox="0 0 16 16">
					<path fill-rule="evenodd"
						d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm9.5 0a.5.5 0 0 1-.5.5H6.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.707 7.5H10a.5.5 0 0 1 .5.5z" />
				</svg>
			</div>

			<!-- Sección 2 -->
			<div class="col-6 col-md-2">
				<div class="card h-100 shadow-sm border-0 rounded-4">
					<div class="card-body p-4">
						<div class="d-flex align-items-center gap-3 mb-3">
							<div class="rounded-circle step-gradient-2 p-3 d-flex align-items-center justify-content-center"
								style="width: 54px; height: 54px;">
								<span class="text-white">
									<i class="bi bi-headset" style="font-size: 28px;"></i>
								</span>
							</div>
							<h3 class="h4 fw-bold text-success mb-0">02</h3>
						</div>
						<h2 class="h3 fw-semibold">Confirmación de Servicios</h2>
						<p class="text-muted mb-0">Se usa para:</p>

						<ul class="list-unstyled mt-3">
							<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Confirmación de disponibilidad</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Asignación de recursos</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Asignación de contáctos</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="col-1 d-none d-md-flex align-items-center justify-content-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#6c757d"
					class="bi bi-arrow-right-circle arrow-desktop" viewBox="0 0 16 16">
					<path fill-rule="evenodd"
						d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm9.5 0a.5.5 0 0 1-.5.5H6.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.707 7.5H10a.5.5 0 0 1 .5.5z" />
				</svg>
			</div>

			<!-- Sección 3: Tesorería -->
			<div class="col-6 col-md-2">
				<div class="card h-100 shadow-sm border-0 rounded-4">
					<div class="card-body p-4">
						<div class="d-flex align-items-center gap-3 mb-3">
							<div class="rounded-circle step-gradient-3 p-3 d-flex align-items-center justify-content-center"
								style="width: 54px; height: 54px;">
								<span class="text-white">
									<i class="bi bi-cash-stack" style="font-size: 28px;"></i>
								</span>
							</div>
							<h3 class="h4 fw-bold text-info mb-0">03</h3>
						</div>
						<h2 class="h3 fw-semibold">Tesorería</h2>
						<p class="text-muted mb-0">Se usa para:</p>
						<ul class="list-unstyled mt-3">
							<li class="mb-2"><i class="bi bi-check-circle-fill text-info me-2"></i> Liquidación</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-info me-2"></i> Confirmación de pagos</li>
							<li><i class="bi bi-check-circle-fill text-info me-2"></i> Facturación electrónica</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="col-1 d-none d-md-flex align-items-center justify-content-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#6c757d"
					class="bi bi-arrow-right-circle arrow-desktop" viewBox="0 0 16 16">
					<path fill-rule="evenodd"
						d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm9.5 0a.5.5 0 0 1-.5.5H6.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.707 7.5H10a.5.5 0 0 1 .5.5z" />
				</svg>
			</div>

			<!-- Sección 4 -->
			<div class="col-6 col-md-2">
				<div class="card h-100 shadow-sm border-0 rounded-4">
					<div class="card-body p-4">
						<div class="d-flex align-items-center gap-3 mb-3">
							<div class="rounded-circle step-gradient-4 p-3 d-flex align-items-center justify-content-center"
								style="width: 54px; height: 54px;">
								<span class="text-white">
									<i class="bi bi-person-walking" style="font-size: 28px;"></i>
								</span>
							</div>
							<h3 class="h4 fw-bold text-warning mb-0">04</h3>
						</div>
						<h2 class="h3 fw-semibold">Operatividad</h2>
						<p class="text-muted mb-0">Se usa para:</p>
						<ul class="list-unstyled mt-3">
							<li class="mb-2"><i class="bi bi-check-circle-fill text-warning me-2"></i> Ejecución</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-warning me-2"></i> Logística en tiempo real</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-warning me-2"></i> Asistencia al viajero</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-warning me-2"></i> Cierre de la operación</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<style scoped>
/* Estilos para la línea horizontal desktop */
.timeline-container {
	position: relative;
	padding: 20px 0;
}

.timeline-line {
	position: absolute;
	top: 50px;
	left: 10%;
	right: 10%;
	height: 4px;
	background: linear-gradient(90deg, #0d6efd 0%, #198754 33%, #0dcaf0 66%, #ffc107 100%);
	border-radius: 2px;
	z-index: 0;
}

.step-circle {
	width: 60px;
	height: 60px;
	font-size: 1.8rem;
	font-weight: bold;
	border-radius: 50%;
	position: relative;
	z-index: 2;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step-circle:hover {
	transform: scale(1.1);
}

.step-circle.shadow {
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Mejora para sombras y transiciones */
.card {
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1) !important;
	cursor:pointer;
}
/* Por defecto en móvil (fuera del media query) la flecha apunta hacia abajo */
.arrow-desktop {
	transform: rotate(-90deg);
}

/* Degradados para pasos */
.step-gradient-1 { background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%); }
.step-gradient-2 { background: linear-gradient(135deg, #198754 0%, #20c997 100%); }
.step-gradient-3 { background: linear-gradient(135deg, #0dcaf0 0%, #3b82f6 100%); }
.step-gradient-4 { background: linear-gradient(135deg, #ffc107 0%, #ff7a00 100%); }

/* En desktop vuelve a apuntar a la derecha */
@media (min-width: 768px) {
	.arrow-desktop {
		transform: rotate(180deg);
	}
}
</style>