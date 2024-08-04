import React, { useState, useEffect } from 'react';
import { Descriptions, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../ApiClient';
import { API_URL_RESTOCKREQUEST, API_URL_UPDATE_INVENTORY, API_URL_RAW_MATERIALS, API_URL_USERS, API_URL_WAREHOUSES, API_URL_SUPPLIERS } from '../Config';

const ReceiptDetailsPage = () => {
    const { id } = useParams();
    const [restockRequest, setRestockRequest] = useState(null);
    const [rawMaterial, setRawMaterial] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [requestedBy, setRequestedBy] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestockRequestDetails();
    }, []);

    const fetchRestockRequestDetails = async () => {
        try {
            const response = await apiClient.get(`${API_URL_RESTOCKREQUEST}${id}/`);
            const restockData = response.data;
            setRestockRequest(restockData);

            // Fetch related raw material
            const rawMaterialResponse = await apiClient.get(`${API_URL_RAW_MATERIALS}${restockData.raw_material}/`);
            setRawMaterial(rawMaterialResponse.data);

            // Fetch related warehouse
            const warehouseResponse = await apiClient.get(`${API_URL_WAREHOUSES}${restockData.warehouse}/`);
            setWarehouse(warehouseResponse.data);

            // Fetch requested by user
            const userResponse = await apiClient.get(`${API_URL_USERS}${restockData.requested_by}/`);
            setRequestedBy(userResponse.data);

            // Fetch supplier details if supplier ID exists in restockData
            if (rawMaterialResponse.data.supplier) {
                const supplierResponse = await apiClient.get(`${API_URL_SUPPLIERS}${rawMaterialResponse.data.supplier}/`);
                setSupplier(supplierResponse.data);
            } else {
                setSupplier({ name: 'Unknown', email: 'N/A' });
            }
        } catch (error) {
            console.error('Error fetching restock request details:', error);
        }
    };

    const handleValidate = async () => {
        if (!restockRequest || !rawMaterial || !warehouse) {
            message.error('Cannot validate request. Missing data.');
            return;
        }

        try {
            await apiClient.patch(`${API_URL_RESTOCKREQUEST}${id}/`, { status: 'Approved' });

            const stockData = {
                inventory_id: restockRequest.inventory_id,
                item_id: rawMaterial.raw_material_id,
                item_type: 'RawMaterial',
                warehouse_id: warehouse.warehouse_id,
                stock: restockRequest.quantity,
            };

            console.log('Data being sent to API:', stockData);

            const response = await apiClient.post(API_URL_UPDATE_INVENTORY, stockData);

            if (response.status === 200 || response.status === 201) {
                message.success('Restock request validated successfully and inventory updated');
                navigate('/inventory/receipts');
            } else {
                console.error('Unexpected response status:', response.status, response.data);
                message.error('Unexpected response status');
            }
        } catch (error) {
            console.error('Error validating restock request:', error.response?.data || error.message);
            message.error('Error validating restock request');
        }
    };

    if (!restockRequest || !rawMaterial || !warehouse || !requestedBy || !supplier) return null;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Receipt Details</h2>
            <Descriptions bordered>
                <Descriptions.Item label="Request Date">{restockRequest.requested_at}</Descriptions.Item>
                <Descriptions.Item label="Product">
                    <img src={rawMaterial.image_icon} alt={rawMaterial.name} style={{ width: '30px', marginRight: '10px' }} />
                    {rawMaterial.name}
                </Descriptions.Item>
                <Descriptions.Item label="Quantity">{restockRequest.quantity}</Descriptions.Item>
                <Descriptions.Item label="Requested By">{requestedBy.first_name} {requestedBy.last_name}</Descriptions.Item>
                <Descriptions.Item label="Supplier">{supplier.name}</Descriptions.Item>
                <Descriptions.Item label="Warehouse">{warehouse.name}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={handleValidate} disabled={restockRequest.status === 'Approved'}>
                Validate
            </Button>
        </div>
    );  
};

export default ReceiptDetailsPage;
