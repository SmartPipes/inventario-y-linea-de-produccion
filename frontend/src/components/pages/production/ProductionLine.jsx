import {React, useState, useEffect} from 'react'
import { FormContainer, Label, Input, Button,ButtonContainer, Error , SelectStyled} from '../../../Styled/Forms.styled'
import { SideBar, MainContent, OrderContainer, PlacedOrderBoxes, PLPHBoxes, BtnEdit } from '../../../Styled/Production.styled';
import { Titles, SubTitle, SubTitle2 } from '../../../Styled/Global.styled'
import {useForm, Controller} from 'react-hook-form'
import {API_URL_PL, API_URL_FACTORIES, API_URL_PHASES, API_URL_PL_PH} from '../Config'
import {apiClient} from '../../../ApiClient'
import ModalComponent from '../../modals/ProductionModals';
import Select from 'react-select';
import { ProductionNavBar } from './ProductionNavBar';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ProductionLine = () => {
const [PL, setPL] = useState([]);
const [phases, setPhases] = useState([]);
const [factory, setFactories] = useState([]);
const [PLPH, setPLPH] = useState([]);
const [selectedPL, setSelectedPL] = useState(null); //to know what phase was selected
const [isEditing, setIsEditing] = useState(false); // to know that its in editing mode
const [selectedPLID, setSelectedPLID] = useState(null); // to know what is being edited

//THIS USER ID SHOULD BE GLOBALLY ACCESIBLE WHEN LOGIN IN
const userID = 2;

    useEffect(() => {
      getProductionLines();
      getFactories();
      getPhases();
      getPL_PH();
      },[]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
      } = useForm();
    
      const onSubmit = (data) => {
        const formData = {
            ...data,
            factory: data.factory.value, // to get only the id of the factory
            production_line_creator: userID, // adding the user ID
        };
    
        // Extract the phase IDs
        let phases = formData.phases.map(phase => phase.value);
    
        // Delete phases from the formData JSON
        delete formData.phases;

        if (isEditing) {
          apiClient.put(`${API_URL_PL}${selectedPLID}/`, formData)
          .then(response => {
              const productionLineId = response.data.productionLine_id; // Assuming the response contains the id of the created production line
              // Prepare and post each phase
              const phasePromises = phases.map((phaseId, index) => {
                  const productionLinePhase = {
                      sequence_number: index + 1, // Assuming sequence_number is just the index + 1
                      productionLine: productionLineId,
                      phase: phaseId,
                  };
  
                  return apiClient.put(`${API_URL_PL_PH}${selectedPLID}`, productionLinePhase);
              });
  
              // Wait for all phase posts to complete
              return Promise.all(phasePromises);
          })
          .then(() => {
              // After posting all phases, refresh the production lines and reset the form
              getProductionLines();            
              getPL_PH();
              reset();
              setValue('factory', '');  
              setValue('phases', '');
          })
          .catch(error => {
              console.error('Error upd production line:', error);
          });
    
        }else{
        // Post formData to the first API endpoint
        apiClient.post(API_URL_PL, formData)
            .then(response => {
                const productionLineId = response.data.productionLine_id; // Assuming the response contains the id of the created production line
    
                // Prepare and post each phase
                const phasePromises = phases.map((phaseId, index) => {
                    const productionLinePhase = {
                        sequence_number: index + 1, // Assuming sequence_number is just the index + 1
                        productionLine: productionLineId,
                        phase: phaseId,
                    };
    
                    return apiClient.post(API_URL_PL_PH, productionLinePhase);
                });
    
                // Wait for all phase posts to complete
                return Promise.all(phasePromises);
            })
            .then(() => {
                // After posting all phases, refresh the production lines and reset the form
                getProductionLines();            
                getPL_PH();
                reset();
                setValue('factory', '');  
                setValue('phases', '');
            })
            .catch(error => {
                console.error('Error posting production line:', error);
            });
          }
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

      const getPhases = async() => {
        try {
          const response = await apiClient.get(API_URL_PHASES);
              if (Array.isArray(response.data)) {
                const transformedPhases = response.data.map(phase => ({
                  value: phase.phase_id,
                  label: phase.name
                }));
                setPhases(transformedPhases);
              } else {
                console.error('Data fetched is not an array:', response.data);
                setPhases([]);
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

      const getPL_PH = async () => {
        try{
          const response = await apiClient.get(API_URL_PL_PH);
          setPLPH(response);
        }catch (error) {
          console.log('Error fetching PL_PH', error);
          setPLPH([]);
        }
      }

  // For the modal of the phases
  const openModal = (name, description, production_line_creator, factory, orderedPhases, PLID, factoryID, phasesID, status) => {
    setSelectedPL({ name, description, production_line_creator, factory, orderedPhases, PLID, factoryID, phasesID, status});
  };

  const closeModal = () => {
    setSelectedPL(null);
  };

  //ADJUST THIS TO ADD THE NAME OF THE USER FROM THE SESSION
  // const getUserLabel = (cityId) => {
  //   const citylabel = city.find(c => c.value === cityId);
  //   return citylabel ? citylabel.label : '';
  // };

  const getFactoryLabel = (id) => {
    const factorylabel = factory.find(c => c.value === id);
    return factorylabel ? factorylabel.label : '';
  };

  //returns the phases of the production line, in order
  const transformPLPH = (id) => {
    let transformedPLPH = [];
    let filteredPhases = [];
    // Filter items by productionLine id
    let filteredItems = PLPH.data.filter(item => item.productionLine === id);
    
    // Sort the filtered items by sequence_number
    filteredItems.sort((a, b) => a.sequence_number - b.sequence_number);
    
    // Push the phase numbers into transformedPLPH
    filteredItems.forEach(item => {
      filteredPhases.push(item.phase);
    });

    //use the ids in filteredItems to get the label of the phase
    filteredPhases.map(item => {
      const phaselabel = phases.find(phase => phase.value === item);
      transformedPLPH.push(phaselabel.label)
    })

    return transformedPLPH;
}

   //disables the factory
   const disablePL = async(id) => {
    const disable = {...PL.find(productionLine =>selectedPL.PLID === id), status: "Inactive"}
    console.log(disable);
    delete disable.PLID;
    delete disable.created_at;
    await apiClient.put(API_URL_PL+id+"/" , disable);
    getProductionLines();
  }

  //enables the factory again
  const enablePL = async (id) => {
    const enable = { ...PL.find(productionLine => selectedPL.PLID === id), status: "Active" };
    delete enable.PLID;
    delete enable.created_at;
    await apiClient.put(API_URL_PL + id + "/", enable);
    getProductionLines();
  };

//Enables editting mode
  const startEditing = () => {
    setSelectedPLID(selectedPL.PLID);
    setIsEditing(true);
    closeModal();
    if (selectedPL) {
      //Values that the form is goign to be populated with
      setValue("name", selectedPL.name);
      setValue("description", selectedPL.description);
      setValue("factory", {value:selectedPL.factoryID , label:selectedPL.factory});

      let transformedPLPH = [];
      let filteredPhases = [];
      let setValuesPhases = [];
      // Filter items by productionLine id
      let filteredItems = PLPH.data.filter(item => item.productionLine === selectedPL.PLID);
      
      // Sort the filtered items by sequence_number
      filteredItems.sort((a, b) => a.sequence_number - b.sequence_number);
      
      // Push the phase numbers into transformedPLPH
      filteredItems.forEach(item => {
        filteredPhases.push(item.phase);
      });
  
      //use the ids in filteredItems to get the label of the phase
      filteredPhases.map(item => {
        const phaselabel = phases.find(phase => phase.value === item);
        transformedPLPH.push(phaselabel.label)
      })

      filteredPhases.map((item, index) => {
        setValuesPhases.push({value:item,label:selectedPL.orderedPhases[index]})
      })
      setValue("phases", setValuesPhases);
    }

  };

  //exits editing mode
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
    <ProductionNavBar/>
        <Titles>{isEditing ? `Editing`:'Create a New Production Line'}</Titles>
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
                <SelectStyled>
                <Controller name="factory" control={control} rules={{required: true}} render={({field}) => ( <Select {...field}  options = {factory}/>)}/>
                </SelectStyled>
                {errors.factory && (
                    <Error>This is a required field.</Error>
                )}
            </div>

            <div className="form-control">
                <Label>Select the Production Phases in Ascending Order</Label>
                <SelectStyled>
                <Controller name="phases" control={control} rules={{required: true}} render={({field}) => ( <Select {...field} isMulti options = {phases}/>)}/>
                </SelectStyled>
                {errors.factory && (
                    <Error>This is a required field.</Error>
                )}
            </div>

            <div className="form-control">
              <label></label>
              <ButtonContainer>
              {isEditing &&(
                <BtnEdit onClick={cancelEdit}>Cancel</BtnEdit>)}
              <Button type="submit">Create a Production Line</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
    </MainContent>
    {selectedPL && ( //Show modal only if a phase is selected
        <ModalComponent onClose={closeModal}>
           {(selectedPL.status === 'Active' &&
              <BtnEdit onClick={() => {startEditing()}}>  <FontAwesomeIcon icon={faPenToSquare} /></BtnEdit>)}
          <h2>{selectedPL.name}</h2>
          <SubTitle2>Description</SubTitle2>
          <p>{selectedPL.description}</p>
          <SubTitle2>Creator</SubTitle2>
          <p>{selectedPL.production_line_creator}</p>
          <SubTitle2>Factory</SubTitle2>
          <p>{selectedPL.factory}</p>
          <SubTitle2>Phases</SubTitle2>
          {selectedPL.orderedPhases.map((item, index) => (
              <PLPHBoxes key={item}>{index+1} - {item}</PLPHBoxes>
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
  )
}

export default ProductionLine;