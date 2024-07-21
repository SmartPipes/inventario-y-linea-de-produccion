import React, { useState, useEffect } from 'react';
import { Modal, Select, Input, Form, Button, message } from 'antd';
import { apiClient } from '../../../ApiClient';
import { API_URL_WAREHOUSES, API_URL_INV } from '../Config';
import { ButtonContainer } from '../../../Styled/QuantityModal.styled';

const { Option } = Select;

const QuantityModal = ({ isVisible, onClose, onApply, selectedRawMaterial, fetchItems }) => {
    const [newQuantity, setNewQuantity] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(selectedRawMaterial);

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
                message.error('Error fetching warehouses.');
            }
        };

        const fetchRawMaterials = async () => {
            try {
                const response = await apiClient.get(API_URL_INV);
                const mergedInventory = mergeInventory(response.data);
                setRawMaterials(mergedInventory);
            } catch (error) {
                console.error('Error fetching raw materials:', error);
                message.error('Error fetching raw materials.');
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
            updateCurrentQuantity(selectedMaterial, selectedWarehouse);
        }
    }, [selectedWarehouse, selectedMaterial, rawMaterials]);

    const mergeInventory = (inventoryData) => {
        const mergedInventory = {};
        inventoryData.forEach((item) => {
            const key = `${item.item_type}-${item.warehouse}-${item.item_id}`;
            if (mergedInventory[key]) {
                mergedInventory[key].stock += item.stock;
            } else {
                mergedInventory[key] = { ...item };
            }
        });
        return Object.values(mergedInventory);
    };

    const updateCurrentQuantity = (material, warehouse) => {
        const inventoryItem = rawMaterials.find(
            (item) =>
                item.item_id === material.item_id &&
                item.item_type === material.item_type &&
                item.warehouse === warehouse
        );
        setCurrentQuantity(inventoryItem ? inventoryItem.stock : 0);
    };

    const handleApply = async () => {
        if (newQuantity === '') {
            message.error('Por favor, ingrese una cantidad.');
            return;
        }

        if (selectedMaterial && selectedWarehouse) {
            try {
                // Llamar a onApply y obtener la respuesta
                await onApply(newQuantity, selectedWarehouse, selectedMaterial);

                // Actualizar rawMaterials y currentQuantity después de aplicar los cambios
                const updatedRawMaterials = await apiClient.get(API_URL_INV).then(response => mergeInventory(response.data));
                setRawMaterials(updatedRawMaterials);
                updateCurrentQuantity(selectedMaterial, selectedWarehouse);

                // Limpiar el campo newQuantity
                setNewQuantity('');
                
                // Cerrar el modal
                onClose();
            } catch (error) {
                console.error('Error applying changes:', error);
                message.error('Error aplicando los cambios.');
            }
        } else {
            message.error('Por favor, seleccione un almacén y un material.');
        }
    };

    return (
        <Modal
            title={`Actualizar Cantidad - ${selectedMaterial ? selectedMaterial.item_name : ''}`}
            visible={isVisible}
            onCancel={onClose}
            footer={null}
        >
            <Form layout="vertical">
                <Form.Item label="Almacén">
                    <Select
                        value={selectedWarehouse}
                        onChange={(value) => setSelectedWarehouse(value)}
                    >
                        {warehouses.map((warehouse) => (
                            <Option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                {warehouse.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Cantidad Actual">
                    <Input value={currentQuantity} disabled />
                </Form.Item>
                <Form.Item label="Nueva Cantidad">
                    <Input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <ButtonContainer>
                        <Button type="primary" onClick={handleApply}>
                            Aplicar
                        </Button>
                        <Button onClick={onClose}>Cancelar</Button>
                    </ButtonContainer>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default QuantityModal;
