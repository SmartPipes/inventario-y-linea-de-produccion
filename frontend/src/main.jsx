import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Home} from './components/pages/Home'
import {ProductionLine} from './components/pages/ProductionLine'
import {InventoryPage} from './components/pages/InventoryPage.jsx'
import {User} from './components/pages/User.jsx'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'

const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  children: [
    { path: "" , element: <Home/> },
    { path: "production-line" , element: <ProductionLine/> },
    { path: "inventory" , element: <InventoryPage/>},
    // LEAVE THIS USER AS THE LAST ALWAYS
    { path: "user" , element: <User/>}
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
