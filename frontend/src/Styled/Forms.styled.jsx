import styled from "styled-components";

const FormContainer = styled.div`
display: flex;
flex-direction: column;
background: #FAFBF3;
padding: 2rem;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
`;

const SelectStyled = styled.div`
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #364936;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    background: ${(props) => props.isdisabledBtn ? '#EE4E4E' : '#97b25e'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-left: 10px;

    &:hover {
        background: ${(props) => props.isdisabledBtn ? '#FF0000' : '#364936'};
    }

`;

const Error = styled.p`
    color: red;
    font-size: 0.9rem;
    margin-top: -7px;
`;

export {FormContainer, Label, Input, ButtonContainer, Button, Error, SelectStyled};