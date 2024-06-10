import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody } from '../../../Styled/Inventory.styled';
import UpdateModal from './ModalsInv/UpdateModal';
import { FormGroup } from '../../../Styled/ModalStyled';
import { Labels } from '../../../Styled/Global.styled';

axios.defaults.baseURL = 'https://smartpipes.cloud/api/inventory/';
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4MDYzMjM1LCJpYXQiOjE3MTc5NzY4MzUsImp0aSI6IjJiYzk2Y2FiZTJkYzRjMzdhYzg2ZmJmZDg5NmZhNzA0IiwidXNlcl9pZCI6Mn0.Nl8Fgwjl3V8Y5kG39S_d0T9y-LEDHxBObrQ3gR1tpUo';

const Card = ({ inventory_id, item_id, item_name, image_icon, item_price, stock, item_type, children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardTitle, setCardTitle] = useState(item_name);
    const [cardPrice, setCardPrice] = useState(item_price);
    const [cardStock, setCardStock] = useState(stock);
    const [rawMaterialSuppliers, setRawMaterialSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawMaterialSuppliersResponse = await axios.get('raw-material-suppliers/');
                const productsResponse = await axios.get('products/');
                const rawMaterialsResponse = await axios.get('raw-materials/');

                setRawMaterialSuppliers(rawMaterialSuppliersResponse.data);
                setProducts(productsResponse.data);
                setRawMaterials(rawMaterialsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };
        fetchData();
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
            saveChanges({ name: newTitle, description: "Descripción actualizada", category: 1 }, 'raw-materials', item_id);
        } else {
            saveChanges({ name: newTitle, description: "Descripción actualizada", price: cardPrice, status: "Active" }, 'products', item_id);
        }
    };

    const handlePriceChange = (e) => {
        const newPrice = parseFloat(e.target.value);
        if (isNaN(newPrice) || newPrice < 0) {
            return;
        }
        setCardPrice(newPrice);
    
        if (item_type === 'RawMaterial') {
            const rawMaterial = rawMaterials.find(rm => rm.raw_material_id === item_id);
            if (!rawMaterial) {
                console.error('Raw material not found for item_id:', item_id);
                return;
            }
            const supplier = rawMaterialSuppliers.find(s => s.raw_material === rawMaterial.raw_material_id);
            if (!supplier) {
                console.error('Supplier not found for raw_material_id:', rawMaterial.raw_material_id);
                return;
            }
    
            const rawMaterialData = {
                purchase_price: newPrice.toString(),
                raw_material: rawMaterial.raw_material_id,
                supplier: supplier.supplier // Ajustar este campo si necesario
            };
    
            console.log('Datos enviados para raw-material-suppliers:', rawMaterialData);
            saveChanges(rawMaterialData, 'raw-material-suppliers', supplier.id);
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
            return;
        }
        setCardStock(newStock);
    
        const inventoryData = {
            item_id: item_id,
            item_type: item_type,
            stock: newStock
        };
    
        console.log('Datos enviados para inventory:', inventoryData);
        saveChanges(inventoryData, 'inventory', inventory_id);
    };
    

    const saveChanges = async (data, type, id) => {
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
                case 'inventory':
                    url = `inventory/${id}/`;
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
            console.error('Error al guardar cambios:', err.response ? err.response.data : err.message);
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
