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

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(async config => {
  console.log('Intercepted request');

  // If no access token, login to get tokens
  if (!ACCESS_TOKEN) {
    console.log('No access token found, logging in...');
    await login('smartpipes@gmail.com', '123');
  }
  
  // If access token exists, add it to the request headers
  if (ACCESS_TOKEN) {
    config.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
    console.log('Access token set in request:', ACCESS_TOKEN);
  }

 return config;
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If a 401 response is received and the request hasn't been retried yet
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Access token expired, attempting to refresh...');

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(`${API_URL}${REFRESH_ENDPOINT}`, {
          refresh: REFRESH_TOKEN
        });

        if (refreshResponse.status === 200) {
          // Update access token and retry the original request
          ACCESS_TOKEN = refreshResponse.data.access;
          localStorage.setItem('access_token', ACCESS_TOKEN);
          apiClient.defaults.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
          originalRequest.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
          console.log('Token refreshed successfully:', ACCESS_TOKEN);
          return apiClient(originalRequest);
        } else {
          // If refresh fails, login again
          console.log('Token refresh failed, logging in again...');
          await login('smartpipes@gmail.com', '123');
          originalRequest.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        console.error('Error refreshing token:', err);
        logout();
      }
    }

    return Promise.reject(error);
  }
);

// Login function to get new tokens
const login = async (email, password) => {
  try {
    console.log('Attempting login...');
    const response = await axios.post(`${API_URL}${TOKEN_ENDPOINT}`, { email, password });
    const { access, refresh } = response.data;
    ACCESS_TOKEN = access;
    REFRESH_TOKEN = refresh;
    console.log('Logged in successfully:', ACCESS_TOKEN);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    apiClient.defaults.headers['Authorization'] = `Bearer ${access}`;
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout function to clear tokens
const logout = () => {
  console.log('Logging out...');
  ACCESS_TOKEN = '';
  REFRESH_TOKEN = '';
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  apiClient.defaults.headers['Authorization'] = '';
};

export { apiClient, login, logout };