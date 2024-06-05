import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Home } from './components/pages/Home';
import { ProductionLine } from './components/pages/production/ProductionLine';
import { ProductsPage } from './components/pages/inventory/ProductsPage.jsx';
import ProductDetail from './components/pages/inventory/ProductDetail.jsx';  // Importa el nuevo componente de detalles del producto
import { InventoryPage } from './components/pages/inventory/Inventory.jsx';  // Importa la página de inventario
import { User } from './components/pages/User.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [
    { path: "", element: <Home /> },
    { path: "production-orders", element: <ProductionLine /> },
    { path: "products", element: <ProductsPage /> },
    { path: "products/:productId", element: <ProductDetail /> },  // Añade la ruta para los detalles del producto
    { path: "inventory", element: <InventoryPage /> },  // Añade la ruta para la página de inventario

    // LEAVE THIS USER AS THE LAST ALWAYS
    { path: "user", element: <User /> }
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
