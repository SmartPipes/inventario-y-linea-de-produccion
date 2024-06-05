import React from 'react';
import PropTypes from 'prop-types';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody } from '../../../Styled/Inventory.styled';

const Card = ({ title, image, children }) => {
    return (
        <InventoryCard>
            <CardBody>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                {children}
            </CardBody>
            <CardImage src={image} alt={title} />
        </InventoryCard>
    );
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Card;
