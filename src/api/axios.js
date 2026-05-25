import axios from "axios";

const API = axios.create({
  baseURL: "https://cravecart-5.onrender.com/api",
  withCredentials: true
});

export default API;
