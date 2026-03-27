import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		/* {
			path: '/',
			name: 'home',
			component: HomeView,
		}, */
		{
			path: '/login',
			name: 'login',
			component: LoginView,
			meta: { requiresGuest: true } // Solo accesible si no está autenticado
		},
		{
			path: '/',
			component: () => import('@/views/layouts/MainLayout.vue'),
			meta: { requiresAuth: true }, // Requiere autenticación
			children: [
				{
					path: '/dashboard',
					name: 'dashboard',
					component: () => import('@/views/Inicio.vue'),
					//component: () => import('@/views/Inicio.vue'),
					meta: { requiresAuth: true }
				},
				{
					path: '/clientes',
					name: 'Clientes',
					component: () => import('../views/Clientes/ClientesView.vue'),
				},
				{
					path: '/cliente/nuevo',
					name: 'nuevoCliente',
					component: () => import('../views/Clientes/NuevoCliente.vue'),
				},
				{
					path: '/cliente/perfil/:id',
					name: 'perfilCliente',
					component: () => import('../views/Clientes/PerfilCliente.vue'),
					props: true
				},
				{
					path: '/proveedores',
					name: 'Proveedores',
					component: () => import('../views/Proveedores/ProveedoresView.vue'),
				},
				{
					path: '/proveedor/perfil/:id',
					name: 'perfilProveedor',
					component: () => import('../views/Proveedores/PerfilProveedor.vue'),
					props: true
				},
				{
					path: '/proveedor/nuevo',
					name: 'nuevoProveedor',
					component: () => import('../views/Proveedores/NuevoProveedor.vue'),
				},
				{
					path: '/cajas',
					name: 'Cajas',
					component: () => import('../views/Cajas/CajasView.vue'),
				},
				{
					path: '/caja/detalle/:id',
					name: 'detalleCaja',
					component: () => import('../views/Cajas/DetalleCaja.vue'),
					props: true
				},
				{
					path: '/caja/nueva',
					name: 'nuevaCaja',
					component: () => import('../views/Cajas/NuevaCaja.vue'),
				},
				{
					path: '/tarifario',
					name: 'Tarifario',
					component: () => import('../views/Tarifario/Tarifario.vue'),
				},
				{
					path: '/ventas',
					name: 'Ventas',
					component: () => import('../views/Ventas/VentasView.vue'),
				},
				{
					path: '/venta/detalle/:id',
					name: 'detalleVenta',
					component: () => import('../views/Ventas/DetalleVenta.vue'),
					props: true
				},
				{
					path: '/venta/nueva',
					name: 'nuevaVenta',
					component: () => import('../views/Ventas/NuevaVenta.vue'),
				},
			]
		},

	],
})

// Guardia de navegación global
router.beforeEach((to, from, next) => {
	const authStore = useAuthStore()
	const isAuthenticated = authStore.isAuthenticated

	// Si la ruta requiere autenticación y el usuario no está autenticado
	if (to.meta.requiresAuth && !isAuthenticated) {
		next('/login')
	}
	// Si la ruta es solo para invitados y el usuario está autenticado
	else if (to.meta.requiresGuest && isAuthenticated) {
		next('/dashboard')
	}
	else {
		next()
	}
})

export default router
