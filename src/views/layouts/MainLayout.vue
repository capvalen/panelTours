<template>
	<div class="container-fluid">
		<!-- Navbar para móvil -->
		<nav class="navbar navbar-expand-md d-md-none bg-white border-bottom">
			<div class="container-fluid">
				<a class="navbar-brand" href="/dashboard">
					<img src="@/assets/logo.webp" alt="Logo" style="height: 40px;">
				</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
					<span class="navbar-toggler-icon"></span>
				</button>
			</div>
		</nav>

		<div class="row">
			<!-- Sidebar desktop -->
			<div class="col-md-3 col-lg-2 p-0 d-none d-md-block" id="rowMenu">
				<div id="logo" class="w-75 my-4 mx-auto">
					<img src="@/assets/logo.webp" class="w-75 mx-auto d-block">
				</div>

				<!-- SECCIÓN: Inicio -->
				<router-link to="/dashboard">
					<div class="menuFila"><i class="bi bi-house"></i> Inicio</div>
				</router-link>

				<!-- SECCIÓN: Ventas y Cotizaciones -->
				<router-link to="/cotizaciones" class="menuSeccionLink">
					<div class="menuSeccion"><i class="bi bi-file-text"></i> Ventas y Cotizaciones</div>
				</router-link>
				<router-link to="/ventas" :class="{ active: $route.path.startsWith('/venta') }" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-cart"></i> Ventas</div>
				</router-link>
				<router-link to="/tarifario" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-tag"></i> Tarifario</div>
				</router-link>
				<router-link to="/rutas-de-servicio" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-signpost-2"></i> Rutas de servicio</div>
				</router-link>

				<!-- SECCIÓN: Operaciones y Logística -->
				<router-link to="/operaciones" class="menuSeccionLink">
					<div class="menuSeccion"><i class="bi bi-truck"></i> Operaciones y Logística</div>
				</router-link>
				<router-link to="/proveedores" :class="{ active: $route.path.startsWith('/proveedor') }" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-truck"></i> Proveedores</div>
				</router-link>
				<router-link to="/vehiculos" :class="{ active: $route.path.startsWith('/vehiculo') }" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-car-front"></i> Vehículos</div>
				</router-link>
				<router-link to="/hospedajes" :class="{ active: $route.path.startsWith('/hospedaje') }" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-building"></i> Hospedajes</div>
				</router-link>
				<router-link to="/guias" :class="{ active: $route.path.startsWith('/guia') }" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-person-badge"></i> Guías</div>
				</router-link>
				<router-link to="/vuelos" :class="{ active: $route.path.startsWith('/vuelo') }" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-airplane"></i> Vuelos</div>
				</router-link>

				<!-- SECCIÓN: Caja -->
				<router-link to="/cajas" :class="{ active: $route.path.startsWith('/caja') }">
					<div class="menuFila"><i class="bi bi-piggy-bank"></i> Caja</div>
				</router-link>

				<!-- SECCIÓN: Finanzas -->
				<router-link to="/finanzas" class="menuSeccionLink">
					<div class="menuSeccion"><i class="bi bi-currency-dollar"></i> Finanzas</div>
				</router-link>
				<router-link to="/pagos" :class="{ active: $route.path.startsWith('/pago') }" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-journal-bookmark"></i> Control de pagos</div>
				</router-link>

				<!-- SECCIÓN: Configuraciones -->
				<router-link to="/configuraciones" class="menuSeccionLink">
					<div class="menuSeccion"><i class="bi bi-gear"></i> Configuraciones</div>
				</router-link>
				<router-link to="/recordatorios" class="menuSubItem">
					<div class="menuFila menuFila-sub"><i class="bi bi-stars"></i> Recordatorios</div>
				</router-link>

				<!-- LÍNEA DIVISORIA -->
				<hr class="my-2 mx-3">

				<!-- MENÚ EXISTENTE (tal cual) -->
				<router-link to="/dashboard">
					<div class="menuFila"><i class="bi bi-house"></i> Inicio</div>
				</router-link>
				<router-link to="/clientes" :class="{ active: $route.path.startsWith('/cliente') }">
					<div class="menuFila"><i class="bi bi-wechat"></i> Clientes</div>
				</router-link>
				<router-link to="/proveedores" :class="{ active: $route.path.startsWith('/proveedor') }">
					<div class="menuFila"><i class="bi bi-truck"></i> Proveedores</div>
				</router-link>
				<router-link to="/vehiculos" :class="{ active: $route.path.startsWith('/vehiculo') }">
					<div class="menuFila"><i class="bi bi-car-front"></i> Vehículos</div>
				</router-link>
				<router-link to="/hospedajes" :class="{ active: $route.path.startsWith('/hospedaje') }">
					<div class="menuFila"><i class="bi bi-building"></i> Hospedajes</div>
				</router-link>
				<router-link to="/guias" :class="{ active: $route.path.startsWith('/guia') }">
					<div class="menuFila"><i class="bi bi-person-badge"></i> Guías</div>
				</router-link>
				<router-link to="/vuelos" :class="{ active: $route.path.startsWith('/vuelo') }">
					<div class="menuFila"><i class="bi bi-airplane"></i> Vuelos</div>
				</router-link>
				<router-link to="/cajas" :class="{ active: $route.path.startsWith('/caja') }">
					<div class="menuFila"><i class="bi bi-piggy-bank"></i> Caja</div>
				</router-link>
				<router-link to="/ventas" :class="{ active: $route.path.startsWith('/venta') }">
					<div class="menuFila"><i class="bi bi-cart"></i> Ventas</div>
				</router-link>
				<router-link to="/pagos" :class="{ active: $route.path.startsWith('/pago') }">
					<div class="menuFila"><i class="bi bi-journal-bookmark"></i> Control de pagos</div>
				</router-link>
				<router-link to="/recordatorios">
					<div class="menuFila"><i class="bi bi-stars"></i> Recordatorios</div>
				</router-link>
				<router-link to="/configuraciones">
					<div class="menuFila"><i class="bi bi-gear"></i> Configuración</div>
				</router-link>
				<router-link to="/tarifario">
					<div class="menuFila"><i class="bi bi-tag"></i> Tarifario</div>
				</router-link>
				<div class="menuFila d-none"><i class="bi bi-stickies"></i> Reportes</div>
				<a href="#!">
					<div class="menuFila" @click="logout()"><i class="bi bi-door-open"></i> Salir</div>
				</a>
			</div>

			<!-- Sidebar offcanvas para móvil -->
			<div class="offcanvas offcanvas-start d-md-none" tabindex="-1" id="sidebarMenu" style="background-color: #E6FBFF; color: #011734; width: 100%; max-width: 100%;">
				<div class="offcanvas-header">
					<img src="@/assets/logo.webp" alt="Logo" style="height: 40px;" data-bs-dismiss="offcanvas">
					<button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
				</div>
				<div class="offcanvas-body p-0" style="overflow-y: auto; height: calc(100vh - 60px);">
					<!-- SECCIÓN: Inicio -->
					<router-link to="/dashboard" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-house"></i> Inicio
					</router-link>

					<!-- SECCIÓN: Ventas y Cotizaciones -->
					<router-link to="/cotizaciones" class="menuSeccion-mobile" @click="closeOffcanvas">
						<i class="bi bi-file-text"></i> Ventas y Cotizaciones
					</router-link>
					<router-link to="/ventas" :class="{ active: $route.path.startsWith('/venta') }" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-cart"></i> Ventas
					</router-link>
					<router-link to="/tarifario" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-tag"></i> Tarifario
					</router-link>
					<router-link to="/rutas-de-servicio" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-signpost-2"></i> Rutas de servicio
					</router-link>

					<!-- SECCIÓN: Operaciones y Logística -->
					<router-link to="/operaciones" class="menuSeccion-mobile" @click="closeOffcanvas">
						<i class="bi bi-truck"></i> Operaciones y Logística
					</router-link>
					<router-link to="/proveedores" :class="{ active: $route.path.startsWith('/proveedor') }" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-truck"></i> Proveedores
					</router-link>
					<router-link to="/vehiculos" :class="{ active: $route.path.startsWith('/vehiculo') }" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-car-front"></i> Vehículos
					</router-link>
					<router-link to="/hospedajes" :class="{ active: $route.path.startsWith('/hospedaje') }" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-building"></i> Hospedajes
					</router-link>
					<router-link to="/guias" :class="{ active: $route.path.startsWith('/guia') }" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-person-badge"></i> Guías
					</router-link>
					<router-link to="/vuelos" :class="{ active: $route.path.startsWith('/vuelo') }" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-airplane"></i> Vuelos
					</router-link>

					<!-- SECCIÓN: Caja -->
					<router-link to="/cajas" :class="{ active: $route.path.startsWith('/caja') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-piggy-bank"></i> Caja
					</router-link>

					<!-- SECCIÓN: Finanzas -->
					<router-link to="/finanzas" class="menuSeccion-mobile" @click="closeOffcanvas">
						<i class="bi bi-currency-dollar"></i> Finanzas
					</router-link>
					<router-link to="/pagos" :class="{ active: $route.path.startsWith('/pago') }" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-journal-bookmark"></i> Control de pagos
					</router-link>

					<!-- SECCIÓN: Configuraciones -->
					<router-link to="/configuraciones" class="menuSeccion-mobile" @click="closeOffcanvas">
						<i class="bi bi-gear"></i> Configuraciones
					</router-link>
					<router-link to="/recordatorios" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
						<i class="bi bi-stars"></i> Recordatorios
					</router-link>

					<!-- LÍNEA DIVISORIA -->
					<hr class="my-2 mx-3">

					<!-- MENÚ EXISTENTE (tal cual) -->
					<router-link to="/dashboard" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-house"></i> Inicio
					</router-link>
					<router-link to="/clientes" :class="{ active: $route.path.startsWith('/cliente') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-wechat"></i> Clientes
					</router-link>
					<router-link to="/proveedores" :class="{ active: $route.path.startsWith('/proveedor') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-truck"></i> Proveedores
					</router-link>
					<router-link to="/vehiculos" :class="{ active: $route.path.startsWith('/vehiculo') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-car-front"></i> Vehículos
					</router-link>
					<router-link to="/hospedajes" :class="{ active: $route.path.startsWith('/hospedaje') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-building"></i> Hospedajes
					</router-link>
					<router-link to="/guias" :class="{ active: $route.path.startsWith('/guia') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-person-badge"></i> Guías
					</router-link>
					<router-link to="/vuelos" :class="{ active: $route.path.startsWith('/vuelo') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-airplane"></i> Vuelos
					</router-link>
					<router-link to="/cajas" :class="{ active: $route.path.startsWith('/caja') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-piggy-bank"></i> Caja
					</router-link>
					<router-link to="/ventas" :class="{ active: $route.path.startsWith('/venta') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-cart"></i> Ventas
					</router-link>
					<router-link to="/pagos" :class="{ active: $route.path.startsWith('/pago') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-journal-bookmark"></i> Control de pagos
					</router-link>
					<router-link to="/recordatorios" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-stars"></i> Recordatorios
					</router-link>
					<router-link to="/tarifario" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-tag"></i> Tarifario
					</router-link>
					<router-link to="/configuraciones" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-gear"></i> Configuración
					</router-link>
					<div class="menuFila-mobile d-none"><i class="bi bi-stickies"></i> Reportes</div>
					<div class="menuFila-mobile" @click="logout()"><i class="bi bi-door-open"></i> Salir</div>
				</div>
			</div>

			<!-- Contenido principal -->
			<div class="col-md-9 col-lg-10 pt-3">
				<router-view class="container-fluid"></router-view>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Offcanvas } from 'bootstrap';
import { onMounted } from 'vue'
import { useFormat } from '@/composables/formatos'
const { consultarApiDolar } = useFormat()
const router = useRouter()

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore()

function closeOffcanvas() {
	const offcanvas = document.getElementById('sidebarMenu');
	if (offcanvas) {
		Offcanvas.getInstance(offcanvas)?.hide();
	}
}

function logout() {
	closeOffcanvas();
	authStore.logout()
	localStorage.removeItem('dolar')
	router.push('/login')
}

onMounted(async () => {
	try {
		localStorage.getItem('dolar') || await consultarApiDolar();
	} catch {}
})
</script>

<style>
#rowMenu {
	background-color: #E6FBFF;
	height: 100vh;
	position: sticky;
	top: 0;
	border-radius: 0 20px 20px 0;
	color: #011734;
	overflow-y: auto;
	overflow-x: hidden;
	scrollbar-color: #07469a #E6FBFF;
}

#rowMenu::-webkit-scrollbar {
	width: 1px;
}

#rowMenu::-webkit-scrollbar-track {
	background: transparent;
	padding: 0 2px;
}

#rowMenu::-webkit-scrollbar-thumb {
	background: #023475;
	border-radius: 10px;
}

#rowMenu::-webkit-scrollbar-thumb:hover {
	background: #011734;
}

/* Offcanvas mobile scrollbar */
.offcanvas-body::-webkit-scrollbar {
	width: 2px;
}

.offcanvas-body::-webkit-scrollbar-track {
	background: transparent;
	padding: 0 2px;
}

.offcanvas-body::-webkit-scrollbar-thumb {
	background: #355886;
	border-radius: 10px;
}

.offcanvas-body::-webkit-scrollbar-thumb:hover {
	background: #011734;
}

a {
	text-decoration: none !important;
}

.menuFila {
	padding: 10px;
	padding-left: 40px;
	transition: all 0.5s ease-out;
	font-size: 1.1rem;
}

.menuFila:hover{
	background-color: #1e4b87;
	color: white;
	cursor: pointer;
	margin: 0 8px;
}

.menuFila i {
	font-size: 1.35rem;
}

.router-link-exact-active>.menuFila, .active>.menuFila {
	background-color: #011734;
	color: white;
	border-radius: 8px;
	margin: 0 8px;
}

/* Estilos para secciones del menú */
.menuSeccion {
	padding: 6px 10px;
	padding-left: 40px;
	font-size: 0.8rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	color: #023475;
	transition: all 0.3s ease-out;
	margin-top: 8px;
}

.menuSeccion:hover {
	background-color: #1e4b87;
	color: white;
	cursor: pointer;
	margin: 8px 8px 0 8px;
	border-radius: 6px;
}

.menuSeccionLink {
	text-decoration: none;
}

.menuSeccionLink .menuSeccion i {
	font-size: 1rem;
}

.menuFila-sub {
	padding-left: 55px !important;
	font-size: 0.95rem !important;
}

.menuFila-sub i {
	font-size: 1.1rem !important;
}

.menuSubItem {
	text-decoration: none;
}

/* Secciones en versión móvil */
.menuSeccion-mobile {
	padding: 8px 20px;
	padding-left: 30px;
	font-size: 0.8rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	color: #023475;
	display: block;
	transition: all 0.3s ease-out;
	margin-top: 6px;
}

.menuSeccion-mobile:hover {
	background-color: #023475;
	color: white;
}

.menuSeccion-mobile i {
	font-size: 1rem;
	margin-right: 8px;
}

.menuSubItem-mobile {
	padding-left: 50px !important;
}

/* Estilos para menú móvil */
.menuFila-mobile {
	padding: 12px 20px;
	padding-left: 30px;
	transition: all 0.3s ease-out;
	font-size: 1.1rem;
	color: #011734;
	display: block;
	cursor: pointer;
}

.menuFila-mobile:hover {
	background-color: #023475;
	color: white;
}

.menuFila-mobile i {
	font-size: 1.2rem;
	margin-right: 8px;
}

.menuFila-mobile.active {
	background-color: #011734;
	color: white;
	margin: 0 8px;
	border-radius: 8px;
}

.breadcrumb-item+.breadcrumb-item::before {
	font-family: bootstrap-icons !important;
	content: "\F285" !important
}

.tdLargo {
	white-space: nowrap;
}
</style>
