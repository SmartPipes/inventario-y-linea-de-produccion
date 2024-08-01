import React, { useEffect, useState, useCallback } from 'react';
import { Input, Button, Row, Col, Spin, Empty, message } from 'antd';
import { apiClient } from '../../../ApiClient';
import { API_URL_INV } from '../Config';
import NavBarMenu from './NavBarMenu';
import NewItemPage from './NewItemPage';
import Card from './Card';
import QuantityModal from './QuantityModal';
import debounce from 'lodash/debounce';
import { InventoryContainer, InventorySubContainer } from '../../../Styled/Inventory.styled';

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
        debounceSearch(searchText);
    }, [searchText, items]);

    const debounceSearch = useCallback(debounce((searchText) => {
        handleSearchChange(searchText);
    }, 100), [items]);

    const fetchItems = useCallback(async () => {
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
    }, []);

    const handleSearchChange = useCallback((searchText) => {
        const filtered = items.filter(item =>
            (item.item_name && item.item_name.toLowerCase().includes(searchText.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredItems(filtered);
    }, [items]);

    const handleCardClick = useCallback((rawMaterial) => {
        setSelectedRawMaterial(rawMaterial);
        setIsQuantityModalVisible(true);
    }, []);

    const handleQuantityModalClose = useCallback(() => {
        setIsQuantityModalVisible(false);
        setSelectedRawMaterial(null);
    }, []);

    const handleAddItemModalClose = useCallback(() => {
        setIsAddItemModalVisible(false);
    }, []);

    const handleApplyQuantity = useCallback(async (quantity, warehouse, material) => {
        try {
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

                if (updateResponse.status === 200) {
                    message.success('Cantidad actualizada exitosamente.');
                    await fetchItems();
                    setIsQuantityModalVisible(false);
                    setSelectedRawMaterial(null);
                } else {
                    message.error('Error al actualizar la cantidad.');
                }
            } else {
                message.error('No se encontró el registro para actualizar.');
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
    }, [fetchItems]);

    const getUniqueItems = useCallback((data) => {
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
    }, []);

    const aggregateStock = useCallback((data) => {
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
    }, []);

    return (
        <div>
            <NavBarMenu title="Inventory" />
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <Input
                    placeholder="Search item..."
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
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
                <InventoryContainer>
                    <InventorySubContainer>
                        {filteredItems.map(item => (
                            <Card
                                key={item.inventory_id}
                                {...item}
                                onCardClick={() => handleCardClick(item)}
                            />
                        ))}
                    </InventorySubContainer>
                </InventoryContainer>
            ) : (
                <Empty description="No items found" />
            )}
            <QuantityModal 
                isVisible={isQuantityModalVisible} 
                onClose={handleQuantityModalClose} 
                onApply={handleApplyQuantity} 
                selectedRawMaterial={selectedRawMaterial}
                fetchItems={fetchItems} // Pasa fetchItems como prop
            />
        </div>
    );
};

export default InventoryList;
