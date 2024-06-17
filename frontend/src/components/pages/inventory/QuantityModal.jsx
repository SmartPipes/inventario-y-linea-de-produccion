import React, { useState } from 'react';
import { ModalOverlay, ModalContent, Title, Label, ButtonContainer, Button, Input } from '../../../Styled/QuantityModal.styled';

const QuantityModal = ({ isVisible, onClose, onApply }) => {
  const [newQuantity, setNewQuantity] = useState('');

  const handleApply = () => {
    onApply(newQuantity);
    setNewQuantity('');
  };

  return (
    <ModalOverlay isVisible={isVisible}>
      <ModalContent>
        <Title>Cambiar cantidad de producto</Title>
        <Label htmlFor="newQuantity">Nueva cantidad disponible:</Label>
        <Input
          type="number"
          id="newQuantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          min="0"
          step="0.01"
        />
        <ButtonContainer>
          <Button variant="apply" onClick={handleApply}>Aplicar</Button>
          <Button variant="discard" onClick={onClose}>Descartar</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default QuantityModal;
