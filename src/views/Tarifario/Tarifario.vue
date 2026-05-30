<template>
	<h1>Tarifario</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item active" aria-current="page">Tarifario</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>
	<p>Nota: el excel tiene en la suma un error de un "13" como número fijo. La multiplicación para la utilidad esta multiplicando la celda incorrecta</p>

	<div class="table-responsive mb-4">
		<table class="table table-hover">
		<thead>
			<tr>
				<th>Número de Personas</th>
				<th class="text-center">4</th>
				<th class="text-center">10</th>
				<th class="text-center">15</th>
				<th class="text-center">20</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, clave) in tarifarios" :key="clave">
				<th class="text-capitalize text-muted">{{ clave }}</th>
				<template v-if="['transporte', 'guia', 'refrigerio', 'entradas', 'desayuno', 'almuerzo', 'cena', 'seguro', 'hotel'].includes(clave)">
					<td> <input type="number" class="form-control" v-model.number="item['4']"> </td>
					<td> <input type="number" class="form-control" v-model.number="item['10']"> </td>
					<td> <input type="number" class="form-control" v-model.number="item['15']"> </td>
					<td> <input type="number" class="form-control" v-model.number="item['20']"> </td>
				</template>
				<template v-else-if="clave == 'costo del transporte'">
					<td>{{ costoTransporte(4) }}</td>
					<td>{{ costoTransporte(10) }}</td>
					<td>{{ costoTransporte(15) }}</td>
					<td>{{ costoTransporte(20) }}</td>
				</template>
				<template v-else-if="clave == 'costo del guia'">
					<td>{{ costoGuia(4) }}</td>
					<td>{{ costoGuia(10) }}</td>
					<td>{{ costoGuia(15) }}</td>
					<td>{{ costoGuia(20) }}</td>
				</template>
				<template v-else-if="clave == 'costo total por persona'">
					<td>{{ costoTotalPorPersona(4) }}</td>
					<td>{{ costoTotalPorPersona(10) }}</td>
					<td>{{ costoTotalPorPersona(15) }}</td>
					<td>{{ costoTotalPorPersona(20) }}</td>
				</template>
				<template v-else-if="clave == 'margen de ganancia %'">
					<td>
						<div class="input-group">
							<input type="number" class="form-control" v-model.number="item['4']">
							<span class="input-group-text">%</span>
						</div>
					</td>
					<td>
						<div class="input-group">
							<input type="number" class="form-control" v-model.number="item['10']">
							<span class="input-group-text">%</span>
						</div>
					</td>
					<td>
						<div class="input-group">
							<input type="number" class="form-control" v-model.number="item['15']">
							<span class="input-group-text">%</span>
						</div>
					</td>
					<td>
						<div class="input-group">
							<input type="number" class="form-control" v-model.number="item['20']">
							<span class="input-group-text">%</span>
						</div>
					</td>
				</template>
				<template v-else-if="clave == 'valor al publico'">
					<td>{{ valorAlPublico(4) }}</td>
					<td>{{ valorAlPublico(10) }}</td>
					<td>{{ valorAlPublico(15) }}</td>
					<td>{{ valorAlPublico(20) }}</td>
				</template>
				<template v-else-if="clave == 'utilidad por persona'">
					<td>{{ utilidadPorPersona(4) }}</td>
					<td>{{ utilidadPorPersona(10) }}</td>
					<td>{{ utilidadPorPersona(15) }}</td>
					<td>{{ utilidadPorPersona(20) }}</td>
				</template>
				<template v-else-if="clave == 'utilidad total'">
					<td>{{ utilidadTotal(4) }}</td>
					<td>{{ utilidadTotal(10) }}</td>
					<td>{{ utilidadTotal(15) }}</td>
					<td>{{ utilidadTotal(20) }}</td>
				</template>
				<template v-else-if="clave == 'igv'">
					<td>{{ igv(4) }}</td>
					<td>{{ igv(10) }}</td>
					<td>{{ igv(15) }}</td>
					<td>{{ igv(20) }}</td>
				</template>
				<template v-else-if="clave == 'precio de venta'">
					<td>{{ precioDeVenta(4) }}</td>
					<td>{{ precioDeVenta(10) }}</td>
					<td>{{ precioDeVenta(15) }}</td>
					<td>{{ precioDeVenta(20) }}</td>
				</template>
				<template v-else-if="clave == 'precio en catálogo'">
					<td>{{ precioEnCatalogo(4) }}</td>
					<td>{{ precioEnCatalogo(10) }}</td>
					<td>{{ precioEnCatalogo(15) }}</td>
					<td>{{ precioEnCatalogo(20) }}</td>
				</template>
				<template v-else>
					<td>{{ formatoMoneda(item['4']) }}</td>
					<td>{{ formatoMoneda(item['10']) }}</td>
					<td>{{ formatoMoneda(item['15']) }}</td>
					<td>{{ formatoMoneda(item['20']) }}</td>
				</template>
			</tr>
		</tbody>
	</table>
	</div>
</template>

<script setup>
	import { ref } from 'vue'

	// Función de formato de moneda
	const formatoMoneda = (valor) => {
		if (valor === undefined || valor === null || isNaN(valor)) return 'S/ 0.00'
		return new Intl.NumberFormat('es-PE', {
			style: 'currency',
			currency: 'PEN',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(valor)
	}

	// Datos base del Excel (inputs editables)
	// margen de ganancia % se guarda como entero (15 = 15%)
	const tarifarios = ref({
		"transporte": {"4": 140, "10": 220, "15": 300, "20": 350},
		"guia": {"4": 80, "10": 80, "15": 130, "20": 150},
		"costo del transporte": {"4": 0, "10": 0, "15": 0, "20": 0},
		"costo del guia": {"4": 0, "10": 0, "15": 0, "20": 0},
		"refrigerio": {"4": 10, "10": 10, "15": 10, "20": 10},
		"entradas": {"4": 10, "10": 10, "15": 10, "20": 10},
		"desayuno": {"4": 15, "10": 15, "15": 15, "20": 15},
		"almuerzo": {"4": 25, "10": 25, "15": 25, "20": 25},
		"cena": {"4": 15, "10": 15, "15": 15, "20": 15},
		"seguro": {"4": 8, "10": 8, "15": 8, "20": 8},
		"hotel": {"4": 0, "10": 0, "15": 0, "20": 0},
		"costo total por persona": {"4": 0, "10": 0, "15": 0, "20": 0},
		"margen de ganancia %": {"4": 15, "10": 15, "15": 15, "20": 15},
		"valor al publico": {"4": 0, "10": 0, "15": 0, "20": 0},
		"utilidad por persona": {"4": 0, "10": 0, "15": 0, "20": 0},
		"utilidad total": {"4": 0, "10": 0, "15": 0, "20": 0},
		"igv": {"4": 0, "10": 0, "15": 0, "20": 0},
		"precio de venta": {"4": 0, "10": 0, "15": 0, "20": 0},
		"precio en catálogo": {"4": 0, "10": 0, "15": 0, "20": 0}
	})

	// Helper para obtener el margen como decimal (15% → 0.15)
	const getMargen = (personas) => {
		return tarifarios.value['margen de ganancia %'][personas] / 100
	}

	// ===== FÓRMULAS DEL EXCEL =====

	// costo del transporte = transporte / numero_de_personas
	const costoTransporte = (personas) => {
		const valor = tarifarios.value['transporte'][personas] / personas
		return formatoMoneda(valor)
	}

	// costo del guía = guia / numero_de_personas
	const costoGuia = (personas) => {
		const valor = tarifarios.value['guia'][personas] / personas
		return formatoMoneda(valor)
	}

	// COSTO TOTAL POR PERSONA = suma de todos los costos por persona
	const costoTotalPorPersona = (personas) => {
		const costoTransporte = tarifarios.value['transporte'][personas] / personas
		const costoGuia = tarifarios.value['guia'][personas] / personas
		const refrigerio = tarifarios.value['refrigerio'][personas]
		const entradas = tarifarios.value['entradas'][personas]
		const desayuno = tarifarios.value['desayuno'][personas]
		const almuerzo = tarifarios.value['almuerzo'][personas]
		const cena = tarifarios.value['cena'][personas]
		const seguro = tarifarios.value['seguro'][personas]
		const hotel = tarifarios.value['hotel'][personas]
		const total = costoTransporte + costoGuia + refrigerio + entradas + desayuno + almuerzo + cena + seguro + hotel
		return formatoMoneda(total)
	}

	// VALOR AL PÚBLICO = COSTO_TOTAL / (1 - MARGEN)
	const valorAlPublico = (personas) => {
		const costoTransporte = tarifarios.value['transporte'][personas] / personas
		const costoGuia = tarifarios.value['guia'][personas] / personas
		const refrigerio = tarifarios.value['refrigerio'][personas]
		const entradas = tarifarios.value['entradas'][personas]
		const desayuno = tarifarios.value['desayuno'][personas]
		const almuerzo = tarifarios.value['almuerzo'][personas]
		const cena = tarifarios.value['cena'][personas]
		const seguro = tarifarios.value['seguro'][personas]
		const hotel = tarifarios.value['hotel'][personas]
		const costoTotal = costoTransporte + costoGuia + refrigerio + entradas + desayuno + almuerzo + cena + seguro + hotel
		const margen = getMargen(personas)
		const valor = costoTotal / (1 - margen)
		return formatoMoneda(valor)
	}

	// UTILIDAD POR PERSONA = VALOR_AL_PUBLICO - COSTO_TOTAL
	const utilidadPorPersona = (personas) => {
		const costoTransporte = tarifarios.value['transporte'][personas] / personas
		const costoGuia = tarifarios.value['guia'][personas] / personas
		const refrigerio = tarifarios.value['refrigerio'][personas]
		const entradas = tarifarios.value['entradas'][personas]
		const desayuno = tarifarios.value['desayuno'][personas]
		const almuerzo = tarifarios.value['almuerzo'][personas]
		const cena = tarifarios.value['cena'][personas]
		const seguro = tarifarios.value['seguro'][personas]
		const hotel = tarifarios.value['hotel'][personas]
		const costoTotal = costoTransporte + costoGuia + refrigerio + entradas + desayuno + almuerzo + cena + seguro + hotel
		const margen = getMargen(personas)
		const valorPublico = costoTotal / (1 - margen)
		const utilidad = valorPublico - costoTotal
		return formatoMoneda(utilidad)
	}

	// UTILIDAD TOTAL = UTILIDAD_POR_PERSONA * numero_de_personas
	const utilidadTotal = (personas) => {
		const costoTransporte = tarifarios.value['transporte'][personas] / personas
		const costoGuia = tarifarios.value['guia'][personas] / personas
		const refrigerio = tarifarios.value['refrigerio'][personas]
		const entradas = tarifarios.value['entradas'][personas]
		const desayuno = tarifarios.value['desayuno'][personas]
		const almuerzo = tarifarios.value['almuerzo'][personas]
		const cena = tarifarios.value['cena'][personas]
		const seguro = tarifarios.value['seguro'][personas]
		const hotel = tarifarios.value['hotel'][personas]
		const costoTotal = costoTransporte + costoGuia + refrigerio + entradas + desayuno + almuerzo + cena + seguro + hotel
		const margen = getMargen(personas)
		const valorPublico = costoTotal / (1 - margen)
		const utilidadPersona = valorPublico - costoTotal
		const utilidadTotal = utilidadPersona * personas
		return formatoMoneda(utilidadTotal)
	}

	// IGV 18% = VALOR_AL_PUBLICO * 0.18
	const igv = (personas) => {
		const costoTransporte = tarifarios.value['transporte'][personas] / personas
		const costoGuia = tarifarios.value['guia'][personas] / personas
		const refrigerio = tarifarios.value['refrigerio'][personas]
		const entradas = tarifarios.value['entradas'][personas]
		const desayuno = tarifarios.value['desayuno'][personas]
		const almuerzo = tarifarios.value['almuerzo'][personas]
		const cena = tarifarios.value['cena'][personas]
		const seguro = tarifarios.value['seguro'][personas]
		const hotel = tarifarios.value['hotel'][personas]
		const costoTotal = costoTransporte + costoGuia + refrigerio + entradas + desayuno + almuerzo + cena + seguro + hotel
		const margen = getMargen(personas)
		const valorPublico = costoTotal / (1 - margen)
		const igvValor = valorPublico * 0.18
		return formatoMoneda(igvValor)
	}

	// PRECIO DE VENTA = IGV + VALOR_AL_PUBLICO
	const precioDeVenta = (personas) => {
		const costoTransporte = tarifarios.value['transporte'][personas] / personas
		const costoGuia = tarifarios.value['guia'][personas] / personas
		const refrigerio = tarifarios.value['refrigerio'][personas]
		const entradas = tarifarios.value['entradas'][personas]
		const desayuno = tarifarios.value['desayuno'][personas]
		const almuerzo = tarifarios.value['almuerzo'][personas]
		const cena = tarifarios.value['cena'][personas]
		const seguro = tarifarios.value['seguro'][personas]
		const hotel = tarifarios.value['hotel'][personas]
		const costoTotal = costoTransporte + costoGuia + refrigerio + entradas + desayuno + almuerzo + cena + seguro + hotel
		const margen = getMargen(personas)
		const valorPublico = costoTotal / (1 - margen)
		const igvValor = valorPublico * 0.18
		const precioVenta = igvValor + valorPublico
		return formatoMoneda(precioVenta)
	}

	// PRECIO EN CATÁLOGO = redondeo hacia arriba del precio de venta
	const precioEnCatalogo = (personas) => {
		const costoTransporte = tarifarios.value['transporte'][personas] / personas
		const costoGuia = tarifarios.value['guia'][personas] / personas
		const refrigerio = tarifarios.value['refrigerio'][personas]
		const entradas = tarifarios.value['entradas'][personas]
		const desayuno = tarifarios.value['desayuno'][personas]
		const almuerzo = tarifarios.value['almuerzo'][personas]
		const cena = tarifarios.value['cena'][personas]
		const seguro = tarifarios.value['seguro'][personas]
		const hotel = tarifarios.value['hotel'][personas]
		const costoTotal = costoTransporte + costoGuia + refrigerio + entradas + desayuno + almuerzo + cena + seguro + hotel
		const margen = getMargen(personas)
		const valorPublico = costoTotal / (1 - margen)
		const igvValor = valorPublico * 0.18
		const precioVenta = igvValor + valorPublico
		const catalogo = Math.ceil(precioVenta)
		return catalogo
	}
</script>
