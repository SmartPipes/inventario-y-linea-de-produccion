import React, { useEffect, useState } from 'react';
import { getPaymentMethods, postPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '../../ApiClient'; // Importa la función para eliminar
import { Modal, Button, message } from 'antd';
import {
  PaymentContainer,
  MainCard,
  PaymentCard,
  PaymentContent,
  PaymentDetail,
  SectionTitle,
} from '../../Styled/Payment.styled';
import FormCreatePayment from './FormCreatePayment'; 
import FormUpdatePayment from './FormUpdatePayment'; // Nuevo componente para la actualización
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de eliminar

const Payment = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal para confirmación de eliminación
  const [methodToDelete, setMethodToDelete] = useState(null); // Método de pago a eliminar

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await getPaymentMethods();
        setPaymentMethods(data);
      } catch (error) {
        setError('Failed to fetch payment methods');
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleOpenUpdateModal = (method) => {
    setCurrentPaymentMethod(method);
    setIsUpdateModalOpen(true);
  };
  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

  const handleOpenDeleteModal = (method) => {
    setMethodToDelete(method);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleCreatePaymentMethod = async (values) => {
    try {
      await postPaymentMethod(values);
      setIsCreateModalOpen(false);
      const data = await getPaymentMethods(); // Refresh payment methods
      setPaymentMethods(data);
    } catch (error) {
      message.error('Failed to create payment method');
    }
  };

  const handleUpdatePaymentMethod = async (values) => {
    try {
      await updatePaymentMethod(currentPaymentMethod.id, values);
      setIsUpdateModalOpen(false);
      const data = await getPaymentMethods(); // Refresh payment methods
      setPaymentMethods(data);
    } catch (error) {
      message.error('Failed to update payment method');
    }
  };

  const handleDeletePaymentMethod = async () => {
    try {
      await deletePaymentMethod(methodToDelete.id);
      setIsDeleteModalOpen(false);
      const data = await getPaymentMethods(); // Refresh payment methods
      setPaymentMethods(data);
    } catch (error) {
      message.error('Failed to delete payment method');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <PaymentContainer>
        <Button type="primary" onClick={handleOpenCreateModal} style={{ marginBottom: '20px' }}>
          Add Payment Method
        </Button>
        <MainCard>
          {paymentMethods.map((method) => (
            <PaymentCard key={method.id}>
              <PaymentContent>
                <SectionTitle>
                  <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '8px' }} />
                  Payment 
                  <Button type="warning" onClick={() => handleOpenUpdateModal(method)} style={{ marginLeft: 'auto' }}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  <Button type="danger" onClick={() => handleOpenDeleteModal(method)} style={{ marginLeft: '8px' }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </SectionTitle>
                <PaymentDetail><strong>Payment Type:</strong> {method.payment_type}</PaymentDetail>
                <PaymentDetail><strong>Provider:</strong> {method.provider}</PaymentDetail>
                <PaymentDetail><strong>Account Number:</strong> {method.account_number}</PaymentDetail>
                <PaymentDetail><strong>Expire Date:</strong> {method.expire_date}</PaymentDetail>
                <PaymentDetail><strong>Name on Account:</strong> {method.name_on_account}</PaymentDetail>
                <PaymentDetail><strong>Default:</strong> {method.is_default ? 'Yes' : 'No'}</PaymentDetail>
              </PaymentContent>
            </PaymentCard>
          ))}
        </MainCard>
        <Modal
          title="Add Payment Method"
          visible={isCreateModalOpen}
          onCancel={handleCloseCreateModal}
          footer={null}
        >
          <FormCreatePayment
            onClose={handleCloseCreateModal}
            onCreate={handleCreatePaymentMethod}
          />
        </Modal>
        <Modal
          title="Update Payment Method"
          visible={isUpdateModalOpen}
          onCancel={handleCloseUpdateModal}
          footer={null}
        >
          <FormUpdatePayment
            initialValues={currentPaymentMethod}
            onClose={handleCloseUpdateModal}
            onUpdate={handleUpdatePaymentMethod}
          />
        </Modal>
        <Modal
          title="Confirm Delete"
          visible={isDeleteModalOpen}
          onCancel={handleCloseDeleteModal}
          footer={[
            <Button key="cancel" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>,
            <Button key="delete" type="primary" danger onClick={handleDeletePaymentMethod}>
              Delete
            </Button>,
          ]}
        >
          <p>Are you sure you want to delete this payment method?</p>
        </Modal>
      </PaymentContainer>
    </>
  );
};

export default Payment;
