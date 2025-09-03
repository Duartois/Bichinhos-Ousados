import axios from "axios";

const api = axios.create({
  baseURL: "https://api-server-orcin.vercel.app", // sua API na Vercel
  headers: { "Content-Type": "application/json" },
});

export default api;
