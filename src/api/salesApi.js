import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const createSale = (saleData) => axios.post(`${BASE_URL}/api/sales/`, saleData);
