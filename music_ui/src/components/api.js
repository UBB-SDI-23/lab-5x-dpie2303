import axios from 'axios';

const api = axios.create({
  baseURL: 'http://54.172.39.129:8000/'
});

export default api;