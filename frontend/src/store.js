// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './components/reducers/index'; // Asegúrate de que la ruta sea correcta

const store = configureStore({
    reducer: rootReducer,
    // `redux-thunk` ya está incluido por defecto en @reduxjs/toolkit
    // No es necesario añadirlo manualmente
});

export default store;
