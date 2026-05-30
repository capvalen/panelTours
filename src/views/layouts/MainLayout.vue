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
			<div class="d-none d-md-block p-0 sidebar-wrapper" :style="{ width: collapsed ? '60px' : '250px' }">
				<div id="rowMenu" :class="{ collapsed: collapsed }">
				<div id="logo" class="my-4 mx-auto" :class="collapsed ? 'w-75' : 'w-75'">
					<img src="@/assets/logo.webp" class="w-75 mx-auto d-block">
				</div>

				<div class="menuFila d-flex align-items-center gap-2" @click="collapsed = !collapsed" :title="collapsed ? 'Expandir menú' : 'Colapsar menú'" style="font-size:0.75rem; color:#64748b;">
					<i :class="collapsed ? 'bi bi-arrow-right' : 'bi bi-arrow-left'"></i>
					<span v-show="!collapsed" class="small">Ocultar panel</span>
				</div>

				<!-- SECCIÓN: Inicio -->
				<router-link to="/dashboard">
					<div class="menuFila" :class="{ collapsed: collapsed }"><i class="bi bi-house"></i> <span v-show="!collapsed">Inicio</span></div>
				</router-link>
				<router-link to="/cotizaciones" :class="{ active: $route.path.startsWith('/cotizacion') }">
					<div class="menuFila" :class="{ collapsed: collapsed }"><i class="bi bi-file-text"></i> <span v-show="!collapsed">Cotizaciones</span></div>
				</router-link>
				<router-link to="/ventas" :class="{ active: $route.path.startsWith('/venta') }">
					<div class="menuFila" :class="{ collapsed: collapsed }"><i class="bi bi-cart"></i> <span v-show="!collapsed">Ventas</span></div>
				</router-link>
				<router-link to="/logistica" :class="{ active: $route.path.startsWith('/logistica') }">
					<div class="menuFila" :class="{ collapsed: collapsed }"><i class="bi bi-truck"></i> <span v-show="!collapsed">Logística</span></div>
				</router-link>
				<router-link to="/cajas" :class="{ active: $route.path.startsWith('/caja') }">
					<div class="menuFila" :class="{ collapsed: collapsed }"><i class="bi bi-piggy-bank"></i> <span v-show="!collapsed">Caja</span></div>
				</router-link>
				
				<!-- Tarifario -->
				<router-link to="/tarifario">
					<div class="menuFila" :class="{ collapsed: collapsed }"><i class="bi bi-tag"></i> <span v-show="!collapsed">Tarifario</span></div>
				</router-link>

				<!-- SECCIÓN: Configuraciones (desplegable) -->
				<div class="menuSeccion" :class="{ collapsed: collapsed }" style="cursor:pointer;" @click="!collapsed && toggleConfig()">
					<i class="bi bi-gear"></i> <span v-show="!collapsed">Configuraciones <i class="bi" :class="configOpen ? 'bi-chevron-up' : 'bi-chevron-down'" style="float:right;margin-right:20px;"></i></span>
				</div>
				<transition name="slide">
					<div v-if="configOpen && !collapsed">
						<router-link to="/configuraciones" class="menuSubItem">
							<div class="menuFila menuFila-sub"><i class="bi bi-gear"></i> Usuarios</div>
						</router-link>
						<router-link to="/clientes" class="menuSubItem">
							<div class="menuFila menuFila-sub"><i class="bi bi-wechat"></i> Clientes</div>
						</router-link>
						<router-link to="/guias" class="menuSubItem">
							<div class="menuFila menuFila-sub"><i class="bi bi-people"></i> Guías</div>
						</router-link>
						<router-link to="/vehiculos" class="menuSubItem">
							<div class="menuFila menuFila-sub"><i class="bi bi-truck"></i> Vehículos</div>
						</router-link>
						<router-link to="/hospedajes" class="menuSubItem">
							<div class="menuFila menuFila-sub"><i class="bi bi-building"></i> Hospedajes</div>
						</router-link>
						<router-link to="/recordatorios" class="menuSubItem">
							<div class="menuFila menuFila-sub"><i class="bi bi-stars"></i> Recordatorios</div>
						</router-link>
					</div>
				</transition>

				<div class="menuFila d-none"><i class="bi bi-stickies"></i> <span>Reportes</span></div>
				<a href="#!">
					<div class="menuFila" :class="{ collapsed: collapsed }" @click="logout()"><i class="bi bi-door-open"></i> <span v-show="!collapsed">Salir</span></div>
				</a>
			</div>
			</div>

			<!-- Sidebar offcanvas para móvil -->
			<div class="offcanvas offcanvas-start d-md-none" tabindex="-1" id="sidebarMenu" style="background: linear-gradient(180deg, #3b82f6 0%, #bfdbfe 50%, #bae6fd 100%); color: #1e293b; width: 100%; max-width: 100%;">
				<div class="offcanvas-header">
					<img src="@/assets/logo.webp" alt="Logo" style="height: 40px;" data-bs-dismiss="offcanvas">
					<button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
				</div>
				<div class="offcanvas-body p-0" style="overflow-y: auto; height: calc(100vh - 60px);">
					<!-- SECCIÓN: Inicio -->
					<router-link to="/dashboard" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-house"></i> Inicio
					</router-link>

					<router-link to="/cotizaciones" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-file-text"></i> Cotizaciones
					</router-link>
					<router-link to="/ventas" :class="{ active: $route.path.startsWith('/venta') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-cart"></i> Ventas
					</router-link>
					<router-link to="/logistica" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-truck"></i> Logística
					</router-link>

					<!-- Tarifario -->
					<router-link to="/tarifario" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-tag"></i> Tarifario
					</router-link>

					<!-- SECCIÓN: Caja -->
					<router-link to="/cajas" :class="{ active: $route.path.startsWith('/caja') }" class="menuFila-mobile" @click="closeOffcanvas">
						<i class="bi bi-piggy-bank"></i> Caja
					</router-link>

					<!-- SECCIÓN: Configuraciones (desplegable) -->
					<div class="menuSeccion-mobile" style="cursor:pointer;" @click="configOpen = !configOpen">
						<i class="bi bi-gear"></i> Configuración general <i class="bi" :class="configOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
					</div>
					<transition name="slide">
						<div v-if="configOpen">
							<router-link to="/configuraciones" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
								<i class="bi bi-gear"></i> Configuraciones
							</router-link>
						<router-link to="/clientes" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
							<i class="bi bi-wechat"></i> Clientes
						</router-link>
						<router-link to="/guias" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
							<i class="bi bi-people"></i> Guías
						</router-link>
						<router-link to="/vehiculos" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
							<i class="bi bi-truck"></i> Vehículos
						</router-link>
						<router-link to="/hospedajes" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
							<i class="bi bi-building"></i> Hospedajes
						</router-link>
						<router-link to="/recordatorios" class="menuFila-mobile menuSubItem-mobile" @click="closeOffcanvas">
							<i class="bi bi-stars"></i> Recordatorios
						</router-link>
						</div>
					</transition>

					<!-- LÍNEA DIVISORIA -->
					<hr class="my-2 mx-3">

					<div class="menuFila-mobile d-none"><i class="bi bi-stickies"></i> Reportes</div>
					<div class="menuFila-mobile" @click="logout()"><i class="bi bi-door-open"></i> Salir</div>
				</div>
			</div>

			<!-- Contenido principal -->
			<div class="col pt-3">
				<router-view class="container-fluid"></router-view>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Offcanvas } from 'bootstrap';
import { ref, onMounted } from 'vue'
import { useFormat } from '@/composables/formatos'
const { consultarApiDolar } = useFormat()
const router = useRouter()

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore()

const configOpen = ref(false)
const collapsed = ref(false)
function toggleConfig() {
	configOpen.value = !configOpen.value
}

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
	background: linear-gradient(180deg, #3b82f6 0%, #bfdbfe 50%, #bae6fd 100%);
	height: 100vh;
	position: sticky;
	top: 0;
	border-radius: 0 20px 20px 0;
	color: #1e293b;
	overflow-y: auto;
	overflow-x: hidden;
	scrollbar-color: #3b82f6 #bfdbfe;
	width: 100%;
}

#rowMenu.collapsed {
	border-radius: 0 12px 12px 0;
}

#rowMenu.collapsed .menuFila {
	padding: 10px 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

#rowMenu.collapsed .menuSeccion {
	padding: 6px 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

#rowMenu.collapsed .menuFila i {
	margin: 0;
	font-size: 1.5rem;
}

#rowMenu::-webkit-scrollbar {
	width: 1px;
}

#rowMenu::-webkit-scrollbar-track {
	background: transparent;
	padding: 0 2px;
}

#rowMenu::-webkit-scrollbar-thumb {
	background: #3b82f6;
	border-radius: 10px;
}

#rowMenu::-webkit-scrollbar-thumb:hover {
	background: #2563eb;
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
	background: #3b82f6;
	border-radius: 10px;
}

.offcanvas-body::-webkit-scrollbar-thumb:hover {
	background: #2563eb;
}

a {
	text-decoration: none !important;
}

.menuFila {
	padding: 10px;
	padding-left: 40px;
	transition: all 0.3s ease-out;
	font-size: 1.1rem;
	color: #334155;
}

.menuFila:hover{
	background-color: rgba(59,130,246,0.1);
	color: #1d4ed8;
	cursor: pointer;
}

.menuFila i {
	font-size: 1.35rem;
}

.router-link-exact-active>.menuFila, .active>.menuFila {
	background: #3b82f6;
	color: white;
	border-radius: 8px;
	margin: 0 8px;
}

/* Estilos para secciones del menú */
.menuSeccion {
	padding: 6px 10px;
	padding-left: 40px;
	font-size: 0.72rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: #3b82f6;
	transition: all 0.3s ease-out;
	margin-top: 8px;
}

.menuSeccion:hover {
	color: #1d4ed8;
	cursor: pointer;
}

.menuSeccion-estatico {
	padding: 6px 10px;
	padding-left: 40px;
	font-size: 0.72rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: #3b82f6;
	margin-top: 8px;
	user-select: none;
	cursor: default;
	pointer-events: none;
}

.menuSeccion-estatico i {
	font-size: 1rem;
}

.menuFila-sub {
	padding-left: 55px !important;
	font-size: 0.95rem !important;
	color: #64748b !important;
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
	color: #3b82f6;
	display: block;
	transition: all 0.3s ease-out;
	margin-top: 6px;
}

.menuSeccion-mobile:hover {
	color: #1d4ed8;
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
	color: #334155;
	display: block;
	cursor: pointer;
}

.menuFila-mobile:hover {
	background-color: rgba(59,130,246,0.1);
	color: #1d4ed8;
}

.menuFila-mobile i {
	font-size: 1.2rem;
	margin-right: 8px;
}

.menuFila-mobile.active {
	background: #3b82f6;
	color: white;
	border-radius: 8px;
}

.breadcrumb-item+.breadcrumb-item::before {
	font-family: bootstrap-icons !important;
	content: "\F285" !important
}

.tdLargo {
	white-space: nowrap;
}

.slide-enter-active, .slide-leave-active {
	transition: all 0.3s ease;
	overflow: hidden;
	display: block;
}
.slide-enter-from {
	opacity: 0;
	max-height: 0;
}
.slide-enter-to {
	opacity: 1;
	max-height: 200px;
}
.slide-leave-from {
	opacity: 1;
	max-height: 200px;
}
.slide-leave-to {
	opacity: 0;
	max-height: 0;
}

.sidebar-wrapper {
	transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	overflow: hidden;
	flex-shrink: 0;
}
</style>
