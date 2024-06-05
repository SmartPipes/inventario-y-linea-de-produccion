import {React, useState, useEffect} from 'react'
import { FormContainer, Label, Input, Button,ButtonContainer, Error } from '../../../Styled/Forms.styled'
import { SideBar, MainContent, OrderContainer, PlacedOrderBoxes } from '../../../Styled/Production.styled';
import { Titles, SubTitle } from '../../../Styled/Global.styled'
import {useForm} from 'react-hook-form'
import {API_URL_PHASES } from '../Config'
import {apiClient} from '../../../ApiClient'
import ModalComponent from '../../modals/ProductionModals';

export const ProductionPhase = () => {
const [phases, setPhases] = useState([]);
const [selectedPhase, setSelectedPhase] = useState(null); //to know what phase was selected

    useEffect(() => {
      getPhases();
      },[]);


    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
      } = useForm();
    
      const onSubmit = (data) => {
         apiClient.post(API_URL_PHASES , data);
         getPhases();
        reset();
      };

    // get the existan phases
    const getPhases = async () => {
      try {
        const response = await apiClient.get(API_URL_PHASES);
            if (Array.isArray(response.data)) {
              setPhases(response.data);
            } else {
              console.error('Data fetched is not an array:', response.data);
              setPhases([]);
            }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      }

  // For the modal of the phases
  const openModal = (name, description) => {
    setSelectedPhase({ name, description });
  };

  const closeModal = () => {
    setSelectedPhase(null);
  };

  return (
    <OrderContainer>
       <SideBar>
        <SubTitle>Phases</SubTitle>
        {phases.map((item) => (
            <PlacedOrderBoxes key={item.phase_id} onClick={() => openModal(item.name, item.description)}>{item.name}</PlacedOrderBoxes>
        ))}
      </SideBar>
    <MainContent>
        <Titles>Add a New Phase for Production Lines!</Titles>
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
              <label></label>
              <ButtonContainer>
              <Button type="submit">Add Phase</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
    </MainContent>
    {selectedPhase && ( //Show modal only if a phase is selected
        <ModalComponent onClose={closeModal}>
          <h2>{selectedPhase.name}</h2>
          <p>{selectedPhase.description}</p>
        </ModalComponent>
      )}
    </OrderContainer>
  )
}
