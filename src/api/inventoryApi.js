import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const updateInventoryQuantity = (productName, quantity) => {
    return axios.put(`${BASE_URL}/api/products/${encodeURIComponent(productName)}`, {
        quantity: quantity
    });
}
