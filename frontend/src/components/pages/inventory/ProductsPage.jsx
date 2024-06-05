import React, { useState } from 'react';
import ProductsList from './ProductsList';  // Asegúrate de que esta ruta sea correcta
import ProductForm from './ProductForm';  // Importa el nuevo formulario
import { Button, ButtonContainer } from '../../../Styled/Forms.styled';

export const ProductsPage = () => {
    const [showForm, setShowForm] = useState(false);

    const handleFormSuccess = () => {
        setShowForm(false);
        // Aquí puedes agregar cualquier lógica adicional, como recargar la lista de productos
    };

    return (
        <div>
            <ButtonContainer>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Hide Form' : 'Add New Product'}
                </Button>
            </ButtonContainer>
            {showForm && <ProductForm onSuccess={handleFormSuccess} />}
            <ProductsList />
        </div>
    );
};
