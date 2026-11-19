import api from './api';

export const orderService = {
    getAll: async () =>{
        const response = await api.get('/production-orders');
        return response.data;
    },
    getById: async(id) =>{
        const response = await api.get(`/production-order/${id}`);
        return response.data;
    },
    create: async(orderData) =>{
        const response = await api.put(`production-order/`,orderData);
        return response.data;
    },
    start: async(id)=>{
        const response = await api.patch(`production-orders/${id}/start`);
        return response.data;
    },
    finish: async(id)=>{
        const response = await api.patch(`production-orders/${id}/finish`);
        return response.data;
    },
    cancel: async(id)=>{
        const response = await api.patch(`/production-orders/${id}/cancel`);
        return response.data;
    },
    update: async (id,orderData) => {
        const response = await api.put(`/production-orders/${id}`,orderData);
        return response.data;
    }

};

export default orderService;