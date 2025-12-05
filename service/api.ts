import axios from "axios";

const api = axios.create({
  baseURL: "https://orquestradorbmad.up.railway.app",
  withCredentials: true,
});

export default api;
