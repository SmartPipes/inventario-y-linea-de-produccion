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
    loading: true, // Añadir una propiedad de loading
    error: null // Añadir una propiedad para almacenar errores
};

export default function(state = initialState, action) {
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
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh,
                user: payload.user || state.user,
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
                user: payload,
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
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: payload
            };
        default:
            return state;
    }
}
