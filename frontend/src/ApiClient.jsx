import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

//const API_URL = 'https://smartpipes.cloud/api';
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

// Para obtener el id del usuario
const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.user_id;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

apiClient.interceptors.request.use(async config => {
  console.log('Intercepted request');

  if (!ACCESS_TOKEN) {
    console.log('No access token found, logging in...');
    await login('smartpipes@gmail.com', 'HPT2024SP');
  }
  
  if (ACCESS_TOKEN) {
    config.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
    console.log('Access token set in request:', ACCESS_TOKEN);
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Access token expired, attempting to refresh...');

      try {
        const refreshResponse = await axios.post(`${API_URL}${REFRESH_ENDPOINT}`, {
          refresh: REFRESH_TOKEN
        });

        if (refreshResponse.status === 200) {
          ACCESS_TOKEN = refreshResponse.data.access;
          localStorage.setItem('access_token', ACCESS_TOKEN);
          apiClient.defaults.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
          originalRequest.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
          console.log('Token refreshed successfully:', ACCESS_TOKEN);
          return apiClient(originalRequest);
        } else {
          console.log('Token refresh failed, logging in again...');
          await login('smartpipes@gmail.com', 'HPT2024SP');
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

const logout = () => {
  console.log('Logging out...');
  ACCESS_TOKEN = '';
  REFRESH_TOKEN = '';
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  apiClient.defaults.headers['Authorization'] = '';
};

const getUserProfile = async () => {
  const userId = getUserIdFromToken(ACCESS_TOKEN);

  if (!userId) {
    throw new Error('User ID not found');
  }

  try {
    const response = await apiClient.get(`/users/users/${userId}/`);
    console.log('User profile data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile', error);
    throw error;
  }
};

// Nueva función para tomar los metodos de pago del usuario
const getPaymentMethods = async () => {
  const userId = getUserIdFromToken(ACCESS_TOKEN);

  if (!userId) {
    throw new Error('User ID not found');
  }

  try {
    const response = await apiClient.get(`/users/payment-methods/?client_id=${userId}`);
    console.log('User payment methods:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user payment methods', error);
    throw error;
  }
};

// Nueva función para actualizar el perfil del usuario
const updateUserProfile = async (profileData) => {
  const userId = getUserIdFromToken(ACCESS_TOKEN);

  if (!userId) {
      throw new Error('User ID not found');
  }

  try {
      const response = await apiClient.put(`/users/users/${userId}/`, profileData);
      console.log('User profile updated:', response.data);
      return response.data;
  } catch (error) {
      console.error('Failed to update user profile', error);
      throw error;
  }
};

// Nueva función para agregar un método de pago
const postPaymentMethod = async (paymentData) => {
  const userId = getUserIdFromToken(ACCESS_TOKEN);

  if (!userId) {
    throw new Error('User ID not found');
  }

  try {
    const response = await apiClient.post('/users/payment-methods/', {
      ...paymentData,
      client_id: userId
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add payment method', error);
    throw error;
  }
};

const updatePaymentMethod = async (id, data) => {
  console.log('Updating payment method with ID:', id, 'and data:', data); // Log ID and data

  try {
    const userId = getUserIdFromToken(ACCESS_TOKEN);

    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await apiClient.put(`/users/payment-methods/${id}/`, {
      ...data,
      client_id: userId, // Asegúrate de incluir client_id
    });
    console.log('Payment method updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update payment method', error);
    throw error;
  }
};

const deletePaymentMethod = async (id) => {
  console.log('Deleting payment method with ID:', id); // Log ID

  try {
    const userId = getUserIdFromToken(ACCESS_TOKEN);

    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await apiClient.delete(`/users/payment-methods/${id}/`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });
    console.log('Payment method deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to delete payment method', error);
    throw error;
  }
};

export { apiClient, login, logout, getUserProfile, updateUserProfile, getPaymentMethods, postPaymentMethod, updatePaymentMethod, deletePaymentMethod };
