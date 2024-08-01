import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStyles, Titles, SubTitle, Container, BlurOverlay, ContentWrapper, ImageWrapper, FormWrapper, FormContent, StyledButton } from '../../../Styled/Password.styled'; // Ajusta según tu estructura de estilos

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/auth/users/reset_password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(response => {
        if (response.ok) {
          setMessage('If your email is registered, you will receive a link to reset your password.');
        } else {
          setMessage('There was an error sending the reset link. Please try again.');
        }
      })
      .catch(() => setMessage('There was an error sending the reset link. Please try again.'));
  };

  return (
    <Container>
      <GlobalStyles />
      <BlurOverlay />
      <ContentWrapper>
        <FormWrapper>
          <FormContent>
            <Titles>Smart Pipes</Titles>
            <SubTitle>Enter your email to receive a password reset link.</SubTitle>
            <form onSubmit={onSubmit}>
              <div className='form-group'>
                <div className="input-group flex-nowrap">
                  <span className="input-group-text" id="addon-wrapping"><i className="fa-solid fa-envelope"></i></span>
                  <input
                    className='form-control'
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <StyledButton type='submit'>Send Reset Link</StyledButton>
            </form>
            <p>{message}</p>
          </FormContent>
        </FormWrapper>
        <ImageWrapper />
      </ContentWrapper>
    </Container>
  );
};

export default ResetPassword;
