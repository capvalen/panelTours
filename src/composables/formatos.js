import dayjs from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime'
import { useDepartamentosStore } from '@/stores/departamentoStore'

// Configurar plugins e idioma una sola vez
dayjs.extend(relativeTime)
dayjs.locale('es')
dayjs.extend(utc);

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
		//console.log(date)
    if (!date) return 'Sin fecha'
    return dayjs.utc(date).fromNow()
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

	const capitalize = (text) => {
		if (!text) return ''
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
	}

	const usuarioActual = ()=>{
		const userString = localStorage.getItem('user');
		if (!userString) {
			throw new Error('Usuario no autenticado en localStorage')
			return;
		}
		return JSON.parse(userString);
	}

	const listaDepartamentos = async () => {
		const deptosStore = useDepartamentosStore();
		if (deptosStore.departamentos.length === 0) {
			await deptosStore.listar();
		}
		return deptosStore.departamentos;
	}

  return {
    formatDate,
    formatRelative,
		formatMoneda,
		formatDecimal,
		fechaLatamCorta, fechaLatamSimple, horaCorta,
		formatHoy, ahora,
		rutaArchivo,
		capitalize, usuarioActual,
		listaDepartamentos
  }
}