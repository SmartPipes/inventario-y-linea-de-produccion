import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import  Home  from './components/pages/Home';
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
import RestockRequestWarehousePage from './components/pages/inventory/RestockRequestWarehousePage.jsx';  // Import the new component
import CartsPage from './components/pages/Delivery/CartsPage.jsx'; // Import the CartsPage component
import PaymentsPage from './components/pages/Delivery/PaymentsPage.jsx'; // Import the PaymentsPage component
import CartDetailsPage from './components/pages/Delivery/CartDetailsPage.jsx'; // Import the CartDetailsPage component
import SaleDetailsPage from './components/pages/Delivery/SaleDetailsPage.jsx';
import ThirdPartyServicePage from './components/pages/Delivery/ThirdPartyServicePage.jsx'; // Import the SaleDetailsPage component
import OrdersPage from './components/pages/Delivery/OrdersPage.jsx';
import Login from './components/pages/User/Login.jsx';

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [
    { path: "login", element: <Login /> },
    { path: "home", element: <Home /> },
    { path: "/production/production-lines", element: <ProductionLine /> },
    { path: "/production/production-phases", element: <ProductionPhase /> },
    { path: "inventory", element: <InventoryPage /> },
    { path: "inventory/new-item", element: <NewItemPage /> },
    { path: "inventory/categories", element: <CategoryPage /> },
    { path: "inventory/request-restock", element: <RestockRequestPage /> },
    { path: "inventory/warehouses", element: <WarehousePage /> },
    { path: "inventory/suppliers", element: <SupplierPage /> },
    { path: "inventory/operation-log", element: <OperationLogPage /> },
    { path: "inventory/request-restock-warehouse", element: <RestockRequestWarehousePage /> },
    { path: "inventory/products", element: <ProductPage /> },
    { path: "inventory/raw-materials", element: <RawMaterialPage /> },
    { path: "/production/factories", element: <Factory /> },
    { path: "production", element: <Production /> },
    { path: "sales", element: <Sales /> },
    { path: "delivery", element: <Delivery /> },
    { path: "user", element: <User /> },
    {path: "production/orders", element:<ProductionOrders/>},
    { path: "/delivery", element: <Delivery /> },
    { path: "/delivery/orders", element: <OrdersPage /> },
    { path: "/delivery/carts", element: <CartsPage /> },
    { path: "/delivery/payments", element: <PaymentsPage /> },
    { path: "/delivery/cart-details", element: <CartDetailsPage /> },
    { path: "/delivery/sale-details", element: <SaleDetailsPage /> },
    { path: "/delivery/ThirdPartyService", element: <ThirdPartyServicePage /> },
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
