import {React, useState, useEffect} from 'react'
import { FormContainer, Label, Input, Button,ButtonContainer, Error } from '../../../Styled/Forms.styled'
import { SideBar, MainContent, OrderContainer, PlacedOrderBoxes } from '../../../Styled/Production.styled';
import { Titles, SubTitle } from '../../../Styled/Global.styled'
import {useForm, Controller} from 'react-hook-form'
import {API_URL_PL, API_URL_FACTORIES } from '../Config'
import {apiClient} from '../../../ApiClient'
import ModalComponent from '../../modals/ProductionModals';
import Select from 'react-select'

export const ProductionLine = () => {
const [PL, setPL] = useState([]);
const [factories, setFactories] = useState([]);
const [selectedPL, setSelectedPL] = useState(null); //to know what phase was selected

//THIS USER ID SHOULD BE GLOBALLY ACCESIBLE WHEN LOGIN IN
const userID = 2;

    useEffect(() => {
      getProductionLines();
      getFactories();
      },[]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
      } = useForm();
    
      const onSubmit = (data) => {
        const formData = {
          ...data,
          production_line_creator: userID, // adding the user ID
        };
         apiClient.post(API_URL_PHASES , formData);
         console.log(formData);
         getProductionLines();
        reset();
      };

    // get the existan phases
    const getProductionLines = async () => {
      try {
        const response = await apiClient.get(API_URL_PL);
            if (Array.isArray(response.data)) {
              setPL(response.data);
            } else {
              console.error('Data fetched is not an array:', response.data);
              setPL([]);
            }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      }


        // get the existatnt factories
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

  // For the modal of the phases
  const openModal = (name, description) => {
    setSelectedPL({ name, description });
  };

  const closeModal = () => {
    setSelectedPL(null);
  };

  return (
    <OrderContainer>
       <SideBar>
        <SubTitle>Production Lines</SubTitle>
        {PL.map((item) => (
            <PlacedOrderBoxes key={item.productionLine_id} onClick={() => openModal(item.name, item.description, item.Factory)}>{item.name}</PlacedOrderBoxes>
        ))}
      </SideBar>
    <MainContent>
        <Titles>Create a New Production Line</Titles>
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
              <Label>Description</Label>
              <Input type="text" name="description" {...register("description", { required: true, minLength: 15 })} />

              {errors.description && errors.description.type === "required" &&(
                <Error>Description is required</Error>
              )}          
              {errors.description && errors.description.type === 'minLength' && (
                <Error>Description should be at-least 15 characters</Error>
              )}
            </div>

            <div className="form-control">
                <Label>Select a Factory</Label>
                <Controller name="factories" control={control} rules={{required: true}} render={({field}) => ( <Select {...field} isMulti options = {factories}/>)}/>
                {errors.factories && (
                    <Error>This is a required field.</Error>
                )}
            </div>

            <div className="form-control">
              <label></label>
              <ButtonContainer>
              <Button type="submit">Create a Production Line</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
    </MainContent>
    {selectedPL && ( //Show modal only if a phase is selected
        <ModalComponent onClose={closeModal}>
          <h2>{selectedPL.name}</h2>
          <p>{selectedPL.description}</p>
          <p>{selectedPL.Factory}</p>

        </ModalComponent>
      )}
    </OrderContainer>
  )
}
