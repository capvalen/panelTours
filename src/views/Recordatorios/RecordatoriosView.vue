<script setup>
import { useRecordatoriosStore } from '@/stores/recordatoriosStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const recordatoriosStore = useRecordatoriosStore();
const { recordatorios } = storeToRefs(recordatoriosStore);

onMounted(() => {
	recordatoriosStore.listar()
})
</script>
<template>
	<h1>Recordatorios</h1>
	<p>2 pendientes · <span class="text-danger">1 vencido</span></p>
	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="" >
							</div>
						</div>
						<div class="col-2">
							<button class="btn btn-outline-secondary" ><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col d-flex justify-content-center">
							<router-link to="/proveedor/nuevo" class="btn btn-outline-primary"><i class="bi bi-star"></i> Nuevo
								proveedor</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<p v-for="recordatorio in recordatorios" :key="recordatorio.id">
		{{ recordatorio.titulo }}
	</p>
</template>