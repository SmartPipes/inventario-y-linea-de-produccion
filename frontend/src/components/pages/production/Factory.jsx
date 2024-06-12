import {React, useState, useEffect} from 'react'
import { FormContainer, Label, Input, Button,ButtonContainer, Error, SelectStyled  } from '../../../Styled/Forms.styled'
import { SideBar, MainContent, OrderContainer, PlacedOrderBoxes, BtnEdit } from '../../../Styled/Production.styled';
import { Titles, SubTitle, SubTitle2 } from '../../../Styled/Global.styled'
import {useForm, Controller} from 'react-hook-form'
import {API_URL_FACTORIES, API_URL_CITIES } from '../Config'
import {apiClient} from '../../../ApiClient'
import ModalComponent from '../../modals/ProductionModals';
import Select from 'react-select'
import { ProductionNavBar } from './ProductionNavBar';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Factory = () => {
const [city, setCities] = useState([]);
const [selectedFactory, setSelectedFactory] = useState(null); //to know what factory was selected for the modal
const [factories, setFactories] = useState([]);
const [isEditing, setIsEditing] = useState(false); // to know that its in editing mode
const [selectedFactoryID, setSelectedFactoryID] = useState(null); // to know what is being edited

    useEffect(() => {
      getCities();
      getFactories();
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
        const transformedData = {
          ...data,
          city: data.city.value
        };

        if (isEditing) {//update
          console.log(data);
          await apiClient.put(`${API_URL_FACTORIES}${selectedFactoryID}/`, transformedData);
            reset();
            setIsEditing(false);
            setSelectedFactoryID(null);
            await getFactories();
            setValue('city', '');

        } else {//create

        try {
          // Realizar la solicitud POST
          await apiClient.post(API_URL_FACTORIES, transformedData);
          
          // Esperar a que se complete la solicitud POST antes de obtener las fábricas actualizadas
          await getFactories();
          
          // Restablecer el formulario después de obtener las fábricas actualizadas
          reset();
          setValue('city', '');
        } catch (error) {
          console.error('Error adding factory:', error);
        }
      }
      };
      

    // get the existan cities
    const getCities = async () => {
      try {
        const response = await apiClient.get(API_URL_CITIES);
            if (Array.isArray(response.data)) {
                const transformedCities = response.data.map(city => ({
                    value: city.city_id,
                    label: city.city_name
                  }));
              setCities(transformedCities);
              console.log(city);
            } else {
              console.error('Data fetched is not an array:', response.data);
              setCities([]);
            }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
      }

      // get the existatnt factories
    const getFactories = async () => {
        try {
            const response = await apiClient.get(API_URL_FACTORIES);
            setFactories(response.data)
        } catch (error) {
            console.error('Error fetching factories:', error);
            setFactories([]);
        }
    }

    const getCityLabel = (cityId) => {
        const citylabel = city.find(c => c.value === cityId);
        return citylabel ? citylabel.label : '';
      };


  // For the modal of the factories
  const openModal = (name, address, phone, city, status, cityID, factoryID) => {
    setSelectedFactory({ name, address, phone, city, status, cityID, factoryID });
  };

  const closeModal = () => {
    setSelectedFactory(null);
  };

    //disables the factory
    const disableFactory = async(id) => {
      const disable = {...factories.find(factory =>factory.factory_id === id), status: "Inactive"}
      delete disable.factory_id;
      delete disable.created_at;
      delete disable.updated_at;
      await apiClient.put(API_URL_FACTORIES+id+"/" , disable);
      getFactories();
    }
  
    //enables the factory again
    const enableFactory = async (id) => {
      const enable = { ...factories.find(factory => factory.factory_id === id), status: "Active" };
      delete enable.factory_id;
      delete enable.created_at;
      delete enable.updated_at;
      await apiClient.put(API_URL_FACTORIES + id + "/", enable);
      getFactories();
    };
  
  //Enables editting mode
    const startEditing = () => {
      setSelectedFactoryID(selectedFactory.factoryID)
      console.log(selectedFactory.factoryID);
      setIsEditing(true);
      closeModal();
      if (selectedFactory) {
        //Values that the form is goign to be populated with
        setValue("name", selectedFactory.name);
        setValue("address", selectedFactory.address);
        setValue("phone", selectedFactory.phone);
        setValue("city", {value:selectedFactory.cityID , label:selectedFactory.city});
      }
  
    };
  
    //exits editing mode
    const cancelEdit = () => {
      reset();
      setIsEditing(false);
      setSelectedFactory(null);
    };

  return ( 
    <OrderContainer>
       <SideBar>
        <SubTitle>Factories</SubTitle>
        {factories.map((item) => (
            <PlacedOrderBoxes isdisabled={item.status} key={item.factory_id} onClick={() => openModal(item.name, item.address, item.phone, getCityLabel(item.city), item.status, item.city, item.factory_id )}>{item.name}</PlacedOrderBoxes>
        ))}
      </SideBar>
    <MainContent>
    <ProductionNavBar/>

        <Titles>{isEditing ? `Editing`:'Add a Factory'}</Titles>
        <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <Label>Name</Label>
              <Input type="text" name="name" {...register("name", { required: true , minLength: 5 })} />

              {errors.name && errors.name.type === 'required' &&(
                <Error>Name is required</Error>
              )}
              {errors.name && errors.name.type === 'minLength' && (
                <Error>Name should be at-least 5 characters</Error>
              )}
            </div>
            <div className="form-control">
              <Label>Address</Label>
              <Input type="text" name="address" {...register("address", { required: true, minLength: 15 })} />

              {errors.address && errors.address.type === "required" &&(
                <Error>Address is required</Error>
              )}          
              {errors.address && errors.address.type === 'minLength' && (
                <Error>Address should be at-least 15 characters</Error>
              )}
            </div>
            <div className="form-control">
              <Label>Phone</Label>
              <Input type="number" name="phone" {...register("phone", { required: true, minLength: 10, maxLength:10 })} />

              {errors.phone && errors.phone.type === "required" &&(
                <Error>Phone is required</Error>
              )}          
              {errors.phone && errors.phone.type === 'minLength' && (
                <Error>Phone should be 10 characters</Error>
              )}
              {errors.phone && errors.phone.type === 'maxLength' && (
                <Error>Phone should be 10 character</Error>
              )}
            </div>
            <div className="form-control">
                <Label>Select a City</Label>
                <SelectStyled>
                <Controller name="city" control={control} rules={{required: true}} render={({field}) => ( <Select {...field}  options = {city}/>)}/>
                </SelectStyled>
                {errors.city && (
                    <Error>This is a required field.</Error>
                )}
            </div>
            <div className="form-control">
              <label></label>
              <ButtonContainer>
              {isEditing &&(
                <BtnEdit onClick={cancelEdit}>Cancel</BtnEdit>)}
              <Button type="submit">{isEditing ? "Update Factory" : "Add Factory"}</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
    </MainContent>
    {selectedFactory && ( //Show modal only if a factory is selected
        <ModalComponent onClose={closeModal}>
          {(selectedFactory.status === 'Active' &&
              <BtnEdit onClick={() => {startEditing()}}>  <FontAwesomeIcon icon={faPenToSquare} /></BtnEdit>)}
          <h2>{selectedFactory.name}</h2>
          <SubTitle2>Address:</SubTitle2>
          <p>{selectedFactory.address}</p>
          <SubTitle2>Phone:</SubTitle2>
          <p>{selectedFactory.phone}</p>
          <SubTitle2>City:</SubTitle2>
          <p>{selectedFactory.city}</p>
          <ButtonContainer>
        {selectedFactory.status === "Active" && (
          <Button isdisabledBtn={true} onClick={() => { disableFactory(selectedFactory.factoryID); closeModal(); }}>Disable</Button>
        )}
        {selectedFactory.status === "Inactive" && (
          <Button onClick={() => { enableFactory(selectedFactory.factoryID); closeModal(); }}>Enable</Button>
        )}
      </ButtonContainer>

        </ModalComponent>
      )}
    </OrderContainer>
  )
}
