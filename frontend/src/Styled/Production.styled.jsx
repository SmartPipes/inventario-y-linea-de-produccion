import styled from "styled-components";

const SideBar = styled.div`
flex-direction: column;
background: #97B25E;
padding: 1rem 2rem;
position: relative;
width: 18%;
height: 100vh;
align-items: center;
box-shadow: 4px 0 8px 0 rgba(0, 0, 0, 0.2), 6px 0 20px 0 rgba(0, 0, 0, 0.19);
`;

const PlacedOrderBoxes = styled.div`
background: #FAFBF3;
padding: 2rem;
margin-bottom: 2rem;
border-radius: 8px;
display: flex;

`;



const OrderContainer = styled.div`
display: flex;
`;

const MainContent = styled.div`
    flex: 1;
    padding: 2rem;
    background: #f4f4f4;
    align-items: center;
    justify-content: center;
`;




export {SideBar, OrderContainer, MainContent, PlacedOrderBoxes};