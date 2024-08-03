import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { load_user } from '../actions/auth';
import axios from 'axios';
import {
    ProfileContainer,
    Card,
    LeftSection,
    RightSection,
    Section,
    SectionTitle,
    List,
    ListItem,
    ProfileImageContainer,
    ProfileImage
} from '../../Styled/Profile.styled';
import profileImg from '../../assets/profile.jpg'; // Ruta de la imagen de perfil

const User = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => state.auth);
    const [defaultPaymentMethod, setDefaultPaymentMethod] = useState([]);

    useEffect(() => {
        dispatch(load_user());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            axios.get('http://127.0.0.1:8000/api/users/default-payment-method/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access')}`
                }
            })
            .then(response => {
                setDefaultPaymentMethod(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the payment method!', error);
            });
        }
    }, [user]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!user) {
        return <p>No user data available</p>;
    }

    return (
        <ProfileContainer>
            <Card>
                <LeftSection>
                    <ProfileImageContainer>
                        <ProfileImage src={profileImg} alt="Profile" />
                    </ProfileImageContainer>
                    <h1>Profile</h1>
                    <hr />
                    <p>Name: {user.first_name} {user.last_name}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>
                    <p>Role: {user.role}</p>
                    <p>Status: {user.status}</p>
                </LeftSection>
                <RightSection>
                    <Section>
                        <SectionTitle>Divisions</SectionTitle>
                        <hr />
                        {user.divisions && user.divisions.length > 0 ? (
                            <List>
                                {user.divisions.map(division => (
                                    <ListItem key={division.division_id}>
                                        {division.name} (Manager ID: {division.manager_user})
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <p>No divisions available</p>
                        )}
                    </Section>
                    <Section>
                        <SectionTitle>Division Users</SectionTitle>
                        <hr />
                        {user.divisionUsers && user.divisionUsers.length > 0 ? (
                            <List>
                                {user.divisionUsers.map(divisionUser => (
                                    <ListItem key={divisionUser.division_user_id}>
                                        Division ID: {divisionUser.division} - User ID: {divisionUser.user} (Assigned Date: {divisionUser.assigned_date})
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <p>No division users available</p>
                        )}
                    </Section>
                    <Section>
                        <SectionTitle>Payment Methods</SectionTitle>
                        <hr />
                        {defaultPaymentMethod.length > 0 ? (
                            <List>
                                {defaultPaymentMethod.map(paymentMethod => (
                                    <ListItem key={paymentMethod.id}>
                                        Type: {paymentMethod.payment_type}, Provider: {paymentMethod.provider}, Account Number: {paymentMethod.account_number}, Expiry Date: {paymentMethod.expire_date}, Name on Account: {paymentMethod.name_on_account}, Default: {paymentMethod.is_default ? 'Yes' : 'No'}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <p>No default payment method available</p>
                        )}
                    </Section>
                </RightSection>
            </Card>
        </ProfileContainer>
    );
};

export default User;
