<template>
	<div class="unauthorized-container">
		<div class="unauthorized-card">
			<div class="icon-wrapper">
				<i class="bi bi-shield-exclamation"></i>
			</div>
			<h1 class="title">Acceso Denegado</h1>
			<p class="subtitle">No tienes permisos para acceder a esta sección.</p>
			<p class="description">Solicita al administrador que te otorgue los permisos necesarios.</p>
			<router-link to="/dashboard" class="btn-back">
				<i class="bi bi-arrow-left"></i> Volver al inicio
			</router-link>
		</div>
	</div>
</template>

<style scoped>
.unauthorized-container {
	min-height: 80vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
}

.unauthorized-card {
	text-align: center;
	max-width: 480px;
	padding: 3rem 2.5rem;
	background: #fff;
	border-radius: 20px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
	width: 100px;
	height: 100px;
	margin: 0 auto 1.5rem;
	background: #fef2f2;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon-wrapper i {
	font-size: 3.5rem;
	color: #ef4444;
}

.title {
	font-size: 1.75rem;
	font-weight: 700;
	color: #1e293b;
	margin-bottom: 0.5rem;
}

.subtitle {
	font-size: 1.1rem;
	color: #475569;
	margin-bottom: 0.5rem;
	font-weight: 500;
}

.description {
	font-size: 0.95rem;
	color: #94a3b8;
	margin-bottom: 2rem;
	line-height: 1.5;
}

.btn-back {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 2rem;
	background: #3b82f6;
	color: #fff;
	border-radius: 10px;
	font-weight: 600;
	font-size: 0.95rem;
	text-decoration: none;
	transition: background 0.2s;
}

.btn-back:hover {
	background: #2563eb;
	color: #fff;
}
</style>
