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
overflow-y: auto;
`;

const PlacedOrderBoxes = styled.div`
background: ${(props) => props.isdisabled === 'Inactive' ? '#CCCCCC' : '#FAFBF3'};
padding: 2rem;
margin-bottom: 2rem;
border-radius: 8px;
display: flex;
color: #364936;
font-weight: 500;
cursor: pointer;
margin-top: ${(props) => props.isorder ? '2rem' : ''}
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
    overflow-y: auto;
`;

const OrderMainContent = styled.div`
    flex: 1;
    padding: 2rem;
    background: #f4f4f4;
    align-items: center;
    justify-content: center;
`;

const PLPHBoxes = styled.div`
margin-bottom: 1rem;
display: flex;
padding-left: 1rem;
`;

const OrdersArea = styled.div`
margin-top: 1rem;
flex-direction: column;
padding: 1rem 2rem;
position: relative;
width: 95.3%;
height: 65.5vh;
align-items: center;
overflow-y: auto;

`;


const BtnEdit = styled.button`
    padding: 0.5rem 1rem;
    background: ${(props) => props.manager ? '#3572EF' : props.isdisabledBtn ? '#EE4E4E' : '#FCDC2A'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-left: 10px;
`;




export {SideBar, OrderContainer, MainContent, PlacedOrderBoxes, OrderMainContent, PLPHBoxes, OrdersArea, BtnEdit};