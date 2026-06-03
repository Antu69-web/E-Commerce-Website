import React, { useState } from 'react';
import './ProductDetailModal.css';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  const { name, price, discountPrice, rating, reviews, image, tag, category, description, specs } = product;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Standard');
  
  // Custom mock colors for selection
  const colors = ['Standard', 'Carbon Gray', 'Muted Copper'];

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    // Pass quantity and selected color options to cart
    onAddToCart({ ...product, quantity, selectedColor });
    onClose();
  };

  // Star render
  const renderStars = (ratingVal) => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star-filled">★</span>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<span key={i} className="star-half">★</span>);
      } else {
        stars.push(<span key={i} className="star-empty">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel anim-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button id="btn-close-detail" className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-body-grid">
          {/* Left Column: Image Preview */}
          <div className="modal-image-col">
            {tag && <span className="modal-badge">{tag}</span>}
            <div className="modal-img-container">
              <img src={image} alt={name} className="modal-img" />
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="modal-info-col">
            <span className="modal-category">{category}</span>
            <h2 className="modal-name">{name}</h2>

            <div className="modal-rating">
              <div className="stars-container">{renderStars(rating)}</div>
              <span className="reviews-count">{rating} out of 5 ({reviews} customer reviews)</span>
            </div>

            <div className="modal-price">
              {discountPrice ? (
                <>
                  <span className="modal-price-current">${discountPrice}</span>
                  <span className="modal-price-original">${price}</span>
                </>
              ) : (
                <span className="modal-price-current">${price}</span>
              )}
            </div>

            <p className="modal-description">{description}</p>

            {/* Specifications list */}
            {specs && specs.length > 0 && (
              <div className="modal-specs">
                <h4>Key Specifications:</h4>
                <ul>
                  {specs.map((spec, index) => (
                    <li key={index}>✓ {spec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Simulated Color Options */}
            <div className="modal-options">
              <h4>Colorway:</h4>
              <div className="options-buttons">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`option-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add Button */}
            <div className="modal-footer-actions">
              <div className="quantity-selector">
                <button
                  id="btn-detail-qty-dec"
                  className="qty-btn"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  id="btn-detail-qty-inc"
                  className="qty-btn"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>

              <button
                id="btn-detail-add"
                className="btn btn-primary add-btn-large"
                onClick={handleAddToCart}
              >
                Add to Cart — ${(discountPrice || price) * quantity}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
