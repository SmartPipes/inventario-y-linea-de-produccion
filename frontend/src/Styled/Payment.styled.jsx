import styled from 'styled-components';

// Contenedor principal para el contenido de la página
export const PaymentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f4f4f4;
    min-height: 100vh; /* Asegura que el contenedor ocupe al menos toda la altura de la pantalla */
`;

// Tarjeta principal que contendrá las tarjetas de métodos de pago
export const MainCard = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    max-width: 1200px;
    width: 100%;
    margin-top: 20px; /* Espacio entre el botón y las tarjetas */
    justify-content: center; /* Centra las tarjetas horizontalmente */
`;

// Estilo para cada tarjeta de método de pago
export const PaymentCard = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: calc(50% - 20px); /* Hace que cada tarjeta ocupe 50% menos el gap */
    max-width: 500px;
    padding: 20px;
    box-sizing: border-box;
`;

// Contenedor para la imagen y los detalles del método de pago
export const PaymentContent = styled.div`
    display: flex;
    flex-direction: column;
`;

// Estilo para los detalles del método de pago
export const PaymentDetail = styled.div`
    margin-bottom: 15px;
    font-size: 1rem;
    color: #333;
`;

// Agregar botón estilizado
export const Button = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: #0056b3;
    }
`;

// Título de cada sección
export const SectionTitle = styled.h2`
    margin-bottom: 10px;
    font-size: 1.5rem;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Alinea el título y el botón de editar */
`;
