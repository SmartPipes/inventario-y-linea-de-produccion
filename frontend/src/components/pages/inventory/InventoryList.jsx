import React, { useEffect, useState } from 'react';
import { Input, Button, Row, Col, Spin, Empty } from 'antd';
import { apiClient } from '../../../ApiClient';
import { API_URL_INV } from '../Config';
import NavBarMenu from './NavBarMenu';
import NewItemPage from './NewItemPage';
import InventoryItemCard from './InventoryItemCard';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
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
            setItems(response.data);
            setFilteredItems(response.data);
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

    const handleModalClose = () => {
        setIsModalVisible(false);
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
                <Button type="primary" onClick={() => setIsModalVisible(true)}>Add Item</Button>
            </div>
            <NewItemPage
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                fetchInventoryItems={fetchItems}
                onClose={handleModalClose}
            />
            {loading ? (
                <Spin size="large" />
            ) : filteredItems.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {filteredItems.map(item => (
                        <Col key={item.inventory_id} span={6}>
                            <InventoryItemCard item={item} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="No items found" />
            )}
        </div>
    );
};

export default InventoryList;
