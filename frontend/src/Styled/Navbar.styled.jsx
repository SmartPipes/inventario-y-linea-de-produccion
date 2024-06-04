import { NavLink } from "react-router-dom";
import styled from "styled-components";

const LogoImg = styled.img`
    width: 150px;
`;

const NavbarWrapper = styled.nav`
display: flex;
justify-content: space-between;
align-items: center;
background: #364936;
padding: 1rem 3rem;
position: relative;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);   
`;

const  NavLinkWrapper = styled.div`

`;

const StyledNavLink = styled(NavLink)`
text-decoration: none;
transition: .2s;
color: #FAFBF3;
margin-left: 2rem;
&:hover {
    color: #97B25E;
}


&.${(props) => props.activeclassname}{
    background: #97B25E;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    &:hover {
        color: #FAFBF3;
    &.${(props) => props.activeclassname}{
        color: #FAFBF3; 
    }
}

&:hover {
    color: #97B25E;
}}

`; 




export {LogoImg , NavLinkWrapper , NavbarWrapper , StyledNavLink};