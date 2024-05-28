import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InventoryPage } from "./pages/InventoryPage";
import { InventoryFormPage } from "./pages/InventoryFormPage";
import {Navigation} from "./components/Navigation";
function App() {
  return (
    <BrowserRouter>

    <Navigation />

      <Routes>
        <Route path="/" element={<Navigate to="/inventory" />}/>
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory_create" element={<InventoryFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
