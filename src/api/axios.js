import axios from "axios";

const api = axios.create({
  baseURL: "https://cravecart-5.onrender.com/api",
  withCredentials: true
});

export default api;
