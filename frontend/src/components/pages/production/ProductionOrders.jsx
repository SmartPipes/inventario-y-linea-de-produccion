import React, { useState, useEffect } from 'react';
import {
    API_URL_WAREHOUSES, API_URL_FACTORIES, API_URL_PRO_ORDERS, API_URL_USERS, API_URL_PL,
    API_URL_PRODUCTS, API_URL_RAW_MATERIALS, API_URL_PO_DETAILS, API_URL_PO_RAWM_DETAILS,
    API_URL_ORDERS, API_URL_PO_PHASES, API_URL_PL_PH, API_URL_PHASES
} from '../Config';
import { ProductionNavBar } from './ProductionNavBar';
import { Table, Modal, Form, Input, Space, Button, Select, message, Descriptions, Steps } from 'antd';
import { apiClient } from '../../../ApiClient';
import { MainContent } from '../../../Styled/Production.styled';
import { NavContainer } from '../../../Styled/InventoryNavBar.styled';

export const ProductionOrders = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [factories, setFactories] = useState([]);
    const [users, setUsers] = useState([]);
    const [PL, setPL] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleDetails, setIsModalVisibleDetails] = useState(false);
    const [isModalVisibleTrack, setIsModalVisibleTrack] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentOrder, setCurrentOrder] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    const [RawM, setRawMs] = useState([]);
    const [PODetails, setPODetails] = useState([]);
    const [POWR, setPOWR] = useState([]);
    const [transformedDetails, setTransformedDetails] = useState([]);
    const [transformedOrderDet, setTransformedOrderDet] = useState([]);
    const [phases, setPhases] = useState([]);
    const [PLPhases, setPLPhases] = useState([]);
    const [currentPhase, setCurrentPhase] = useState([]); //this is the list of phases for the porduction line
    const [POP, setPOP] = useState([]); 
    const [stepPLP, setStepPLP] = useState(); //This is the step which the PO is currently at


    useEffect(() => {
        getPL();
        getPLP();
        getPhases();
        fetchWarehouses();
        getProductionOrders();
        getUsers();
        getFactories();
        getRawM();
        getProducts();
        getPODetails();
        getPOWarehouseRetrieval();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, orders]);

    const fetchWarehouses = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
        setLoading(false);
    };

    const getProductionOrders = async () => {
        try {
            const response = await apiClient.get(API_URL_PRO_ORDERS);
            setOrders(response.data);
            setFilteredOrders(response.data); // Initialize filteredOrders with all orders
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
            setFilteredOrders([]); // Initialize filteredOrders as an empty array in case of error
        }
    }

    const getPhases = async () => {
        try {
            const response = await apiClient.get(API_URL_PHASES);
            setPhases(response.data);

            const response2 = await apiClient.get(API_URL_PL_PH);
            setPLPhases(response2.data);
        } catch (error) {
            console.error('Error at fetching phases', error)
        }
    }

    const getPL = async () => {
        try {
            const response = await apiClient.get(API_URL_PL);
            setPL(response.data.filter(PL => PL.status === 'Active'));
        } catch (errors) {
            console.error('Error fetching PL:', errors);
            setPL([]);
        }
    }

    const getPLP = async () => {
        try{
          const response = await apiClient.get(API_URL_PO_PHASES);
          setPOP(response.data);
        }catch (error){
          console.error('Error at fetching PLP: ',error)
        }
      }

    const getFactories = async () => {
        try {
            const response = await apiClient.get(API_URL_FACTORIES);
            setFactories(response.data);
        } catch (error) {
            console.error('Error fetching factories:', error);
            setFactories([]);
        }
    }

    const getUsers = async () => {
        try {
            const response = await apiClient.get(API_URL_USERS);
            setUsers(response.data);
        } catch (errors) {
            console.error('error at getting users:', errors);
            setUsers([]);
        }
    }

    const getProducts = async () => {
        try {
            const response = await apiClient.get(API_URL_PRODUCTS);
            setProducts(response.data);
        } catch (error) {
            console.error('Error at getting the products: ', error)
            setProducts([])
        }
    }

    const getRawM = async () => {
        try {
            const response = await apiClient.get(API_URL_RAW_MATERIALS);
            setRawMs(response.data);
        } catch (error) {
            console.error('Error at fetching Rawm: ', error);
            setRawMs([]);
        }
    }

    const getPODetails = async () => {
        try {
            const response = await apiClient.get(API_URL_PO_DETAILS);
            setPODetails(response.data)
        } catch (error) {
            console.error('Error at fetching PODetails: ', error);
            setPODetails([])
        }
    }

    const getPOWarehouseRetrieval = async () => {
        try {
            const response = await apiClient.get(API_URL_PO_RAWM_DETAILS);
            setPOWR(response.data);
        } catch (error) {
            console.error('Error at fetching POWR: ', error);
            setPOWR([]);
        }
    }

    const showModal = (order = null) => {
        setCurrentOrder(order);
        setEditMode(!!order);
        if (order) {
            form.setFieldsValue(order);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };
    const getPhaseCountForOrder = (orderId, dataArray) => {
        const filteredArray = dataArray
            .filter(obj => obj.production_order === orderId);
    
        if (filteredArray.length === 0) {
            return -1; // No objects found for this production order
        }
    
        // The count of phases for the given orderId
        return filteredArray.length;
    };

    const showModalTrack = (order = null) => { // to track in which phases the order is
        setCurrentOrder(order);
        const PLPhase = PLPhases.filter(plp => plp.productionLine === order.pl_assigned)
        .map(transform => ({
            title: phases.find(phase => phase.phase_id === transform.phase).name,
            description: phases.find(phase => phase.phase_id === transform.phase).description
        }));
        setCurrentPhase(PLPhase);
        setStepPLP(getPhaseCountForOrder(order.production_order_id, POP));
        setIsModalVisibleTrack(true);
            };

    const showModalDetails = (order = null) => {
        setCurrentOrder(order);
        setIsModalVisibleDetails(true);

        const orderDetails = PODetails
            .filter(details => details.production_order === order.production_order_id)
            .map(details => {
                const product = products.find(prod => prod.product_id === details.product);
                return {
                    key: `product_${details.id}`,
                    label: 'Product',
                    value: `${product ? product.name : 'Unknown Product'} (Qty: ${details.product_quantity})`
                };
            });


        const warehouseRetrievals = POWR
            .filter(retrieval => retrieval.production_order === order.production_order_id)
            .map(retrieval => {
                const warehouse = warehouses.find(wh => wh.warehouse_id === retrieval.warehouse);
                const rawMaterial = RawM.find(rm => rm.raw_material_id === retrieval.raw_material);
                console.log('Retrieval:', retrieval);
                console.log('Warehouse:', warehouse);
                console.log('RawMaterial:', rawMaterial);
                return {
                    key: `retrieval_${retrieval.id}`,
                    label: 'Warehouse Retrieval',
                    value: `${retrieval.qty} units of ${rawMaterial ? rawMaterial.name : 'Unknown Material'} from ${warehouse ? warehouse.name : 'Unknown Warehouse'}`
                };
            });
        setTransformedDetails([...warehouseRetrievals]);
        setTransformedOrderDet([...orderDetails]);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // Update the current order with the selected PL
            const updatedOrder = {
                ...currentOrder,
                status: 'In Progress', //when it gives it a production line it changes the status to In Progress meaning its starting
                pl_assigned: values['Production Line']
            };

            // Find the first phase in the sequence for the selected production line
            const initialPhase = PLPhases.find(phase => phase.productionLine === updatedOrder.pl_assigned && phase.sequence_number === 1);

            const PO_phases = {
                exit_phase_date: null,
                production_order: currentOrder.production_order_id,
                phase: initialPhase.phase
            };

            // set the production line to in use
            const PLtoUPD = PL.find(pl => pl.productionLine_id === values['Production Line']);
            //set its state to "In Use"
            const updatedPL = {
                ...PLtoUPD,
                state: 'In Use'
            }


            await apiClient.put(`${API_URL_ORDERS}${currentOrder.production_order_id}/`, updatedOrder);
            await apiClient.post(API_URL_PO_PHASES, PO_phases);
            await apiClient.put(`${API_URL_PL}${values['Production Line']}/`,updatedPL)
            message.success('Order successfully assigned to Production Line, Starting production!');
            getProductionOrders();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error assigning to PL:', error);
            message.error('Failed to assign order to Production Line');
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = orders.filter(order =>
            order.production_order_id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
            (order.status && order.status.toLowerCase().includes(searchText.toLowerCase())) ||
            (order.requested_by && users.find(user => user.id === order.requested_by)?.first_name.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredOrders(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'production_order_id', key: 'production_order_id' },
        {
            title: 'Issued Date', dataIndex: 'creation_date', key: 'creation_date', render: (text) => {
                const date = new Date(text);
                const formattedDate = date.toISOString().substring(0, 10);
                const formattedTime = date.toISOString().substring(11, 19);
                return `${formattedDate} | ${formattedTime}`;
            }
        },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Warehouse To Deliver', dataIndex: 'warehouse_to_deliver', key: 'warehouse_to_deliver', render: (text) => warehouses.find(warehouse => warehouse.warehouse_id === text)?.name || 'Unknown' },
        { title: 'Factory', dataIndex: 'factory', key: 'factory', render: (text) => factories.find(factory => factory.factory_id === text)?.name || 'Unknown' },
        {
            title: 'Requested By', dataIndex: 'requested_by', key: 'requested_by', render: (text) => {
                const user = users.find(user => user.id === text);
                return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
            }
        },
        {
            title: 'Assigned PL', dataIndex: 'pl_assigned', key: 'pl_assigned', render: (text) => {
                if (text === null) {
                    return 'Pending';
                }
                const productionLine = PL.find(PL => PL.productionLine_id === text);
                return productionLine ? productionLine.name : 'Unknown';
            }
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.pl_assigned === null && (
                        <Button onClick={() => showModal(record)} type="default">Assign to PL</Button>
                    )}
                    <Button onClick={() => showModalDetails(record)} type="default">Details</Button>
                    {record.pl_assigned != null && record.status === 'In Progress' &&(
                        <Button onClick={() => showModalTrack(record)} type="default">Track</Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div>
            <ProductionNavBar />
            <NavContainer>
                <div style={{ marginBottom: '18px', marginTop: '18px', margiLeft: '2px', width: '99.9%' }}>
                    <Input
                        placeholder="Search by ID, Status or User"
                        value={searchText}
                        onChange={e => handleSearchChange(e.target.value)}
                        style={{ width: '99.9%' }}
                        size='large'
                    />
                </div>
            </NavContainer>
            <MainContent>
                <Table
                    columns={columns}
                    dataSource={filteredOrders}
                    rowKey="order_id"
                    loading={loading}
                />
            </MainContent>
            <Modal
                title={`Order ID: ${currentOrder ? currentOrder.production_order_id : ''} - Assign To a PL`}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="Production Line" label="Assign Order To" rules={[{ required: true }]}>
                        <Select>
                            {PL.filter(PL => PL.factory === 1).map(PL => (// EL 1 DE LA FACTORY DEBE DE SER CAMBIADO TOMANDO EL NUMERO DE FACTORY QUE SE LE TIENE ASIGNADO AL USER DE MANAGER DE LA FABRICA, TOMAR DEL CONTEXTO
                                <Select.Option key={PL.productionLine_id} value={PL.productionLine_id}>{PL.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={`Order ID: ${currentOrder ? currentOrder.production_order_id : ''} - Details`}
                visible={isModalVisibleDetails}
                onCancel={() => setIsModalVisibleDetails(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisibleDetails(false)}>Close</Button>
                ]}
            >
                <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                    <Descriptions title="Ordered Products" bordered column={1}>
                        {transformedOrderDet.map(detail => (
                            <Descriptions.Item key={detail.key} label={detail.label}>
                                {detail.value}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>

                    <Descriptions title="Retrieval" bordered column={1}>
                        {transformedDetails.map(detail => (
                            <Descriptions.Item key={detail.key} label={detail.label}>
                                {detail.value}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </div>
            </Modal>
            <Modal
                title={`Order ID: ${currentOrder ? currentOrder.production_order_id : ''} - Track`}
                visible={isModalVisibleTrack}
                onCancel={() => setIsModalVisibleTrack(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisibleTrack(false)}>Close</Button>
                ]}
            >

                <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px', maxWidth:'800px'}}>
                    <Steps direction='vertical' current={stepPLP-1} items={currentPhase}/> {/*current should be dynamic and should be taken from pro_ProductionOrders-Phases*/}
                </div>
            </Modal>
        </div>
    );
};
