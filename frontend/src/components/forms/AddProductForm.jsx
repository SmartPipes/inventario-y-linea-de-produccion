import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../common/styles.css';

const AddProductForm = ({ onClose, onProductAdded }) => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        status: 'Active',
        image_icon: '',
    });

    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('status', product.status);
        if (imageFile) {
            formData.append('image_icon', imageFile);
        }

        try {
            await axios.post('http://127.0.0.1:8080/api/inventory/products/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3MzE1OTIyLCJpYXQiOjE3MTcyMjk1MjIsImp0aSI6IjJmNTg5ZTJmNjdkYjQzMTg5NGU5YzY4M2E3NjQxMjgwIiwidXNlcl9pZCI6MX0.3Dh8Svnh1XPQtRh2nJkddtknPEyPZimZx9XV5PpX7sU`,
                },
            });
            onProductAdded();
            onClose();
        } catch (error) {
            console.error('Error adding product', error);
        }
    };

    return (
        <div className="add-product-form">
            <form onSubmit={handleSubmit}>
                <h2>Nuevo Producto</h2>
                <label>
                    Nombre:
                    <input type="text" name="name" value={product.name} onChange={handleChange} required />
                </label>
                <label>
                    Descripción:
                    <input type="text" name="description" value={product.description} onChange={handleChange} required />
                </label>
                <label>
                    Precio:
                    <input type="number" name="price" value={product.price} onChange={handleChange} required />
                </label>
                <label>
                    Estado:
                    <select name="status" value={product.status} onChange={handleChange} required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </label>
                <label>
                    Imagen:
                    <input type="file" name="image_icon" onChange={handleFileChange} />
                </label>
                <button type="submit">Agregar</button>
                <button type="button" onClick={onClose}>Cancelar</button>
            </form>
        </div>
    );
};

AddProductForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onProductAdded: PropTypes.func.isRequired,
};

export default AddProductForm;
