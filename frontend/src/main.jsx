import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SalesPage  from './components/pages/SalesPage.jsx'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'
import Salesdetails from './components/pages/Salesdetails.jsx'
import SalesCustomer from './components/pages/SalesCustomer.jsx'
import Profile from './components/pages/Profile/Profile.jsx'

const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  children: [
    { path: "sales" , element: <SalesPage/>},
    { path: "/sales/salesdetails" , element: <Salesdetails/> },
    { path: "/sales/Purchases" , element: <SalesCustomer/> },
    { path: "/Profile/Profile", element: <Profile/> },
    ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
