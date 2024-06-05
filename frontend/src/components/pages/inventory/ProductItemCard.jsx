import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';  // Usamos el componente Card actualizado

const ProductItemCard = ({ product, onClick }) => {
    const price = !isNaN(product.price) ? product.price.toFixed(2) : 'N/A';
    const stock = !isNaN(product.stock) ? product.stock.toFixed(2) : '0.00';
    return (
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
            <Card title={product.name} image={product.image_icon}>
                <p>Precio: ${price}</p>
                <p>Disponible: {stock} Unidades</p>
            </Card>
        </div>
    );
};

ProductItemCard.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        stock: PropTypes.number,
        image_icon: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default ProductItemCard;
