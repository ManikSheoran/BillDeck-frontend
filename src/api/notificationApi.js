import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const getUdhaarNotifications = () => axios.get(`${BASE_URL}/api/udhaar/notifications/`);
