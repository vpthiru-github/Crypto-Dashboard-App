import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5002/api/watchlist';

const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
authAxios.interceptors.request.use((config) => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

const getWatchlist = async () => {
    const response = await authAxios.get('/');
    return response.data;
};

const addToWatchlist = async (coinId) => {
    const response = await authAxios.post('/add', { coinId });
    return response.data;
};

const removeFromWatchlist = async (coinId) => {
    const response = await authAxios.delete(`/remove/${coinId}`);
    return response.data;
};

const watchlistService = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist
};

export default watchlistService;
