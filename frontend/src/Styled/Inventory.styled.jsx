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
    justify-content: flex-start;
    width: 100%;
    max-width: 1600px;
    gap: 20px;
    box-sizing: border-box;

    & > .inventory-card {
        flex: 1 1 calc(25% - 20px);
        max-width: calc(25% - 20px);
        min-width: 250px;
        box-sizing: border-box;
    }

    @media (max-width: 1200px) {
        & > .inventory-card {
            flex: 1 1 calc(33.333% - 20px);
            max-width: calc(33.333% - 20px);
        }
    }

    @media (max-width: 1024px) {
        & > .inventory-card {
            flex: 1 1 calc(50% - 20px);
            max-width: calc(50% - 20px);
        }
    }

    @media (max-width: 768px) {
        & > .inventory-card {
            flex: 1 1 100%;
            max-width: 100%;
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
    justify-content: space-between;
    text-align: left;
    width: 100%; /* Asegura que la tarjeta ocupe todo el espacio disponible */
    box-sizing: border-box;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
`;

export const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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
    max-width: 70px; /* Ajusta según sea necesario */
    height: auto;
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

export const CardFooter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export const PriceTag = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin: 0;
`;

export const StockTag = styled.span`
    font-size: 14px;
    color: #666666;
`;
