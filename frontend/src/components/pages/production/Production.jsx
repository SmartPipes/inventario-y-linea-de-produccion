import React, {useState, useEffect} from 'react'
import { ProductionNavBar } from './ProductionNavBar'
import { MainContent } from '../../../Styled/Production.styled'
import { FormContainer, Label, Input, Button,ButtonContainer, Error, SelectStyled  } from '../../../Styled/Forms.styled'
import {useForm, Controller} from 'react-hook-form'
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavSearchContainer} from '../../../Styled/InventoryNavBar.styled';
import ModalComponent from '../../modals/ProductionModals';
import Select from 'react-select';
import { ModalTitle} from '../../../Styled/Global.styled'
import { API_URL_PRODUCTS, API_URL_FACTORIES, API_URL_WAREHOUSES, API_URL_ORDERS, API_URL_RAWMLIST, API_URL_INV, API_URL_RAW_MATERIALS, API_URL_PO_DETAILS,API_URL_PO_RAWM_DETAILS,API_URL_PRO_ORDERS,API_URL_PL} from '../Config'
import { apiClient } from '../../../ApiClient'
import { Card, Row, Col, Layout, Table} from 'antd';
import { Column } from '@ant-design/charts';
import factoryLogo from '../../../assets/factory.png';
const {  Content } = Layout;

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
    const [itemsNeeded,setItemsNeeded] = useState([]);
    const [selectedWarehouses,setSelectedWarehouses] = useState();
    const [selectedWarehousesList, setSelectedWarehousesList] = useState([]);
    const [productionOrderInfo, setProductionOrder] = useState();
    const [PendingOrders, setPendingOrders] = useState([]);
    const [IPOrders, setIPOrders] = useState([]);
    const [FinishedOrders, setFinishedOrders] = useState([]);
    const [PL, setPL] = useState([]);
    const [loading, setLoading] = useState(false);


      const addProductField = () => {
        setProductFields([...productFields, { product: '', qty: '' }]);
      };

  const removeProductField = (index) => {
        // Desregistrar los campos del formulario
        unregister(`productFields.${index}.product`);
        unregister(`productFields.${index}.qty`);
      
        // Remover los campos del estado
        const newFields = [...productFields];
        newFields.splice(index, 1);
        setProductFields(newFields);
      };

            //Open modal to create a new prodcution order
  const openModal = () => {
    setNewOrder(true)
  };

  const closeModal = () => {
    setNewOrder(false);
    reset();
  };

    const products_batch = [{value:1,label:50},{value:2,label:100},{value:3,label:150},{value:4,label:200},{value:5,label:250},{value:6,label:300},{value:7,label:2},{value:8,label:500}]

    useEffect(() => {
        getProducts();
        getFactories();
        getWarehouses();
        getRM();
        getProductionOrders();
        getPL();
        },[]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        unregister
      } = useForm();

      const getPL = async () => {
        try {
            const response = await apiClient.get(API_URL_PL);
            setPL(response.data.filter(PL => PL.status === 'Active' && PL.factory === 1)); //THIS FACTORY SHOULD BE TAKEN BY THE CCONTEXT OF THE USER
        } catch (errors) {
            console.error('Error fetching PL:', errors);
            setPL([]);
        }
    }

      const openModalWarehouse = (warehouse_id) => {
        if (typeof warehouse_id === 'object' && 'otherWH' in warehouse_id) {
          console.log("here");
          setWarehousesToPick(warehouse_id);
          setItemsNeeded(warehouse_id.agregatedCombinedMaterialList_withName.map(item => ({
            ...item,
            initialQty: item.qty // store initial quantities to reset later if needed
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
      };
    
      const closeModalWarehouse = () => {
        setModalWarehouse(null);
      };

      const closeModalWarehouseToPick = () => {
        setWarehousesToPick(null);
      };

      // Aggregate the quantities for the same rawm numbers
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
            const filteredWarehouses = warehouse.filter(wh => wh.city === data.factory.city)
                .map(f_warehouse => ({
                    id: f_warehouse.value,
                    name: f_warehouse.label
                }));
            const inventory = await apiClient.get(API_URL_INV);
    
            let neededMaterials = [...agregatedCombinedMaterialList];
            let warehousesUsed = [];
    
            for (let i = 0; i < filteredWarehouses.length; i++) {
                const warehouseId = filteredWarehouses[i].id;
    
                const filteredInv = inventory.data.filter(inv => inv.warehouse === warehouseId && inv.item_type === 'RawMaterial');

    
                let warehouseMaterialsUsed = [];
                for (let j = 0; j < neededMaterials.length; j++) {
                    const material = neededMaterials[j];
                    const inventoryItem = filteredInv.find(inv => inv.item_id === material.rawm);
                    //console.log(` ALL ${inventoryItem.inventory_id} - ${inventoryItem.stock} - ${material.qty}`)

                    if (inventoryItem && inventoryItem.stock >= material.qty) {
                      //console.log(`${inventoryItem.stock} - ${material.qty}`)
                        warehouseMaterialsUsed.push(material);
                    }
                }
                  
                if (warehouseMaterialsUsed.length > 0) {
                    warehousesUsed.push({ warehouseId, materials: warehouseMaterialsUsed });
                    neededMaterials = neededMaterials.filter(material => !warehouseMaterialsUsed.includes(material));
                }
                if (neededMaterials.length === 0) {
                    break;
                }
                
            }

            if (neededMaterials.length === 0) {
                // We have found enough materials in the warehouses in the same city
                console.log(warehousesUsed)
                openModalWarehouse(warehousesUsed[0].warehouseId);

            } else {
            // We need to look for materials in other cities
            let agregatedCombinedMaterialList_withName
            let filtered_rm = [];
              console.log(warehouse)
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
        }

    
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
  
}

  const getProducts = async () => {
    try{
        const response = await apiClient.get(API_URL_PRODUCTS);
        const transformedProducts = response.data
        .filter(products => products.status === "Active")
        .map(products => ({
          value: products.product_id,
          label: products.name,
          img: products.image_icon
        }));
        setProducts(transformedProducts)
    }catch (error) {
        console.error("Error fetching products: "+error);
        setProducts([]);
    }
  }

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
        setRaw_Materials([]); // Corrected from setProducts to setRaw_Materials
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
          city: factory.city //added this CAREFUL
        }));
        setFactories(transformedFactories)
    } catch (error) {
        console.error('Error fetching factories:', error);
        setFactories([]);
    }
}

const getWarehouses = async () => {
    try {
        const response = await apiClient.get(API_URL_WAREHOUSES);
        const transformedWarehouse = response.data
        .filter(warehouse => warehouse.status === "Active")
        .map(warehouse => ({
          value: warehouse.warehouse_id,
          label: warehouse.name,
          city: warehouse.city //added this CAREFUL
        }));
        setWarehouse(transformedWarehouse);
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        setWarehouse([]);
    }
}

const getProductionOrders = async () => {
  try {
      const response = await apiClient.get(API_URL_PRO_ORDERS);
      let p = 0;
      let ip = 0;
      let d = 0;
      const transformedOrders = response.data
      transformedOrders.forEach(order => { 
        if (order.status === 'Pending'){
            p++;
        }else if(order.status === 'In Progress'){
          ip++;
        }else{
          d++;
        }});
        console.log(p,ip,d)
        setPendingOrders(p);
        setIPOrders(ip);
        setFinishedOrders(d);
  }catch (error) {
    console.error('Error fetching warehouses:', error);
    setPendingOrders([]);
    setIPOrders([]);
    setFinishedOrders([]);
  }
}

const formatOptionLabel = ({ label, img }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={img} alt={label} style={{ width: 30, marginRight: 10 }} />
    <span>{label}</span>
  </div>
);

const columns = [
  { title: 'ID', dataIndex: 'productionLine_id', key: 'productionLine_id' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'State', dataIndex: 'state', key: 'state' }
];


  return (
      <MainContent>
          <ProductionNavBar/>
          <NavSearchContainer>
              <Button onClick={() => openModal()}>
                  <FontAwesomeIcon icon={faPlus} /> New Order
              </Button>
          </NavSearchContainer>
              <Content style={{ padding: '50px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Total Pending Orders" bordered={false} style={{color:'red', fontSize: '20px', fontWeight: 'bold'}}>
                {PendingOrders}
            </Card>
           
          </Col>
          <Col span={8}>
          <Card title="Total In Progress Orders" bordered={false}  style={{color:'#FFDE4D', fontSize: '20px', fontWeight: 'bold'}}>
              {IPOrders}
          </Card>
          </Col>
          <Col span={8}>
          <Card title="Total Finished Orders" bordered={false} style={{color:'#9BEC00', fontSize: '20px', fontWeight: 'bold'}}>
              {FinishedOrders}
            </Card>
          </Col>
        </Row>
        <Table
                columns={columns}
                dataSource={PL}
                rowKey="productionLine_id"
                loading={loading}
                style={{marginTop: '15px'}}
            />

      </Content>

            {/* //   THIS IS THE FORM TO CREATE A NEW ORDER */}
        {newOrder &&
        <ModalComponent onClose={closeModal} fixedSize>
            <ModalTitle>Create a New production order</ModalTitle>
              <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          {productFields.map((field, index) => (
            <div key={index} >
              <Label>Product</Label>
              <SelectStyled>
                <Controller
                  name={`productFields[${index}].product`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={products}
                      formatOptionLabel={formatOptionLabel}
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
          {modalWarehouse && ( //Show modal only if a factory is selected
          <ModalComponent onClose={closeModalWarehouse}>
            <h2>WARNING</h2>
                <p>There are not enough materials in the factory you chose to fulfill your production order.</p>
                <p> We located the necessary materials in the following warehouse near your chosen factory:</p>
                <h3 style={{color:'red'}}>{modalWarehouse.label}</h3>
                <p>Would you like to request the necessary materials or cancel the production order?</p>
            <ButtonContainer>
            <Button onClick={() => {closeModalWarehouse(); console.log("Requesting Materials...")}}>Request Material</Button>
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
          {errors.productFields && errors.productFields[index] && errors.productFields[index].qty && (
            <Error>This is a required field.</Error>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <h3>Items Needed</h3>
            <ul>
              {itemsNeeded.map(item => (
                <li key={item.rawm}>
                  {item.name}: <a style={{color:'#EE4E4E'}}>{item.qty}</a>
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
            <Button type="button" isdisabledBtn={true} onClick={() => { closeModalWarehouseToPick(); console.log("cancelled order") }}>Cancel Order</Button>
            <Button type="button" onClick={() => {onSubmitWarehousesPicking(selectedWarehousesList)}}>Complete Order</Button>
          </ButtonContainer>
        </form>
      </FormContainer>
    </ModalComponent>
  )}
      </MainContent>
  )
}

//hacer otra cosa para epujar todo para abajo