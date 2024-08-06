import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8080/api/inventory/products/${productId}/`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8080/api/inventory/products/${productId}/`, product);
            alert('Product updated successfully');
        } catch (error) {
            console.error('Error updating product', error);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-detail">
            <div className="product-detail-header">
                <img src={product.image_icon} alt={product.name} className="product-image" />
                <h1>{product.name}</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="product-actions">
                    <button type="button">Actualizar la cantidad</button>
                    <button type="button">Reabastecer</button>
                    <button type="button">Imprimir etiquetas</button>
                </div>
                <div className="product-info">
                    <label>
                        Nombre del producto:
                        <input type="text" name="name" value={product.name} onChange={handleInputChange} />
                    </label>
                    <label>
                        Precio de venta:
                        <input type="text" name="price" value={product.price} onChange={handleInputChange} />
                    </label>
                    <label>
                        Costo:
                        <input type="text" name="cost" value={product.cost} onChange={handleInputChange} />
                    </label>
                    <label>
                        Categoría del producto:
                        <input type="text" name="category" value={product.category} onChange={handleInputChange} />
                    </label>
                    <label>
                        Referencia interna:
                        <input type="text" name="internal_reference" value={product.internal_reference} onChange={handleInputChange} />
                    </label>
                    <label>
                        Código de barras:
                        <input type="text" name="barcode" value={product.barcode} onChange={handleInputChange} />
                    </label>
                </div>
                <div className="product-notes">
                    <label>
                        Notas internas:
                        <textarea name="internal_notes" value={product.internal_notes} onChange={handleInputChange} />
                    </label>
                </div>
                <button type="submit">Aceptar</button>
            </form>
        </div>
    );
};

export default ProductDetail;
