import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_IP}`,
    withCredentials: true
});

export default api;