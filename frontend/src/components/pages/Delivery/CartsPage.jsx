import React, { useState, useEffect } from 'react';
import { API_URL_DELIVERY_CARTS } from  '../../pages/Config';  // Ajusta la ruta de importación según sea necesario
import axios from 'axios';

const CartsPage = () => {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await axios.get(API_URL_DELIVERY_CARTS);
        setCarts(response.data);
      } catch (error) {
        console.error('Error fetching carts:', error);
      }
    };

    fetchCarts();
  }, []);

  return (
    <div>
      <h1>Carts</h1>
      <table>
        <thead>
          <tr>
            <th>Cart ID</th>
            <th>Cart Details</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart) => (
            <tr key={cart.id}>
              <td>{cart.id}</td>
              <td>{cart.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartsPage;
