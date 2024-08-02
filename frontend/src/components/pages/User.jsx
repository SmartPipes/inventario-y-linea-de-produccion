// frontend/src/components/pages/User.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { load_user } from '../actions/auth';

const User = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);

  useEffect(() => {
      dispatch(load_user());
  }, [dispatch]);

  if (loading) {
      return <p>Loading...</p>;
  }

  if (error) {
      return <p>Error: {error}</p>;
  }

  if (!user) {
      return <p>No user data available</p>;
  }

  return (
      <div>
          <h1>Profile</h1>
          <p>Name: {user.first_name} {user.last_name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Role: {user.role}</p>
          <p>Status: {user.status}</p>

          <h2>Divisions</h2>
          {user.divisions && user.divisions.length > 0 ? (
            <ul>
                {user.divisions.map(division => (
                    <li key={division.division_id}>
                        {division.name} (Manager ID: {division.manager_user})
                    </li>
                ))}
            </ul>
          ) : (
            <p>No divisions available</p>
          )}

          <h2>Division Users</h2>
          {user.divisionUsers && user.divisionUsers.length > 0 ? (
            <ul>
                {user.divisionUsers.map(divisionUser => (
                    <li key={divisionUser.division_user_id}>
                        Division ID: {divisionUser.division} - User ID: {divisionUser.user} (Assigned Date: {divisionUser.assigned_date})
                    </li>
                ))}
            </ul>
          ) : (
            <p>No division users available</p>
          )}

          <h2>Payment Methods</h2>
          {user.paymentMethods && user.paymentMethods.length > 0 ? (
            <ul>
                {user.paymentMethods.map(paymentMethod => (
                    <li key={paymentMethod.id}>
                        Type: {paymentMethod.payment_type}, Provider: {paymentMethod.provider}, Account Number: {paymentMethod.account_number}, Expiry Date: {paymentMethod.expire_date}, Name on Account: {paymentMethod.name_on_account}, Default: {paymentMethod.is_default ? 'Yes' : 'No'}
                    </li>
                ))}
            </ul>
          ) : (
            <p>No payment methods available</p>
          )}
      </div>
  );
};

export default User;
