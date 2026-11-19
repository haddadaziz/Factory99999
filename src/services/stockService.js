import api from './api';

export const stockService = {
    getAllMovements : async()=>{
        const response = await api.get('/stock-movements');
        return response.data;
    },
    getMovementByMaterial: async(materialId) =>{
        const response  = await api.get(`stock-movements/material/${materialId}`);
        return response.data;
    },
    createMovement: async(movementData) =>{
        const response = await api.post('/stock-movements',movementData);
        return response.data;
    },
};

export default stockService;