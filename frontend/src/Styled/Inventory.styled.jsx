import styled from 'styled-components';

export const InventoryContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
`;

export const InventorySubContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start; /* Alinea las tarjetas a la izquierda */
    width: 100%;
    max-width: 1600px; /* Ajusta según sea necesario */
    gap: 20px; /* Espacio entre tarjetas */
    box-sizing: border-box;

    & > div {
        flex: 1 1 calc(25% - 20px); /* Ajusta para 4 tarjetas por fila con gap */
        max-width: calc(25% - 20px); /* Ajusta para 4 tarjetas por fila con gap */
        min-width: 250px; /* Ajusta el valor mínimo de flex-basis */
        box-sizing: border-box;
    }

    @media (max-width: 1200px) {
        & > div {
            flex: 1 1 calc(33.333% - 20px); /* Ajusta para 3 tarjetas por fila */
            max-width: calc(33.333% - 20px); /* Ajusta para 3 tarjetas por fila */
        }
    }

    @media (max-width: 1024px) {
        & > div {
            flex: 1 1 calc(50% - 20px); /* 2 tarjetas por fila */
            max-width: calc(50% - 20px); /* 2 tarjetas por fila */
        }
    }

    @media (max-width: 768px) {
        & > div {
            flex: 1 1 100%; /* 1 tarjeta por fila */
            max-width: 100%; /* 1 tarjeta por fila */
        }
    }
`;

export const InventoryCard = styled.div`
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    width: 100%; /* Asegura que la tarjeta ocupe todo el espacio disponible */
    box-sizing: border-box;

    img {
        max-width: 70px; /* Ajusta según sea necesario */
        height: auto;
        border-radius: 4px;
    }

    h3 {
        margin: 0;
        font-size: 1.25rem;
    }

    p {
        margin: 10px 0;
        font-size: 1rem;
    }
`;

export const CardHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-right: 10px;
`;

export const CardTitle = styled.span`
    font-size: 1em;
    font-weight: bold;
    margin-bottom: 10px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px; /* Ajusta el ancho máximo del título según sea necesario */
`;

export const CardImage = styled.img`
    width: 70px; /* Tamaño base de la imagen */
    height: 70px; /* Tamaño base de la imagen */
    border-radius: 4px;
    margin-left: 10px; /* Espaciado entre el título y la imagen */
`;

export const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;

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
