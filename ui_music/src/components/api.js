import axios from 'axios';

const api = axios.create({
  baseURL: 'http://52.207.253.133:8000/'
});

export default api;