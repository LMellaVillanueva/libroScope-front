import axios from "axios";

const BACK_URL = import.meta.env.VITE_BACK_URL

const api = axios.create({
    baseURL: BACK_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default api