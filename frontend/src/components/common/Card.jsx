import React from 'react';
import PropTypes from 'prop-types';
import '../common/styles.css';

const Card = ({ title, image, children }) => {
    return (
        <div className="card">
            <div className="card-header">
                <span className="card-title">{title}</span>
                <img className="card-image" src={image} alt={title} />
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Card;
