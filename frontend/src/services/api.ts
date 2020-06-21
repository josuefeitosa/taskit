import axios from 'axios';

const api = axios.create({
  baseURL: 'http://backend-container:3333',
});

export default api;
