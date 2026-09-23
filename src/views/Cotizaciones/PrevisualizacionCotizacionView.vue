<template>
	<div class="previsualizacion-cotizacion">
		<!-- Barra superior (no se imprime) -->
		<div class="d-flex flex-wrap align-items-center gap-2 mb-3">
			<router-link :to="'/cotizacion/detalle/' + props.id" class="btn btn-outline-secondary btn-sm">
				<i class="bi bi-arrow-left"></i> Volver
			</router-link>
			<span class="fw-bold" style="color:#1e293b;">Previsualización {{ codigo }}</span>
			<div class="ms-auto d-flex align-items-center gap-2">
				<label class="small text-muted mb-0">Temporada:</label>
				<select v-if="temporadas.length" v-model="temporadaId" class="form-select form-select-sm" style="width:auto;">
					<option :value="null">Sin temporada</option>
					<option v-for="t in temporadas" :key="t.id" :value="t.id">{{ t.valor?.titulo }}</option>
				</select>
				<span v-else class="small text-muted">Sin temporadas disponibles</span>
			</div>
		</div>

		<div v-if="cargando" class="text-center py-5">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Cargando...</span>
			</div>
			<p class="mt-2 text-muted">Cargando previsualización...</p>
		</div>

		<div v-else-if="error" class="alert alert-danger">
			<i class="bi bi-exclamation-triangle"></i> {{ error }}
		</div>

		<template v-else>
			<div class="pdf-scroll">
				<div id="pdf-document" class="pdf-document">
					<!-- ══════════ ENCABEZADO ══════════ -->
					<div id="pdf-header" class="pdf-header">
						<div class="h-logo">
							<img :src="logoUrl" alt="Logo Grupo Euro Andino">
						</div>
						<div class="h-info">
							<div class="titulo">GRUPO EURO ANDINO</div>
							<div class="subtitulo">agencia de viajes y Turismo</div>
							<div class="datos">
								RUC: 20568390629<br>
								Reg.: N° 014-2020-GRJ-DIRCETUR<br>
								Oficina: Calle Real 750 - Plaza Huamanmarca - Huancayo
							</div>
						</div>
						<div class="h-cot">
							<div class="badge-cot">COTIZACIÓN N° {{ codigo }}</div>
							<div class="datos">
								Fecha de emisión: {{ fechaEmision }}<br>
								Validez: 7 días calendario<br>
								Asesor: {{ asesor }}
							</div>
						</div>
					</div>

					<!-- ══════════ CONTENIDO ══════════ -->
					<div id="pdf-content" class="pdf-content">
						<!-- Datos del cliente / servicio -->
						<div class="datos-cliente">
							<div class="col">
								<div class="titulo">DATOS DE CLIENTE</div>
								<div class="dato"><span class="lbl">Pasajero/Grupo:</span> {{ clienteNombre }}</div>
								<div class="dato"><span class="lbl">Contacto Whatsapp:</span> {{ cliente.celular || '-' }}</div>
								<div class="dato"><span class="lbl">N° de pasajero:</span> {{ adults }} / {{ kids }}</div>
							</div>
							<div class="col">
								<div class="titulo">DETALLES DEL SERVICIO</div>
								<div class="dato"><span class="lbl">Modalidad:</span> Servicio {{ modalidad }}</div>
								<div class="dato"><span class="lbl">Fecha estimada de viaje:</span> {{ fechaViaje }}</div>
								<div class="dato"><span class="lbl">Punto de partida:</span> {{ puntoPartida }}</div>
							</div>
						</div>

						<!-- Programa -->
						<div v-for="(tour, idx) in toursData" :key="'tour-' + idx" class="seccion">
							<div class="titulo">PROGRAMA: {{ tour.nombre }}</div>
							<div v-if="tour.descripcion" class="detalle" v-html="tour.descripcion"></div>
							<div v-if="tour.partida" class="detalle"><strong>Punto de partida:</strong> <span v-html="tour.partida"></span></div>
							<div v-if="tour.itinerario" class="detalle"><strong>Itinerario:</strong> <span v-html="tour.itinerario"></span></div>
							<div v-if="tour.incluye" class="detalle"><strong>Incluye:</strong> <span v-html="tour.incluye"></span></div>
							<div v-if="tour.noincluye" class="detalle"><strong>No incluye:</strong> <span v-html="tour.noincluye"></span></div>
						</div>
						<div v-if="toursData.length === 0 && items.length" class="seccion">
							<div class="titulo">PROGRAMA: {{ items[0].descripcion || 'Servicio' }}</div>
						</div>

						<!-- Inversión económica -->
						<div class="seccion">
							<div class="titulo">INVERSIÓN ECONÓMICA</div>
							<table class="tabla-inversion">
								<thead>
									<tr>
										<th>Detalle del paquete</th>
										<th class="text-center">Cant. Pasajeros</th>
										<th class="text-end">Precio Unit.</th>
										<th class="text-end">Total</th>
									</tr>
								</thead>
								<tbody>
									<template v-for="(item, idx) in items" :key="item.id || idx">
										<tr>
											<td :rowspan="kids > 0 ? 2 : 1">{{ item.descripcion || '-' }}</td>
											<td class="text-center">{{ adults }} adulto{{ adults !== 1 ? 's' : '' }}</td>
											<td class="text-end">S/ {{ fmt(item.precio_adulto) }}</td>
											<td class="text-end">S/ {{ fmt(Number(item.precio_adulto || 0) * adults) }}</td>
										</tr>
										<tr v-if="kids > 0">
											<td class="text-center">{{ kids }} niño{{ kids !== 1 ? 's' : '' }}</td>
											<td class="text-end">S/ {{ fmt(item.precio_kids) }}</td>
											<td class="text-end">S/ {{ fmt(Number(item.precio_kids || 0) * kids) }}</td>
										</tr>
									</template>
								</tbody>
								<tfoot>
									<tr v-if="totalDescuento > 0">
										<td colspan="3" class="text-end">Descuento</td>
										<td class="text-end">- S/ {{ fmt(totalDescuento) }}</td>
									</tr>
									<tr>
										<td colspan="3" class="text-end">TOTAL</td>
										<td class="text-end">S/ {{ fmt(totalFinal) }}</td>
									</tr>
								</tfoot>
							</table>
						</div>

						<!-- Recomendaciones -->
						<div class="seccion">
							<div class="titulo">RECOMIENDACIONES</div>
							<div v-if="temporada">
								<div class="detalle" style="font-weight:700; color:#306dac;">{{ temporada.titulo }}</div>
								<div class="detalle" v-html="temporada.contenido"></div>
							</div>
							<div v-else class="detalle" style="color:#888;">Sin recomendaciones de temporada.</div>
						</div>

						<!-- Fotos en mosaico -->
						<div v-if="fotos.length" class="seccion">
							<div class="titulo">GALERÍA</div>
							<div class="mosaico">
								<img v-for="(f, i) in fotos" :key="i" :src="f" alt="Foto del tour">
							</div>
						</div>
					</div>

					<!-- ══════════ PIE DE PÁGINA ══════════ -->
					<div id="pdf-footer" class="pdf-footer">
						<div class="fila1">
							<span class="txt">¡Reserva tu aventura hoy mismo con nosotros!.</span>
							<span class="wa"><i class="bi bi-whatsapp"></i> CONFIRMAR POR WHATSAPP 9647614293</span>
						</div>
						<div class="fila2">
							https://grupoeuroandino.com &middot; grupoeuroandino@hotmail.com
						</div>
					</div>
				</div>
			</div>

			<!-- Botón flotante de descarga -->
			<button class="fab-pdf" @click="exportarPDF" :disabled="exportando" title="Descargar PDF">
				<i class="bi bi-download"></i>
				<i class="bi bi-file-pdf"></i>
				<span v-if="exportando" class="spinner-border spinner-border-sm ms-1"></span>
			</button>
		</template>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import api from '@/services/axios';
import logoUrl from '@/assets/logo.webp';
import { useCotizacionStore } from '@/stores/cotizacionStore';
import { useConfiguracionStore } from '@/stores/configuracionStore';
import { useAuthStore } from '@/stores/auth';
import { useFormat } from '@/composables/formatos';

const props = defineProps({
	id: [String, Number],
});

const route = useRoute();
const cotizacionStore = useCotizacionStore();
const configStore = useConfiguracionStore();
const authStore = useAuthStore();
const { fechaLatamSimple } = useFormat();

const API_GRUPO = import.meta.env.VITE_API_GRUPO;
const FOTOS_BASE = 'https://grupoeuroandino.com/app/render/images/subidas/';

const cotizacion = ref(null);
const cargando = ref(true);
const error = ref('');
const toursData = ref([]);
const fotos = ref([]);
const temporadas = ref([]);
const temporadaId = ref(null);
const temporada = ref(null);
const exportando = ref(false);

// ── Computed ──
const codigo = computed(() => 'COT-' + String(Number(props.id)).padStart(3, '0'));
const adults = computed(() => Number(cotizacion.value?.adults || 0));
const kids = computed(() => Number(cotizacion.value?.kids || 0));
const items = computed(() => cotizacion.value?.items || []);
const cliente = computed(() => cotizacion.value?.cliente || {});
const clienteNombre = computed(() => {
	const c = cliente.value;
	if (!c) return '-';
	return c.razon_social || [c.apellidos, c.nombres].filter(Boolean).join(' ') || '-';
});
const asesor = computed(() => authStore.user?.nombre || cotizacion.value?.usuario?.nombre || '-');
const modalidad = computed(() => {
	const m = cotizacion.value?.compartido || 'compartido';
	return m === 'privado' ? 'Privado' : 'Compartido';
});
const fechaEmision = computed(() => fechaLatamSimple(cotizacion.value?.fecha) || fechaLatamSimple(new Date().toISOString()));
const fechaViaje = computed(() => (cotizacion.value?.fecha_inicio ? fechaLatamSimple(cotizacion.value.fecha_inicio) : 'Por confirmar'));
const puntoPartida = computed(() => cotizacion.value?.ruta || 'Por confirmar');
const totalDescuento = computed(() => {
	if (!cotizacion.value) return 0;
	return items.value.reduce((acc, item) => acc + Number(item.descuento || 0), 0);
});
const totalFinal = computed(() => {
	if (!cotizacion.value) return 0;
	const suma = items.value.reduce((acc, item) => {
		return acc + Number(item.precio_adulto || 0) * adults.value + Number(item.precio_kids || 0) * kids.value;
	}, 0);
	return Math.max(0, suma - totalDescuento.value);
});

const fmt = (val) => {
	const num = Number(val || 0);
	return isNaN(num) ? '0.00' : num.toFixed(2);
};

// ── Carga de datos ──
onMounted(async () => {
	try {
		const data = await cotizacionStore.obtenerPorId(props.id);
		cotizacion.value = data;
		await cargarTemporadas();
		temporadaId.value = Number(route.query.temporada_id) || data.temporada_id || null;
		await cargarTemporadaSeleccionada();
		await cargarTours();
	} catch (err) {
		console.error('Error al cargar cotización:', err);
		error.value = 'No se pudo cargar la cotización. Verifica que exista o intente nuevamente.';
	} finally {
		cargando.value = false;
	}
});

watch(temporadaId, async (val) => {
	if (val === null || val === undefined) {
		temporada.value = null;
		return;
	}
	const found = temporadas.value.find((t) => t.id === val);
	if (found) {
		temporada.value = found.valor;
	} else {
		await cargarTemporadaSeleccionada();
	}
});

async function cargarTemporadas() {
	try {
		await configStore.cargarTemporadas();
		temporadas.value = configStore.temporadas;
	} catch (e) {
		console.warn('No se pudieron cargar temporadas:', e);
		temporadas.value = [];
	}
}

async function cargarTemporadaSeleccionada() {
	if (!temporadaId.value) {
		temporada.value = null;
		return;
	}
	const found = temporadas.value.find((t) => t.id === temporadaId.value);
	if (found) {
		temporada.value = found.valor;
		return;
	}
	try {
		const { data } = await api.get(`/temporada/${temporadaId.value}`);
		temporada.value = data.valor;
	} catch (e) {
		console.warn('No se pudo cargar la temporada:', e);
		temporada.value = null;
	}
}

async function cargarTours() {
	const tourItems = items.value.filter((i) => i.id_tour);
	if (!tourItems.length) return;

	for (const item of tourItems) {
		try {
			const resp = await fetch(`${API_GRUPO}verTourPorId_v2.php`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: item.id_tour }),
			});
			const body = await resp.json();
			const content = body?.tour?.contenido ? JSON.parse(body.tour.contenido) : {};

			const nombresFotos = (content.fotos || [])
				.map((f) => (typeof f === 'string' ? f : f?.nombreRuta || f?.[0]))
				.filter(Boolean);

			const fotosData = [];
			for (const nombre of nombresFotos) {
				const dataUrl = await cargarFotoDataUrl(FOTOS_BASE + nombre);
				if (dataUrl) fotosData.push(dataUrl);
			}

			toursData.value.push({
				nombre: content.nombre || item.descripcion || 'Servicio',
				descripcion: content.descripcion || null,
				partida: content.partida || null,
				itinerario: content.itinerario || null,
				incluye: content.incluye || null,
				noincluye: content.noIncluye || null,
			});
			fotos.value.push(...fotosData);
		} catch (e) {
			console.error('Error al cargar tour web:', e);
			toursData.value.push({
				nombre: item.descripcion || 'Servicio',
				descripcion: null,
				partida: null,
				itinerario: null,
				incluye: null,
				noincluye: null,
			});
		}
	}
}

async function cargarFotoDataUrl(url) {
	try {
		const resp = await api.get('/proxy-imagen', { params: { url }, responseType: 'blob' });
		return await blobToDataUrl(resp.data);
	} catch (e) {
		console.warn('No se pudo cargar foto:', url, e);
		return null;
	}
}

function blobToDataUrl(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

// ── Exportar PDF (encabezado y pie en cada hoja) ──
async function exportarPDF() {
	if (exportando.value) return;
	exportando.value = true;
	try {
		await nextTick();

		const headerEl = document.getElementById('pdf-header');
		const contentEl = document.getElementById('pdf-content');
		const footerEl = document.getElementById('pdf-footer');
		if (!headerEl || !contentEl || !footerEl) return;

		const opts = {
			scale: 2,
			useCORS: true,
			backgroundColor: '#ffffff',
			logging: false,
			windowWidth: 794,
		};

		const headerCanvas = await html2canvas(headerEl, opts);
		const footerCanvas = await html2canvas(footerEl, opts);
		const contentCanvas = await html2canvas(contentEl, opts);

		const pdf = new jsPDF('p', 'mm', 'a4');
		const pageW = 210;
		const pageH = 297;
		const marginX = 8; // margen horizontal solo para el contenido

		const headerHmm = headerCanvas.height / (headerCanvas.width / pageW);
		const footerHmm = footerCanvas.height / (footerCanvas.width / pageW);
		const contentTop = headerHmm;
		const contentBottom = pageH - footerHmm;
		const usableHmm = contentBottom - contentTop;
		const pxPerMm = contentCanvas.width / pageW;
		const usableHpx = usableHmm * pxPerMm;
		const totalPages = Math.max(1, Math.ceil(contentCanvas.height / usableHpx));

		const headerImg = headerCanvas.toDataURL('image/png');
		const footerImg = footerCanvas.toDataURL('image/png');

		for (let i = 0; i < totalPages; i++) {
			if (i > 0) pdf.addPage();
			pdf.addImage(headerImg, 'PNG', 0, 0, pageW, headerHmm);
			pdf.addImage(footerImg, 'PNG', 0, pageH - footerHmm, pageW, footerHmm);

			const srcY = Math.round(i * usableHpx);
			const srcH = Math.min(usableHpx, contentCanvas.height - srcY);
			if (srcH > 0) {
				const slice = document.createElement('canvas');
				slice.width = contentCanvas.width;
				slice.height = Math.round(srcH);
				const ctx = slice.getContext('2d');
				ctx.drawImage(contentCanvas, 0, srcY, contentCanvas.width, srcH, 0, 0, contentCanvas.width, srcH);
				pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', marginX, contentTop, pageW - 2 * marginX, srcH / pxPerMm);
			}
		}

		pdf.save(`Cotizacion-${codigo.value}.pdf`);
	} catch (err) {
		console.error('Error al exportar PDF:', err);
		Swal.fire('Error', 'No se pudo generar el PDF. Intente nuevamente.', 'error');
	} finally {
		exportando.value = false;
	}
}
</script>

<style scoped>
.pdf-scroll {
	overflow-x: auto;
	padding-bottom: 40px;
}

.pdf-document {
	width: 794px;
	margin: 0 auto;
	background: #fff;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
	font-family: 'Segoe UI', Arial, sans-serif;
	color: #333;
	font-size: 12px;
	line-height: 1.5;
}

/* ── Encabezado ── */
.pdf-header {
	background: linear-gradient(180deg, #1b3d6a 0%, #2864a2 100%);
	color: #fff;
	display: flex;
	align-items: stretch;
}

.h-logo {
	width: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px 8px;
}

.h-logo img {
	max-width: 70px;
	max-height: 62px;
	object-fit: contain;
}

.h-info {
	flex: 1;
	padding: 10px 12px;
}

.h-info .titulo {
	font-size: 20px;
	font-weight: 800;
	letter-spacing: 1px;
}

.h-info .subtitulo {
	font-size: 11px;
	opacity: 0.92;
}

.h-info .datos {
	font-size: 10.5px;
	margin-top: 6px;
	line-height: 1.55;
	opacity: 0.95;
}

.h-cot {
	width: 210px;
	padding: 10px 12px;
	text-align: right;
}

.h-cot .badge-cot {
	background: #ec8832;
	color: #fff;
	font-weight: 700;
	padding: 6px 10px;
	border-radius: 4px;
	display: inline-block;
	font-size: 13px;
}

.h-cot .datos {
	font-size: 10.5px;
	margin-top: 8px;
	line-height: 1.6;
}

/* ── Contenido ── */
.pdf-content {
	padding: 12px;
}

.datos-cliente {
	background: #f6fafd;
	padding: 14px 16px;
	display: flex;
	gap: 20px;
}

.datos-cliente .col {
	flex: 1;
}

.datos-cliente .titulo {
	color: #2f679a;
	font-weight: 800;
	font-size: 13px;
	margin-bottom: 8px;
}

.dato {
	font-size: 11.5px;
	margin-bottom: 4px;
}

.dato .lbl {
	font-weight: 700;
	color: #555;
}

.seccion {
	background: #ebf8ff;
	color: #306dac;
	padding: 14px 16px;
	margin-top: 10px;
}

.seccion .titulo {
	font-weight: 800;
	font-size: 13px;
	margin-bottom: 8px;
}

.seccion .detalle {
	font-size: 11.5px;
	color: #444;
	margin-bottom: 6px;
}

.tabla-inversion {
	width: 100%;
	border-collapse: collapse;
	margin-top: 6px;
}

.tabla-inversion th {
	background: #306dac;
	color: #fff;
	padding: 7px 10px;
	font-size: 11px;
	text-align: left;
}

.tabla-inversion td {
	border: 1px solid #cfe3f5;
	padding: 7px 10px;
	font-size: 11.5px;
	color: #333;
}

.tabla-inversion tfoot td {
	font-weight: 800;
	background: #dceefc;
}

.mosaico {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 6px;
}

.mosaico img {
	width: 100%;
	object-fit: cover;
	border-radius: 4px;
}

.mosaico img:nth-child(3n+1) {
	grid-column: span 6;
	height: 300px;
}

.mosaico img:nth-child(3n+2),
.mosaico img:nth-child(3n+3) {
	grid-column: span 3;
	height: 220px;
}

/* ── Pie de página ── */
.pdf-footer {
	margin-top: 12px;
	background: #2e3748;
	color: #fae4b3;
}

.pdf-footer .fila1 {
	background: #2e3748;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 14px;
}

.pdf-footer .fila1 .txt {
	color: #fae4b3;
	font-size: 12px;
	font-weight: 600;
}

.pdf-footer .fila1 .wa {
	background: #2ac669;
	color: #fff;
	font-weight: 700;
	padding: 6px 12px;
	border-radius: 20px;
	font-size: 12px;
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

.pdf-footer .fila2 {
	text-align: center;
	padding: 6px;
	font-size: 11px;
	color: #fae4b3;
}

/* ── Botón flotante ── */
.fab-pdf {
	position: fixed;
	bottom: 24px;
	right: 24px;
	z-index: 1050;
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 14px 18px;
	border: none;
	border-radius: 50px;
	background: #10b981;
	color: #fff;
	font-size: 18px;
	box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
	cursor: pointer;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.fab-pdf:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5);
}

.fab-pdf:disabled {
	opacity: 0.7;
	cursor: wait;
}
</style>