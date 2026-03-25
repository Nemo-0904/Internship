import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useCart } from '../context/cartContext.jsx';
import '../styles/ProductDetailsModal.css';

const STLViewer = lazy(() => import('./STLViewer'));

const ProductDetailsModal = ({ product, stlData, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  
  // 🔹 State for the Toast notification
  const [toastVisible, setToastVisible] = useState(false);

  const resetRotation = (e) => {
    e.stopPropagation();
    setRotation({ x: 0, y: 0, z: 0 });
  };

  const productStlFiles = useMemo(() => {
    if (!product || !stlData) return [];
    const stlEntry = stlData.find(item => item.name === product.name);
    if (!stlEntry || !stlEntry.stl_files) return [];

    return stlEntry.stl_files.map(file => ({
      name: file.name,
      url: `/stl/${product.name}/${file.filename}`,
    }));
  }, [product, stlData]);

  useEffect(() => {
    setRotation({ x: 0, y: 0, z: 0 });
  }, [product]);

  if (!isOpen) return null;

  const handleRotationChange = (axis, value) => {
    setRotation(prev => ({ ...prev, [axis]: parseFloat(value) }));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    
    // 🔹 Show Toast instead of Alert
    setToastVisible(true);
    
    // Automatically close modal after 1.5 seconds so user sees the toast
    setTimeout(() => {
      setToastVisible(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-details wide-pattern" onClick={(e) => e.stopPropagation()}>
        
        {/* 🔹 Toast Notification */}
        {toastVisible && (
          <div className="toast-notification">
            <span className="toast-icon">✓</span>
            <p>Added to Collection!</p>
          </div>
        )}

        <button className="close-modal-btn" onClick={onClose}>&times;</button>

        <div className="modal-main-layout">
          <div className="modal-visual-column embedded-viewer">
            <Suspense fallback={<div className="viewer-loader">Loading 3D Model...</div>}>
              {productStlFiles.length > 0 ? (
                <STLViewer stlFiles={productStlFiles} rotation={rotation} />
              ) : (
                <div className="no-stl-placeholder">
                  <img src={product.image_url} alt={product.name} />
                  <p>3D Preview Unavailable</p>
                </div>
              )}
            </Suspense>

            <div className="viewer-controls-overlay">
              <div className="controls-header">
                <span>Rotation</span>
                <button className="reset-rotation-btn" onClick={resetRotation} title="Reset">↺</button>
              </div>
              {['x', 'y', 'z'].map((axis) => (
                <div key={axis} className="control-group">
                  <label>{axis.toUpperCase()}</label>
                  <input 
                    type="range" min="0" max="360" 
                    value={rotation[axis]} 
                    onChange={(e) => handleRotationChange(axis, e.target.value)}
                  />
                  <span>{rotation[axis]}°</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-info-column">
            <h2 className="modal-product-title">{product.name}</h2>
            <p className="modal-product-price">{product.price || 'Free'}</p>
            <div className="modal-description-section">
              <h3>About this Model</h3>
              <p>{product.description || "No description available."}</p>
            </div>
            <div className="modal-specs-preview">
              <p><strong>Category:</strong> 3D Printing</p>
              <p><strong>Format:</strong> STL / 3MF</p>
            </div>
            <div className="modal-action-buttons">
              <button className="btn-primary-hub" onClick={handleAddToCart}>
                Add to Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetailsModal);