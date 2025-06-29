import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const createPurchase = (purchaseData) =>
  axios.post(`${BASE_URL}/api/purchases/`, purchaseData);
