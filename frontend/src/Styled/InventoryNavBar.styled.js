import styled from 'styled-components';

export const NavContainer = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    position: relative;
`;

export const NavLogo = styled.div`
    font-size: 24px;
    font-weight: bold;
`;

export const NavItem = styled.div`
    margin: 0 10px;
    a {
        text-decoration: none;
        color: #333;
    }
`;

export const HamburgerMenu = styled.div`
    display: none;
    cursor: pointer;
    @media (max-width: 768px) {
        display: block;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    @media (max-width: 768px) {
        display: ${props => (props.isOpen ? 'flex' : 'none')};
        flex-direction: column;
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        background-color: #f5f5f5;
        z-index: 1000;
        border-top: 1px solid #ddd;
    }
`;

export const NavSearchContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    position: relative;
`;

export const NavSearch = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 50%;
    margin: 0 auto;

    input {
        border: none;
        padding: 5px;
        margin-left: 5px;
        flex-grow: 1;
        outline: none;
    }

    button {
        border: none;
        background: none;
        padding: 5px 10px;
        cursor: pointer;
    }
`;

export const NavFilters = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    button {
        padding: 5px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }
`;

export const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    input {
        margin-right: 5px;
    }
`;

export const FilterOption = styled.div`
    padding: 5px 10px;
    background-color: #eee;
    margin-right: 5px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: #ddd;
    }
`;

export const FilterTag = styled.div`
    display: flex;
    align-items: center;
    background-color: #eee;
    padding: 5px 10px;
    margin-right: 5px;
    border-radius: 4px;
    span {
        margin-left: 5px;
        cursor: pointer;
    }
`;

export const FilterDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
`;

export const NavPagination = styled.div`
    display: flex;
    align-items: center;
    button {
        padding: 5px 10px;
        cursor: pointer;
    }
    span {
        margin: 0 5px;
    }
`;

export const NewButton = styled.button`
    background-color: #97b25e;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #364936;
    }

    svg {
        margin-right: 5px;
    }
`;

