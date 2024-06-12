import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Home} from './components/pages/Home'
import {ProductionLine} from './components/pages/production/ProductionLine'
import {ProductionPhase} from './components/pages/production/ProductionPhase.jsx'
import { Factory } from './components/pages/production/Factory.jsx'
import {InventoryPage} from './components/pages/InventoryPage.jsx'
import { Production } from './components/pages/production/Production.jsx'
import {User} from './components/pages/User.jsx'
import { RouterProvider, createBrowserRouter  } from 'react-router-dom'

const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  children: [
    { path: "" , element: <Home/> },
    { path: "/production/production-lines" , element: <ProductionLine/> },
    { path: "/production/production-phases", element: <ProductionPhase/>},
    { path: "inventory" , element: <InventoryPage/>},
    { path: "/production/factories" , element: <Factory/>},
    { path: "production" , element: <Production/>},
    // LEAVE THIS USER AS THE LAST ALWAYS
    { path: "user" , element: <User/>}
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
