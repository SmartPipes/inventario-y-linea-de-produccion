import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Home} from './components/pages/Home'
import SalesPage  from './components/pages/SalesPage.jsx'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'
import Salesdetails from './components/pages/Salesdetails.jsx'
import ListSales from './components/pages/ListSales.jsx'
import Login from './components/pages/Auth/Login.jsx'
import User from './components/pages/User.jsx'
import Profile from './components/pages/Profile.jsx'
import Payment from './components/pages/Payment.jsx'

const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  children: [
    { path: "" , element: <Login/> },
    { path: "/home" , element: <Home/> },
    { path: "/sales/salesdetails" , element: <Salesdetails/> },
    { path: "/ListSales" , element: <ListSales/> },
    { path: "sales" , element: <SalesPage/>},
    { path: "user" , element: <User/>},
    { path: "profile" , element: <Profile/>},
    { path: "payment" , element: <Payment/>},
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
