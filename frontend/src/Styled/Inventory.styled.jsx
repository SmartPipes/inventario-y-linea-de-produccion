import styled from 'styled-components';

export const InventoryCard = styled.div`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 290px;
    margin: 0 auto;
    backdrop-filter: blur(100px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }
`;

export const CardHeader = styled.div`
    padding: 16px;
    text-align: center;
    backdrop-filter: blur(10px);
`;

export const CardTitle = styled.h3`
    font-size: 18px;
    margin: 0;
    color: #333;
    backdrop-filter: blur(10px);
`;

export const CardImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    backdrop-filter: blur(10px);
`;

export const CardBody = styled.div`
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(10px);
`;

export const CardFooter = styled.div`
    padding: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    backdrop-filter: blur(10px);
`;

export const PriceTag = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0;
    backdrop-filter: blur(10px);
`;

export const StockInfo = styled.p`
    font-size: 14px;
    color: #666;
    margin: 0;
    margin-top: 4px;
    text-align: center;
    backdrop-filter: blur(10px);
`;

export const WowText = styled.p`
    font-size: 14px;
    color: #999;
    text-align: center;
    margin-top: 8px;
    font-style: italic;
    backdrop-filter: blur(10px);
`;
