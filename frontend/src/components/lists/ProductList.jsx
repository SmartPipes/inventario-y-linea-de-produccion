import React, { useEffect, useState } from 'react';
import { useHeaderButton } from '../../contexts/HeaderButtonContext';
import ProductCard from '../items/ProductCard';
import AddProductForm from '../forms/AddProductForm';
import axios from 'axios';

const ProductList = () => {
    const { setButtonProps } = useHeaderButton();
    const [products, setProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        setButtonProps({
            text: 'Nuevo Producto',
            onClick: () => setShowAddForm(true),
        });

        fetchProducts();
    }, [setButtonProps]);

    const fetchProducts = async () => {
        const response = await axios.get('http://127.0.0.1:8080/api/inventory/products/');
        setProducts(response.data);
    };

    const handleProductAdded = () => {
        fetchProducts(); // Volver a cargar la lista de productos
    };

    return (
        <div className="product-list">
            {products.map(product => (
                <div className="product-card" key={product.product_id}>
                    <ProductCard product={product} />
                </div>
            ))}
            {showAddForm && (
                <AddProductForm 
                    onClose={() => setShowAddForm(false)} 
                    onProductAdded={handleProductAdded} 
                />
            )}
        </div>
    );
};

export default ProductList;
