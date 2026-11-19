import axios from 'axios';
import {STORAGE_KEYS} from '../constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers:{
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
    }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if(error.response && error.response.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN),
            localStorage.removeItem(STORAGE_KEYS.USER)

            if(window.location.pathname !== '/login'){
                window.location.href = '/login';
            }
        }

        const message = error.response?.data?.message || error.message || 'Une erreur réseau est survenue'

        return Promise.reject(new Error(message));
    }
)

export default api;
