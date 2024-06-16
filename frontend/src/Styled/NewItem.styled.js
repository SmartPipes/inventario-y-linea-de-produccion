import styled from 'styled-components';

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

export const ButtonGroup = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

export const Button = styled.button`
    padding: 10px 20px;
    background: ${props => (props.selected ? '#97b25e' : '#ddd')};
    color: ${props => (props.selected ? 'white' : 'black')};
    border: none;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;

    &:hover {
        background: ${props => (props.selected ? '#364936' : '#ccc')};
    }
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    width: 100%;

    input, select {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 100%;
    }
`;

export const Labels = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
`;

