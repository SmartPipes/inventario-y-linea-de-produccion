import styled,{ createGlobalStyle } from "styled-components";
import background from '../assets/background.jpg';
import plant from '../assets/plant.jpg';
import { Link } from "react-router-dom";


const GlobalStyles = createGlobalStyle`
body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}
`;
const Titles = styled.h1`
color: white;
text-transform: uppercase;
padding-bottom: 2rem;
text-align: center;
`;

const SubTitle = styled.h3`
color: white;
text-align: center;
padding-bottom: 1rem;
`;

//Smaller than the normal subtitle
const SubTitle2 = styled.h4`
color: #364936;
text-transform: uppercase;
`;

//Subtitle but without the padding bottom
const ModalTitle = styled.h2`
color: #364936;
text-transform: uppercase;
`;

// Images styles

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${background});
  backdrop-filter: blur(10px);
  background-size: cover;
  background-position: center;
  position: relative;
`;

const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  z-index: -1;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 70%;
  max-width: 900px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.4);
`;

const ImageWrapper = styled.div`
  flex: 1;
  background-image: url(${plant});
  background-size: cover;
  background-position: center;
`;

const FormWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormContent = styled.div`
  width: 90%; 
  max-width: 100%;
`;

const CustomLink = styled(Link)`
  color: #88D66C;
  text-decoration: none;
  margin-top: 10px;
  padding-right: 46.5%;
  display: inline-block; 
  &:hover {
    text-decoration: underline;
  }
`;

const StyledButton = styled.button`
  margin-top: 10px;
  display: inline-block;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #218838; 
  }
`;

export { GlobalStyles, Titles, SubTitle, SubTitle2, ModalTitle, Container, BlurOverlay, ContentWrapper, ImageWrapper, FormWrapper, FormContent, CustomLink, StyledButton };
