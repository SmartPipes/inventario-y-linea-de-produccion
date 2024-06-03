import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import '../common/styles.css';
const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products/${product.product_id}`);
    };

    return (
        <div onClick={handleClick}>
            <Card title={product.name} image={product.image_icon}>
                <p>Precio: ${product.price}</p>
                <p>Estado: {product.status}</p>
            </Card>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        product_id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        image_icon: PropTypes.string.isRequired,
    }).isRequired,
};

export default ProductCard;
