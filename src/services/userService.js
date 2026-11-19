import api from './api';

export const userService = {
    getAll: async() =>{
        const response = await api.get('/users');
        return response.data;
    },
    create: async(userData) =>{
        const response = await api.post('/users',userData);
        return response.data;
    },
}

export default userService;