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
import OperationLogPage from './components/pages/inventory/OperationLogPage.jsx';
import RestockRequestPage from './components/pages/inventory/RestockRequestPage.jsx';
import ProductPage from './components/pages/inventory/ProductPage.jsx';
import RawMaterialPage from './components/pages/inventory/RawMaterialPage.jsx';
import {ProductionOrders} from './components/pages/production/ProductionOrders.jsx'

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
    { path: "inventory/request-restock", element: <RestockRequestPage /> },
    { path: "inventory/warehouses", element: <WarehousePage /> },
    { path: "inventory/suppliers", element: <SupplierPage /> },
    { path: "inventory/operation-log", element: <OperationLogPage /> },
    { path: "inventory/products", element: <ProductPage /> },
    { path: "inventory/raw-materials", element: <RawMaterialPage /> },
    { path: "/production/factories", element: <Factory /> },
    { path: "production", element: <Production /> },
    { path: "sales", element: <Sales /> },
    { path: "delivery", element: <Delivery /> },
    { path: "user", element: <User /> },
    {path: "production/orders", element:<ProductionOrders/>}
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
