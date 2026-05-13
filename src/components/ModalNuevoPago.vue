<script setup>
import { computed, ref, onMounted, watch } from 'vue';

const props = defineProps({
	pagoEditar: {
		type: Object,
		default: null,
	},
	saldoPendienteBase: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits(['guardar']);
const formRef = ref(null);

const form = ref({
	numeroComprobante: '',
	fechaPago: '',
	monto: '',
	metodoPago: 'efectivo',
	observaciones: '',
	saldoPendiente: '',
	esCompromiso: false,
	fechaCompromiso: '',
	estadoPago: 'pendiente',
});

const saldoPendienteCalculado = computed(() => {
	const base = Number(props.saldoPendienteBase || 0);
	const monto = Number(form.value.monto || 0);
	return Math.max(base - monto, 0);
});

const getCurrentDate = () => {
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const yyyy = today.getFullYear();
	return `${yyyy}-${mm}-${dd}`;
};

const resetForm = () => {
	const saldoBase = Number(props.saldoPendienteBase || 0);
	form.value = {
		numeroComprobante: '',
		fechaPago: getCurrentDate(),
		monto: saldoBase,
		metodoPago: 'efectivo',
		observaciones: '',
		saldoPendiente: 0,
		esCompromiso: false,
		fechaCompromiso: '',
		estadoPago: 'pendiente',
	};
};

const submitForm = () => {
	emit('guardar', { ...form.value, saldoPendiente: saldoPendienteCalculado.value });
};


onMounted(() => {
	form.value.fechaPago = getCurrentDate();
});

watch(
	() => props.pagoEditar,
	(value) => {
		if (!value) {
			resetForm();
			return;
		}

		form.value = {
			numeroComprobante: value.codigo_referencia || '',
			fechaPago: value.fecha ? new Date(value.fecha).toISOString().slice(0, 10) : getCurrentDate(),
			monto: value.monto_abonado ?? '',
			metodoPago: value.metodo_pago || 'efectivo',
			observaciones: value.observaciones || '',
			saldoPendiente: value.saldo_pendiente ?? '',
			esCompromiso: Boolean(value.es_compromiso),
			fechaCompromiso: value.fecha_compromiso ? new Date(value.fecha_compromiso).toISOString().slice(0, 10) : '',
			estadoPago: value.estado_pago || 'pendiente',
		};
	},
	{ immediate: true }
);

watch(
	() => props.saldoPendienteBase,
	() => {
		if (!props.pagoEditar) {
			resetForm();
		}
	}
);

watch(
	() => form.value.monto,
	() => {
		form.value.saldoPendiente = saldoPendienteCalculado.value;
	},
	{ immediate: true }
);
</script>
<template>
  <div class="modal fade" id="modalAddPago" tabindex="-1" aria-labelledby="modalAddPagoLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-white border-0">
          <h5 class="modal-title" id="modalAddPagoLabel">{{ pagoEditar ? 'Editar Pago' : 'Agregar Pago' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form ref="formRef" @submit.prevent="submitForm">
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
              <label for="metodoPago" class="form-label">Método de Pago</label>
              <select class="form-select" id="metodoPago" v-model="form.metodoPago" required>
                <option value="depósito">Depósito</option>
								<option value="efectivo">Efectivo</option>
                <option value="POS">POS</option>
								<option value="plin">Plin</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="yape">Yape</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="saldoPendiente" class="form-label">Saldo pendiente</label>
              <input type="number" class="form-control" id="saldoPendiente" :value="saldoPendienteCalculado" step="0.01" min="0" disabled>
            </div>
            <div class="mb-3">
              <label for="estadoPago" class="form-label">Estado del pago</label>
              <select class="form-select" id="estadoPago" v-model="form.estadoPago" required>
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="confirmado">Confirmado</option>
                <option value="rechazado">Rechazado</option>
                <option value="reembolsado">Reembolsado</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="observaciones" class="form-label">Observaciones</label>
              <textarea class="form-control" id="observaciones" v-model="form.observaciones" rows="3"></textarea>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" @click="submitForm"><i class="bi bi-wallet2"></i> {{ pagoEditar ? 'Guardar cambios' : 'Guardar Pago' }}</button>
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
