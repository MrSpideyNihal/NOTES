import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Netlify redirects /api to functions
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
});

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Logic handled in AuthContext usually, but good to know
        }
        return Promise.reject(error);
    }
);

export default api;
