import React, { useState, useEffect } from 'react';
import { ModalOverlay, ModalContent, Title, Label, ButtonContainer, Button, Input } from '../../../Styled/QuantityModal.styled';
import { apiClient } from '../../../ApiClient';
import { API_URL_WAREHOUSES, API_URL_INV } from '../Config';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

const QuantityModal = ({ isVisible, onClose, onApply, selectedRawMaterial }) => {
    const [newQuantity, setNewQuantity] = useState('');
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await apiClient.get(API_URL_WAREHOUSES);
                setWarehouses(response.data);
                if (response.data.length > 0) {
                    setSelectedWarehouse(response.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching warehouses:', error);
            }
        };

        const fetchRawMaterials = async () => {
            try {
                const response = await apiClient.get(API_URL_INV);
                const mergedInventory = mergeInventory(response.data);
                setRawMaterials(mergedInventory);
            } catch (error) {
                console.error('Error fetching raw materials:', error);
            }
        };

        fetchWarehouses();
        fetchRawMaterials();
    }, []);

    useEffect(() => {
        if (selectedRawMaterial) {
            setSelectedMaterial(selectedRawMaterial);
        }
    }, [selectedRawMaterial]);

    useEffect(() => {
        if (selectedMaterial && selectedWarehouse) {
            const warehouseStock = rawMaterials.find(item => 
                item.item_id === selectedMaterial.item_id && 
                item.item_type === selectedMaterial.item_type && 
                item.warehouse === parseInt(selectedWarehouse)
            );
            setNewQuantity(warehouseStock ? warehouseStock.stock : 0);
        }
    }, [selectedWarehouse, selectedMaterial, rawMaterials]);

    const mergeInventory = (inventoryData) => {
        const mergedInventory = {};
        inventoryData.forEach((item) => {
            const key = `${item.item_type}-${item.warehouse}-${item.item_id}`;
            if (mergedInventory[key]) {
                mergedInventory[key].stock += item.stock;
            } else {
                mergedInventory[key] = {
                    ...item,
                };
            }
        });
        return Object.values(mergedInventory);
    };

    const handleApply = () => {
        const quantityValue = parseFloat(newQuantity);
        onApply(quantityValue, selectedWarehouse, selectedMaterial);
        onClose();
    };

    const handleSelectWarehouse = (warehouseId) => {
        setSelectedWarehouse(warehouseId);
    };

    return (
        <ModalOverlay isVisible={isVisible}>
            <ModalContent>
                <Title>Cambiar cantidad de producto</Title>
                {selectedMaterial && (
                    <>
                        <Label htmlFor="newQuantity">Material: {selectedMaterial.item_name}</Label>
                        <Label>Precio: {selectedMaterial.item_price}</Label>
                    </>
                )}
                <FormControl id="warehouse" mt={4}>
                    <FormLabel>Almacén</FormLabel>
                    <Select
                        value={selectedWarehouse}
                        onChange={(e) => handleSelectWarehouse(e.target.value)}
                    >
                        {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>
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
