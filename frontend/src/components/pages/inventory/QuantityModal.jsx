import React, { useState, useEffect } from 'react';
import { Modal, Select, Input, Form, Button, message } from 'antd';
import { apiClient } from '../../../ApiClient';
import { API_URL_WAREHOUSES, API_URL_INV } from '../Config';
import { Title, Label, ButtonContainer } from '../../../Styled/QuantityModal.styled';

const { Option } = Select;

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
                    setSelectedWarehouse(response.data[0].warehouse_id);
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
        if (isNaN(quantityValue) || quantityValue < 0) {
            message.error('La cantidad debe ser un número positivo.');
            return;
        }
        if (!selectedMaterial) {
            message.error('No hay material seleccionado.');
            return;
        }
        if (!selectedWarehouse) {
            message.error('No hay almacén seleccionado.');
            return;
        }
        onApply(quantityValue, selectedWarehouse, selectedMaterial);
        setNewQuantity(''); // Clear quantity after applying
    };

    const handleSelectWarehouse = (value) => {
        setSelectedWarehouse(value);
        // Update quantity when warehouse changes
        if (selectedMaterial) {
            const warehouseStock = rawMaterials.find(item => 
                item.item_id === selectedMaterial.item_id && 
                item.item_type === selectedMaterial.item_type && 
                item.warehouse === parseInt(value)
            );
            setNewQuantity(warehouseStock ? warehouseStock.stock : 0);
        }
    };

    return (
        <Modal
            visible={isVisible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Title>Cambiar cantidad de producto</Title>
            {selectedMaterial && (
                <>
                    <Label htmlFor="newQuantity">Material: {selectedMaterial.item_name}</Label>
                    <Label>Precio: {selectedMaterial.item_price}</Label>
                    <Label>Cantidad actual en almacén seleccionado: {newQuantity}</Label>
                </>
            )}
            <Form layout="vertical">
                <Form.Item label="Almacén" required>
                    <Select
                        value={selectedWarehouse}
                        onChange={handleSelectWarehouse}
                        placeholder="Selecciona un almacén"
                    >
                        {warehouses.map((warehouse) => (
                            <Option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                {warehouse.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Nueva cantidad disponible" required>
                    <Input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                </Form.Item>
                <ButtonContainer>
                    <Button type="primary" onClick={handleApply} style={{ marginRight: '8px' }}>Aplicar</Button>
                    <Button onClick={onClose}>Descartar</Button>
                </ButtonContainer>
            </Form>
        </Modal>
    );
};

export default QuantityModal;
