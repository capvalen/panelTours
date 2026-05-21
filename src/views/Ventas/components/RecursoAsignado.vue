<script setup>
const props = defineProps({
	item: { type: Object, required: true },
	tipoNormalizado: { type: String, required: true },
	estadoSolicitudClass: { type: Function, required: true },
	estadoSolicitudLabel: { type: Function, required: true },
	boolLabel: { type: Function, required: true },
	formatMoneda: { type: Function, required: true },
	convertirHora: { type: Function, required: true },
	fechaLatamSimple: { type: Function, required: true },
	ventaGuia: { type: Object, default: null },
});
</script>

<template>
	<div>
		<h6 class="fw-bold">Asignado</h6>
		<template v-if="props.tipoNormalizado === 'restaurant'">
			<p>
				<strong>Estado:</strong>
				<span class="ms-2" :class="props.estadoSolicitudClass(props.item.detalle?.estado)">
					<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
					{{ props.estadoSolicitudLabel(props.item.detalle?.estado) }}
				</span>
			</p>
			<p><strong>Restaurant asignado:</strong> {{ props.item.detalle?.restaurante?.nombre || '-' }}</p>
			<p><strong>Contacto:</strong> {{ props.item.detalle?.restaurante?.contacto || 'sin contacto' }}</p>
			<p><strong>Comprobante:</strong> {{ props.item.detalle?.comprobante || '-' }}</p>
			<p v-if="(props.item.detalle?.restaurante?.estado || props.item.estado || '').toLowerCase() === 'cancelado'"><strong>Motivo cancelación:</strong> {{ props.item.detalle?.restaurante?.motivo_cancelacion || '-' }}</p>
		</template>

		<template v-else-if="props.tipoNormalizado === 'hospedaje'">
			<p>
				<strong>Estado:</strong>
				<span class="ms-2" :class="props.estadoSolicitudClass(props.item.estado)">
					<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
					{{ props.estadoSolicitudLabel(props.item.estado) }}
				</span>
			</p>
			<p><strong>Hospedaje asignado:</strong> {{ props.item.detalle?.hospedaje?.hospedaje || '-' }}</p>
			<p><strong>Contacto hospedaje:</strong> {{ `${props.item.detalle?.hospedaje?.contacto || '-'} - ${props.item.detalle?.hospedaje?.celular || '-'}` }}</p>
			<p><strong>Número habitación:</strong> {{ props.item.detalle?.numero_habitacion || '-' }}</p>
			<p><strong>Estado pago:</strong> {{ props.item.detalle?.estado_pago || props.item.estado_pago || '-' }}</p>
			<p><strong>Obs.:</strong> {{ props.item.motivo_cancelacion || '-' }}</p>
		</template>

		<template v-else-if="props.tipoNormalizado === 'vuelo'">
			<p>
				<strong>Estado:</strong>
				<span class="ms-2" :class="props.estadoSolicitudClass(props.item.detalle?.estado_tramo)">
					<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
					{{ props.estadoSolicitudLabel(props.item.detalle?.estado_tramo) }}
				</span>
			</p>
			<p><strong>Aerolínea:</strong> {{ props.item.detalle?.aerolinea || '-' }}</p>
			<p><strong>Código vuelo:</strong> {{ props.item.detalle?.codigo_vuelo || '-' }}</p>
			<p><strong>Número vuelo:</strong> {{ props.item.detalle?.numero_vuelo || '-' }}</p>
			<p><strong>Aeronave:</strong> {{ props.item.detalle?.aeronave || '-' }}</p>
			<p><strong>Clase vuelo:</strong> <span class="text-capitalize">{{ props.item.detalle?.clase_vuelo || props.item.clase_vuelo || '-' }}</span></p>
			<p><strong>Escala:</strong> {{ props.boolLabel(props.item.detalle?.escala ?? props.item.escala) }}</p>
			<p><strong>Terminal salida:</strong> {{ props.item.detalle?.terminal_salida || '-' }}</p>
			<p><strong>Puerta embarque:</strong> {{ props.item.detalle?.puerta_embarque || '-' }}</p>
			<p><strong>Terminal llegada:</strong> {{ props.item.detalle?.terminal_llegada || '-' }}</p>
			<p><strong>Asientos asignados:</strong> {{ props.item.detalle?.asientos_asignados || '-' }}</p>
			<p><strong>Duración minutos:</strong> {{ props.item.detalle?.duracion_minutos ?? '-' }}</p>
			<p><strong>Costo soles:</strong> {{ props.formatMoneda(Number(props.item.detalle?.costo_soles || 0)) }}</p>
			<p><strong>Costo dólares:</strong> $ {{ parseFloat(Number(props.item.detalle?.costo_dolares || 0)).toFixed(2) }}</p>
		</template>

		<template v-else-if="props.tipoNormalizado === 'transporte'">
			<p>
				<strong>Estado alquiler:</strong>
				<span class="ms-2" :class="props.estadoSolicitudClass(props.item.detalle?.estado_alquiler)">
					<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
					{{ props.estadoSolicitudLabel(props.item.detalle?.estado_alquiler) }}
				</span>
			</p>
			<p><strong>Conductor:</strong> {{ props.item.detalle?.vehiculo?.nombre_conductor || '-' }}</p>
			<p><strong>Placa:</strong> {{ props.item.detalle?.vehiculo?.placa || '-' }}</p>
			<p><strong>Tipo combustible:</strong> {{ props.item.detalle?.vehiculo?.tipo_combustible || '-' }}</p>
			<p><strong>Costo:</strong> {{ props.formatMoneda(Number(props.item.detalle?.costo || 0)) }}</p>
		</template>

		<template v-else-if="props.tipoNormalizado === 'tour'">
			<p>
				<strong>Estado:</strong>
				<span class="ms-2" :class="props.estadoSolicitudClass(props.item.detalle?.estado)">
					<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
					{{ props.estadoSolicitudLabel(props.item.detalle?.estado).replaceAll('_', ' ') }}
				</span>
			</p>
			<p><strong>Guía asignado:</strong> {{ props.ventaGuia.guia?.nombre || '-' }}</p>
			<p><strong>Fecha:</strong> {{ props.fechaLatamSimple(props.ventaGuia?.fecha) || '-' }}</p>
			<p><strong>Hora:</strong> {{ props.convertirHora(props.ventaGuia?.hora) || '-' }}</p>
			<p><strong>Lugar encuentro:</strong> {{ props.ventaGuia?.lugar_encuentro || '-' }}</p>
			<p><strong>Tipo servicio:</strong> {{ props.ventaGuia?.tipo_servicio || '-' }}</p>
			<p><strong>Costo:</strong> {{ props.formatMoneda(Number(props.ventaGuia?.costo || 0)) }}</p>
		</template>
	</div>
</template>
