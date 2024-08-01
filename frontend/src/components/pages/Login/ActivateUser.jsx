import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../actions/auth'; // Asegúrate de tener esta acción para manejar el login

const ActivateUser = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleActivation = async () => {
      try {
        // Realiza la solicitud de activación al backend
        await axios.post(`${process.env.VITE_API_URL}/auth/users/activate/`, { uid, token });
        // Opcional: loguear al usuario automáticamente después de la activación
        dispatch(login({ uid, token }));
        navigate('/home'); // Redirigir a la página principal o a otra página después de la activación
      } catch (error) {
        setError('Failed to activate account. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    handleActivation();
  }, [uid, token, dispatch, navigate]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && <p>Activating your account...</p>}
    </div>
  );
};

export default ActivateUser;
