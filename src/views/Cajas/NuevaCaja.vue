<script setup>
import { useRouter } from 'vue-router'
import { useCajaStore } from '@/stores/cajaStore';
import { onMounted } from 'vue';
import { useFormat } from '@/composables/formatos'
const {formatHoy, formatMoneda} = useFormat()

const cajaStore = useCajaStore()
const router = useRouter()

const usuario = JSON.parse(localStorage.getItem('user'))
const cajaNueva = {
	fecha_apertura: formatHoy(),
	monto_inicial: 0,
	observaciones: '',
	usuario_id: usuario.id
}

onMounted(() => {
	//cajaStore.obtenerCajaId(router)
});

async function aperturar(){
	const id = await cajaStore.aperturarCaja(cajaNueva)
	router.push(`/caja/detalle/${id}`)
}

</script>
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
							<input type="text" class="form-control" id="usuario" :value="usuario.nombre" disabled>
						</div>
						<div class="col-md-6">
							<label for="fecha" class="form-label">Fecha</label>
							<input type="date" class="form-control" id="fecha" v-model="cajaNueva.fecha_apertura" disabled>
						</div>
						<div class="col-md-6 mt-3">
							<label for="fecha" class="form-label">Monto de apertura</label>
							<input type="text" class="form-control" id="monto" v-model="cajaNueva.monto_inicial" min="0">
						</div>
						<div class="col-md-6 mt-3">
							<label for="observacion" class="form-label">Observación</label>
							<input type="text" class="form-control" id="observacion" v-model="cajaNueva.observaciones">
						</div>
					</div>


				</div>
			</div>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary" @click="aperturar()">Aperturar nueva caja</button>
			</div>
		</div>
	</div>
</template>