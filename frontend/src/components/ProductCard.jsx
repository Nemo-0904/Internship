import React, { useState } from 'react';
import ProductDetailsModal from './ProductDetailsModal';
import '../styles/ProductCard.css';

const ProductCard = ({ product, stlData }) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleViewProductClick = (e) => {
    e.stopPropagation();
    setDetailsModalOpen(true);
  };

  return (
    <>
      <div className="product-card" onClick={handleViewProductClick}>
        <div className="card-image-wrapper">
          {!imageLoaded && <div className="image-placeholder" />}
          
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={imageLoaded ? 'image-visible' : 'image-hidden'}
          />
        </div>

        <div className="card-content">
          <div className="card-info">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-price">
              Get it for: {product.price || 'Free'}
            </p>
            <span className="view-status-text">3D View Available</span>
          </div>

          <button
            className="view-product-btn"
            onClick={handleViewProductClick}
          >
            View Product
          </button>
        </div>
      </div>

      {detailsModalOpen && (
        <ProductDetailsModal
          product={product}
          stlData={stlData}
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
        />
      )}
    </>
  );
};

export default React.memo(ProductCard);