import axios from "axios";

const BASE_URL = "http://localhost:8000"; 

export const getProducts = () => axios.get(`${BASE_URL}/api/products/`);

export const addProduct = (productData) => axios.post(`${BASE_URL}/api/products/`, productData);

export const updateProduct = (productId, updatedData) =>
  axios.put(`${BASE_URL}/api/products/${productId}`, updatedData);

export const deleteProduct = (productId) =>
  axios.delete(`${BASE_URL}/api/products/${productId}`);
