import api from './api';

export const authService = {
    login: async(credentials) =>{
        const response = await api.post('/auth/login',credentials);

        return response.data;
    },
    getMe: async() => {
        const response = await api.get('/auth/me');
        return response.data.user
    },
    updateMe: async (userData) => {
        const response = await api.put('/auth/me',userData);
        return response.data;
    },
    checkInstallation: async () => {
        const response = await api.get('/installation/status');
        return response.data;
    },
};

export default authService;