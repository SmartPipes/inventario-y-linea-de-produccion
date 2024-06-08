import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody } from '../../../Styled/Inventory.styled';
import UpdateModal from './ModalsInv/UpdateModal';
import { FormGroup } from '../../../Styled/ModalStyled';
import { Labels } from '../../../Styled/Global.styled';

axios.defaults.baseURL = 'https://smartpipes.cloud/api/inventory/';
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3ODgxNTUwLCJpYXQiOjE3MTc3OTUxNTAsImp0aSI6ImExZWI2MTNmYWQxZjQ2ZjE5Nzc2MGE5NjQzMmNmYmIzIiwidXNlcl9pZCI6Mn0.cP1VNPuu0my1Tbiq6PQgTAgGRcreof0JVmzcMTMbYCE';

const Card = ({ inventory_id, item_id, item_name, image_icon, item_price, stock, item_type, children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardTitle, setCardTitle] = useState(item_name);
    const [cardPrice, setCardPrice] = useState(item_price);
    const [cardStock, setCardStock] = useState(stock);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rawMaterialSuppliers, setRawMaterialSuppliers] = useState([]);

    useEffect(() => {
        const fetchRawMaterialSuppliers = async () => {
            try {
                const response = await axios.get('raw-material-suppliers/');
                setRawMaterialSuppliers(response.data);
            } catch (err) {
                console.error('Error fetching raw material suppliers:', err);
                setError(err);
            }
        };
        fetchRawMaterialSuppliers();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setCardTitle(newTitle);
        if (item_type === 'RawMaterial') {
            saveChanges({ name: newTitle, description: "Descripción actualizada", image_icon: image_icon, category: 1 }, 'raw-materials', item_id);
        } else {
            saveChanges({ name: newTitle, description: "Descripción actualizada", price: cardPrice, status: "Active" }, 'products', item_id);
        }
    };

    const handlePriceChange = (e) => {
        const newPrice = parseFloat(e.target.value);
        if (isNaN(newPrice) || newPrice < 0) {
            alert('Please enter a valid price');
            return;
        }
        setCardPrice(newPrice);
    
        const rawMaterialData = {
            purchase_price: newPrice.toString(),
            raw_material: item_id, // Assuming item_id is the raw_material id
            supplier: 1 // Assuming supplier id is 1, replace with actual supplier id if available
        };
    
        if (item_type === 'RawMaterial') {
            console.log('Datos enviados para raw-material-suppliers:', rawMaterialData);
            saveChanges(rawMaterialData, 'raw-material-suppliers', inventory_id); // Pass the correct id
        } else {
            const productData = {
                name: cardTitle,
                description: "Descripción actualizada",
                price: newPrice,
                status: "Active"
            };
            console.log('Datos enviados para products:', productData);
            saveChanges(productData, 'products', item_id);
        }
    };
    

    const handleStockChange = (e) => {
        const newStock = parseInt(e.target.value, 10);
        if (isNaN(newStock) || newStock < 0) {
            alert('Please enter a valid stock quantity');
            return;
        }
        setCardStock(newStock);
        saveChanges({ stock: newStock, item_id: item_id, item_type: item_type, warehouse: "default" }, 'inventory', inventory_id);
    };

    const saveChanges = async (data, type, id) => {
        setIsLoading(true);
        setError(null);
        try {
            let url;
            switch (type) {
                case 'products':
                    url = `products/${id}/`;
                    break;
                case 'raw-materials':
                    url = `raw-materials/${id}/`;
                    break;
                case 'raw-material-suppliers':
                    url = `raw-material-suppliers/${id}/`;
                    break;
                default:
                    url = `inventory/${id}/`;
                    break;
            }
            console.log('URL:', url);
            console.log('Data:', data);
            const response = await axios.put(url, data);
            console.log('Respuesta del servidor:', response.data);
        } catch (err) {
            console.error('Error al guardar cambios:', err);
            setError(err);
            alert(`Error al guardar cambios: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <>
            <InventoryCard className="inventory-card" onClick={handleOpenModal}>
                <CardBody>
                    <CardHeader>
                        <CardTitle>{cardTitle}</CardTitle>
                    </CardHeader>
                    <p>Precio: ${cardPrice}</p>
                    <p>Disponible: {cardStock} Unidades</p>
                    {children}
                </CardBody>
                <CardImage src={image_icon} alt={cardTitle} />
            </InventoryCard>
            <UpdateModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <form>
                    <FormGroup>
                        <Labels>Título</Labels>
                        <input
                            type="text"
                            value={cardTitle}
                            onChange={handleTitleChange}
                            placeholder="Ingresa el nuevo título"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Labels>Precio</Labels>
                        <input
                            type="number"
                            value={cardPrice}
                            onChange={handlePriceChange}
                            placeholder="Ingresa el nuevo precio"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Labels>Existencia</Labels>
                        <input
                            type="number"
                            value={cardStock}
                            onChange={handleStockChange}
                            placeholder="Ingresa la nueva existencia"
                        />
                    </FormGroup>
                    {children}
                </form>
            </UpdateModal>
        </>
    );
};

Card.propTypes = {
    inventory_id: PropTypes.number.isRequired,
    item_id: PropTypes.number.isRequired,
    item_name: PropTypes.string.isRequired,
    image_icon: PropTypes.string.isRequired,
    item_price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    item_type: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default Card;
