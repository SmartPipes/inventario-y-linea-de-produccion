import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import store from './store';
import App from './App';
import Login from './components/pages/Login/Login';
import ResetPassword from './components/pages/Login/ResetPassword';
import Home from './components/pages/Home';
import ProductionLine from './components/pages/production/ProductionLine';
import ProductionPhase from './components/pages/production/ProductionPhase';
import Factory from './components/pages/production/Factory';
import InventoryPage from './components/pages/InventoryPage';
import Production from './components/pages/production/Production';
import User from './components/pages/User';
import Register from './components/Register'; 
import { load_user } from './components/actions/auth';
import ActivateUser from './components/pages/Login/ActivateUser';
const Root = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  React.useEffect(() => {
    dispatch(load_user()); // Carga el usuario al inicio
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Puedes agregar un spinner de carga aquí
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activate/:uid/:token" element={<ActivateUser />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path="/" element={<App />}>
        <Route path="home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="production-line" element={isAuthenticated ? <ProductionLine /> : <Navigate to="/login" />} />
        <Route path="production-phase" element={isAuthenticated ? <ProductionPhase /> : <Navigate to="/login" />} />
        <Route path="factory" element={isAuthenticated ? <Factory /> : <Navigate to="/login" />} />
        <Route path="inventory" element={isAuthenticated ? <InventoryPage /> : <Navigate to="/login" />} />
        <Route path="production" element={isAuthenticated ? <Production /> : <Navigate to="/login" />} />
        <Route path="user" element={isAuthenticated ? <User /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Route>
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>
);