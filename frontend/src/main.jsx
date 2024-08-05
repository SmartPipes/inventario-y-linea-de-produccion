import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SalesPage  from './components/pages/SalesPage.jsx'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'
import Salesdetails from './components/pages/Salesdetails.jsx'

const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  children: [
    { path: "sales" , element: <SalesPage/>},
    { path: "/sales/salesdetails" , element: <Salesdetails/> },
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
