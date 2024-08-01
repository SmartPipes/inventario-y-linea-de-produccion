// frontend/src/components/Profile.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { load_user } from '../actions/auth';

const User = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);

  useEffect(() => {
      dispatch(load_user());
  }, [dispatch]);

  if (loading) {
      return <p>Loading...</p>;
  }

  if (!user) {
      return <p>No user data available</p>; // Mensaje para cuando no hay datos de usuario
  }

  return (
      <div>
          <h1>Profile</h1>
          <p>Name: {user.first_name} {user.last_name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Role: {user.role}</p>
          <p>Status: {user.status}</p>
          {/* Add other fields as necessary */}
      </div>
  );
};


export default User;
