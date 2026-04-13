<script setup>
import { ref, watch } from 'vue';
import {useArchivoStore} from '@/stores/archivoStore'
import { useClienteStore } from '@/stores/clienteStore';
import { useProveedoresStore } from '@/stores/proveedorStore';
import { useVehiculosStore } from '@/stores/vehiculoStore';
import { useHospedajesStore } from '@/stores/hospedajeStore';

const props = defineProps(['modelo']) //'titulo', 'color'
const archivoStore = useArchivoStore()
const clienteStore = useClienteStore()
const proveedorStore = useProveedoresStore()
const vehiculoStore = useVehiculosStore()
const hospedajeStore = useHospedajesStore()

const archivo = ref(null)
const nombre = ref('')
const fileInput = ref(null);

const handleFile = (e) => {
  archivo.value = e.target.files[0]
}

const cargar = async ()=>{
	let resp = await archivoStore.subir(archivo.value)
	if(resp.mensaje == 'Archivo subido'){

		if(props.modelo == 'cliente'){
			clienteStore.clienteActual.archivos.unshift({
				'nombre': nombre.value,
				'link': resp.link
			})
			clienteStore.actualizarCliente(clienteStore.clienteActual)
		}
		if(props.modelo == 'proveedor'){
			proveedorStore.proveedorActual.archivos.unshift({
				'nombre': nombre.value,
				'link': resp.link
			})
			proveedorStore.actualizar(proveedorStore.proveedorActual.id, proveedorStore.proveedorActual)
		}
		if(props.modelo == 'vehiculo'){
			vehiculoStore.vehiculoActual.archivos.unshift({
				'nombre': nombre.value,
				'link': resp.link
			})
			vehiculoStore.actualizar(vehiculoStore.vehiculoActual.id, vehiculoStore.vehiculoActual)
		}
		if(props.modelo == 'hospedaje'){
			hospedajeStore.hospedajeActual.archivos.unshift({
				'nombre': nombre.value,
				'link': resp.link
			})
			hospedajeStore.actualizar(hospedajeStore.hospedajeActual.id, hospedajeStore.hospedajeActual)
		}

	}
	archivo.value = null
	nombre.value = ''
	fileInput.value.value = '';
}

</script>

<template>
	<div class="modal fade" id="modalSubirArchivo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header  border-0">
        <h1 class="modal-title fs-5" id="exampleModalLabel">📁 Subida de archivos</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Seleccione un archivo para subir</p>
				<p>Nombre del archivo:</p>
				<input type="text" class="form-control" v-model="nombre">
				<p><small>Se acepta: Word, Excel, PPT, PDF, Imágenes</small></p>
				<input type="file" class="form-control" ref="fileInput" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png" @change="handleFile">
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-outline-primary"  data-bs-dismiss="modal" @click="cargar()">Cargar archivo</button>
      </div>
    </div>
  </div>
</div>
</template>
