// Profile.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';
import { getUserProfile, updateUserProfile } from '../../ApiClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faWallet,
    faLocationDot,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
    ProfileContainer,
    Card,
    LeftSection,
    RightSection,
    Section,
    SectionTitle,
    List,
    ProfileImageContainer,
    ProfileImage
} from '../../Styled/Profile.styled';
import profileImg from '../../assets/profile.jpg';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import FormUpdateProfile from './FormUpdateProfile'; // Asegúrate de la ruta correcta
import FormUpdateAddress from './FormUpdateAddress'; // Nueva importación

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const navigate = useNavigate(); // Usar useNavigate

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const data = await getUserProfile();
                setUserData(data);
            } catch (error) {
                setError('Failed to fetch user profile');
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async (values) => {
        try {
            await updateUserProfile(values);
            setIsModalVisible(false);
            const data = await getUserProfile(); // Refresh user data
            setUserData(data);
        } catch (error) {
            message.error('Failed to update profile');
        }
    };

    const handleUpdateAddress = async (values) => {
        try {
            await updateUserProfile(values);
            setIsModalVisible(false);
            const data = await getUserProfile(); // Refresh user data
            setUserData(data);
        } catch (error) {
            message.error('Failed to update address');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showModal = (section) => {
        setSelectedSection(section);
        setIsModalVisible(true);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <ProfileContainer>
            <Card>
                <LeftSection>
                    <ProfileImageContainer>
                        <ProfileImage src={profileImg} alt="Profile" />
                    </ProfileImageContainer>
                    <SectionTitle><FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />Profile <Button type="primary" onClick={() => showModal('Profile')}>Edit</Button></SectionTitle>
                    <hr />
                    <p>Name: {userData.first_name} {userData.last_name}</p>
                    <p>Birthdate: {userData.birthdate || 'Please provide your Birthdate.'}</p>
                    <p>Email: {userData.email}</p>
                    <p>Phone: {userData.phone}</p>
                </LeftSection>
                <RightSection>
                    <Section>
                        <SectionTitle><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '8px' }} />Address <Button type="primary" onClick={() => showModal('Address')}>Edit</Button></SectionTitle>
                        <hr />
                        <List>
                            <p>{userData.address || 'Please provide your Address.'}</p>
                        </List>
                    </Section>
                    <Section>
                        <SectionTitle><FontAwesomeIcon icon={faWallet} style={{ marginRight: '8px' }} />Payment Methods <Button type="primary" onClick={() => navigate('/payment')}>Access</Button></SectionTitle> 
                        <hr />
                        <List>
                            <p>{userData.paymentMethods || 'Click on access to see your payment methods.'}</p>
                        </List>
                    </Section>
                </RightSection>
            </Card>

            <Modal
                title={`Update ${selectedSection}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedSection === 'Profile' && (
                    <FormUpdateProfile
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        onUpdate={handleUpdateProfile}
                        initialValues={userData}
                    />
                )}
                {selectedSection === 'Address' && (
                    <FormUpdateAddress
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        onUpdate={handleUpdateAddress}
                        initialValues={userData}
                    />
                )}
                {/* Puedes agregar otros componentes para otras secciones si es necesario */}
            </Modal>
        </ProfileContainer>
    );
};

export default Profile;
