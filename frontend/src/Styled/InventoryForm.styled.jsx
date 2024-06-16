import styled from 'styled-components';
import { FaTrash, FaEdit } from 'react-icons/fa';

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1000px; /* Aumenta el tamaño máximo del contenedor */
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    button {
        margin: 0 5px;
    }
`;

export const ActionButtonGroup = styled(ButtonGroup)`
    margin-bottom: 10px;
`;

export const Button = styled.button`
    padding: 10px 20px;
    background: ${(props) => (props.isSelected ? '#97b25e' : '#ccc')};
    color: ${(props) => (props.isSelected ? 'white' : 'black')};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;

    &:hover {
        background: ${(props) => (props.isSelected ? '#364936' : '#bbb')};
    }
`;

export const FormRow = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 30px;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
`;

export const Column = styled.div`
    flex: 1;
    min-width: 45%; /* Ajusta este valor para mantener una buena proporción */
    &:last-child {
        margin-right: 0;
    }
    @media (max-width: 800px) {
        min-width: 100%;
    }
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 30px;
    width: 100%;
`;

export const Labels = styled.label`
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
`;

export const SelectedImageWrapper = styled.div`
    position: relative;
    display: inline-block;
    margin-bottom: 30px;
`;

export const SelectedImage = styled.img`
    width: 120px; /* Aumenta el tamaño de la imagen */
    height: 120px; /* Aumenta el tamaño de la imagen */
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
`;

export const IconWrapper = styled.div`
    position: absolute;
    bottom: 5px;
    right: 5px;
    display: none;
    gap: 5px;
    ${SelectedImageWrapper}:hover & {
        display: flex;
    }
`;

export const EditIcon = styled(FaEdit)`
    cursor: pointer;
    background: #ffffff;
    border-radius: 50%;
    padding: 5px;
    color: #000;
    font-size: 16px;
`;

export const DeleteIcon = styled(FaTrash)`
    cursor: pointer;
    background: #ffffff;
    border-radius: 50%;
    padding: 5px;
    color: #ff0000;
    font-size: 16px;
`;

export const Tooltip = styled.div`
    visibility: hidden;
    width: 50px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    left: 50%;
    margin-left: -25px;
    opacity: 0;
    transition: opacity 0.3s;

    ${IconWrapper}:hover & {
        visibility: visible;
        opacity: 1;
    }
`;

export const Input = styled.input`
    width: 100%;
    padding: 12px; /* Aumenta el padding */
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px; /* Aumenta el tamaño de la fuente */
    margin-bottom: 10px;
    box-sizing: border-box; /* Asegura que el padding no aumente el ancho total */
`;

export const Select = styled.select`
    width: 100%;
    padding: 12px; /* Aumenta el padding */
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px; /* Aumenta el tamaño de la fuente */
    margin-bottom: 10px;
    box-sizing: border-box; /* Asegura que el padding no aumente el ancho total */
`;

export const ActionButton = styled(Button)`
    background: #97b25e;
    color: white;
    margin: 0 5px;
    &:hover {
        background: #364936;
    }
`;

export const SubmitButton = styled(Button)`
    background: #97b25e;
    color: white;
    margin-top: 20px;
    width: 100%;
    &:hover {
        background: #364936;
    }
`;

export const Title = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
`;
