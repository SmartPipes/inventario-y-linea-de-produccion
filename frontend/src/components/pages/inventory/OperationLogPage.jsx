import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    Space
} from 'antd';
import { 
    API_URL_OPERATION_LOG, 
    API_URL_USERS, 
    API_URL_INV, 
    API_URL_WAREHOUSES, 
    API_URL_PRODUCTS, 
    API_URL_RAW_MATERIALS 
} from '../Config';
import NavBarMenu from './NavBarMenu';

const OperationLogPage = () => {
    const [operationLogs, setOperationLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    useEffect(() => {
        fetchOperationLogs();
        fetchUsers();
        fetchInventoryItems();
        fetchWarehouses();
        fetchProducts();
        fetchRawMaterials();
    }, []);

    const fetchOperationLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_OPERATION_LOG);
            console.log('Operation logs fetched:', response.data);
            setOperationLogs(response.data);
        } catch (error) {
            console.error('Error fetching operation logs:', error);
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_URL_USERS);
            console.log('Users fetched:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get(API_URL_INV);
            console.log('Inventory items fetched:', response.data);
            setInventoryItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get(API_URL_WAREHOUSES);
            console.log('Warehouses fetched:', response.data);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL_PRODUCTS);
            console.log('Products fetched:', response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchRawMaterials = async () => {
        try {
            const response = await axios.get(API_URL_RAW_MATERIALS);
            console.log('Raw materials fetched:', response.data);
            setRawMaterials(response.data);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

    const getUserById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
    };

    const getItemName = (inventoryItemId) => {
        console.log('Inventory item search:', inventoryItemId);
        const inventoryItem = inventoryItems.find(item => item.item_id === inventoryItemId);
        console.log('Found inventory item:', inventoryItem);
        if (inventoryItem) {
            if (inventoryItem.item_type === 'Product') {
                const item = products.find(product => product.product_id === inventoryItem.item_id);
                console.log('Product found:', item);
                return item ? item.name : 'Unknown Item';
            } else if (inventoryItem.item_type === 'RawMaterial') {
                const item = rawMaterials.find(rawMaterial => rawMaterial.raw_material_id === inventoryItem.item_id);
                console.log('Raw Material found:', item);
                return item ? item.name : 'Unknown Item';
            }
        }
        console.log('Inventory item not found:', inventoryItemId);
        return 'Unknown Item';
    };

    const getWarehouseById = (warehouseId) => {
        const warehouse = warehouses.find(warehouse => warehouse.warehouse_id === warehouseId);
        return warehouse ? warehouse.name : 'Unknown Warehouse';
    };

    const columns = [
        { title: 'ID', dataIndex: 'operation_log_id', key: 'operation_log_id' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Date/Time', dataIndex: 'datetime', key: 'datetime' },
        { title: 'Operation Type', dataIndex: 'type_operation', key: 'type_operation' },
        {
            title: 'Item',
            dataIndex: 'inventory_item',
            key: 'inventory_item',
            render: (text, record) => {
                const itemName = getItemName(record.inventory_item);
                console.log('Item name:', itemName);
                return itemName;
            }
        },
        {
            title: 'User',
            dataIndex: 'op_log_user',
            key: 'op_log_user',
            render: (text) => getUserById(text),
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouse',
            key: 'warehouse',
            render: (text) => getWarehouseById(text),
        }
    ];

    return (
        <div>
            <NavBarMenu title="Operation Log" />
            <Table
                columns={columns}
                dataSource={operationLogs}
                rowKey="operation_log_id"
                loading={loading}
            />
        </div>
    );
};

export default OperationLogPage;
