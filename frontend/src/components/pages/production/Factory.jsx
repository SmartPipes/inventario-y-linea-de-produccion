import {React, useState, useEffect} from 'react'
import { FormContainer, Label, Input, Button,ButtonContainer, Error } from '../../../Styled/Forms.styled'
import { SideBar, MainContent, OrderContainer, PlacedOrderBoxes } from '../../../Styled/Production.styled';
import { Titles, SubTitle, SubTitle2 } from '../../../Styled/Global.styled'
import {useForm, Controller} from 'react-hook-form'
import {API_URL_FACTORIES, API_URL_CITIES } from '../Config'
import {apiClient} from '../../../ApiClient'
import ModalComponent from '../../modals/ProductionModals';
import Select from 'react-select'

export const Factory = () => {
const [city, setCities] = useState([]);
const [selectedFactory, setSelectedFactory] = useState(null); //to know what factory was selected for the modal
const [factories, setFactories] = useState([]);

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
  const openModal = (name, address, phone, city) => {
    setSelectedFactory({ name, address, phone, city });
  };

  const closeModal = () => {
    setSelectedFactory(null);
  };

  return (
    <OrderContainer>
       <SideBar>
        <SubTitle>Factories</SubTitle>
        {factories.map((item) => (
            <PlacedOrderBoxes key={item.factory_id} onClick={() => openModal(item.name, item.address, item.phone, getCityLabel(item.city) )}>{item.name}</PlacedOrderBoxes>
        ))}
      </SideBar>
    <MainContent>
        <Titles>Add a Factory</Titles>
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
                <Controller name="city" control={control} rules={{required: true}} render={({field}) => ( <Select {...field}  options = {city}/>)}/>
                {errors.city && (
                    <Error>This is a required field.</Error>
                )}
            </div>
            <div className="form-control">
              <label></label>
              <ButtonContainer>
              <Button type="submit">Add Factory</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
    </MainContent>
    {selectedFactory && ( //Show modal only if a factory is selected
        <ModalComponent onClose={closeModal}>
          <h2>{selectedFactory.name}</h2>
          <SubTitle2>Address:</SubTitle2>
          <p>{selectedFactory.address}</p>
          <SubTitle2>Phone:</SubTitle2>
          <p>{selectedFactory.phone}</p>
          <SubTitle2>City:</SubTitle2>
          <p>{selectedFactory.city}</p>

        </ModalComponent>
      )}
    </OrderContainer>
  )
}
