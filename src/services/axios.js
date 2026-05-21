import axios from 'axios';

const urlBase = import.meta.env.MODE === 'production'
	? 'https://apipanel.grupoeuroandino.com/api/'
  : 'http://127.0.0.1:8000/api/'

const api = axios.create({
  baseURL: urlBase,
  headers: {
    'Accept': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;