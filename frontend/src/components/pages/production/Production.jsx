import React, { useState, useEffect } from 'react';
import { ProductionNavBar } from './ProductionNavBar';
import { MainContent } from '../../../Styled/Production.styled';
import { FormContainer, Label, Input, ButtonContainer, Error, SelectStyled, Button } from '../../../Styled/Forms.styled';
import { useForm, Controller } from 'react-hook-form';
import { faPlus, faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavSearchContainer } from '../../../Styled/InventoryNavBar.styled';
import ModalComponent from '../../modals/ProductionModals';
import Select from 'react-select';
import { ModalTitle } from '../../../Styled/Global.styled';
import { API_URL_PRODUCTS, API_URL_FACTORIES, API_URL_WAREHOUSES, API_URL_ORDERS, API_URL_RAWMLIST, API_URL_INV, API_URL_RAW_MATERIALS, API_URL_PO_DETAILS, API_URL_PO_RAWM_DETAILS, API_URL_PRO_ORDERS, API_URL_PL, API_URL_RESTOCK_WH, API_URL_RESTOCK_WH_DETAIL, API_URL_PO_PHASES, API_URL_PHASES, API_URL_PL_PH, API_URL_FAC_MANAGER } from '../Config';
import { apiClient } from '../../../ApiClient';
import { Card, Row, Col, Layout, Table, Space, Button as AntButton, Modal, Flex, Steps, Typography, message, Alert } from 'antd';
const { Content } = Layout;
const { Text } = Typography;

export const Production = () => {
  const [newOrder, setNewOrder] = useState(false);
  const [products, setProducts] = useState([]);
  const [factory, setFactories] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [modalWarehouse, setModalWarehouse] = useState(null);
  const [productFields, setProductFields] = useState([{ product: '', qty: '' }]);
  const [warehousesToPick, setWarehousesToPick] = useState(null);
  const [raw_materials, setRaw_Materials] = useState([]);
  const [warehousesRMFiltered, setwarehousesRMFiltered] = useState([]);
  const [itemsNeeded, setItemsNeeded] = useState([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState();
  const [selectedWarehousesList, setSelectedWarehousesList] = useState([]);
  const [productionOrderInfo, setProductionOrder] = useState();
  const [PendingOrders, setPendingOrders] = useState([]);
  const [IPOrders, setIPOrders] = useState([]);
  const [FinishedOrders, setFinishedOrders] = useState([]);
  const [PL, setPL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rawmToRetrieveFrom, setRawmToRetrieveFrom] = useState({});
  const [responseIDWarehouseRestock, setResponseIDWarehouseRestock] = useState();
  const [currentPL, setCurrentPL] = useState([]);
  const [isModalVisibleProduction, setIsModalVisibleProduction] = useState(false);
  const [PLPhases, setPLPhases] = useState([]);
  const [phases, setPhases] = useState([]);
  const [currentPhase, setCurrentPhase] = useState([]);
  const [POP, setPOP] = useState([]);
  const [stepPLP, setStepPLP] = useState();
  const [PO, setPO] = useState([]);
  const [currentPOID, setCurrentPOID] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allItemsFulfilled, setAllItemsFulfilled] = useState(false);
  const [PODetails, setPODetails] = useState([]);
  const [inventoryState, setInventoryState] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [facManagers, setFacManagers] = useState([]);

  useEffect(() => {
    // When selectedWarehousesList changes, update materialsArray
    const newMaterialsArray = selectedWarehousesList.flatMap(warehouse =>
      warehouse.materials.map(material => ({
        warehouse: warehouse.warehouse,
        rawm: material.rawm,
        qty: material.qty
      }))
    );
    setRawmToRetrieveFrom(newMaterialsArray);
  }, [selectedWarehousesList]);

  useEffect(() => {
    getInventory();
  }, [productionOrderInfo]);

  const addProductField = () => {
    setProductFields([...productFields, { product: '', qty: '' }]);
    setSelectedProducts([...selectedProducts, '']);
  };

  const removeProductField = (index) => {
    unregister(`productFields.${index}.product`);
    unregister(`productFields.${index}.qty`);
    const newFields = [...productFields];
    newFields.splice(index, 1);
    setProductFields(newFields);
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
  };

  const handleProductChange = (value, index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = value;
    setSelectedProducts(newSelectedProducts);
  };

  const getFilteredProducts = (index) => {
    return products.filter(product => !selectedProducts.includes(product) || selectedProducts[index] === product);
  };

  const openModal = () => {
    setNewOrder(true);
  };

  const closeModal = () => {
    setNewOrder(false);
    reset();
  };

  const getInventory = async () => {
    try {
      const response = await apiClient.get(API_URL_INV);
      setInventoryState(response.data);
    } catch (error) {
      console.error('Error at fetching inv: ', error);
    }
  };

  const products_batch = [{ value: 1, label: 50 }, { value: 2, label: 100 }, { value: 3, label: 150 }, { value: 4, label: 200 }, { value: 5, label: 250 }, { value: 6, label: 300 }, { value: 7, label: 2 }, { value: 8, label: 500 }];

  useEffect(() => {
    fetchFactoryManagers();
    const userInfoJson = {
      id: localStorage.getItem('user_id'),
      role: localStorage.getItem('user_role'),
      name: localStorage.getItem('user_name')
    };
    if (userInfoJson.role && userInfoJson.name && userInfoJson.id) {
      setUserInfo(userInfoJson);
    }
  }, []);

  useEffect(() => {
    if (userInfo && facManagers.length > 0) {
      getPL();
      getProducts();
      getFactories();
      getWarehouses();
      getRM();
      getProductionOrders();
      getPLP();
      getPhases();
      getPODetails();
    }
  }, [userInfo, facManagers]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    unregister
  } = useForm();

  const fetchFactoryManagers = async () => {
    try {
      const response = await apiClient.get(API_URL_FAC_MANAGER);
      console.log('Fetched facManagers:', response.data);
      setFacManagers(response.data);
    } catch (error) {
      console.error('Error at fetching Managers: ', error);
    }
  };

  const getPL = async () => {
    try {
        const response = await apiClient.get(API_URL_PL);

        if (userInfo.role === 'Admin') {
            setPL(response.data.filter(PL => PL.status === 'Active'));
        } else {
            const isManager = facManagers.find(man => man.manager === parseInt(userInfo.id) && man.departure_date === null)?.factory ?? null;
            console.log(isManager);
            if (isManager) {
                setPL(response.data.filter(PL => PL.status === 'Active' && PL.factory === isManager));
            } else {
                <Alert message="You are not a manager of any factory, you can't control the flow of production" type="warning" />
            }
        }
    } catch (errors) {
        console.error('Error fetching PL:', errors);
        setPL([]);
    }
}

  const getPhases = async () => {
    try {
      const response = await apiClient.get(API_URL_PHASES);
      setPhases(response.data);

      const response2 = await apiClient.get(API_URL_PL_PH);
      setPLPhases(response2.data);
    } catch (error) {
      console.error('Error at fetching phases', error);
    }
  };

  const getPODetails = async () => {
    try {
      const response = await apiClient.get(API_URL_PO_DETAILS);
      setPODetails(response.data);
    } catch (error) {
      console.error('Error at fetching phases', error);
    }
  };

  const openModalWarehouse = (warehouse_id) => {
    if (typeof warehouse_id === 'object' && 'otherWH' in warehouse_id) {
      setWarehousesToPick(warehouse_id);
      setItemsNeeded(warehouse_id.agregatedCombinedMaterialList_withName.map(item => ({
        ...item,
        initialQty: item.qty
      })));
    } else {
      const warehouse_name = warehouse.find(obj => obj.value === warehouse_id);
      setModalWarehouse(warehouse_name);
    }
  };

  const handleWarehouseSelection = (selectedWarehouses) => {
    let updatedItems = itemsNeeded.map(item => ({ ...item, qty: item.initialQty }));
    let updatedSelectedWarehousesList = [];

    selectedWarehouses.forEach(selectedWarehouse => {
      const warehouseInventory = warehousesToPick.filtered_rm.flat().filter(rm => rm.warehouse === selectedWarehouse.value);
      let warehouseMaterials = [];

      warehouseInventory.forEach(rm => {
        const item = updatedItems.find(item => item.rawm === rm.item_id);
        if (item && item.qty > 0) {
          const qtyToSubtract = Math.min(item.qty, rm.stock);
          item.qty -= qtyToSubtract;
          warehouseMaterials.push({ rawm: rm.item_id, qty: qtyToSubtract });
        }
      });

      updatedSelectedWarehousesList.push({ warehouse: selectedWarehouse.value, materials: warehouseMaterials });
    });

    setItemsNeeded(updatedItems);
    setSelectedWarehouses(selectedWarehouses);
    setSelectedWarehousesList(updatedSelectedWarehousesList);

    const allFulfilled = updatedItems.every(item => item.qty === 0);
    setAllItemsFulfilled(allFulfilled);
  };

  const closeModalWarehouse = () => {
    setModalWarehouse(null);
  };

  const closeModalWarehouseToPick = () => {
    setWarehousesToPick(null);
  };

  const aggregateMaterials = (materialsList) => {
    const materialsMap = new Map();

    materialsList.forEach(({ rawm, qty }) => {
      if (materialsMap.has(rawm)) {
        materialsMap.set(rawm, materialsMap.get(rawm) + qty);
      } else {
        materialsMap.set(rawm, qty);
      }
    });
    return Array.from(materialsMap, ([rawm, qty]) => ({ rawm, qty }));
  };

  const onSubmit = async (data) => {
    try {
        setProductionOrder(data)
        // Extract product fields
        const productFields = data.productFields;
        
        // Create a combined materials list for all products
        let combinedMaterialsList = [];
        console.log(productFields)
        // Loop through each product field to get the necessary materials
        for (let i = 0; i < productFields.length; i++) {
            const product = productFields[i].product.value;
            const qty = productFields[i].qty.label;

            // Get the list of raw materials for the current product
            const materialsList = await apiClient.get(API_URL_RAWMLIST);
            const productMaterialsList = materialsList.data.filter(rawm => rawm.product === product)
                .map(rawm => ({
                    rawm: rawm.raw_material,
                    qty: rawm.quantity * qty // Multiply the product qty by the raw materials
                    
                }));
            // Add to the combined materials list
            combinedMaterialsList = [...combinedMaterialsList, ...productMaterialsList];
        }
        const agregatedCombinedMaterialList = aggregateMaterials(combinedMaterialsList);
        // Check the warehouses in the same city as the factory
        // const filteredWarehouses = warehouse.filter(wh => wh.city === data.factory.city)
        //     .map(f_warehouse => ({
        //         id: f_warehouse.value,
        //         name: f_warehouse.label
        //     }));
        const inventory = await apiClient.get(API_URL_INV);

        // let neededMaterials = [...agregatedCombinedMaterialList];
        // let warehousesUsed = [];

        // for (let i = 0; i < filteredWarehouses.length; i++) {
        //     const warehouseId = filteredWarehouses[i].id;

        //     const filteredInv = inventory.data.filter(inv => inv.warehouse === warehouseId && inv.item_type === 'RawMaterial');


        //     let warehouseMaterialsUsed = [];
        //     for (let j = 0; j < neededMaterials.length; j++) {
        //         const material = neededMaterials[j];
        //         const inventoryItem = filteredInv.find(inv => inv.item_id === material.rawm);
        //         //console.log(` ALL ${inventoryItem.inventory_id} - ${inventoryItem.stock} - ${material.qty}`)

        //         if (inventoryItem && inventoryItem.stock >= material.qty) {
        //           //console.log(`${inventoryItem.stock} - ${material.qty}`)
        //             warehouseMaterialsUsed.push(material);
        //         }
        //     }
              
        //     if (warehouseMaterialsUsed.length > 0) {
        //         warehousesUsed.push({ warehouseId, materials: warehouseMaterialsUsed });
        //         neededMaterials = neededMaterials.filter(material => !warehouseMaterialsUsed.includes(material));
        //     }
        //     if (neededMaterials.length === 0) {
        //         break;
        //     }
            
        // }

        // if (neededMaterials.length === 0) {
        //     // We have found enough materials in the warehouses in the same city
        //     console.log(warehousesUsed)
        //     openModalWarehouse(warehousesUsed[0].warehouseId);

        // } else {
        // We need to look for materials in other cities
        let agregatedCombinedMaterialList_withName
        let filtered_rm = [];
        for (let i = 0; i < warehouse.length; i++) {
            const warehouseId = warehouse[i].value;
            console.log('warehouse ID: '+warehouseId)

            //gets all the material from the warehouses 
            const filteredInv = inventory.data.filter(inv => inv.warehouse === warehouseId && inv.item_type === 'RawMaterial');
            // add the name to the agregatedCombinedMaterialList
             agregatedCombinedMaterialList_withName = agregatedCombinedMaterialList.map(rm => {
              const matchedMaterial = raw_materials.find(material => material.id === rm.rawm);
              return {
                  rawm: rm.rawm,
                  qty: rm.qty,
                  name: matchedMaterial ? matchedMaterial.name : null
              };
          });
            //its basically the inventory of every warehouse but only the RM we need and its stock
            if(filteredInv.filter(rm => agregatedCombinedMaterialList_withName.some(material => material.name === rm.item_name)).length > 0)
            filtered_rm.push(filteredInv.filter(rm => agregatedCombinedMaterialList_withName.some(material => material.name === rm.item_name)));
            //filtered_rm tells us which warehouses have the things we need and the info of it
        }
        const flattened_rm = filtered_rm.flat();
        // Get unique warehouse values
        const uniqueWarehouses = [...new Set(flattened_rm.map(rm => rm.warehouse))];
        setwarehousesRMFiltered(
          uniqueWarehouses.map(warehouseId => {
            const warehouseDetails = warehouse.find(wh => wh.value === warehouseId);
            return {
              value: warehouseId,
              label: warehouseDetails ? warehouseDetails.label : ''
            };
          })
      );
      
        // Open modal sending the qty of each material specified in agregatedCombinedMaterialList for each warehouse, only sending info of rhe material we need (specidied in agregatedCombinedMaterialList)
        openModalWarehouse({ agregatedCombinedMaterialList_withName,filtered_rm,otherWH: true});
    //}


    } catch (error) {
        console.error('Error submitting:', error);
    }
};

  const onSubmitWarehousesPicking = async(data) => {
    console.log(data);
    console.log(productionOrderInfo);
    const transformed_general_order = {
      "status": "Pending",
      "warehouse_to_deliver": productionOrderInfo.warehouse.value,
      "factory": productionOrderInfo.factory.value,
      "requested_by": 1 //get the user ID by the context of the logging
    }
    //post the general order
    const production_order = await apiClient.post(API_URL_ORDERS, transformed_general_order);
    console.log(production_order.data.production_order_id)
    //post the products linked to the order
    //add in the order detail all the products that had been chosen
    for (let i = 0; i < productionOrderInfo.productFields.length;i++) {
      let product_order = {
        "product_quantity": productionOrderInfo.productFields[i].qty.label,
        "production_order": production_order.data.production_order_id,
        "product": productionOrderInfo.productFields[i].product.value
      }
      await apiClient.post(API_URL_PO_DETAILS, product_order)
    }

    //Add  to the third table (The long one)
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].materials.length; j++) {
          let material_order = {
              "qty": data[i].materials[j].qty,
              "production_order": production_order.data.production_order_id,
              "warehouse": data[i].warehouse,
              "raw_material": data[i].materials[j].rawm
          };
          console.log(material_order);
          await apiClient.post(API_URL_PO_RAWM_DETAILS, material_order);
      }
  }

  const groupByWarehouse = rawmToRetrieveFrom.reduce((acc, item) => {
    if (!acc[item.warehouse]) {
      acc[item.warehouse] = [];
    }
    acc[item.warehouse].push(item);
    return acc;
  }, {});
let arrayRequestRM =[]
  const postWarehouseData = async (warehouseId) => {
    const payload = {
      status: 'Pending',
      from_warehouse: warehouseId,
      requested_by: 1, // THIS NEEDS TO BE THE USER FROM THE LOGIN
      to_factory: productionOrderInfo.factory.value,
      production_order_id: production_order.data.production_order_id
    };
  
    try {
      const response = await apiClient.post(API_URL_RESTOCK_WH, payload);
      arrayRequestRM.push(response.data.id)
    } catch (error) {
      console.error(`Error posting warehouse data for warehous restock ${warehouseId}:`, error);
    }
  }

  const postItemData = async (items) => {
    try {
      const transformed_rawm_needed = items.map(rawm => ({
        quantity: rawm.qty,
        restock_request_warehouse: arrayRequestRM[flag],
        raw_material: rawm.rawm
      }));
  
      console.log('Transformed Raw Materials Needed:', transformed_rawm_needed);
  
      for (let i = 0; i < transformed_rawm_needed.length; i++) {
        const item = transformed_rawm_needed[i];
        if (item.quantity && item.restock_request_warehouse && item.raw_material) {
          try {
            const response = await apiClient.post(API_URL_RESTOCK_WH_DETAIL, item);
            console.log(`Successfully posted item: ${JSON.stringify(item)}`, response.data);
          } catch (error) {
            console.error(`Error posting item ${JSON.stringify(item)}:`, error.response ? error.response.data : error);
          }
        } else {
          console.error(`Invalid item data: ${JSON.stringify(item)}`);
        }
      }
    } catch (error) {
      console.error(`Error processing items: ${JSON.stringify(items)}`, error);
    }
  };
  
  // Make the rawm request to all the other warehouses
  let flag = 0;
  for (const [warehouseId, items] of Object.entries(groupByWarehouse)) {
    await postWarehouseData(Number(warehouseId));
    await postItemData(items,flag);
    flag++;
  }
  closeModalWarehouseToPick();
  closeModal();
  getProductionOrders();
};

  const getProducts = async () => {
    try {
      const response = await apiClient.get(API_URL_PRODUCTS);
      const transformedProducts = response.data
        .filter(products => products.status === "Active")
        .map(products => ({
          value: products.product_id,
          label: products.name,
          img: products.image_icon
        }));
      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products: " + error);
      setProducts([]);
    }
  };

  const getRM = async () => {
    try {
      const response = await apiClient.get(API_URL_RAW_MATERIALS);
      const transformedRM = response.data.map(rm => ({
        id: rm.raw_material_id,
        name: rm.name,
      }));
      setRaw_Materials(transformedRM);
    } catch (error) {
      console.error("Error fetching raw materials: " + error);
      setRaw_Materials([]);
    }
  };

  const getFactories = async () => {
    try {
      const response = await apiClient.get(API_URL_FACTORIES);
      const transformedFactories = response.data
        .filter(factory => factory.status === "Active")
        .map(factory => ({
          value: factory.factory_id,
          label: factory.name,
          city: factory.city
        }));
      setFactories(transformedFactories);
    } catch (error) {
      console.error('Error fetching factories:', error);
      setFactories([]);
    }
  };

  const getWarehouses = async () => {
    try {
      const response = await apiClient.get(API_URL_WAREHOUSES);
      const transformedWarehouse = response.data
        .filter(warehouse => warehouse.status === "Active")
        .map(warehouse => ({
          value: warehouse.warehouse_id,
          label: warehouse.name,
          city: warehouse.city
        }));
      setWarehouse(transformedWarehouse);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setWarehouse([]);
    }
  };

  const getProductionOrders = async () => {
    try {
        const response = await apiClient.get(API_URL_PRO_ORDERS);
        let p = 0;
        let ip = 0;
        let d = 0;

        let transformedOrders = response.data;

        if (userInfo.role !== 'Admin') {
            const isManager = facManagers.find(man => man.manager === parseInt(userInfo.id) && man.departure_date === null)?.factory ?? null;
            if (isManager) {
                transformedOrders = transformedOrders.filter(order => order.factory === isManager);
            } else {
                setPendingOrders(0);
                setIPOrders(0);
                setFinishedOrders(0);
                setPO([]);
                return;
            }
        }

        transformedOrders.forEach(order => {
            if (order.status === 'Pending') {
                p++;
            } else if (order.status === 'In Progress') {
                ip++;
            } else {
                d++;
            }
        });

        setPendingOrders(p);
        setIPOrders(ip);
        setFinishedOrders(d);
        setPO(transformedOrders);
    } catch (errors) {
        console.error('Error fetching production orders:', errors);
        setPendingOrders(0);
        setIPOrders(0);
        setFinishedOrders(0);
        setPO([]);
    }
};


  const getPLP = async () => {
    try {
      const response = await apiClient.get(API_URL_PO_PHASES);
      setPOP(response.data);
    } catch (error) {
      console.error('Error at fetching PLP: ', error);
    }
  };

  const formatOptionLabel = ({ label, img }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={img} alt={label} style={{ width: 30, marginRight: 10 }} />
      <span>{label}</span>
    </div>
  );

  const getPhaseCountForOrder = (orderId, dataArray) => {
    const filteredArray = dataArray
      .filter(obj => obj.production_order === orderId);

    if (filteredArray.length === 0) {
      return -1;
    }

    return filteredArray.length;
  };

  const showModalProduction = (PL = null) => {
    setCurrentPL(PL);
    const PLPhase = PLPhases.filter(plp => plp.productionLine === PL.productionLine_id)
      .map(transform => ({
        title: phases.find(phase => phase.phase_id === transform.phase).name,
        description: phases.find(phase => phase.phase_id === transform.phase).description
      }));
    setCurrentPhase(PLPhase);
    const productionOrderID = PO.find(po => po.pl_assigned === PL.productionLine_id && po.status === 'In Progress').production_order_id;
    setCurrentPOID(productionOrderID);
    setStepPLP(getPhaseCountForOrder(productionOrderID, POP));
    setIsModalVisibleProduction(true);
  };

  function getNextPhase(phases, currentPhase) {
    const sortedPhases = phases.sort((a, b) => a.sequence_number - b.sequence_number);
    const currentIndex = sortedPhases.findIndex(phase => phase.phase === currentPhase);

    if (currentIndex === -1 || currentIndex === sortedPhases.length - 1) {
      return 0;
    }

    return sortedPhases[currentIndex + 1];
  }

  const success = (type) => {
    if (type) {
      messageApi.open({
        type: 'success',
        content: 'Changed Phase Successfully!',
      });
    } else {
      messageApi.open({
        type: 'success',
        content: 'Finished Order!',
      });
    }
  };

  const ChangePOPhase = async () => {
    try {
      const selfPhases = PLPhases.filter(ph => ph.productionLine === currentPL.productionLine_id);
      const nextPhase = getNextPhase(selfPhases, stepPLP).phase;

      if (nextPhase != undefined) {
        const PO_phases = {
          exit_phase_date: null,
          production_order: currentPOID,
          phase: nextPhase
        };
        await apiClient.post(API_URL_PO_PHASES, PO_phases);
        await getPLP();
        setIsModalVisibleProduction(false);
        success(true);
      } else {
        success(false);
        const PLupdState = {
          ...currentPL,
          state: "Free"
        };
        delete PLupdState.date_created;

        const POfinish = {
          ...(PO.find(po => po.production_order_id === currentPOID)),
          status: "Completed"
        };
        delete POfinish.creation_date;

        const productsCreated = PODetails.filter(pro => pro.production_order === currentPOID);
        const WH = PO.find(po => po.production_order_id === currentPOID).warehouse_to_deliver;

        for (const product of productsCreated) {
          try {
            let flag = inventoryState.find(wh => wh.warehouse === WH && wh.item_id === product.product);

            if (flag) {
              let invJson = {
                ...flag,
                stock: (flag.stock + product.product_quantity)
              };
              await apiClient.put(`${API_URL_INV}${flag.inventory_id}/`, invJson);
            } else {
              let invPost = {
                "item_id": product.product.toString(),
                "item_type": "Product",
                "warehouse": WH.toString(),
                "stock": product.product_quantity.toString()
              };
              await apiClient.post(API_URL_INV, invPost);
            }
          } catch (error) {
            console.error(`Error processing product ${product.product}:`, error);
          }
        }

        await apiClient.put(`${API_URL_PL}${currentPL.productionLine_id}/`, PLupdState);
        await apiClient.put(`${API_URL_PRO_ORDERS}${currentPOID}/`, POfinish);
        getPL();
        setIsModalVisibleProduction(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'productionLine_id', key: 'productionLine_id' },
    {title: 'Factory', dataIndex: 'factory', key: 'factory', render: (text) => factory.find(factory => factory.value === text)?.label || 'Unknown' },
    { title: 'Production Line', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'State', dataIndex: 'state', key: 'state' },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.state === 'In Use' && (
            <AntButton onClick={() => showModalProduction(record)} type="default">Production</AntButton>
          )}
        </Space>
      )
    }
  ];

  const columnProducts = products.map(pro => {
    const totalQty = PODetails
      .filter(det => det.product === pro.value)
      .reduce((sum, det) => sum + det.product_quantity, 0);

    return { product: pro.label, quantity: totalQty };
  });

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <MainContent>
      <ProductionNavBar />
      <NavSearchContainer>
        {userInfo.role === 'Admin' && (
          <Button onClick={() => openModal()}>
            <FontAwesomeIcon icon={faPlus} /> New Order
          </Button>
        )}
      </NavSearchContainer>
      <Content style={{ padding: '50px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Total Pending Orders" bordered={false} style={{ color: 'red', fontSize: '20px', fontWeight: 'bold' }}>
              {PendingOrders}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total In Progress Orders" bordered={false} style={{ color: '#FFDE4D', fontSize: '20px', fontWeight: 'bold' }}>
              {IPOrders}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total Finished Orders" bordered={false} style={{ color: '#9BEC00', fontSize: '20px', fontWeight: 'bold' }}>
              {FinishedOrders}
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={PL}
          rowKey="productionLine_id"
          loading={loading}
          style={{ marginTop: '15px' }}
        />

      </Content>
      {contextHolder}
      <Modal
        title={`Production Phases For: ${currentPL ? currentPL.name : ''}`}
        visible={isModalVisibleProduction}
        onCancel={() => setIsModalVisibleProduction(false)}
        footer={[]}
        width={900}
      >
        <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px', width: '800px' }}>
          <Flex justify="space-between">
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px', flex: 1 }}>
              <Steps direction='vertical' current={stepPLP - 1} items={currentPhase} />
            </div>
            <Flex vertical align="flex-end" justify="space-between" style={{ paddingLeft: 32, flex: 1 }}>
              <Typography.Title level={4}>
                Change To The Next Production Phase
              </Typography.Title>
              <Text italic underline style={{ marginTop: "-240px", marginRight: "10px" }}>You're currently viewing for the production order <Text strong mark>{currentPOID}</Text></Text>
              <Text type="danger" style={{ marginTop: "-200px", marginLeft: "30px" }}>By changing the production phase, you agree that the previous phase has already been completed within the production line based on the production order.</Text>
              <Flex gap={10}>
                <AntButton danger onClick={() => { ChangePOPhase() }}>
                  Next Phase <FontAwesomeIcon icon={faArrowRight} />
                </AntButton>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </Modal>

      {newOrder &&
        <ModalComponent onClose={closeModal} fixedSize>
          <ModalTitle>Create a New production order</ModalTitle>
          <FormContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
              {productFields.map((field, index) => (
                <div key={index}>
                  <Label>Product</Label>
                  <SelectStyled>
                    <Controller
                      name={`productFields[${index}].product`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={getFilteredProducts(index)}
                          formatOptionLabel={formatOptionLabel}
                          onChange={(value) => {
                            field.onChange(value);
                            handleProductChange(value, index);
                          }}
                        />
                      )}
                    />
                    {errors.productFields && errors.productFields[index] && errors.productFields[index].product && (
                      <Error>This is a required field.</Error>
                    )}
                  </SelectStyled>
                  <Label>Size of Batch per Product</Label>
                  <SelectStyled>
                    <Controller
                      name={`productFields[${index}].qty`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={products_batch}
                        />
                      )}
                    />
                    {errors.productFields && errors.productFields[index] && errors.productFields[index].qty && (
                      <Error>This is a required field.</Error>
                    )}
                  </SelectStyled>
                  {index > 0 && (
                    <Button iswarningBtn={true} onClick={() => removeProductField(index)}>Remove</Button>
                  )}
                </div>
              ))}
              <div className="form-control">
                <Label>Factory</Label>
                <SelectStyled>
                  <Controller
                    name="factory"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select {...field} options={factory} />
                    )}
                  />
                  {errors.factory && (
                    <Error>This is a required field.</Error>
                  )}
                </SelectStyled>
              </div>
              <div className="form-control">
                <Label>Warehouse to Deliver</Label>
                <SelectStyled>
                  <Controller
                    name="warehouse"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select {...field} options={warehouse} />
                    )}
                  />
                  {errors.warehouse && (
                    <Error>This is a required field.</Error>
                  )}
                </SelectStyled>
              </div>
              <div>
                <label></label>
                <ButtonContainer>
                  <Button type="submit">Create Order</Button>
                  <Button iswarningBtn={true} onClick={addProductField}>
                    <FontAwesomeIcon icon={faPlus} /> Product
                  </Button>
                </ButtonContainer>
              </div>
            </form>
          </FormContainer>
        </ModalComponent>
      }

      {modalWarehouse && (
        <ModalComponent onClose={closeModalWarehouse}>
          <h2>WARNING</h2>
          <p>There are not enough materials in the factory you chose to fulfill your production order.</p>
          <p> We located the necessary materials in the following warehouse near your chosen factory:</p>
          <h3 style={{ color: 'red' }}>{modalWarehouse.label}</h3>
          <p>Would you like to request the necessary materials or cancel the production order?</p>
          <ButtonContainer>
            <Button onClick={() => { closeModalWarehouse(); console.log("Requesting Materials...") }}>Request Material</Button>
            <Button isdisabledBtn={true} onClick={() => { closeModalWarehouse(); console.log("cancelled order") }}>Cancel Order</Button>
          </ButtonContainer>
        </ModalComponent>
      )}
      {warehousesToPick && (
        <ModalComponent onClose={closeModalWarehouseToPick}>
          <h2>Select Warehouses</h2>
          <p>There are not enough materials within the warehouses in the city where you placed your order.</p>
          <p>We located the necessary materials in the following warehouses, please pick from where the needed materials are going to be retrieved to fulfill your production order:</p>
          <FormContainer>
            <form onSubmit={handleSubmit(onSubmitWarehousesPicking)}>
              <Label>Select Warehouses to Retrieve From:</Label>
              <SelectStyled>
                <Controller
                  name="Warehouses"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={warehousesRMFiltered}
                      onChange={(selected) => {
                        field.onChange(selected);
                        handleWarehouseSelection(selected);
                      }}
                    />
                  )}
                />
              </SelectStyled>
              {errors.Warehouses && (
                <Error>This is a required field.</Error>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                  <h3>Items Needed</h3>
                  <ul>
                    {itemsNeeded.map(item => (
                      <li key={item.rawm}>
                        {item.name}: <a style={{ color: '#EE4E4E' }}>{item.qty}</a>
                        {item.qty === 0 && (
                          <FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginLeft: '10px' }} />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: 1, marginLeft: '10px' }}>
                  <h3>Selected Warehouses and Quantities</h3>
                  <ul>
                    {selectedWarehousesList.map(warehouse => (
                      <li key={warehouse.warehouse}>
                        Warehouse {warehouse.warehouse}:
                        <ul>
                          {warehouse.materials.map(material => (
                            <li key={material.rawm}>
                              Material {material.rawm}: {material.qty}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <ButtonContainer>
                <Button type="button" isdisabledBtn={true} onClick={() => { closeModalWarehouseToPick(); closeModal() }}>Cancel Order</Button>
                <Button type="button" onClick={() => { onSubmitWarehousesPicking(selectedWarehousesList) }} disabled={!allItemsFulfilled}>
                  Complete Order
                </Button>
              </ButtonContainer>
            </form>
          </FormContainer>
        </ModalComponent>
      )}
    </MainContent>
  );
};
