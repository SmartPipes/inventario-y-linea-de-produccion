// frontend/src/components/actions/auth.js
import axios from 'axios';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGOUT
} from './types';

const apiUrl = import.meta.env.VITE_API_URL;

// Acción para cargar el perfil del usuario
export const load_user = () => async dispatch => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${apiUrl}/auth/users/me/`, config);
            console.log('User data:', res.data);
            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            console.error('Error loading user:', err);
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};

// Acción para verificar si el usuario está autenticado
export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const body = JSON.stringify({ token: localStorage.getItem('access') });

        try {
            const res = await axios.post(`${apiUrl}/auth/jwt/verify/`, body, config);

            if (res.data.code !== 'token_not_valid') {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }

    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
};

// Acción para iniciar sesión
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${apiUrl}/auth/jwt/create/`, body, config);

        // Log the response to ensure it contains the expected data
        console.log('Login response:', res.data);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(load_user()); // Llama a load_user para cargar el usuario después del login
    } catch (err) {
        console.error('Login error:', err);
        dispatch({
            type: LOGIN_FAIL
        });
    }
};

// Acción para registrar un usuario
export const registerUser = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify(formData);

    try {
        const res = await axios.post(`${apiUrl}/auth/users/`, body, config);

        // Log the response to ensure it contains the expected data
        console.log('Registration response:', res.data);

        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        console.error('Registration error:', err);
        dispatch({
            type: SIGNUP_FAIL
        });
    }
};

// Acción para cerrar sesión
export const logout = () => dispatch => {
    // Elimina los tokens del almacenamiento local
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    
    // Actualiza el estado de Redux
    dispatch({
        type: LOGOUT
    });
    
    // Redirige al usuario a la página de inicio de sesión
    // Puedes usar la navegación programática si estás usando React Router
    // window.location.href = '/login';
};
