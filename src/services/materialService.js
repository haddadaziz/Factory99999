import api from './api';

export const materialService = {
    getAll: async () => {
        const response = await api.get('/raw-materials');
        return response.data;
    },
    getAlerts: async () =>{
        const response = await api.get('/raw-materials/alerts');
        return response.data;
    },
    getById: async(id) => {
        const response = await api.get(`/raw-materials/${id}`);
        return response.data;
    },
    create: async (materialData) => {
        const response = await api.post('/raw-materials',materialData);
        return response.data;
    },
    update: async(id,materialData) => {
        const response = await api.put(`/raw-materials/${id}`,materialData);
        return response.data;
    },
    delete: async(id) =>{
        const response = await api.delete(`/raw-materials/${id}`);
        return response.data;
    }
};

export default materialService;