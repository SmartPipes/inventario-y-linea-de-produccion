import React from 'react';
import styled, { css } from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #364936;
  position: relative;
  overflow-y: auto; /* Add this line to make the content scrollable */
  max-height: 80vh; /* Adjust this value to control the maximum height of the modal */

  ${(props) => props.fixedSize && css`
    width: 900px; /* Set your fixed width here */
  `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
`;

const ModalComponent = ({ onClose, children, fixedSize }) => {
  const handleOverlayClick = (e) => {
    // Check if the click is on the overlay (i.e., outside the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent fixedSize={fixedSize}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalComponent;
