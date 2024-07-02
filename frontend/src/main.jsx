import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Home } from './components/pages/Home';
import { ProductionLine } from './components/pages/production/ProductionLine';
import { ProductionPhase } from './components/pages/production/ProductionPhase.jsx';
import { Factory } from './components/pages/production/Factory.jsx';
import InventoryPage from './components/pages/inventory/Inventory.jsx';
import NewItemPage from './components/pages/inventory/NewItemPage.jsx'; 
import { Production } from './components/pages/production/Production.jsx';
import { Sales } from './components/pages/Sales/Sales.jsx';
import { Delivery } from './components/pages/Delivery/Delivery.jsx';
import { User } from './components/pages/User/User.jsx';
import WarehousePage from './components/pages/inventory/WarehousePage.jsx';
import SupplierPage from './components/pages/inventory/SupplierPage.jsx';
import CategoryPage from './components/pages/inventory/CategoryPage.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [
    { path: "", element: <Home /> },
    { path: "/production/production-lines", element: <ProductionLine /> },
    { path: "/production/production-phases", element: <ProductionPhase /> },
    { path: "inventory", element: <InventoryPage /> },
    { path: "inventory/new-item", element: <NewItemPage /> },
    { path: "inventory/categories", element: <CategoryPage /> },
    { path: "inventory/warehouses", element: <WarehousePage /> },
    { path: "inventory/suppliers", element: <SupplierPage /> },
    { path: "/production/factories", element: <Factory /> },
    { path: "production", element: <Production /> },
    { path: "sales", element: <Sales /> },
    { path: "delivery", element: <Delivery /> },
    { path: "user", element: <User /> }
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
