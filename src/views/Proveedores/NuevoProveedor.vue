<script setup>
import { onMounted, reactive } from 'vue'
import { useProveedoresStore } from '@/stores/proveedorStore'
import { useDepartamentosStore } from '@/stores/departamentoStore';
import Swal from 'sweetalert2'

const proveedorStore = useProveedoresStore()
const departamentosStore = useDepartamentosStore();
const nuevo = reactive({
	id: null,
	ruc: '',
	razon_social: '',
	direccion: '',
	ciudad:'',
	contacto: '',
	celular: '',
	cuenta_bancaria: '',
	numero_cuenta: '',
	aplicativo: '',
	propietario_aplicativo: '',
	categoria: 'local',
	departamento_id: ''
})

function  guardar(){
	if(nuevo.ruc == '' || nuevo.razon_social == ''){
		Swal.fire('Error', 'Por favor complete todos los campos obligatorios', 'error')
		return
	}
	
	proveedorStore.guardar(nuevo)
		.then( resp => {
			if(parseInt(resp.id) > 0)
				Swal.fire('Proveedor creado', `El proveedor ${nuevo.razon_social} ha sido creado`, 'success')
			.then(() => {
				window.location.href = '/proveedor/perfil/'+resp.id
			})
			else
				Swal.fire('Error', 'Error al crear proveedor', 'error')
		})
		.catch( error => {
			console.error(error)
			Swal.fire('Error', 'Error al crear proveedor', 'error')
		})
}

onMounted(() => {
	departamentosStore.listar();
});
</script>
<template>
	<h1>Nuevo Proveedor</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/proveedores">Proveedores</a></li>
			<li class="breadcrumb-item active" aria-current="page">Nuevo</li>
		</ol>
	</nav>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos del proveedor</strong></h5>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="ruc" class="form-label">R.U.C. <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="ruc" v-model="nuevo.ruc">
						</div>
						<div class="col-md-6">
							<label for="razonSocial" class="form-label">Razón Social <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="razonSocial" v-model="nuevo.razon_social">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="categoria" class="form-label">Categoría</label>
							<select class="form-select" id="categoria" v-model="nuevo.categoria">
								<option value="alojamiento">Alojamiento</option>
								<option value="transporte">Transporte</option>
								<option value="restaurant">Restaurant</option>
								<option value="local">Local</option>
								<option value="agencia">Agencia</option>
								<option value="guía">Guía</option>
							</select>
						</div>
						<div class="col-md-6">
							<label for="contacto" class="form-label">Contacto</label>
							<input type="text" class="form-control" id="contacto" v-model="nuevo.contacto">
						</div>
						<div class="col-md-6">
							<label for="departamento" class="form-label">Departamento</label>
							<select class="form-select" id="departamento" v-model="nuevo.departamento_id">
								<option value="">Seleccione departamento</option>
								<option v-for="dep in departamentosStore.departamentos" :key="dep.id" :value="dep.id">
									{{ dep.departamento }}
								</option>
							</select>
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="direccionEmpresa" class="form-label">Dirección</label>
							<input type="text" class="form-control" id="direccionEmpresa" v-model="nuevo.direccion">
						</div>
						<div class="col-md-6">
							<label for="ciudad" class="form-label">Ciudad</label>
							<input type="text" class="form-control" id="ciudad" v-model="nuevo.ciudad">
						</div>
						<div class="col-md-6">
							<label for="celularEmpresa" class="form-label">Celular</label>
							<input type="tel" class="form-control" id="celularEmpresa" v-model="nuevo.celular">
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
					<h5 class="mb-4"><strong>Documentación</strong></h5>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="banco" class="form-label">Banco / Cuenta</label>
							<select class="form-select" id="banco" v-model="nuevo.banco">
								<option value="" selected>Ninguno</option>
								<option >Banco de la Nación</option>
								<option >BBVA</option>
								<option >BCP</option>
								<option >BIF</option>
								<option >Caja Arequipa</option>
								<option >Caja Cusco</option>
								<option >Caja Huancayo</option>
								<option >Interbank</option>
								<option >Scotiabank</option>
								<option >Otro</option>
							</select>
						</div>
						<div class="col-md-6">
							<label for="cuentaBanacaria" class="form-label">Número de cuenta</label>
							<input type="text" class="form-control" id="cuentaBanacaria" v-model="nuevo.numero_cuenta">
						</div>
						<div class="col-md-6">
							<label for="aplicativo" class="form-label">Aplicativo</label>
							<input type="text" class="form-control" id="aplicativo" v-model="nuevo.aplicativo">
						</div>
						<div class="col-md-6">
							<label for="propietarioAplicativo" class="form-label">Propietario del aplicativo</label>
							<input type="text" class="form-control" id="propietarioAplicativo" v-model="nuevo.propietario_aplicativo">
						</div>
						<div class="col-md-6 my-3">
							<label for="cuentaBanacaria" class="form-label">Datos extras:</label>
							<input type="text" class="form-control" id="cuenObservaciones" v-model="nuevo.observaciones">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary" @click="guardar()">Generar nuevo proveedor</button>
			</div>
		</div>
	</div>
</template>
