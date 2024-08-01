import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Home} from './components/pages/Home'
import SalesPage  from './components/pages/SalesPage.jsx'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'
import Salesdetails from './components/pages/Salesdetails.jsx'
import ListSales from './components/pages/ListSales.jsx'

const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  children: [
    { path: "" , element: <Home/> },
    { path: "/sales/salesdetails" , element: <Salesdetails/> },
    { path: "/ListSales" , element: <ListSales/> },
    { path: "sales" , element: <SalesPage/>},
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
