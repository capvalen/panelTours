<script setup>
const props = defineProps({
	item: { type: Object, required: true },
	tipoNormalizado: { type: String, required: true },
	nacionalidadVenta: { type: String, default: '' },
	fechaLatamSimple: { type: Function, required: true },
	formatMoneda: { type: Function, required: true },
	convertirHora: { type: Function, required: true },
	boolLabel: { type: Function, required: true },
});
</script>

<template>
	<div>
		<h6 class="fw-bold">Requerimientos</h6>
		<template v-if="props.tipoNormalizado === 'restaurant'">
			<p><strong>Número personas:</strong> {{ props.item.detalle?.numero_personas ?? 0 }}</p>
			<p><strong>Turno:</strong> <span class="text-capitalize">{{ props.item.detalle?.turno || '-' }}</span></p>
			<p><strong>Tipo servicio:</strong> <span class="text-capitalize">{{ props.item.detalle?.tipo_servicio || '-' }}</span></p>
			<p><strong>Espacio:</strong> <span class="text-capitalize">{{ props.item.detalle?.espacio || '-' }}</span></p>
			<h6 class="fw-bold mt-3">Confirmaciones</h6>
			<p><strong>Fecha reserva:</strong> {{ props.item.detalle?.fecha_reserva ? props.fechaLatamSimple(props.item.detalle?.fecha_reserva) : '-' }}</p>
			<p><strong>Fecha confirmación:</strong> {{ props.item.detalle?.fecha_confirmacion ? props.fechaLatamSimple(props.item.detalle?.fecha_confirmacion) : '-' }}</p>
			<p><strong>Hora reserva:</strong> {{ props.item.detalle?.hora_reserva || '-' }}</p>
			<p><strong>Pedido especial:</strong> {{ props.item.detalle?.pedido_especial || '-' }}</p>
			<p><strong>Precio:</strong> {{ props.formatMoneda(Number(props.item.detalle?.precio || 0)) }}</p>
		</template>

		<template v-else-if="props.tipoNormalizado === 'hospedaje'">
			<p><strong>Cantidad noches:</strong> {{ props.item.detalle?.cantidad_noches ?? 0 }}</p>
			<p><strong>N° habitaciones:</strong> {{ props.item.detalle?.num_habitaciones ?? 0 }}</p>
			<p><strong>Tipo habitación:</strong> {{ props.item.detalle?.tipo_habitacion || '-' }}</p>
			<p><strong>Adultos:</strong> {{ props.item.detalle?.cantidad_adultos ?? 0 }} · <strong>Niños:</strong> {{ props.item.detalle?.cantidad_ninos ?? 0 }}</p>
			<h6 class="fw-bold mt-3">Confirmaciones</h6>
			<p><strong>Fecha ingreso:</strong> {{ props.item.detalle?.fecha_ingreso ? props.fechaLatamSimple(props.item.detalle?.fecha_ingreso) : '-' }}</p>
			<p><strong>Fecha salida:</strong> {{ props.item.detalle?.fecha_salida ? props.fechaLatamSimple(props.item.detalle?.fecha_salida) : '-' }}</p>
			<p><strong>Hora checkin:</strong> {{ props.convertirHora(props.item.detalle?.hora_checkin) || '-' }}</p>
			<p><strong>Hora checkout:</strong> {{ props.convertirHora(props.item.detalle?.hora_checkout) || '-' }}</p>
			<p><strong>Preferencias especiales:</strong> {{ props.item.detalle?.preferencias_especiales || '-' }}</p>
			<p><strong>Requiere cuna:</strong> {{ props.boolLabel(props.item.detalle?.requiere_cuna) }}</p>
			<p><strong>Habitación fumador:</strong> {{ props.boolLabel(props.item.detalle?.habitacion_fumador) }}</p>
			<p><strong>Precio por noche:</strong> {{ props.formatMoneda(Number(props.item.detalle?.precio_por_noche || 0)) }}</p>
			<p><strong>Precio:</strong> {{ props.formatMoneda(Number(props.item.detalle?.precio || 0)) }}</p>
		</template>

		<template v-else-if="props.tipoNormalizado === 'vuelo'">
			<p><strong>Origen:</strong> {{ props.item.detalle?.origen || '-' }}</p>
			<p><strong>Destino:</strong> {{ props.item.detalle?.destino || '-' }}</p>
			<p><strong>Pasajeros:</strong> {{ props.item.detalle?.pasajeros ?? props.item.detalle?.nro_clientes ?? 0 }}</p>
			<p><strong>Precio ticket:</strong> {{ props.formatMoneda(Number(props.item.detalle?.precio_ticket || 0)) }}</p>
			<p><strong>Precio soles:</strong> {{ props.formatMoneda(Number(props.item.detalle?.precio_soles || 0)) }}</p>
			<p><strong>Precio dólares:</strong> {{ Number(props.item.detalle?.precio_dolares || 0) }}</p>
			<h6 class="fw-bold mt-3">Confirmaciones</h6>
			<p><strong>Lleva equipaje:</strong> {{ props.item.detalle?.lleva_equipaje === 'si' ? 'Sí' : 'No' }}</p>
			<p><strong>Kilos:</strong> {{ parseInt(props.item.detalle?.kilos || 0) }} kg</p>
			<p><strong>Equipaje:</strong> {{ props.item.detalle?.que_equipaje || '-' }}</p>
			<p><strong>Fecha salida:</strong> {{ props.item.detalle?.fecha_salida ? props.fechaLatamSimple(props.item.detalle?.fecha_salida) : '-' }} · {{ props.convertirHora(props.item.detalle?.hora_salida) || '-' }}</p>
			<p><strong>Fecha llegada:</strong> {{ props.item.detalle?.fecha_llegada ? props.fechaLatamSimple(props.item.detalle?.fecha_llegada) : '-' }} · {{ props.convertirHora(props.item.detalle?.horario_llegada) || '-' }}</p>
			<p><strong>Observaciones:</strong> {{ props.item.detalle?.observaciones || '-' }}</p>
		</template>

		<template v-else-if="props.tipoNormalizado === 'transporte'">
			<p><strong>Origen:</strong> {{ props.item.detalle?.origen || '-' }}</p>
			<p><strong>Destino:</strong> {{ props.item.detalle?.destino || '-' }}</p>
			<p><strong>Fecha inicio:</strong> {{ props.item.detalle?.fecha_inicio ? props.fechaLatamSimple(props.item.detalle?.fecha_inicio) : '-' }}</p>
			<p><strong>Fecha fin:</strong> {{ props.item.detalle?.fecha_fin ? props.fechaLatamSimple(props.item.detalle?.fecha_fin) : '-' }}</p>
			<p><strong>Hora recogida:</strong> {{ props.convertirHora(props.item.detalle?.hora_recogida) || '-' }}</p>
			<p><strong>Hora devolución:</strong> {{ props.convertirHora(props.item.detalle?.hora_devolucion) || '-' }}</p>
			<p><strong>Precio:</strong> {{ props.formatMoneda(Number(props.item.detalle?.precio || 0)) }}</p>
			<p><strong>Pasajeros:</strong> {{ props.item.detalle?.pasajeros ?? props.item.detalle?.nro_clientes ?? 0 }}</p>
			<p><strong>Observaciones:</strong> {{ props.item.detalle?.observaciones || '-' }}</p>
		</template>

		<template v-else-if="props.tipoNormalizado === 'tour'">
			<p><strong>Nombre tour:</strong> {{ props.item.detalle?.nombre_tour || '-' }}</p>
			<p><strong>Tipo tour:</strong> {{ props.item.detalle?.tipo_tour || '-' }}</p>
			<p><strong>Descripción:</strong> {{ props.item.detalle?.descripcion || '-' }}</p>
			<p><strong>Cantidad personas:</strong> {{ props.item.detalle?.cantidad_personas ?? 0 }}</p>
			<p><strong>Adultos:</strong> {{ props.item.detalle?.cantidad_adultos ?? 0 }} · <strong>Niños:</strong> {{ props.item.detalle?.cantidad_ninos ?? 0 }}</p>
			<p v-if="(props.nacionalidadVenta || '').toLowerCase() === 'peruana'">
				<strong>Peruanos:</strong> Adultos {{ props.item.detalle?.peruanos_adultos ?? 0 }} · Kids {{ props.item.detalle?.peruanos_kids ?? 0 }}
			</p>
			<p v-else>
				<strong>Extranjeros:</strong> Adultos {{ props.item.detalle?.extranjeros_adultos ?? 0 }} · Kids {{ props.item.detalle?.extranjeros_kids ?? 0 }}
			</p>
			<p><strong>Precio:</strong> {{ props.formatMoneda(Number(props.item.detalle?.precio || 0)) }}</p>
			<p><strong>Incluye:</strong> {{ props.item.detalle?.incluye || '-' }}</p>
			<p><strong>No incluye:</strong> {{ props.item.detalle?.no_incluye || '-' }}</p>
			<p><strong>Requisitos:</strong> {{ props.item.detalle?.requisitos || '-' }}</p>
			<h6 class="fw-bold mt-3">Confirmaciones</h6>
			<p><strong>Fecha salida:</strong> {{ props.item.detalle?.fecha_salida ? props.fechaLatamSimple(props.item.detalle?.fecha_salida) : '-' }}</p>
			<p><strong>Fecha retorno:</strong> {{ props.item.detalle?.fecha_retorno ? props.fechaLatamSimple(props.item.detalle?.fecha_retorno) : '-' }}</p>
			<p><strong>Costo:</strong> {{ props.formatMoneda(Number(props.item.detalle?.costo || 0)) }}</p>
			<p><strong>Punto partida:</strong> {{ props.item.detalle?.punto_partida || '-' }}</p>
			<p><strong>Punto llegada:</strong> {{ props.item.detalle?.punto_llegada || '-' }}</p>
			<p><strong>Hora salida:</strong> {{ props.convertirHora(props.item.detalle?.hora_salida) || '-' }}</p>
			<p><strong>Hora retorno:</strong> {{ props.convertirHora(props.item.detalle?.hora_retorno) || '-' }}</p>
			<p><strong>Observaciones:</strong> {{ props.item.detalle?.observaciones || '-' }}</p>
		</template>
	</div>
</template>
