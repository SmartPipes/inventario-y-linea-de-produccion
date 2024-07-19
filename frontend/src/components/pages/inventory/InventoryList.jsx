import React, { useEffect, useState } from 'react';
import { Input, Button, Row, Col, Spin, Empty, message } from 'antd';
import { apiClient } from '../../../ApiClient';
import { API_URL_INV } from '../Config'; // Importa la URL de la API
import NavBarMenu from './NavBarMenu';
import NewItemPage from './NewItemPage';
import Card from './Card'; // Importa el componente Card
import QuantityModal from './QuantityModal'; // Importa el componente QuantityModal

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
    }, [searchText]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_INV);
            const uniqueItems = getUniqueItems(response.data);
            setItems(uniqueItems);
            setFilteredItems(uniqueItems);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
        setLoading(false);
    };

    const getUniqueItems = (data) => {
        const uniqueItemsMap = {};
        data.forEach(item => {
            if (!uniqueItemsMap[item.item_id]) {
                uniqueItemsMap[item.item_id] = item;
            }
        });
        return Object.values(uniqueItemsMap);
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
            const response = await apiClient.put(`${API_URL_INV}${material.inventory_id}/`, {
                item_id: material.item_id,
                item_type: material.item_type,
                warehouse: warehouse,
                stock: quantity,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Update Response:', response);
            if (response.status === 200) {
                message.success('Cantidad actualizada exitosamente.');
            } else {
                message.error('Error al actualizar la cantidad.');
            }
    
            fetchItems();
            setIsQuantityModalVisible(false);
    
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
                                onCardClick={() => handleCardClick(item)} // Pasar la función onCardClick
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
