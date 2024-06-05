import React, { useState } from 'react';
import axios from 'axios';
import { FormContainer, Button, Label, Input, ButtonContainer } from '../../../Styled/Forms.styled';

const ProductForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'Active',
    image_icon: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image_icon') {
      setFormData({
        ...formData,
        image_icon: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios.post('https://smartpipes.cloud/api/inventory/products/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3NjY1NjM5LCJpYXQiOjE3MTc1NzkyMzksImp0aSI6IjQ1Yzc5Njk3NzBiNDQ1ZjVhNGJjMmRkZDI4OTJkMGViIiwidXNlcl9pZCI6M30._py6D2qlXQjl_a1k19p-evTIREor_akEIJDJJm0RUQM`
        }
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Label>Name</Label>
      <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
      <Label>Description</Label>
      <Input type="text" name="description" value={formData.description} onChange={handleChange} />
      <Label>Price</Label>
      <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
      <Label>Status</Label>
      <Input type="text" name="status" value={formData.status} onChange={handleChange} required />
      <Label>Image icon</Label>
      <Input type="file" name="image_icon" onChange={handleChange} />
      <ButtonContainer>
        <Button type="submit">Add Product</Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default ProductForm;
