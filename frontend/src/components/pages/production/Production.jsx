import React, {useState, useEffect} from 'react'
import { ProductionNavBar } from './ProductionNavBar'
import { MainContent, OrdersArea,PlacedOrderBoxes } from '../../../Styled/Production.styled'
import { FormContainer, Label, Input, Button,ButtonContainer, Error, SelectStyled  } from '../../../Styled/Forms.styled'
import {useForm, Controller} from 'react-hook-form'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavSearchContainer} from '../../../Styled/InventoryNavBar.styled';
import ModalComponent from '../../modals/ProductionModals';
import Select from 'react-select'
import { ModalTitle} from '../../../Styled/Global.styled'
import { API_URL_PRODUCTS, API_URL_FACTORIES, API_URL_WAREHOUSES, API_URL_ORDERS } from '../Config'
import { apiClient } from '../../../ApiClient'


export const Production = () => {
    const [newOrder, setNewOrder] = useState(false);
    const [products, setProducts] = useState([]);
    const [factory, setFactories] = useState([]);
    const [warehouse, setWarehouse] = useState([]);

    const products_batch = [{value:1,label:50},{value:2,label:100},{value:3,label:150},{value:4,label:200},{value:5,label:250},{value:6,label:300}]

    useEffect(() => {
        getProducts();
        getFactories();
        getWarehouses();
        },[]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
      } = useForm();

          
      const onSubmit = async (data) => {
      
        try {
            // const response = await apiClient.post(API_URL_ORDERS, data);
            console.log(data);
        } catch (error) {
          console.error('Error adding factory:', error);
        }
      };

      //Open modal to create a new prodcution order
  const openModal = () => {
    setNewOrder(true)
  };

  const closeModal = () => {
    setNewOrder(false);
  };

  const getProducts = async () => {
    try{
        const response = await apiClient.get(API_URL_PRODUCTS);
        const transformedProducts = response.data.map(products => ({
          value: products.product_id,
          label: products.name
        }));
        setProducts(transformedProducts)
    }catch (error) {
        console.error("Error fetching products: "+error);
        setProducts([]);
    }
  }

  const getFactories = async () => {
    try {
        const response = await apiClient.get(API_URL_FACTORIES);
        const transformedFactories = response.data.map(factory => ({
          value: factory.factory_id,
          label: factory.name
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
        const transformedWarehouse = response.data.map(warehouse => ({
          value: warehouse.warehouse_id,
          label: warehouse.name
        }));
        setWarehouse(transformedWarehouse);
    } catch (error) {
        console.error('Error fetching factories:', error);
        setWarehouse([]);
    }
}

  return (
      <MainContent>
          <ProductionNavBar/>
          <NavSearchContainer>
              <Button onClick={() => openModal()}>
                  <FontAwesomeIcon icon={faPlus} /> New Order
              </Button>
          </NavSearchContainer>
              <OrdersArea>
                <PlacedOrderBoxes/>

              </OrdersArea>

            {/* //   THIS IS THE FORM TO CREATE A NEW ORDER */}
        {newOrder &&
        <ModalComponent onClose={closeModal} fixedSize>
            <ModalTitle>Create a New production order</ModalTitle>
            <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <Label>Product</Label>
              <SelectStyled>
                <Controller name="product" control={control} rules={{required: true}} render={({field}) => ( <Select {...field} isMulti options = {products}/>)}/>
                </SelectStyled>
                {errors.product && (
                    <Error>This is a required field.</Error>
                )}
            </div>
            <div className="form-control">
              <Label>Size of Batch per Product</Label>
              <SelectStyled>
                <Controller name="qty" control={control} rules={{required: true}} render={({field}) => ( <Select {...field}  options = {products_batch}/>)}/>
                </SelectStyled>
                {errors.qty && (
                    <Error>This is a required field.</Error>
                )}
            </div>
            <div className="form-control">
              <Label>Factory</Label>
              <SelectStyled>
                <Controller name="factory" control={control} rules={{required: true}} render={({field}) => ( <Select {...field}  options = {factory}/>)}/>
                </SelectStyled>
                {errors.factory && (
                    <Error>This is a required field.</Error>
                )}
            </div>
            <div className="form-control">
              <Label>Warehouse to Deliver</Label>
              <SelectStyled>
                <Controller name="warehouse" control={control} rules={{required: true}} render={({field}) => ( <Select {...field}s options = {warehouse}/>)}/>
                </SelectStyled>
                {errors.warehouse && (
                    <Error>This is a required field.</Error>
                )}
            </div>
            <div className="form-control">
              <label></label>
              <ButtonContainer>
              <Button type="submit">Create Order</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
        </ModalComponent>
        }
      </MainContent>
  )
}

//hacer otra cosa para epujar todo para abajo