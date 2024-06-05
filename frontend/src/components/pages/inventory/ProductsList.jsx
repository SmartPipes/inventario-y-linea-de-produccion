import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import ProductItemCard from './ProductItemCard';
import axios from 'axios';
import { Titles } from '../../../Styled/Global.styled';
import { InventoryContainer } from '../../../Styled/Inventory.styled';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();  // Inicializa useNavigate

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get('https://smartpipes.cloud/api/inventory/products/');
        const formattedProducts = response.data.map(product => ({
            ...product,
            price: parseFloat(product.price), // Asegúrate de que el precio es un número
            stock: parseFloat(product.stock) // Asegúrate de que el stock es un número
        }));
        setProducts(formattedProducts);
    };

    const handleCardClick = (productId) => {
        navigate(`/products/${productId}`);  // Navega a la página de detalles del producto
    };

    return (
        <div>
            <Titles style={{ textAlign: 'center' }}>PRODUCTS LIST</Titles>
            <InventoryContainer>
                {products.map(product => (
                    <ProductItemCard
                        key={product.product_id}
                        product={product}
                        onClick={() => handleCardClick(product.product_id)}  // Pasa el manejador de clic
                    />
                ))}
            </InventoryContainer>
        </div>
    );
};

export default ProductsList;
