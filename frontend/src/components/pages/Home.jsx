import React from 'react'
import Sidebar from '../items/Sidebar';
import { useCart } from '../../context/CartContext';

export const Home = () => {
  const { showSidebar } = useCart();

  return (
    <div>
      <h2>Home</h2>
      <Sidebar />
    </div>
  )
}

