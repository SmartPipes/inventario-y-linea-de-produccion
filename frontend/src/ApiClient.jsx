import axios from 'axios';

const API_URL = 'https://smartpipes.cloud/api';
const TOKEN_ENDPOINT = '/token/';
const REFRESH_ENDPOINT = '/token/refresh/';

let ACCESS_TOKEN = localStorage.getItem('access_token') || '';
let REFRESH_TOKEN = localStorage.getItem('refresh_token') || '';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(async config => {
  if (!ACCESS_TOKEN) {

    await login('smartpipes@gmail.com', 'HPT2024sp');
  }
  
  if (ACCESS_TOKEN) {
    config.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(`${API_URL}${REFRESH_ENDPOINT}`, {
          refresh: REFRESH_TOKEN
        });

        if (refreshResponse.status === 200) {
          ACCESS_TOKEN = refreshResponse.data.access;
          localStorage.setItem('access_token', ACCESS_TOKEN);
          apiClient.defaults.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
          originalRequest.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
          return apiClient(originalRequest);
        } else {
          await login('smartpipes@gmail.com', 'HPT2024sp');
          originalRequest.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        console.error('Error refreshing token:', err);
      }
    }

    return Promise.reject(error);
  }
);

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}${TOKEN_ENDPOINT}`, { email, password });
    const { access, refresh } = response.data;
    ACCESS_TOKEN = access;
    REFRESH_TOKEN = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    apiClient.defaults.headers['Authorization'] = `Bearer ${access}`;
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

const logout = () => {
  ACCESS_TOKEN = '';
  REFRESH_TOKEN = '';
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  apiClient.defaults.headers['Authorization'] = '';
};

export { apiClient, login, logout };
