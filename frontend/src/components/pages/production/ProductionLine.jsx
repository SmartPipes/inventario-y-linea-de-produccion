import { React, useState, useEffect } from 'react';
import { FormContainer, Label, Input, Button, ButtonContainer, Error, SelectStyled } from '../../../Styled/Forms.styled';
import { SideBar, MainContent, OrderContainer, PlacedOrderBoxes, PLPHBoxes, BtnEdit } from '../../../Styled/Production.styled';
import { Titles, SubTitle, SubTitle2 } from '../../../Styled/Global.styled';
import { useForm, Controller } from 'react-hook-form';
import { API_URL_PL, API_URL_FACTORIES, API_URL_PHASES, API_URL_PL_PH,API_URL_USERS} from '../Config';
import { apiClient } from '../../../ApiClient';
import ModalComponent from '../../modals/ProductionModals';
import Select from 'react-select';
import { ProductionNavBar } from './ProductionNavBar';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';

export const ProductionLine = () => {
  const [PL, setPL] = useState([]);
  const [phases, setPhases] = useState([]);
  const [factory, setFactories] = useState([]);
  const [PLPH, setPLPH] = useState([]);
  const [selectedPL, setSelectedPL] = useState(null); // to know what phase was selected
  const [isEditing, setIsEditing] = useState(false); // to know that it's in editing mode
  const [selectedPLID, setSelectedPLID] = useState(null); // to know what is being edited
  const [userID, setUserID] = useState(null); // Retrieve the userID from localStorage
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const storedUserID = localStorage.getItem('user_id');
    if (storedUserID) {
      setUserID(storedUserID);
    }
    getProductionLines();
    getFactories();
    getPhases();
    getPL_PH();
    fetchUsers();
  }, []);

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
      const formData = {
        name: data.name,
        description: data.description,
        status: 'Active',
        state: 'Free',
        production_line_creator: userID,
        factory: data.factory.value
      };

      if (isEditing) {
        const response = await apiClient.put(`${API_URL_PL}${selectedPLID}/`, formData);
        const productionLineId = response.data.productionLine_id;

        const existingPhasesResponse = await apiClient.get(API_URL_PL_PH);
        const phaseFiltering = existingPhasesResponse.data.filter(pl => pl.productionLine === productionLineId);
        const existingPhases = phaseFiltering;

        const updatedPhases = data.phases.map((phase, index) => ({
          sequence_number: index + 1,
          productionLine: productionLineId,
          phase: phase.value,
        }));

        const phasesToAdd = updatedPhases.filter(updatedPhase =>
          !existingPhases.some(existingPhase => existingPhase.phase === updatedPhase.phase)
        );
        const phasesToDelete = existingPhases.filter(existingPhase =>
          !updatedPhases.some(updatedPhase => updatedPhase.phase === existingPhase.phase)
        );

        // Logging payloads for debugging
        console.log("Phases to Add:", phasesToAdd);
        console.log("Phases to Delete:", phasesToDelete);

        const addPromises = phasesToAdd.map(phase => {
          const payload = {
            sequence_number: phase.sequence_number,
            productionLine: phase.productionLine,
            phase: phase.phase,
          };
          console.log("Adding phase:", payload);
          return apiClient.post(API_URL_PL_PH, payload);
        });

        const deletePromises = phasesToDelete.map(phase => {
          console.log(`Deleting phase ${phase.id}`);
          return apiClient.delete(`${API_URL_PL_PH}${phase.id}/`);
        });

        await Promise.all([...addPromises, ...deletePromises]);

        setIsEditing(false);
        getProductionLines();
        getPL_PH();
        reset();
        setValue('factory', '');
        setValue('phases', '');
      } else {
        const createResponse = await apiClient.post(API_URL_PL, formData);
        const productionLineId = createResponse.data.productionLine_id;

        const phasePromises = data.phases.map((phase, index) => {
          const productionLinePhase = {
            sequence_number: index + 1,
            productionLine: productionLineId,
            phase: phase.value,
          };
          return apiClient.post(API_URL_PL_PH, productionLinePhase);
        });

        await Promise.all(phasePromises);
        console.log('Successfully created production line and phases');
      }

      getProductionLines();
      getPL_PH();
      reset();
      setValue('factory', '');
      setValue('phases', '');
    } catch (error) {
      if (error.response) {
        console.error('Error during submission:', error.response.data);
      } else {
        console.error('Error during submission:', error.message);
      }
    }
  };

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

  const fetchUsers = async() => {
    try{
      const response = await apiClient.get(API_URL_USERS);
      setUsers(response.data);
    }catch(error){
      console.error('Error at fetching users: ', error )
    }
  }

  const getPhases = async () => {
    try {
      const response = await apiClient.get(API_URL_PHASES);
      if (Array.isArray(response.data)) {
        const transformedPhases = response.data
          .filter(phase => phase.status === "Active")
          .map(phase => ({
            value: phase.phase_id,
            label: phase.name,
            dependency: phase.after_phase
          }));
        setPhases(transformedPhases);
      } else {
        console.error('Data fetched is not an array:', response.data);
        setPhases([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getFactories = async () => {
    try {
      const response = await apiClient.get(API_URL_FACTORIES);
      const transformedFactories = response.data
        .filter(factory => factory.status === "Active")
        .map(factory => ({
          value: factory.factory_id,
          label: factory.name
        }));
      setFactories(transformedFactories)
    } catch (error) {
      console.error('Error fetching factories:', error);
      setFactories([]);
    }
  }

  const getPL_PH = async () => {
    try {
      const response = await apiClient.get(API_URL_PL_PH);
      setPLPH(response);
    } catch (error) {
      console.log('Error fetching PL_PH', error);
      setPLPH([]);
    }
  }

  const openModal = (name, description, production_line_creator, factory, orderedPhases, PLID, factoryID, phasesID, status) => {
    setSelectedPL({ name, description, production_line_creator, factory, orderedPhases, PLID, factoryID, phasesID, status });
  };

  const closeModal = () => {
    setSelectedPL(null);
  };

  const getFactoryLabel = (id) => {
    const factorylabel = factory.find(c => c.value === id);
    return factorylabel ? factorylabel.label : '';
  };

  const transformPLPH = (id) => {
    let transformedPLPH = [];
    let filteredPhases = [];
    let filteredItems = PLPH.data.filter(item => item.productionLine === id);

    filteredItems.sort((a, b) => a.sequence_number - b.sequence_number);

    filteredItems.forEach(item => {
      filteredPhases.push(item.phase);
    });

    filteredPhases.map(item => {
      const phaselabel = phases.find(phase => phase.value === item);
      transformedPLPH.push(phaselabel.label)
    })

    return transformedPLPH;
  }

  const disablePL = async (id) => {
    const selectedPL = PL.find(productionLine => productionLine.productionLine_id === id);
    if (selectedPL.state !== "Free") {
      message.error("You can't disable this right now, it's currently being used.");
      return;
    } else {
      const disable = { ...selectedPL, status: "Inactive" };
      delete disable.productionLine_id;
      delete disable.created_at;
      await apiClient.put(API_URL_PL + id + "/", disable);
      getProductionLines();
    }
  };

  const enablePL = async (id) => {
    const enable = { ...PL.find(productionLine => selectedPL.PLID === id), status: "Active" };
    delete enable.PLID;
    delete enable.created_at;
    await apiClient.put(API_URL_PL + id + "/", enable);
    getProductionLines();
  };

  const startEditing = () => {
    setSelectedPLID(selectedPL.PLID);
    setIsEditing(true);
    closeModal();
    if (selectedPL) {
      setValue("name", selectedPL.name);
      setValue("description", selectedPL.description);
      setValue("factory", { value: selectedPL.factoryID, label: selectedPL.factory });

      let transformedPLPH = [];
      let filteredPhases = [];
      let setValuesPhases = [];
      let filteredItems = PLPH.data.filter(item => item.productionLine === selectedPL.PLID);

      filteredItems.sort((a, b) => a.sequence_number - b.sequence_number);

      filteredItems.forEach(item => {
        filteredPhases.push(item.phase);
      });

      filteredPhases.map(item => {
        const phaselabel = phases.find(phase => phase.value === item);
        transformedPLPH.push(phaselabel.label)
      })

      filteredPhases.map((item, index) => {
        setValuesPhases.push({ value: item, label: selectedPL.orderedPhases[index] })
      })
      setValue("phases", setValuesPhases);
    }
  };

  const getDependentPhases = (phaseId, phases) => {
    let dependentPhases = [];
    let currentPhase = phases.find(phase => phase.value === phaseId);
    console.log(currentPhase)
  
    while (currentPhase && currentPhase.dependency) {
      const nextPhase = phases.find(phase => phase.value === currentPhase.dependency);
      console.log(nextPhase)
      if (nextPhase) {
        dependentPhases.push(nextPhase);
        currentPhase = nextPhase;
      } else {
        break;
      }
    }
    return dependentPhases;
  };
  
  
  const handlePhaseChange = (selectedPhases) => {
    console.log(selectedPhases)
    let allSelectedPhases = [...selectedPhases];
  
    selectedPhases.forEach(phase => {
      console.log(phase.value, phases);
      const dependentPhases = getDependentPhases(phase.value, phases);
      dependentPhases.forEach(depPhase => {
        if (!allSelectedPhases.find(p => p.value === depPhase.value)) {
          allSelectedPhases.push(depPhase);
        }
      });
    });
  
    allSelectedPhases.sort((a, b) => a.value - b.value); // Sort phases by ID to keep order
    setValue('phases', allSelectedPhases); // Update form state
    return allSelectedPhases;
  };
  

  

  const cancelEdit = () => {
    reset();
    setIsEditing(false);
    setSelectedPL(null);
  };

  return (
    <OrderContainer>
      <SideBar>
        <SubTitle>Production Lines</SubTitle>
        {PL.map((item) => (
          <PlacedOrderBoxes isdisabled={item.status} key={item.productionLine_id} onClick={() => openModal(item.name, item.description, item.production_line_creator, getFactoryLabel(item.factory), transformPLPH(item.productionLine_id), item.productionLine_id, item.factory, item.phases, item.status)}>{item.name}</PlacedOrderBoxes>
        ))}
      </SideBar>
      <MainContent>
        <ProductionNavBar />
        <Titles>{isEditing ? `Editing` : 'Create a New Production Line'}</Titles>
        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <Label>Name</Label>
              <Input type="text" name="name" {...register("name", { required: true, minLength: 5 })} />

              {errors.name && errors.name.type === 'required' && (
                <Error>Name is required</Error>
              )}
              {errors.name && errors.name.type === 'minLength' && (
                <Error>Name should be at least 5 characters</Error>
              )}
            </div>
            <div className="form-control">
              <Label>Description</Label>
              <Input type="text" name="description" {...register("description", { required: true, minLength: 15 })} />

              {errors.description && errors.description.type === "required" && (
                <Error>Description is required</Error>
              )}
              {errors.description && errors.description.type === 'minLength' && (
                <Error>Description should be at least 15 characters</Error>
              )}
            </div>

            <div className="form-control">
              <Label>Select a Factory</Label>
              <SelectStyled>
                <Controller name="factory" control={control} rules={{ required: true }} render={({ field }) => (<Select {...field} options={factory} />)} />
              </SelectStyled>
              {errors.factory && (
                <Error>This is a required field.</Error>
              )}
            </div>

            <div className="form-control">
              <Label>Select the Production Phases in Ascending Order</Label>
              <SelectStyled>
              <Controller
  name="phases"
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <Select
      {...field}
      isMulti
      options={phases}
      value={field.value} // Ensure the selected values are shown
      onChange={(selected) => {
        const updatedSelected = handlePhaseChange(selected);
        field.onChange(updatedSelected);
      }}
    />
  )}
/>
          </SelectStyled>
              {errors.phases && (
                <Error>This is a required field.</Error>
              )}
            </div>

            <div className="form-control">
              <label></label>
              <ButtonContainer>
                {isEditing && (
                  <BtnEdit onClick={cancelEdit}>Cancel</BtnEdit>)}
                <Button type="submit">{isEditing ? 'Update Production Line' : 'Create a Production Line'}</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
      </MainContent>
      {selectedPL && ( // Show modal only if a phase is selected
        <ModalComponent onClose={closeModal}>
          {(selectedPL.status === 'Active' &&
            <BtnEdit onClick={() => { startEditing() }}>  <FontAwesomeIcon icon={faPenToSquare} /></BtnEdit>)}
          <h2>{selectedPL.name}</h2>
          <SubTitle2>Description</SubTitle2>
          <p>{selectedPL.description}</p>
          <SubTitle2>Creator</SubTitle2>
          <p>{`${users.find(usr => usr.id === selectedPL.production_line_creator).first_name} ${users.find(usr => usr.id === selectedPL.production_line_creator).last_name}` }</p>
          <SubTitle2>Factory</SubTitle2>
          <p>{selectedPL.factory}</p>
          <SubTitle2>Phases</SubTitle2>
          {selectedPL.orderedPhases.map((item, index) => (
            <PLPHBoxes key={item}>{index + 1} - {item}</PLPHBoxes>
          ))}
          <ButtonContainer>
            {selectedPL.status === "Active" && (
              <Button isdisabledBtn={true} onClick={() => { disablePL(selectedPL.PLID); closeModal(); }}>Disable</Button>
            )}
            {selectedPL.status === "Inactive" && (
              <Button onClick={() => { enablePL(selectedPL.PLID); closeModal(); }}>Enable</Button>
            )}
          </ButtonContainer>
        </ModalComponent>
      )}
    </OrderContainer>
  );
}


// i want it so that i enter a phase in my selector, it automatically adds all the other ones and i can see them in my selector too