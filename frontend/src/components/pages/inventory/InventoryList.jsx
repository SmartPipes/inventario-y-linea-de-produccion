import React, { useEffect, useState } from 'react';
import { Input, Button, Row, Col, Spin, Empty, message } from 'antd';
import { apiClient } from '../../../ApiClient';
import { API_URL_INV } from '../Config'; // Import the API URL
import NavBarMenu from './NavBarMenu';
import NewItemPage from './NewItemPage';
import Card from './Card'; // Import the Card component
import QuantityModal from './QuantityModal'; // Import the QuantityModal component

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
    const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
    const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, items]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_INV);
            const uniqueItems = getUniqueItems(response.data);
            const aggregatedItems = aggregateStock(uniqueItems);
            setItems(aggregatedItems);
            setFilteredItems(aggregatedItems);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
        setLoading(false);
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = items.filter(item =>
            (item.item_name && item.item_name.toLowerCase().includes(searchText.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredItems(filtered);
    };

    const handleCardClick = (rawMaterial) => {
        setSelectedRawMaterial(rawMaterial);
        setIsQuantityModalVisible(true);
    };

    const handleQuantityModalClose = () => {
        setIsQuantityModalVisible(false);
        setSelectedRawMaterial(null);
    };

    const handleAddItemModalClose = () => {
        setIsAddItemModalVisible(false);
    };

    const handleApplyQuantity = async (quantity, warehouse, material) => {
        try {
            // Buscar el registro en la base de datos
            const response = await apiClient.get(API_URL_INV);
            const allItems = response.data;
            
            const existingItem = allItems.find(item =>
                item.item_id === material.item_id &&
                item.item_type === material.item_type &&
                item.warehouse === warehouse
            );
    
            if (existingItem) {
                const updateResponse = await apiClient.put(`${API_URL_INV}${existingItem.inventory_id}/`, {
                    item_id: material.item_id,
                    item_type: material.item_type,
                    warehouse: warehouse,
                    stock: quantity,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                // Registro de la respuesta en la consola
                console.log('Server Response:', updateResponse.data);
                console.log(material.item_id, material.item_type, warehouse, quantity);
                if (updateResponse.status === 200) {
                    message.success('Cantidad actualizada exitosamente.');
                } else {
                    message.error('Error al actualizar la cantidad.');
                }
    
                fetchItems();
                setIsQuantityModalVisible(false);
                setSelectedRawMaterial(null); // Clear selected raw material after update
            } else {
                message.error('No se encontró el registro para actualizar.');
                console.log('Item no encontrado:', {
                    item_id: material.item_id,
                    item_type: material.item_type,
                    warehouse: warehouse
                });
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
    
            if (error.response) {
                console.error('Server Response:', error.response.data);
                message.error(`Error al actualizar la cantidad: ${error.response.data.detail || 'Error desconocido'}`);
            } else {
                message.error('Error al actualizar la cantidad');
            }
        }
    };
    
    
    

    const getUniqueItems = (data) => {
        const uniqueProductsMap = {};
        const rawMaterials = [];

        data.forEach(item => {
            if (item.item_type === 'RawMaterial') {
                rawMaterials.push(item);
            } else {
                if (!uniqueProductsMap[item.item_id]) {
                    uniqueProductsMap[item.item_id] = item;
                }
            }
        });

        return [...Object.values(uniqueProductsMap), ...rawMaterials];
    };

    const aggregateStock = (data) => {
        const aggregatedItems = data.reduce((acc, item) => {
            const existingItem = acc.find(i => i.item_id === item.item_id && i.item_type === item.item_type);
            if (existingItem) {
                existingItem.stock += item.stock;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, []);
        return aggregatedItems;
    };

    return (
        <div>
            <NavBarMenu title="Inventory" />
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <Input
                    placeholder="Search item..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => setIsAddItemModalVisible(true)}>Add Item</Button>
            </div>
            <NewItemPage
                isModalVisible={isAddItemModalVisible}
                setIsModalVisible={setIsAddItemModalVisible}
                fetchInventoryItems={fetchItems}
                onClose={handleAddItemModalClose}
            />
            {loading ? (
                <Spin size="large" />
            ) : filteredItems.length > 0 ? (
                <Row gutter={[8, 8]}>
                    {filteredItems.map(item => (
                        <Col key={item.inventory_id} xs={24} sm={12} md={8} lg={6} xl={4} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card 
                                {...item}
                                onCardClick={() => handleCardClick(item)} // Pass the onCardClick function
                            />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="No items found" />
            )}
            <QuantityModal 
                isVisible={isQuantityModalVisible} 
                onClose={handleQuantityModalClose} 
                onApply={handleApplyQuantity} 
                selectedRawMaterial={selectedRawMaterial}
            />
        </div>
    );
};

export default InventoryList;
