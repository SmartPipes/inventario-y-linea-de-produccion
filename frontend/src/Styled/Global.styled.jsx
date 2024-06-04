import styled,{ createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}
`;
const Titles = styled.h1`
color: #364936;
text-transform: uppercase;
padding-bottom: 2rem;
`;

const SubTitle = styled.h3`
color: white;
text-transform: uppercase;
padding-bottom: 1rem;
`;

export  {GlobalStyles, Titles, SubTitle};