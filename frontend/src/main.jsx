import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import store from './store';
import App from './App';
import Login from './components/pages/Login/Login';
import Home from './components/pages/Home';
import ProductionLine from './components/pages/production/ProductionLine';
import ProductionPhase from './components/pages/production/ProductionPhase';
import Factory from './components/pages/production/Factory';
import InventoryPage from './components/pages/InventoryPage';
import Production from './components/pages/production/Production';
import User from './components/pages/User';
import Register from './components/Register'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<App />}>
          <Route path="home" element={<Home />} />
          <Route path="production-line" element={<ProductionLine />} />
          <Route path="production-phase" element={<ProductionPhase />} />
          <Route path="factory" element={<Factory />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="production" element={<Production />} />
          <Route path="user" element={<User />} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </Router>
  </Provider>
);
