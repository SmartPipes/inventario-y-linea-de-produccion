import styled from 'styled-components';
import profile from '../assets/profile.jpg';

// Contenedor principal para centrar la card
export const ProfileContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
`;

// Card principal que contendrá las secciones
export const Card = styled.div`
    display: flex;
    width: 60%;
    max-width: 1200px;
    overflow: hidden; // Asegura que no haya scroll innecesario en la card
`;

// Sección izquierda de la card para los datos de perfil
export const LeftSection = styled.div`
    flex: 1;
    padding: 20px;
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    justify-content: center;
    overflow: auto; // Maneja el scroll si el contenido es demasiado grande
    background-color: #fff; // Fondo blanco para destacar la sección
    border: 1px solid #ddd; // Borde de cada sección
    border-radius: 8px; // Bordes redondeados para un aspecto más suave
    
`;

// Contenedor de la imagen de perfil
export const ProfileImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
`;

export const ProfileImage = styled.img`
    border-radius: 50%;
    width: 120px; // Ajusta el tamaño de la imagen según sea necesario
    height: 120px;
    object-fit: cover; // Asegura que la imagen se ajuste al contenedor sin deformarse
`;

// Sección derecha de la card dividida en 3 secciones
export const RightSection = styled.div`
    flex: 1;
    display: flex;
    padding: 0 20px;
    flex-direction: column;
    overflow: auto; // Maneja el scroll dentro de las secciones internas
`;

// Contenedor para cada sección dentro de la sección derecha
export const Section = styled.div`
    flex: 1 1 auto;
    padding: 20px;
    border: 1px solid #ddd; // Borde de cada sección
    border-radius: 8px; // Bordes redondeados para un aspecto más suave
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Sombra ligera para darle profundidad
    background-color: #fff; // Fondo blanco para cada sección
    &:not(:last-child) {
        margin-bottom: 20px; // Mayor espacio entre secciones
    }
`;

// Título de cada sección
export const SectionTitle = styled.h2`
    margin-bottom: 10px;
    font-size: 1.5rem;
    color: #333;
`;

// Lista sin estilo
export const List = styled.ul`
    list-style-type: none;
    padding: 0;
`;

// Elemento de la lista
export const ListItem = styled.li`
    margin-bottom: 10px;
    font-size: 1rem;
    color: #555;
`;
