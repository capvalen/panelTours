<template>
	<div class="container-fluid">
		<div class="row row-cols-2">
			<div class="col col-md-3 col-lg-2  p-0" id="rowMenu">
				<div id="logo" class="w-100 my-4">
					<img src="@/assets/logo.webp" class="w-75 mx-auto d-block">
				</div>
				<div class="menuFila"><i class="bi bi-house"></i> Inicio</div>
				<router-link to="/clientes">
					<div class="menuFila"><i class="bi bi-wechat"></i> Clientes</div>
				</router-link>
				<router-link to="/proveedores">
					<div class="menuFila"><i class="bi bi-truck"></i> Proveedores</div>
				</router-link>
				<router-link to="/cajas">
					<div class="menuFila"><i class="bi bi-piggy-bank"></i> Caja</div>
				</router-link>
				<div class="menuFila"><i class="bi bi-cart"></i> Ventas</div>
				<div class="menuFila"><i class="bi bi-ticket-perforated"></i> Reservas</div>
				<div class="menuFila"><i class="bi bi-journal-bookmark"></i> Control de pagos</div>
				<div class="menuFila"><i class="bi bi-stars"></i> Recordatorios</div>
				<div class="menuFila"><i class="bi bi-stickies"></i> Reportes</div>
				<div class="menuFila"><i class="bi bi-gear"></i> Configuración</div>
				<div class="menuFila"><i class="bi bi-door-open"></i> Salir</div>
			</div>
			<div class="col col-md-9 col-lg-10 pt-3">
				<router-view class="container"></router-view>
			</div>

		</div>

	</div>
</template>

<script>
export default {
  name: 'ModalExample',
  methods: {
    handleConfirm() {
      alert('¡Has hecho clic en Aceptar!')
      // Cierra el modal manualmente (opcional, ya que el botón de "Cerrar" ya lo hace)
      const modal = document.getElementById('exampleModal')
      const bootstrapModal = bootstrap.Modal.getInstance(modal)
      bootstrapModal.hide()
    }
  }
}
</script>
<style>
#rowMenu{
	background-color: #E6FBFF;
	min-height: 100vh;
	border-radius: 0 20px 20px 0;
	color:#011734;
}
a{
	text-decoration: none!important;
}
.menuFila{
	padding: 10px;
	padding-left: 40px;
	transition: all 0.5s ease-out;
	font-size: 1.2rem;
}
.menuFila:hover{
	background-color: #011734;
	color: white;
	cursor:pointer
}
.menuFila i{
	font-size: 1.35rem;
}
.breadcrumb-item + .breadcrumb-item::before {
	font-family:bootstrap-icons !important ;
	content:"\F285"!important
}
</style>