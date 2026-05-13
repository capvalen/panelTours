# Estructura de Solicitud - Recursos (Detalle de Venta)

Base de item: `venta.items[x]`

Tipo para subdividir:
- Principal: `venta.tipo`
- Fallback práctico en UI: `venta.items[x].tipo`

## Campos comunes de Solicitud
- `nombre_cliente`
- `estado` (`pendiente`, `confirmado`, `cancelado`, `completado`)
- `descripcion`

## Restaurant
### Requerimientos (`venta.items[x]`)
- `nombre_cliente`
- `estado`
- `numero_personas`
- `fecha_confirmacion`
- `turno`
- `tipo_servicio`
- `espacio`
- `precio`
- `fecha_reserva`
- `hora_reserva`
- `pedido_especial`

### Asignado (`venta.items[x].detalles.restaurante`)
- `nombre`
- `contacto` (fallback: `sin contacto`)
- `comprobante`
- `motivo_cancelacion` (si estado es `cancelado`)

## Hospedaje
### Requerimientos (`venta.items[x]`)
- `cantidad_noches`
- `num_habitaciones`
- `tipo_habitacion`
- `fecha_ingreso`
- `fecha_salida`
- `hora_checkin`
- `hora_checkout`
- `cantidad_adultos`
- `cantidad_ninos`
- `precio_por_noche`
- `precio`
- `requiere_cuna`
- `habitacion_fumador`
- `preferencias_especiales`

### Asignado (`venta.items[x].detalle.hospedaje`)
- `hospedaje`
- `contacto`
- `celular`

### Regresan a `venta.items[x]`
- `numero_habitacion`
- `estado`
- `estado_pago`
- `motivo_cancelacion`
- `nombre_titular`
- `documento_titular`
- `datos_contacto`

## Vuelo
### Requerimientos (`venta.items[x]`)
- `origen`
- `destino`
- `pasajeros`
- `lleva_equipaje` (si/no)
- `kilos` (int)
- `que_equipaje`
- `precio_ticket`
- `precio_soles`
- `precio_dolares`
- `fecha_salida`
- `fecha_llegada`
- `hora_salida`
- `horario_llegada`
- `observaciones`

### Asignado (`venta.items[x].detalles`)
- `aerolinea`
- `codigo_vuelo`
- `numero_vuelo`
- `aeronave`
- `clase_vuelo`
- `escala`
- `terminal_salida`
- `puerta_embarque`
- `terminal_llegada`
- `estado_tramo`
- `asientos_asignados`
- `duracion_minutos`
- `costo_soles`
- `costo_dolares`

## Transporte
### Requerimientos (`venta.items[x]`)
- `origen`
- `destino`
- `fecha_inicio`
- `fecha_fin`
- `hora_recogida`
- `hora_devolucion`
- `costo`
- `precio`
- `pasajeros`
- `observaciones`

### Asignado
- `venta.items[x].detalles.estado_alquiler`
- Vehículo en `venta.items[x].detalle.vehiculo`
- `venta.items[x].detalle.vehiculo.nombre_conductor`
- `venta.items[x].detalle.vehiculo.placa`
- `venta.items[x].detalle.vehiculo.tipo_combustible`
