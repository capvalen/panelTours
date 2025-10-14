import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Inicio.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/clientes',
			name: 'Clientes',
			component: () => import('../views/Clientes/ClientesView.vue'),
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
	],
})

export default router
