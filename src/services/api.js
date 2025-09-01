import axios from "axios";

const PROD_API = 'https://api-server-orcin.vercel.app'; 
const LOCAL_API = 'http://localhost:3000';

const baseURL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? LOCAL_API
  : PROD_API;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export default api;