import { combineReducers } from 'redux'; // Asegúrate de usar la importación correcta de 'redux'
import auth from './auth'; // Asegúrate de que la ruta sea correcta

const rootReducer = combineReducers({
    auth: auth,
    // Otros reducers aquí
});

export default rootReducer;
