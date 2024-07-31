import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../components/actions/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        birthdate: '',
        email: '',
        phone: '',
        password: '',
        re_password: '',  // Añadido el campo de confirmación
        role: 'User',
        status: 'Active'
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                required
            />
            <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                required
            />
            <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <input
                type="password"
                name="re_password"
                value={formData.re_password}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
            />
            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
            >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
            </select>
            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
            >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
