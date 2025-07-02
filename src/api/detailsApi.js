import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const getSaleById = (saleId) => {
  return axios.get(`${BASE_URL}/api/sales/${saleId}`);
};

export const getPurchaseById = (purchaseId) => {
  return axios.get(`${BASE_URL}/api/purchases/${purchaseId}`);
};
