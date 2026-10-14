import axios from 'axios';


const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5175/api',
  withCredentials: true, // Include cookies in requests
});

export default agent;