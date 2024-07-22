import { React, useState, useEffect } from 'react';
import { FormContainer, Label, Input, Button, ButtonContainer, Error } from '../../../Styled/Forms.styled';
import { SideBar, MainContent, OrderContainer, PlacedOrderBoxes, BtnEdit } from '../../../Styled/Production.styled';
import { Titles, SubTitle } from '../../../Styled/Global.styled';
import { useForm, Controller } from 'react-hook-form';
import { API_URL_PHASES } from '../Config';
import { apiClient } from '../../../ApiClient';
import ModalComponent from '../../modals/ProductionModals';
import { ProductionNavBar } from './ProductionNavBar';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

export const ProductionPhase = () => {
  const [phases, setPhases] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null); // to know what phase was selected
  const [isEditing, setIsEditing] = useState(false); // to know that its in editing mode
  const [selectedPhaseID, setSelectedPhaseID] = useState(null); // to know what is being edited
  const [showPhaseSelect, setShowPhaseSelect] = useState(false); // State to control the visibility of the phases select

  useEffect(() => {
    getPhases();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        ...data,
        phase: data.phase ? data.phase.value : null // Add phase to the transformed data
      };
      if (isEditing) {
        console.log(transformedData);
        await apiClient.put(`${API_URL_PHASES}${selectedPhaseID}/`, transformedData);
        reset();
        setIsEditing(false);
        setSelectedPhaseID(null);
        await getPhases();
        setShowPhaseSelect(false);
      } else {
        await apiClient.post(API_URL_PHASES, transformedData);
        await getPhases();
        reset();
        setShowPhaseSelect(false);
      }
    } catch (error) {
      console.error('Error at submitting phases: ', error)
      await getPhases();
    }
  };
  

  // get the existing phases
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
  };

  // For the modal of the phases
  const openModal = (name, description, id, status) => {
    setSelectedPhase({ name, description, id, status });
  };

  const closeModal = () => {
    setSelectedPhase(null);
  };

  // disables the phase
  const disablePhase = async (id) => {
    const disable = { ...phases.find(phase => phase.phase_id === id), status: "Inactive" };
    delete disable.phase_id;
    delete disable.created_at;
    delete disable.updated_at;
    await apiClient.put(API_URL_PHASES + id + "/", disable);
    getPhases();
  };

  // enables the phase again
  const enablePhase = async (id) => {
    const enable = { ...phases.find(phase => phase.phase_id === id), status: "Active" };
    delete enable.phase_id;
    delete enable.created_at;
    delete enable.updated_at;
    await apiClient.put(API_URL_PHASES + id + "/", enable);
    getPhases();
  };

  // Enables editing mode
  const startEditing = () => {
    setSelectedPhaseID(selectedPhase.id);
    setIsEditing(true);
    closeModal();
    if (selectedPhase) {
      setValue("name", selectedPhase.name);
      setValue("description", selectedPhase.description);
    }
  };

  // exits editing mode
  const cancelEdit = () => {
    reset();
    setIsEditing(false);
    setSelectedPhase(null);
    setShowPhaseSelect(false);
  };

  return (
    <OrderContainer>
      <SideBar>
        <SubTitle>Phases</SubTitle>
        {phases.map((item) => (
          <PlacedOrderBoxes isdisabled={item.status} key={item.phase_id} onClick={() => openModal(item.name, item.description, item.phase_id, item.status)}>{item.name}</PlacedOrderBoxes>
        ))}
      </SideBar>
      <MainContent>
        <ProductionNavBar />
        <Titles>{isEditing ? `Editing` : 'Add a New Phase for Production Lines!'}</Titles>
        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <Label>Name</Label>
              <Input type="text" name="name" {...register("name", { required: true, minLength: 5 })} />
              {errors.name && errors.name.type === 'required' && (
                <Error>Name is required</Error>
              )}
              {errors.name && errors.name.type === 'minLength' && (
                <Error>Name should be at-least 5 characters</Error>
              )}
            </div>
            <div className="form-control">
              <Label>Description</Label>
              <Input type="text" name="description" {...register("description", { required: true, minLength: 15 })} />
              {errors.description && errors.description.type === "required" && (
                <Error>Description is required</Error>
              )}
              {errors.description && errors.description.type === 'minLength' && (
                <Error>Description should be at-least 15 characters</Error>
              )}
            </div>
            <div className="form-control">
              <Label>Does this phase depend of another?</Label>
              <input type="checkbox" onChange={(e) => setShowPhaseSelect(e.target.checked)} />
            </div>
            {showPhaseSelect && (
              <div className="form-control" style={{marginBottom:'1rem'}}>
                <Controller name="phase" control={control} render={({ field }) => (<Select {...field} options={phases.map(phase => ({ value: phase.phase_id, label: phase.name }))} placeholder='Select a Phase...' />)} />
              </div>
            )}
            <div className="form-control">
              <label></label>
              <ButtonContainer>
                {isEditing && (
                  <BtnEdit onClick={cancelEdit}>Cancel</BtnEdit>)}
                <Button type="submit">{isEditing ? "Update Phase" : "Add Phase"}</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
      </MainContent>
      {selectedPhase && ( // Show modal only if a phase is selected
        <ModalComponent onClose={closeModal}>
          {(selectedPhase.status === 'Active' &&
            <BtnEdit onClick={() => { startEditing() }}>  <FontAwesomeIcon icon={faPenToSquare} /></BtnEdit>)}
          <h2>
            {selectedPhase.name}
          </h2>
          <h3 style={{ color: '#EE4E4E' }}>{selectedPhase.status === "Inactive" ? "Inactive" : ""}</h3>
          <p>{selectedPhase.description}</p>
          <ButtonContainer>
            {selectedPhase.status === "Active" && (
              <Button isdisabledBtn={true} onClick={() => { disablePhase(selectedPhase.id); closeModal(); }}>Disable</Button>
            )}
            {selectedPhase.status === "Inactive" && (
              <Button onClick={() => { enablePhase(selectedPhase.id); closeModal(); }}>Enable</Button>
            )}
          </ButtonContainer>
        </ModalComponent>
      )}
    </OrderContainer>
  );
};
