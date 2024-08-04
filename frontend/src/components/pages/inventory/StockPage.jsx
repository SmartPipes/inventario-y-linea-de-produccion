import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Row, Col, Select, Input } from 'antd';
import { apiClient } from '../../../ApiClient';
import NavBarMenu from './NavBarMenu';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { API_URL_INV, API_URL_WAREHOUSES, API_URL_CATEGORIES, API_URL_RAW_MATERIALS, API_URL_SUPPLIERS } from '../Config';

const { Option } = Select;

const StockPage = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredData, setFilteredData] = useState({});
    const [totalStock, setTotalStock] = useState(0);
    const [itemType, setItemType] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouses, setSelectedWarehouses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortStockOrder, setSortStockOrder] = useState(null);

    useEffect(() => {
        fetchInventory();
        fetchWarehouses();
        fetchCategories();
        fetchRawMaterials();
        fetchSuppliers();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await apiClient.get(API_URL_INV);
            setInventory(response.data);
            setFilteredData(groupByWarehouse(response.data));
            calculateTotalStock(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get(API_URL_CATEGORIES);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchRawMaterials = async () => {
        try {
            const response = await apiClient.get(API_URL_RAW_MATERIALS);
            setRawMaterials(response.data);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await apiClient.get(API_URL_SUPPLIERS);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleItemTypeChange = (value) => {
        setItemType(value);
        if (value !== "RawMaterial") {
            setSelectedCategory(null);
            setSelectedSupplier(null);
        }
    };

    const handleWarehouseChange = (value) => {
        setSelectedWarehouses(value);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const handleSupplierChange = (value) => {
        setSelectedSupplier(value);
    };

    const handleFilterClick = () => {
        try {
            filterData(itemType, selectedWarehouses, selectedCategory, selectedSupplier, minPrice, maxPrice, sortOrder, sortStockOrder);
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    const handleClearFilters = () => {
        setItemType(null);
        setSelectedWarehouses([]);
        setSelectedCategory(null);
        setSelectedSupplier(null);
        setMinPrice(null);
        setMaxPrice(null);
        setSortOrder(null);
        setSortStockOrder(null);
        setFilteredData(groupByWarehouse(inventory));
        calculateTotalStock(inventory);
    };

    const filterData = (type, warehouses, category, supplier, minPrice, maxPrice, sortOrder, sortStockOrder) => {
        let data = inventory;

        if (type) {
            data = data.filter(item => item.item_type === type);
        }

        if (warehouses.length > 0) {
            data = data.filter(item => warehouses.includes(item.warehouse));
        }

        if (type === 'RawMaterial' && category) {
            data = data.filter(item => {
                const rawMaterial = rawMaterials.find(rm => rm.raw_material_id === item.item_id);
                return rawMaterial && rawMaterial.category === category;
            });
        }

        if (type === 'RawMaterial' && supplier) {
            data = data.filter(item => {
                const rawMaterial = rawMaterials.find(rm => rm.raw_material_id === item.item_id);
                return rawMaterial && rawMaterial.supplier === supplier;
            });
        }

        if (minPrice !== null) {
            data = data.filter(item => item.item_price >= minPrice);
        }

        if (maxPrice !== null) {
            data = data.filter(item => item.item_price <= maxPrice);
        }

        if (sortOrder) {
            data = data.sort((a, b) => (sortOrder === 'ascend' ? a.item_price - b.item_price : b.item_price - a.item_price));
        }

        if (sortStockOrder) {
            data = data.sort((a, b) => (sortStockOrder === 'ascend' ? a.stock - b.stock : b.stock - a.stock));
        }

        const groupedData = groupByWarehouse(data);
        setFilteredData(groupedData);
        calculateTotalStock(data);
    };

    const groupByWarehouse = (data) => {
        return data.reduce((result, item) => {
            if (!result[item.warehouse]) {
                result[item.warehouse] = [];
            }
            result[item.warehouse].push(item);
            return result;
        }, {});
    };

    const calculateTotalStock = (data) => {
        const total = data.reduce((sum, item) => sum + item.stock, 0);
        setTotalStock(total);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        Object.keys(filteredData).forEach((warehouseId, index) => {
            const warehouseData = filteredData[warehouseId];
            const warehouseName = warehouses.find(wh => wh.warehouse_id === parseInt(warehouseId))?.name;

            if (index > 0 && doc.previousAutoTable.finalY + 15 > doc.internal.pageSize.height - 10) {
                doc.addPage();
            }
            doc.autoTable({
                head: [[{ content: `Warehouse: ${warehouseName}`, colSpan: 5, styles: { halign: 'center', fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12 } }]],
                body: [],
                theme: 'plain',
                margin: { top: 5, bottom: 5 } // Adjust the spacing
            });
            doc.autoTable({
                head: [['ID', 'Name', 'Type', 'Quantity', 'Price']],
                body: warehouseData.map((item, index) => [index + 1, item.item_name, item.item_type, item.stock, item.item_price]),
                startY: doc.previousAutoTable.finalY + 2,
                styles: { overflow: 'linebreak' } // Allow table to break within page
            });
        });

        doc.save("stock-report.pdf");
    };

    const handleDownloadCSV = () => {
        const wb = XLSX.utils.book_new();

        Object.keys(filteredData).forEach(warehouseId => {
            const warehouseData = filteredData[warehouseId].map((item, index) => ({
                No: index + 1,
                'Item Type': item.item_type,
                'Warehouse Name': warehouses.find(wh => wh.warehouse_id === item.warehouse)?.name || '',
                Stock: item.stock,
                'Item Name': item.item_name,
                'Item Description': item.item_description,
                Price: item.item_price
            }));
            const ws = XLSX.utils.json_to_sheet(warehouseData);
            const warehouseName = warehouses.find(wh => wh.warehouse_id === parseInt(warehouseId))?.name;
            XLSX.utils.book_append_sheet(wb, ws, warehouseName || `Warehouse ${warehouseId}`);
        });

        XLSX.writeFile(wb, "stock-report.xlsx");
    };

    const handleSortPriceChange = (value) => {
        setSortOrder(value);
        filterData(itemType, selectedWarehouses, selectedCategory, selectedSupplier, minPrice, maxPrice, value, sortStockOrder);
    };

    const handleSortStockChange = (value) => {
        setSortStockOrder(value);
        filterData(itemType, selectedWarehouses, selectedCategory, selectedSupplier, minPrice, maxPrice, sortOrder, value);
    };

    const columns = [
        { title: 'No.', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1 },
        { title: 'Name', dataIndex: 'item_name', key: 'item_name', render: (text, record) => (
            <div>
                <img src={record.image_icon} alt={text} style={{ width: '30px', marginRight: '10px' }} />
                {text}
            </div>
        )},
        { title: 'Type', dataIndex: 'item_type', key: 'item_type' },
        { title: 'Quantity', dataIndex: 'stock', key: 'stock' },
        { title: 'Price', dataIndex: 'item_price', key: 'item_price' },
        { title: 'Warehouse ID', dataIndex: 'warehouse', key: 'warehouse' }
    ];

    return (
        <div>
            <style>
                {`
                .filter-row .ant-col {
                    margin-bottom: 16px;
                }
                `}
            </style>
            <NavBarMenu title="Stock" />
            <Row gutter={[16, 16]} className="filter-row">
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Select Item Type"
                        onChange={handleItemTypeChange}
                        style={{ width: '100%' }}
                        value={itemType}
                        allowClear
                    >
                        <Option value="Product">Product</Option>
                        <Option value="RawMaterial">Raw Material</Option>
                        <Option value={null}>All</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Select Warehouse"
                        mode="multiple"
                        onChange={handleWarehouseChange}
                        style={{ width: '100%' }}
                        value={selectedWarehouses}
                        allowClear
                    >
                        {warehouses.map(warehouse => (
                            <Option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                {warehouse.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                {itemType === "RawMaterial" && (
                    <>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Select Category"
                                onChange={handleCategoryChange}
                                style={{ width: '100%' }}
                                value={selectedCategory}
                                allowClear
                            >
                                {categories.map(category => (
                                    <Option key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Select Supplier"
                                onChange={handleSupplierChange}
                                style={{ width: '100%' }}
                                value={selectedSupplier}
                                allowClear
                            >
                                {suppliers.map(supplier => (
                                    <Option key={supplier.supplier_id} value={supplier.supplier_id}>
                                        {supplier.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </>
                )}
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Min Price"
                        type="number"
                        onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                        value={minPrice !== null ? minPrice : ''}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Input
                        placeholder="Max Price"
                        type="number"
                        onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                        value={maxPrice !== null ? maxPrice : ''}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Sort by Price"
                        onChange={handleSortPriceChange}
                        style={{ width: '100%' }}
                        value={sortOrder}
                        allowClear
                    >
                        <Option value="ascend">Ascending</Option>
                        <Option value="descend">Descending</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Sort by Stock"
                        onChange={handleSortStockChange}
                        style={{ width: '100%' }}
                        value={sortStockOrder}
                        allowClear
                    >
                        <Option value="ascend">Ascending</Option>
                        <Option value="descend">Descending</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={24} md={6}>
                    <Space>
                        <Button type="primary" onClick={handleFilterClick}>Filter</Button>
                        <Button type="primary" danger onClick={handleClearFilters}>Clear Filters</Button>
                    </Space>
                </Col>
            </Row>
            {Object.keys(filteredData).map(warehouseId => (
                <div key={warehouseId}>
                    <h3>{warehouses.find(wh => wh.warehouse_id === parseInt(warehouseId))?.name || `Warehouse ${warehouseId}`}</h3>
                    <Table
                        columns={columns}
                        dataSource={filteredData[warehouseId]}
                        rowKey="inventory_id"
                        style={{ marginTop: 16 }}
                        pagination={false}
                        scroll={{ x: true }} // Enable horizontal scroll for mobile responsiveness
                    />
                </div>
            ))}
            <div style={{ marginTop: 16 }}>
                <Tag>Total Stock: {totalStock}</Tag>
            </div>
            <Space style={{ marginTop: 16 }}>
                <Button onClick={handleDownloadPDF}>Download PDF</Button>
                <Button onClick={handleDownloadCSV}>Download CSV</Button>
            </Space>
        </div>
    );
};

export default StockPage;
