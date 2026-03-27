<template>
		<h1>Tarifario</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item active" aria-current="page">Tarifario</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Número de Personas</th>
				<th>4</th>
				<th>10</th>
				<th>15</th>
				<th>20</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, clave) in tarifarios">
				<td class="text-capitalize">{{ clave }}</td>
				<template v-if="['transporte', 'guia'].includes(clave) ">
					<td> <input type="number" class="form-control" v-model="item['4']"> </td>
					<td> <input type="number" class="form-control" v-model="item['10']"> </td>
					<td> <input type="number" class="form-control" v-model="item['15']"> </td>
					<td> <input type="number" class="form-control" v-model="item['20']"> </td>
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
				<template v-else-if="clave != 'margen de ganancia'">
					<td>{{ formatoMoneda(item['4']) }}</td>
					<td>{{ formatoMoneda(item['10']) }}</td>
					<td>{{ formatoMoneda(item['15']) }}</td>
					<td>{{ formatoMoneda(item['20']) }}</td>
				</template>
				<template v-else>
					<td>{{ item['4'] }}%</td>
					<td>{{ item['10'] }}%</td>
					<td>{{ item['15'] }}%</td>
					<td>{{ item['20'] }}%</td>
				</template>
			</tr>
		</tbody>
	</table>
</template>
<script setup>
	import {ref} from 'vue'
	import { formatoMoneda }from '@/globales.js'
	const tarifarios = ref({
		"transporte": {"4": 140, "10": 220, "15": 300, "20": 350},
		"guia": {"4": 0, "10": 0, "15": 0, "20": 0},
		"costo del transporte": {"4": 0, "10": 0, "15": 0, "20": 0},
		"costo del guia": {"4": 0, "10": 0, "15": 0, "20": 0},
		"refrigerio": {"4": 0, "10": 0, "15": 0, "20": 0},
		"entradas": {"4": 0, "10": 0, "15": 0, "20": 0},
		"desayuno": {"4": 0, "10": 0, "15": 0, "20": 0},
		"almuerzo": {"4": 0, "10": 0, "15": 0, "20": 0},
		"cena": {"4": 0, "10": 0, "15": 0, "20": 0},
		"seguro": {"4": 0, "10": 0, "15": 0, "20": 0},
		"hotel": {"4": 0, "10": 0, "15": 0, "20": 0},
		"margen de ganancia": {"4": 15, "10": 15, "15": 15, "20": 15},
		"valor al público": {"4": 0, "10": 0, "15": 0, "20": 0},
		"utilidad por persona": {"4": 0, "10": 0, "15": 0, "20": 0},
		"utilidad total": {"4": 0, "10": 0, "15": 0, "20": 0},
		"igv": {"4": 0, "10": 0, "15": 0, "20": 0},
		"precio de venta": {"4": 0, "10": 0, "15": 0, "20": 0},
		"precio en catálogo": {"4": 0, "10": 0, "15": 0, "20": 0}
	})

	const costoTransporte = (clave)=>{ return formatoMoneda(tarifarios.value['transporte'][clave] / clave) }
	const costoGuia = (clave)=>{ return formatoMoneda(tarifarios.value['guia'][clave] / clave) }
</script>