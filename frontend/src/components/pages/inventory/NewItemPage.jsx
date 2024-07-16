import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FormContainer, FormGroup, Button, ButtonGroup, ActionButtonGroup, SelectedImage, Labels, Input, Select, SubmitButton, Title, ActionButton, SelectedImageWrapper, IconWrapper, EditIcon, DeleteIcon, FormRow, Column } from '../../../Styled/InventoryForm.styled';
import { API_URL_PRODUCTS, API_URL_RAWM, API_URL_SUPPLIERS, API_URL_CATEGORIES, API_URL_RAW_MATERIALS } from '../Config';
import { apiClient } from '../../../ApiClient';
import QuantityModal from './QuantityModal';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from '@chakra-ui/react';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

const NewItemPage = () => {
    const location = useLocation();
    const [formType, setFormType] = useState('Product');
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('Active');
    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');
    const [cost, setCost] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const fileInputRef = useRef(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);


    useEffect(() => {
        fetchCategories();
        fetchSuppliers();
        if (location.state) {
            prefillForm(location.state);
        }
    }, [location.state]);

    const fetchCategories = async () => {
        const response = await apiClient.get(API_URL_CATEGORIES);
        setCategories(response.data);
    };

    const fetchSuppliers = async () => {
        const response = await apiClient.get(API_URL_SUPPLIERS);
        setSuppliers(response.data);
    };

    const prefillForm = async (data) => {
        setIsEditMode(data.isEditMode);
        setName(data.item_name);
        setDescription(data.item_description || '');
        setPrice(data.item_price);
        setStatus(data.status || 'Active');
        setImage(null);
        setSelectedImage(data.image_icon);

        if (data.item_type === 'RawMaterial') {
            const rawMaterialResponse = await apiClient.get(`${API_URL_RAW_MATERIALS}${data.item_id}/`);
            const rawMaterialData = rawMaterialResponse.data;
            setDescription(rawMaterialData.description || '');
            setCategory(rawMaterialData.category);

            const rawMaterialSupplierResponse = await apiClient.get(`${API_URL_RAWM}?raw_material=${data.item_id}`);
            const rawMaterialSupplierData = rawMaterialSupplierResponse.data[0];
            setSupplier(rawMaterialSupplierData.supplier);
            setCost(rawMaterialSupplierData.purchase_price);
        } else {
            const productResponse = await apiClient.get(`${API_URL_PRODUCTS}${data.item_id}/`);
            const productData = productResponse.data;
            setDescription(productData.description || '');
        }

        setFormType(data.item_type === 'RawMaterial' ? 'RawMaterial' : 'Product');
    };

    const handleFormTypeChange = (type) => {
        setFormType(type);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageDelete = () => {
        setImage(null);
        setSelectedImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('status', status);
        if (image) {
            formData.append('image_icon', image, image.name);
        }

        if (formType === 'Product') {
            formData.append('price', price);
            console.log(`${isEditMode ? "Updating" : "Creating"} Product with data:`, {
                name,
                description,
                status,
                image,
                price
            });
            try {
                const response = isEditMode
                    ? await apiClient.put(`${API_URL_PRODUCTS}${location.state.item_id}/`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                    : await apiClient.post(API_URL_PRODUCTS, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });

                if (response.status === 201 || response.status === 200) {
                    resetForm();
                    setShowSuccessAlert(true);
                } else {
                    console.error(`${isEditMode ? 'Error actualizando' : 'Error creando'} producto:`, response.data);
                    alert(`${isEditMode ? 'Error actualizando' : 'Error creando'} producto: ` + response.data.message);
                }
            } catch (error) {
                console.error(`${isEditMode ? 'Error actualizando' : 'Error creando'} producto:`, error.response ? error.response.data : error);
                alert(`${isEditMode ? 'Error actualizando' : 'Error creando'} producto`);
            }
        } else {
            formData.append('category', category);
            console.log(`${isEditMode ? "Updating" : "Creating"} Raw Material with data:`, {
                name,
                description,
                status,
                image,
                category
            });

            try {
                const rawMaterialResponse = isEditMode
                    ? await apiClient.put(`${API_URL_RAW_MATERIALS}${location.state.item_id}/`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                    : await apiClient.post(API_URL_RAW_MATERIALS, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });

                if (rawMaterialResponse.status === 201 || rawMaterialResponse.status === 200) {
                    const rawMaterialId = isEditMode ? location.state.item_id : rawMaterialResponse.data.raw_material_id;

                    const rawMaterialSupplierData = {
                        purchase_price: cost,
                        raw_material: rawMaterialId,
                        supplier: supplier
                    };
                    console.log(`${isEditMode ? "Updating" : "Creating"} Raw Material Supplier with data:`, rawMaterialSupplierData);

                    if (isEditMode) {
                        const rawMaterialSupplierResponse = await apiClient.get(`${API_URL_RAWM}?raw_material=${rawMaterialId}`);
                        const rawMaterialSupplierId = rawMaterialSupplierResponse.data[0].id;

                        const rawMaterialSupplierUpdateResponse = await apiClient.put(`${API_URL_RAWM}${rawMaterialSupplierId}/`, rawMaterialSupplierData, {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        if (rawMaterialSupplierUpdateResponse.status === 200) {
                            resetForm();
                            setShowSuccessAlert(true);
                        } else {
                            console.error('Error actualizando proveedor de materia prima:', rawMaterialSupplierUpdateResponse.data);
                            alert('Error actualizando proveedor de materia prima: ' + rawMaterialSupplierUpdateResponse.data.message);
                        }
                    } else {
                        const rawMaterialSupplierCreateResponse = await apiClient.post(API_URL_RAWM, rawMaterialSupplierData, {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        if (rawMaterialSupplierCreateResponse.status === 201) {
                            resetForm();
                            setShowSuccessAlert(true);
                        } else {
                            console.error('Error creando proveedor de materia prima:', rawMaterialSupplierCreateResponse.data);
                            alert('Error creando proveedor de materia prima: ' + rawMaterialSupplierCreateResponse.data.message);
                        }
                    }
                } else {
                    console.error(`${isEditMode ? 'Error actualizando' : 'Error creando'} materia prima:`, rawMaterialResponse.data);
                    alert(`${isEditMode ? 'Error actualizando' : 'Error creando'} materia prima: ` + rawMaterialResponse.data.message);
                }
            } catch (error) {
                console.error(`${isEditMode ? 'Error actualizando' : 'Error creando'} materia prima:`, error.response ? error.response.data : error);
                alert(`${isEditMode ? 'Error actualizando' : 'Error creando'} materia prima`);
            }
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setStatus('Active');
        setImage(null);
        setSelectedImage(null);
        setCategory('');
        setSupplier('');
        setCost('');
    };

    const handleModalApply = (quantity) => {
        console.log(`Nueva cantidad aplicada: ${quantity}`);
        setModalVisible(false);
    };

    const handleAlertClick = () => {
        setShowSuccessAlert(false);
    };


    const handlePrintLabel = () => {
        const pdf = new jsPDF('p', 'mm', 'a4'); // Página tamaño A4 en modo retrato
        const barcodeValue = name || 'default'; // Valor predeterminado para el código de barras si name está indefinido
        const canvas = document.createElement('canvas');
        
        // Generar el código de barras
        try {
            JsBarcode(canvas, barcodeValue, { format: 'CODE128' });
        } catch (error) {
            console.error('Error generating barcode:', error);
            return;
        }
        const barcodeDataUrl = canvas.toDataURL('image/png');
        
        // Agregar logo
        const logoPath = '/SmartPipesLogo.png';  // Ruta a la imagen del logo en la carpeta public
        const img = new Image();
        img.src = logoPath;
        img.onload = function() {
            try {
                pdf.addImage(img, 'PNG', 80, 10, 50, 30); // Agranda el logo y céntralo
                
                // Agregar encabezado
                pdf.setFontSize(22);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Etiqueta de Envío', 105, 50, { align: 'center' });
                
                // Agregar información del producto
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'normal');
                const startX = 20;
                let startY = 80;
                const lineHeight = 10;
                
                pdf.text('Nombre del Producto:', startX, startY);
                pdf.setFont('helvetica', 'bold');
                pdf.text(String(name), 105, startY, { align: 'center' });
                startY += lineHeight;
                
                pdf.setFont('helvetica', 'normal');
                pdf.text('Cantidad:', startX, startY);
                pdf.setFont('helvetica', 'bold');
                pdf.text('__________', 105, startY, { align: 'center' }); // Espacio para llenar la cantidad
                startY += lineHeight;
                
                pdf.setFont('helvetica', 'normal');
                pdf.text('Descripción:', startX, startY);
                pdf.setFont('helvetica', 'bold');
                pdf.text(String(description), 105, startY, { align: 'center' });
                startY += lineHeight;
                
                // Agregar código de barras
                pdf.addImage(barcodeDataUrl, 'PNG', 40, startY + 10, 130, 40); // Ajustar tamaño y posición del código de barras
                
                // Agregar pie de página
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'italic');
                pdf.text('Generado automáticamente', 105, 290, { align: 'center' });
                
                // Guardar PDF
                pdf.save(`${name}_etiqueta.pdf`);
            } catch (error) {
                console.error('Error creating PDF:', error);
            }
        };
        
        img.onerror = function() {
            console.error('Error loading logo image');
        };
    };
    
    

    
    
    return (
        <FormContainer>
            <Title>{isEditMode ? 'Editar' : 'Nuevo'} {formType === 'Product' ? 'Producto' : 'Material'}</Title>
            <ButtonGroup>
                <Button
                    type="button"
                    isSelected={formType === 'Product'}
                    onClick={() => handleFormTypeChange('Product')}
                >
                    Producto
                </Button>
                <Button
                    type="button"
                    isSelected={formType === 'RawMaterial'}
                    onClick={() => handleFormTypeChange('RawMaterial')}
                >
                    Material
                </Button>
            </ButtonGroup>
            <ActionButtonGroup>
                <ActionButton onClick={() => setModalVisible(true)}>
                    Actualizar cantidad
                </ActionButton>
                <ActionButton>Reabastecer</ActionButton>
                <ActionButton onClick={handlePrintLabel}>Imprimir Etiqueta</ActionButton>
            </ActionButtonGroup>
            <form onSubmit={handleSubmit}>
                <FormRow>
                    <Column>
                        <FormGroup>
                            <Labels>Nombre</Labels>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Labels>Descripción</Labels>
                            <Input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </FormGroup>
                    </Column>
                    <Column>
                        <FormGroup>
                            <Labels>Imagen</Labels>
                            <Input
                                type="file"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                            <SelectedImageWrapper>
                                <SelectedImage src={selectedImage || 'https://smartpipes.cloud/staticfiles/img/placeholder.png'} alt="Selected" onClick={handleImageClick} />
                                <IconWrapper>
                                    {selectedImage ? (
                                        <DeleteIcon onClick={handleImageDelete} />
                                    ) : (
                                        <EditIcon onClick={handleImageClick} />
                                    )}
                                </IconWrapper>
                            </SelectedImageWrapper>
                        </FormGroup>
                        {formType === 'Product' ? (
                            <>
                                <FormGroup>
                                    <Labels>Precio</Labels>
                                    <Input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                            </>
                        ) : (
                            <>
                                <FormGroup>
                                    <Labels>Categoría</Labels>
                                    <Select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categories.map((cat) => (
                                            <option key={cat.category_id} value={cat.category_id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormGroup>
                                <FormGroup>
                                    <Labels>Proveedor</Labels>
                                    <Select
                                        value={supplier}
                                        onChange={(e) => setSupplier(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione un proveedor</option>
                                        {suppliers.map((sup) => (
                                            <option key={sup.supplier_id} value={sup.supplier_id}>
                                                {sup.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormGroup>
                                <FormGroup>
                                    <Labels>Costo</Labels>
                                    <Input
                                        type="number"
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                            </>
                        )}
                        <FormGroup>
                            <Labels>Estado</Labels>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Select>
                        </FormGroup>
                    </Column>
                </FormRow>
                <SubmitButton type="submit">{isEditMode ? 'Actualizar' : 'Crear'}</SubmitButton>
            </form>
            {showSuccessAlert && (
                <Box my={4} style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 9999, // Asegura que el alert esté encima de otros elementos
                }}
                    onClick={handleAlertClick} // Manejador de clic para cerrar el alert
                >
                    <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="auto" maxWidth="400px" mx="auto" cursor="pointer">
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            {isEditMode ? 'Actualización Exitosa!' : 'Creación Exitosa!'}
                        </AlertTitle>
                        <AlertDescription maxWidth="sm">
                            {`El ${formType === 'Product' ? 'producto' : 'material'} ha sido ${isEditMode ? 'actualizado' : 'creado'} exitosamente.`}
                        </AlertDescription>
                    </Alert>
                </Box>
            )}

            <QuantityModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onApply={handleModalApply}
            />
        </FormContainer>
    );
};

export default NewItemPage;
