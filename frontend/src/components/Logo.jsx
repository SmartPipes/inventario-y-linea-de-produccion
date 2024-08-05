import React from 'react'
import { LogoImg } from '../Styled/Navbar.styled'
import logo from '../assets/logo.svg'

function Logo() {
  return (
    <LogoImg src={logo} alt="logo" />
  )
}

export default Logo