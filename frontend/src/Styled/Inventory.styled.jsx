import styled from 'styled-components';

export const InventoryCard = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    width: 320px; /* Ancho fijo */
    height: 400px; /* Altura fija */
    margin: 16px; /* Separación entre tarjetas */
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    background-clip: padding-box;
    
    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
`;

export const CardHeader = styled.div`
    padding: 12px;
    text-align: center;
    flex: 0 1 auto;
`;

export const CardTitle = styled.h3`
    font-size: 20px;
    margin: 0;
    color: #000;
`;

export const CardImage = styled.img`
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    flex: 0 1 auto;
`;

export const CardBody = styled.div`
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Asegura que el contenido esté centrado verticalmente */
    flex: 1 1 auto;
    text-align: center; /* Centra el texto */
`;

export const CardFooter = styled.div`
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 0 1 auto;
    backdrop-filter: blur(10px);
`;

export const PriceTag = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin: 0;
`;

export const StockInfo = styled.p`
    font-size: 14px;
    color: #555;
    margin: 4px 0 0 0;
    text-align: center;
`;

export const WowText = styled.p`
    font-size: 14px;
    color: #777;
    text-align: center;
    margin-top: 8px;
    font-style: italic;
`;
export const StockTag = styled.span`
  font-size: 14px;
  color: #666666;
`;