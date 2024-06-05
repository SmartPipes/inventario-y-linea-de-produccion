import styled from 'styled-components';

export const InventoryContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* Centrar las tarjetas */
    align-items: flex-start; /* Alinear al inicio de la fila */
    gap: 10px;
    padding: 10px;
`;

export const InventoryCard = styled.div`
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    max-width: 420px; /* Tamaño máximo de las tarjetas */
    min-width: 300px; /* Tamaño mínimo de las tarjetas */
    flex: 1 1 calc(33.333% - 20px); /* Permitir que las tarjetas crezcan y ocupen espacio disponible */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #fff;
    color: black;
    box-sizing: border-box;
`;

export const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 100%;
`;

export const CardTitle = styled.span`
    font-size: 1em;
    font-weight: bold;
    margin-right: 10px;
`;

export const CardImage = styled.img`
    width: 70px; /* Tamaño base de la imagen */
    height: 70px; /* Tamaño base de la imagen */
    border-radius: 20%;
    margin-left: 10px; /* Espaciado entre el título y la imagen */
`;

export const CardBody = styled.div`
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 10px;

    p {
        margin: 5px 0;
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

export const Button = styled.button`
    padding: 0.5rem 1rem;
    background: #97b25e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background: #364936;
    }
`;
