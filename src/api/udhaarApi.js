import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const getSalesUdhaar = () => axios.get(`${BASE_URL}/api/udhaar/sales/`);
export const getPurchaseUdhaar = () => axios.get(`${BASE_URL}/api/udhaar/purchases/`);
export const clearSalesUdhaar = (id) => axios.delete(`${BASE_URL}/api/udhaar/sales/${id}`);
export const clearPurchaseUdhaar = (id) => axios.delete(`${BASE_URL}/api/udhaar/purchases/${id}`);
