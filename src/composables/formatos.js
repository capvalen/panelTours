import dayjs from 'dayjs'
import 'dayjs/locale/es'

import relativeTime from 'dayjs/plugin/relativeTime'

// Configurar plugins e idioma una sola vez
dayjs.extend(relativeTime)
dayjs.locale('es')

export function useFormat() {
  const formatDate = (date, format = 'D MMMM YYYY h:mm a') => {
    if (!date) return ''
    return dayjs(date).format(format)
  }
  const fechaLatamCorta = (date, format = 'ddd DD/MM/YYYY') => {
    if (!date) return ''
    return dayjs(date).format(format)
  }
  const fechaLatamSimple = (date, format = 'DD/MM/YYYY') => {
    if (!date) return ''
    return dayjs(date).format(format)
  }
  const horaCorta = (date, format = 'h:mm a') => {
    if (!date) return ''
    return dayjs(date).format(format)
  }

  const formatRelative = (date) => {
    if (!date) return ''
    return dayjs(date).fromNow()
  }

	const formatMoneda = (monto) =>{
		if(!monto) return 'S/ 0.00'
		return 'S/ '+ parseFloat(monto).toFixed(2)
	}
	const formatDecimal = (monto) =>{
		if(!monto) return ''
		return parseFloat(monto).toFixed(2)
	}

	const formatHoy = ()=>{
		return dayjs().format('YYYY-MM-DD');
	}
	const ahora = ()=>{
		return dayjs().format('YYYY-MM-DD HH:mm:ss');
	}
	const rutaArchivo = (link)=>{
		if(!link) return ''
		
		if( import.meta.env.MODE == 'development') return 'http://127.0.0.1:8000/adjuntos/'+link
		if( import.meta.env.MODE == 'production') return 'http://grupoeuroandino.com/app/.../adjuntos/'+link //<-- cambiar URL de producción
	}

  return {
    formatDate,
    formatRelative,
		formatMoneda,
		formatDecimal,
		fechaLatamCorta, fechaLatamSimple, horaCorta,
		formatHoy, ahora,
		rutaArchivo
  }
}