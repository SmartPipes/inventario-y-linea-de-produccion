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

// Estilos para la paginación
export const Pagination = styled.ul`
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 20px 0;
`;

export const PageItem = styled.li`
    margin: 0 5px;
`;

export const PageLink = styled.button`
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    background-color: white;
    color: black;
    text-decoration: none;

    &.active {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
    }

    &:hover {
        background-color: #e0e0e0;
    }
`;

export const TableContainer = styled.div`
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th, td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: left;
    }

    th {
        background-color: #f4f4f4;
    }
`;

export const SearchBar = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
`;

export const SearchInput = styled.input`
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 300px;
    box-sizing: border-box;
`;

export const AddButton = styled(Button)`
    background: #97b25e;
    margin-right: auto;
    margin-bottom: 20px;

    &:hover {
        background: #bbb;
    }
`;
