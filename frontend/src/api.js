import axios from 'axios';

const getBaseURL = () => {
    let url;
    if (import.meta.env.VITE_API_URL) {
        url = import.meta.env.VITE_API_URL;
    } else if (window.location.port === '5173') {
        url = `http://${window.location.hostname}:8000/api/`;
    } else {
        url = '/api/';
    }
    console.log('Using API Base URL:', url);
    return url;
};

const API = axios.create({
    baseURL: getBaseURL(),
});

// Add interceptor to attach token to requests
API.interceptors.request.use((config) => {
    console.log(`📡 Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
});

API.interceptors.response.use((response) => {
    console.log(`✅ Response: ${response.status} from ${response.config.url}`);
    return response;
}, (error) => {
    console.error('❌ Response Error Details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config?.url
    });
    return Promise.reject(error);
});

export const login = (credentials) => API.post('token/', credentials);
export const signup = (data) => API.post('signup/', data);

export const getExpenses = (params) => API.get('expenses/', { params });
export const createExpense = (data) => API.post('expenses/', data);
export const updateExpense = (id, data) => API.put(`expenses/${id}/`, data);
export const deleteExpense = (id) => API.delete(`expenses/${id}/`);

export const getCategories = () => API.get('categories/');
export const createCategory = (data) => API.post('categories/', data);
export const updateCategory = (id, data) => API.put(`categories/${id}/`, data);
export const deleteCategory = (id) => API.delete(`categories/${id}/`);

export default API;
