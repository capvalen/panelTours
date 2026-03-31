<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useClienteStore } from '@/stores/clienteStore'
import Swal from 'sweetalert2'

const route = useRoute() //instancia hacia la ruta
const clienteStore = useClienteStore()

const nuevo = reactive({})

const cargarDatos = async ()=>{
	await clienteStore.obtenerClienteId(route.params.id)	
	Object.assign(nuevo, clienteStore.clienteActual) //copiar los datos del cliente actual al objeto reactivo nuevo
}

onMounted(()=>{ //al cargar la pagina
	cargarDatos()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
	}
, { immediate: true })



function agregarVacuna() {
	//verificar si el último certificado tiene fecha antes de agregar
	const ultimaVacuna = nuevo.vacunas[nuevo.vacunas.length - 1]
	if (ultimaVacuna && (!ultimaVacuna.certificado)) return
	nuevo.vacunas.push({ certificado: '', fecha: null })
}
function agregarSeguro() {
	//verificar si el último seguro tiene fecha antes de agregar
	const ultimoSeguro = nuevo.seguros[nuevo.seguros.length - 1]
	if (ultimoSeguro && (!ultimoSeguro.seguro)) return
	nuevo.seguros.push({ seguro: '', fecha: null })
}
async function  guardarCliente() {
	if(nuevo.dni == '' && nuevo.ruc == '' ){
		Swal.fire('Faltan datos', 'Complete los campos de DNI o RUC', 'error')
		return
	}
	if(nuevo.dni && nuevo.apellidos == '' ){
		Swal.fire('Faltan datos', 'Complete el campo de apellidos', 'error')
		return
	}
	if(nuevo.ruc && nuevo.razon_social == '' ){
		Swal.fire('Faltan datos', 'Complete el campo de razón social', 'error')
		return
	}
	const resp = await clienteStore.actualizarCliente(nuevo)
	if(await resp)
		Swal.fire('Cliente actualizado', 'Los datos del cliente han sido actualizados', 'success')
	else
		Swal.fire('Error', 'Error al actualizar cliente', 'error')
}
const cambioVisado = () => {
  if (nuevo.visado === 'no') {
    nuevo.tipo_visado = 'ninguno';
  }
  // Si es 'si', no modificamos tipo_visado
};

</script>
<template>
	<h1>Actualizar Cliente</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/clientes">Clientes</a></li>
			<li class="breadcrumb-item active" aria-current="page">Actualizar</li>
		</ol>
	</nav>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos del cliente</strong></h5>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="nacionalidad" class="form-label">Nacionalidad</label>
							<select class="form-select" id="nacionalidad" v-model="nuevo.nacionalidad">
								<option value="peruano">Peruano</option>
								<option value="extranjero">Extranjero</option>
							</select>
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="dni" class="form-label">DNI</label>
							<input type="text" class="form-control" id="dni" v-model="nuevo.dni" required>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="apellidos" class="form-label">Apellidos</label>
							<input type="text" class="form-control" id="apellidos" v-model="nuevo.apellidos" required>
						</div>
						<div class="col-md-6">
							<label for="nombres" class="form-label">Nombres</label>
							<input type="text" class="form-control" id="nombres" v-model="nuevo.nombres" required>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="ruc" class="form-label">RUC</label>
							<input type="text" class="form-control" id="ruc" v-model="nuevo.ruc" required>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="razon_social" class="form-label">Razón social</label>
							<input type="text" class="form-control" id="razon_social" v-model="nuevo.razon_social" required>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
							<input type="date" class="form-control" id="fechaNacimiento" v-model="nuevo.fecha_nacimiento" required>
						</div>
						<div class="col-md-6">
							<label for="correo" class="form-label">Correo</label>
							<input type="email" class="form-control" id="correo" v-model="nuevo.correo" required>
						</div>
					</div>

					<div class="row mb-3">

						<div class="col-md-6">
							<label for="celular" class="form-label">Celular</label>
							<input type="tel" class="form-control" id="celular" v-model="nuevo.celular" required>
						</div>
						<div class="col-md-6">
							<label for="telefono" class="form-label">Teléfono</label>
							<input type="tel" class="form-control" id="telefono" v-model="nuevo.telefono">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="direccion" class="form-label">Dirección</label>
							<input type="text" class="form-control" id="direccion" v-model="nuevo.direccion" required>
						</div>
						<div class="col-md-6">
							<label for="pais_origen" class="form-label">
								<span v-if="nuevo.nacionalidad === 'peruano'">Ciudad</span>
								<span v-else>País de origen</span>
							</label>
							<input type="text" class="form-control" id="pais_origen" v-model="nuevo.pais_origen" required>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row my-2">
		<div class="col col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Documentación y Seguridad</strong></h5>

					<div class="row mb-3">
						<div class="col-md-4">
							<label for="pasaporte" class="form-label">Visado</label>
							<select name="" id="visado" class="form-select" v-model="nuevo.visado" @change="cambioVisado()">
								<option>Si</option>
								<option>No</option>
							</select>
						</div>
						<div class="col-md-3">
							<label for="pasaporte" class="form-label">Tipo de visado</label>
							<select name="" id="tipo_visado" class="form-select" v-model="nuevo.tipo_visado">
								<option value="ninguno">Ninguno</option>
								<option value="adopción">Adopción</option>
								<option value="diplomático">Diplomático</option>
								<option value="estudiante">Estudiante</option>
								<option value="familiar">Familiar</option>
								<option value="freelance">Freelance</option>
								<option value="humanitario">Humanitario</option>
								<option value="militar">Militar</option>
								<option value="oficial">Oficial</option>
								<option value="trabajo">Trabajo</option>
								<option value="turista">Turista</option>
								<option value="visitante">Visitante</option>
							</select>
						</div>
						<div class="col-md-8">
							<label for="pasaporte" class="form-label">Fecha de visado</label>
							<input type="text" class="form-control" id="fecha_visa" v-model="nuevo.valido_visa" placeholder="Válido hasta">
						</div>
						<div class="col-md-8">
							<label for="pasaporte" class="form-label">Pasaporte</label>
							<input type="text" class="form-control" id="pasaporte" v-model="nuevo.pasaporte">
						</div>
						<div class="col-md-4">
							<label for="vigenciaPasaporte" class="form-label">Vigencia del pasaporte</label>
							<input type="date" class="form-control" id="vigenciaPasaporte" v-model="nuevo.vigencia_pasaporte">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-8">
							<label for="tipoVisado" class="form-label">Tipo de Visado</label>
							<input type="text" class="form-control" id="tipoVisado" v-model="nuevo.tipo_visado">
						</div>
						<div class="col-md-4">
							<label for="vigenciaVisado" class="form-label">Válido hasta</label>
							<input type="date" class="form-control" id="vigenciaVisado" v-model="nuevo.valido_visa">
						</div>
					</div>

					<div class="my-4">
						<div class="d-flex justify-content-between">
							<label for="vacunacion" class="form-label">Vacunación</label>
							<button class="btn btn-outline-secondary" @click="agregarVacuna()"><i class="bi bi-plus-lg"></i> Agregar
								vacuna</button>
						</div>
						<div class="row my-2" v-for="(vacuna, index) in nuevo.vacunas" :key="index">
							<div class="col ">
								<div class="d-flex align-items-center gap-2">
									<span class="">{{ index + 1 }}. </span>
									<input type="text" class="form-control" :id="'vacuna' + index" v-model="vacuna.certificado"
										placeholder="Certificado de vacuna">
								</div>
							</div>
							<div class="col">
								<input type="date" class="form-control" :id="'vacuna_fecha' + index" v-model="vacuna.fecha"
									placeholder="Fecha de vacuna">
							</div>

						</div>
					</div>
					<div class="my-4">
						<div class="d-flex justify-content-between">
							<label for="vacunacion" class="form-label">Seguros</label>
							<button class="btn btn-outline-secondary" @click="agregarSeguro()"><i class="bi bi-plus-lg"></i> Agregar
								seguro</button>
						</div>
						<div class="row my-2" v-for="(seguro, index) in nuevo.seguros" :key="index">
							<div class="col ">
								<div class="d-flex align-items-center gap-2">
									<span class="">{{ index + 1 }}. </span>
									<input type="text" class="form-control" :id="'seguro' + index" v-model="seguro.seguro"
										placeholder="¿Qué seguro es?">
								</div>
							</div>
							<div class="col">
								<input type="date" class="form-control" :id="'seguro_fecha' + index" v-model="seguro.fecha"
									placeholder="Fecha del seguro">
							</div>

						</div>
					</div>



					<div class="mb-3">
						<label for="autorizacionViaje" class="form-label">Autorización de viaje</label>
						<select class="form-select" id="autorizacionViaje" v-model="nuevo.autorizacion_viaje">
							<option value="no aplica">No aplica</option>
							<option value="no presentó">No presentó</option>
							<option value="no">Sin autorización</option>
							<option value="si">Sí</option>
						</select>
					</div>


				</div>
			</div>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary" @click="guardarCliente()">Actualizar cliente</button>
			</div>
		</div>
	</div>
</template>