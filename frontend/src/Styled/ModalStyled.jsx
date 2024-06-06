import styled from 'styled-components';

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75); /* Darker background for better focus */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Ensure the modal is on top of other elements */
`;

export const ModalContent = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px; /* More rounded corners */
    width: 500px;
    max-width: 90%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    animation: fadeIn 0.3s ease; /* Smooth fade-in animation */
    z-index: 1010; /* Ensure the modal content is on top of the overlay */

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;

    h2 {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
    }
`;

export const ModalBody = styled.div`
    padding-bottom: 20px;
`;

export const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    button {
        background: #007bff;
        color: #fff;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
            background: #0056b3;
        }

        &:first-child {
            background: #6c757d;

            &:hover {
                background: #5a6268;
            }
        }
    }
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #aaa;

    &:hover {
        color: #000;
    }
`;

export const FormGroup = styled.div`
    margin-bottom: 5px;

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
    }
`;
