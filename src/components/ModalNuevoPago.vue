<script setup>
import { ref, onMounted } from 'vue';

const form = ref({
	numeroComprobante: '',
	fechaPago: '',
	monto: '',
	tipoPago: 'adelanto',
	metodoPago: 'efectivo',
	observaciones: ''
});

const getCurrentDate = () => {
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const yyyy = today.getFullYear();
	return `${yyyy}-${mm}-${dd}`;
};

const submitForm = () => {
	console.log('Form submitted:', form.value);
};

onMounted(() => {
	form.value.fechaPago = getCurrentDate();
});
</script>
<template>
  <div class="modal fade" id="modalAddPago" tabindex="-1" aria-labelledby="modalAddPagoLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-white border-0">
          <h5 class="modal-title" id="modalAddPagoLabel">Agregar Pago</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="numeroComprobante" class="form-label">N° Comprobante</label>
              <input type="text" class="form-control" id="numeroComprobante" v-model="form.numeroComprobante" required>
            </div>
            <div class="mb-3">
              <label for="fechaPago" class="form-label">Fecha de Pago</label>
              <input type="date" class="form-control" id="fechaPago" v-model="form.fechaPago" :max="getCurrentDate()" required>
            </div>
            <div class="mb-3">
              <label for="monto" class="form-label">Monto</label>
              <input type="number" class="form-control" id="monto" v-model="form.monto" step="0.01" min="0" required>
            </div>
            <div class="mb-3">
              <label for="tipoPago" class="form-label">Tipo de Pago</label>
              <select class="form-select" id="tipoPago" v-model="form.tipoPago" required disabled>
                <option value="adelanto">Adelanto</option>
                <option value="pago_completo">Pago completo</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="metodoPago" class="form-label">Método de Pago</label>
              <select class="form-select" id="metodoPago" v-model="form.metodoPago" required>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="pos">POS</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="observaciones" class="form-label">Observaciones</label>
              <textarea class="form-control" id="observaciones" v-model="form.observaciones" rows="3"></textarea>
            </div>
            <div class="modal-footer border-0">
              
              <button type="submit" class="btn btn-outline-primary" data-bs-dismiss="modal"><i class="bi bi-wallet2"></i> Guardar Pago</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.modal-content {
  border-radius: 0.5rem;
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
}
</style>