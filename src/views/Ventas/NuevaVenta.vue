<template>
	<h1>Nueva venta</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/proveedores">Ventas</a></li>
			<li class="breadcrumb-item active" aria-current="page">Nueva venta</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-10 mx-auto">
			<h5 class="mb-4"><strong>Datos básicos</strong></h5>
			<div class="card">
				<div class="card-body">
					<div class="row row-cols-4">
						<div class="col">
							<label for="usuario" class="form-label">Usuario</label>
							<input type="text" class="form-control" id="usuario" value="Úrsula" disabled>
						</div>
						<div class="col">
							<label for="usuario" class="form-label">Tipo</label>
							<select name="" id="sltTipo" class="form-select">
								<option value="1">Venta</option>
								<option value="2">Reserva</option>
							</select>
						</div>
						<div class="col">
							<label for="usuario" class="form-label">Método de pago</label>
							<select name="" id="sltTipo" class="form-select">
								<option value="1">Yape</option>
								<option value="2">Plin</option>
								<option value="3">Tarjeta</option>
								<option value="4">Depósito bancario</option>
							</select>
						</div>
						<div class="w-100"></div>
						<div class="col">
							<label for="txtDni" class="form-label">Dni / Ruc</label>
							<input type="text" class="form-control" id="txtDni" value="416901105">
						</div>
						<div class="col-8">
							<label for="txtDni" class="form-label">Razón social</label>
							<input type="text" class="form-control" id="txtDni" value="Inversiones Caja HuancayoS SRL" disabled>
						</div>
					</div>

				</div>
			</div>
			<div class="card">
				<div class="card-body">
					<div class="row row-cols-3">
						<div class="col">
							<label for="nacionalidad" class="form-label">Nacionalidad</label>
							<select name="nacionalidad" id="" class="form-select">
								<option value="1">Peruana</option>
								<option value="2">Extranjera</option>
							</select>
						</div>
						<div class="col">
							<label for="usuario" class="form-label">N° de pasajeros</label>
							<input type="number" class="form-control" id="usuario" value="1" >
						</div>
						<div class="col">
							<label for="txtFecha" class="form-label">Fecha inicial</label>
							<input type="date" class="form-control" id="txtFecha" value="2025-01-05">
						</div>
						<div class="col">
							<label for="txtFecha" class="form-label">Fecha final</label>
							<input type="date" class="form-control" id="txtFecha" value="2025-01-05">
						</div>
						
					</div>

				</div>
			</div>
			<div class="card">
				<div class="card-body">
					<div class="row">
						<div class="col">
							<label for="tservicio" class="form-label">Servicio</label>
							<select name="tservicio" id="" class="form-select" v-model="venta.idServicio">
								<option value="1">Tour</option>
								<option value="2">Paquete</option>
								<option value="3">Transporte</option>
								<option value="4">Vuelo</option>
								<option value="5">Alojamiento</option>
							</select>
						</div>
						<div class="col">
							<label for="servicio" class="form-label">Servicio</label>
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 1">
								<option value="1">Tour selva central</option>
								<option value="2">Tour valle del perené</option>
								<option value="3">Tour laguna</option>
							</select>
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 2">
								<option value="1">2d/1n Selva central primaveral</option>
								<option value="2">Año nuevo 2026 Huancayo</option>
								<option value="3">3d/2n Selva central huancayo</option>
							</select>
							
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 3">
								<option value="1">WF1-256 - Bus interprovincial</option>
								<option value="2">HMR-178 - Taxi privado</option>
							</select>
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 4">
								<option value="1">JetSmart Airlines</option>
								<option value="2">Kayak</option>
								<option value="3">Latam Airlines</option>
							</select>
							<select name="tservicio" id="" class="form-select" v-if="venta.idServicio == 5">
								<option value="1">Hotel Mil Maravillas</option>
								<option value="2">Hospedaje El Virrey</option>
								<option value="3">Hostal La casa de Juana</option>
							</select>
						</div>
					</div>
					<div class="row" v-if="['3','4', '5'].includes(venta.idServicio)">
						<div class="col">
							<label for="ciudad" class="form-label">Ciudad</label>
							<select name="" class="form-select" id="sltCiudad">
								<option v-for="ciudad in ciudades" value="ciudad">{{ ciudad }}</option>
							</select>
						</div>
						<div class="col">
							<label for="ciudad" class="form-label">Requisito especial</label>
							<input type="text" class="form-control">
						</div>
					</div>
					<div class="row row-cols-2" v-if="['3','4'].includes(venta.idServicio)">
						
						<div class="col">
							<label for="lugarSalida" class="form-label">Origen</label>
							<input type="text" class="form-control">
						</div>
						<div class="col">
							<label for="lugarLlegada" class="form-label">Destino</label>
							<input type="text" class="form-control">
						</div>
						<div class="col">
							<label for="fechaSalida" class="form-label">Fecha de salida</label>
							<input type="date" class="form-control">
						</div>
						<div class="col">
							<label for="fechaLlegada" class="form-label">Fecha de llegada</label>
							<input type="date" class="form-control">
						</div>
						<div class="col">
							<label for="horaSalida" class="form-label">Hora de salida</label>
							<input type="time" class="form-control">
						</div>
						<div class="col">
							<label for="horaLlegada" class="form-label">Hora de llegada</label>
							<input type="time" class="form-control">
						</div>
						<div class="col">
							<label for="precio" class="form-label">Precio (S/)</label>
							<input type="number" class="form-control">
						</div>
						<div class="col">
							<label for="precio" class="form-label">Precio ($)</label>
							<input type="number" class="form-control">
						</div>

					</div>
					<div class="row row-cols-2"  v-if="['5'].includes(venta.idServicio)">
						<div class="col">
							<label for="fechaSalida" class="form-label">Fecha de llegada</label>
							<input type="date" class="form-control">
						</div>
						<div class="col">
							<label for="fechaLlegada" class="form-label">Fecha de salida</label>
							<input type="date" class="form-control">
						</div>
						<div class="col">
							<label for="horaSalida" class="form-label">Hora de salida</label>
							<input type="time" class="form-control">
						</div>
						<div class="col">
							<label for="horaLlegada" class="form-label">Hora de llegada</label>
							<input type="time" class="form-control">
						</div>
						<div class="col">
							<label for="precio" class="form-label">Precio (S/)</label>
							<input type="number" class="form-control">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary">Aperturar nueva caja</button>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { ref } from 'vue';
	const ciudades = ["Abancay", "Andahuaylas", "Arequipa", "Chincha", "Cusco", "Huancavelica", "Ayacucho", "Cajamarca", "Callao", "Cerro de Pasco", "Chachapoyas", "Chiclayo", "Huancayo", "Huánuco", "Huaraz", "Ica", "Iquitos", "Jauja", "Juliaca", "Puerto Maldonado", "La Merced", "Lima", "Moquegua", "Nazca", "Охаратра", "Pichanaqui", "Piura", "Pucallpa", "Puno", "Satipo", "Tacna", "Tarapoto", "Tarma", "Tingo María", "Trujillo", "Tumbes"];
	const venta = ref({
		idServicio:1
	})
</script>
<style scoped>
.card, .card  .col{
	margin-bottom: 20px;
}
</style>