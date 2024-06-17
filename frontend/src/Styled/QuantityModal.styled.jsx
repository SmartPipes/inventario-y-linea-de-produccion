import styled from 'styled-components';

export const ModalOverlay = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #ccc;
  width: 300px;
  max-width: 90%;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h3`
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 600;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  margin-right: 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  ${({ variant }) => variant === 'apply' && `
    background-color: #6c5ce7;
    color: white;
  `}

  ${({ variant }) => variant === 'discard' && `
    background-color: #b2bec3;
    color: black;
  `}
`;
