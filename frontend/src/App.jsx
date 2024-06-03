import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InventoryList from './components/lists/InventoryList';
import ProductList from './components/lists/ProductList';
import ProductDetail from './components/pages/ProductDetail';
import GeneralInfo from './components/pages/GeneralInfo';
import Operations from './components/pages/Operations';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';
import Layout from './components/Layout';
import { HeaderButtonProvider } from './contexts/HeaderButtonContext';

const App = () => {
    return (
        <HeaderButtonProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/inventory" element={<InventoryList />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/:productId" element={<ProductDetail />} />
                        <Route path="/general-info" element={<GeneralInfo />} />
                        <Route path="/operations" element={<Operations />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </Layout>
            </Router>
        </HeaderButtonProvider>
    );
};

export default App;
