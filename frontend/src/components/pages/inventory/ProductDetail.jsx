import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FormContainer, Label, Input, ButtonContainer, Button } from '../../../Styled/Forms.styled';
import styled from 'styled-components';

const ProductImage = styled.img`
    width: 150px;  // Ajusta el tamaño según tus necesidades
    height: auto;  // Mantiene la proporción de la imagen
    border-radius: 10px;  // Ajusta los bordes redondeados según prefieras
    margin-bottom: 20px;  // Espaciado inferior
`;

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`https://smartpipes.cloud/api/inventory/products/${productId}/`);
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
            await axios.put(`https://smartpipes.cloud/api/inventory/products/${productId}/`, product);
            alert('Product updated successfully');
        } catch (error) {
            console.error('Error updating product', error);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-detail">
            <div className="product-detail-header">
                <ProductImage src={product.image_icon} alt={product.name} />
                <h1>{product.name}</h1>
            </div>
            <FormContainer onSubmit={handleSubmit}>
                <Label>Nombre del producto:</Label>
                <Input type="text" name="name" value={product.name} onChange={handleInputChange} />

                <Label>Precio de venta:</Label>
                <Input type="text" name="price" value={product.price} onChange={handleInputChange} />

                <Label>Costo:</Label>
                <Input type="text" name="cost" value={product.cost} onChange={handleInputChange} />

                <Label>Categoría del producto:</Label>
                <Input type="text" name="category" value={product.category} onChange={handleInputChange} />

                <Label>Referencia interna:</Label>
                <Input type="text" name="internal_reference" value={product.internal_reference} onChange={handleInputChange} />

                <Label>Código de barras:</Label>
                <Input type="text" name="barcode" value={product.barcode} onChange={handleInputChange} />

                <Label>Notas internas:</Label>
                <textarea name="internal_notes" value={product.internal_notes} onChange={handleInputChange} />

                <ButtonContainer>
                    <Button type="submit">Aceptar</Button>
                </ButtonContainer>
            </FormContainer>
        </div>
    );
};

export default ProductDetail;
