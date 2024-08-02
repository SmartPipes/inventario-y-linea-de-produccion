// frontend/src/components/reducers/auth.js
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
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    loading: true, // Propiedad para manejar el estado de carga
    error: null // Propiedad para manejar errores
};

export default function authReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: state.user // Mantén al usuario si ya está cargado
            };
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access); // Guardar el token de acceso
            localStorage.setItem('refresh', payload.refresh); // Guardar el token de actualización
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh,
                user: payload.user || state.user, // Usa los datos del usuario si están disponibles
                loading: false
            };
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false, // Puede que no quieras marcar como autenticado inmediatamente
                loading: false
            };
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: {
                    ...payload,
                    divisions: payload.divisions,
                    divisionUsers: payload.divisionUsers,
                    paymentMethods: payload.paymentMethods,
                },
                isAuthenticated: true,
                loading: false
            };
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                loading: false
            };
        case USER_LOADED_FAIL:
        case LOGIN_FAIL:
        case SIGNUP_FAIL:
        case LOGOUT:
            localStorage.removeItem('access'); // Limpiar el token de acceso
            localStorage.removeItem('refresh'); // Limpiar el token de actualización
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: payload // Almacena el error en el estado
            };
        default:
            return state;
    }
}
