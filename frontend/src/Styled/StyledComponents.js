import styled from 'styled-components';

// Container for the menu bar
export const MenuBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 1em;
`;

// Individual menu items
export const MenuItem = styled.a`
  color: white;
  padding: 0.75em 1.5em;
  text-decoration: none;
  font-size: 1em;
  
  &:hover {
    background-color: #575757;
  }

  &.active {
    background-color: #4CAF50;
  }
`;

// Container for menu items (optional, if you want to group them)
export const MenuItemsContainer = styled.div`
  display: flex;
  gap: 1em;
`;

// Container for the entire application
export const AppContainer = styled.div`
  background-color: ${props => props.bgColor || 'white'};
  min-height: 100vh; /* Ensure it covers the full height of the viewport */
  display: flex;
  flex-direction: column;
`;