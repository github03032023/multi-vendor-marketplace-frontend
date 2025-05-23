import axios from '../api/axiosSetUp';

export const createOrder = (data) => axios.post('/order/createOrder', data);
export const getOrder = (id) => axios.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => axios.patch(`/orders/${id}/status`, data);
export const updateSubOrderStatus = (id, data) => axios.patch(`/orders/${id}/suborder/status`, data);
