import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { GlobalStyles, Titles, SubTitle, Container, BlurOverlay, ContentWrapper, ImageWrapper, FormWrapper, FormContent, CustomLink, StyledButton } from '../../../Styled/Login.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';


const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container>
      <GlobalStyles />
      <BlurOverlay />
      <ContentWrapper>
        <ImageWrapper />
        <FormWrapper>
          <FormContent>
            <Titles>SmartPipes</Titles>
            <SubTitle>Welcome back!</SubTitle>
            <form onSubmit={onSubmit}>
              <div className='form-group'>
                <div class="input-group flex-nowrap">
                  <span class="input-group-text" id="addon-wrapping"><i class="fa-solid fa-at"></i></span>
                  <input  
                    className='form-control'
                    type='email'
                    placeholder='Email'
                    name='email'
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <br />
              <div className='form-group'>
                <div class="input-group flex-nowrap">
                  <span class="input-group-text" id="addon-wrapping"><i class="fa-solid fa-lock"></i></span>
                  <input
                    className='form-control'
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={password}
                    onChange={onChange}
                    minLength='6'
                    required
                  />
                </div>
              </div>
              <CustomLink to='/reset-password'>Forgot Password?</CustomLink>
              <StyledButton type='submit'>Login</StyledButton>
            </form>
          </FormContent>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
