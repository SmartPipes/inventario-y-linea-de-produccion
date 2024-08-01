import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../actions/auth'; // Asegúrate de que la ruta al archivo de acciones sea correcta

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login'); // Redirige al usuario a la página de login
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
