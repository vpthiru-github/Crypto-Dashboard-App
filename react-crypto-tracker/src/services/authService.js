import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/users/register`, {
        name,
        email,
        password
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const getToken = () => {
    return localStorage.getItem('token');
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    getToken
};

export default authService;
