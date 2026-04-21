<template>
	<div class="container py-5">
		<!-- Título principal -->
		<div class="text-center mb-5">
			<h1 class="display-4 fw-bold text-primary">Ruta de Servicio</h1>
			<p class="lead text-secondary">Flujo de ventas de principio a fin</p>
		</div>

		<!-- Línea de tiempo horizontal (oculta en móviles, visible en md+) -->
		<div class="row d-none d-md-flex justify-content-center mb-5">
			<div class="col-md-4 text-center position-relative">
				<div class="step-circle mx-auto bg-primary text-white d-flex align-items-center justify-content-center">1</div>
				<div class="step-line"></div>
				<h4 class="mt-3 fw-semibold">Ventas y Reservaciones</h4>
			</div>
			<div class="col-md-4 text-center position-relative">
				<div class="step-circle mx-auto bg-primary text-white d-flex align-items-center justify-content-center">2</div>
				<div class="step-line"></div>
				<h4 class="mt-3 fw-semibold">Confirmación de Servicios</h4>
			</div>
			<div class="col-md-4 text-center position-relative">
				<div class="step-circle mx-auto bg-primary text-white d-flex align-items-center justify-content-center">3</div>
				<h4 class="mt-3 fw-semibold">Operatividad</h4>
			</div>
		</div>

		<p>Seleccione el nivel de la venta:</p>

		
		<div class="row g-4">
			<!-- Sección 1 -->
			<div class="col-md-3">
				<router-link to="/ventas">
				<div class="card h-100 shadow-sm border-0 rounded-4">
					<div class="card-body p-4">
						<div class="d-flex align-items-center gap-3 mb-3">
							<div class="rounded-circle bg-primary bg-opacity-10 p-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
								<span class="text-primary">
									<i class="bi bi-cart-fill" style="font-size: 28px;"></i>
								</span>
							</div>
							<h3 class="h4 fw-bold text-primary mb-0">01</h3>
						</div>
						<h2 class="h3 fw-semibold">Ventas y Reservaciones</h2>
						<p class="text-muted mb-0">Se usa para:</p>
						<ul class="list-unstyled mt-2">
							<li class="mb-2"><i class="bi bi-check-circle-fill text-primary me-2"></i> Generar ventas</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-primary me-2"></i> Generar cotizaciones</li>
						</ul>
					</div>
				</div>
			</router-link>
			</div>

			<!-- Flecha decorativa entre cards (solo desktop) -->
			<div class="col-md-1 d-flex align-items-center justify-content-center ">
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#6c757d"
					class="bi bi-arrow-right-circle arrow-desktop" viewBox="0 0 16 16">
					<path fill-rule="evenodd"
						d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm9.5 0a.5.5 0 0 1-.5.5H6.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.707 7.5H10a.5.5 0 0 1 .5.5z" />
				</svg>
			</div>

			<!-- Sección 2 -->
			<div class="col-md-3">
				<div class="card h-100 shadow-sm border-0 rounded-4">
					<div class="card-body p-4">
						<div class="d-flex align-items-center gap-3 mb-3">
							<div class="rounded-circle bg-success bg-opacity-10 p-3 d-flex align-items-center justify-content-center"
								style="width: 54px; height: 54px;">
								<span class="text-success">
									<i class="bi bi-headset" style="font-size: 28px;"></i>
								</span>
							</div>
							<h3 class="h4 fw-bold text-success mb-0">02</h3>
						</div>
						<h2 class="h3 fw-semibold">Confirmación de Servicios</h2>
						<p class="text-muted mb-0">Se usa para:</p>

						<ul class="list-unstyled mt-3">
							<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Contratos digitales</li>
							<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> Notificaciones automáticas</li>
							<li><i class="bi bi-check-circle-fill text-success me-2"></i> Calendarización final</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="col-md-1 d-flex align-items-center justify-content-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#6c757d"
					class="bi bi-arrow-right-circle arrow-desktop" viewBox="0 0 16 16">
					<path fill-rule="evenodd"
						d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm9.5 0a.5.5 0 0 1-.5.5H6.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.707 7.5H10a.5.5 0 0 1 .5.5z" />
				</svg>
			</div>

			<!-- Sección 3 -->
			<div class="col-md-3">
				<div class="card h-100 shadow-sm border-0 rounded-4">
					<div class="card-body p-4">
						<div class="d-flex align-items-center gap-3 mb-3">
							<div class="rounded-circle bg-warning bg-opacity-10 p-3 d-flex align-items-center justify-content-center"
								style="width: 54px; height: 54px;">
								<span class="text-warning">
									<i class="bi bi-person-walking" style="font-size: 28px;"></i>
								</span>
							</div>
							<h3 class="h4 fw-bold text-warning mb-0">03</h3>
						</div>
						<h2 class="h3 fw-semibold">Operatividad</h2>
						<p class="text-muted mb-0">Se usa para:</p>
						<ul class="list-unstyled mt-3">
							<li class="mb-2"><i class="bi bi-check-circle-fill text-warning me-2"></i> Logística en tiempo real</li>
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
.step-circle {
	width: 60px;
	height: 60px;
	font-size: 1.8rem;
	font-weight: bold;
	border-radius: 50%;
	position: relative;
	z-index: 2;
}

.step-line {
	position: absolute;
	top: 30px;
	left: calc(50% + 30px);
	width: calc(100% - 60px);
	height: 2px;
	background-color: #0d6efd;
	z-index: 1;
}

.col-md-4:last-child .step-line {
	display: none;
}

@media (max-width: 767px) {
	.step-line {
		display: none;
	}
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

/* En desktop vuelve a apuntar a la derecha */
@media (min-width: 768px) {
	.arrow-desktop {
		transform: rotate(180deg);
	}
}
</style>