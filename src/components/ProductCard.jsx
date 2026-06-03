import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product, onSelect, onAddToCart, formatPrice = (p) => `$${p}` }) {
  const { name, price, discountPrice, rating, reviews, image, tag, category } = product;
  
  // Render star ratings
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
    <div className="product-card glass-panel" onClick={() => onSelect(product)}>
      {/* Product Tag */}
      {tag && (
        <span className={`product-tag ${tag.toLowerCase().replace(' ', '-')}`}>
          {tag}
        </span>
      )}

      {/* Image container */}
      <div className="product-img-wrapper">
        <img src={image} alt={name} className="product-img" loading="lazy" />
        <div className="quick-view-overlay">
          <button
            id={`btn-quick-view-${product.id}`}
            className="btn btn-secondary quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="product-details">
        <span className="product-category">{category}</span>
        
        <h3 className="product-name">{name}</h3>
        
        {/* Rating */}
        <div className="product-rating">
          <div className="stars-container">{renderStars(rating)}</div>
          <span className="reviews-count">({reviews})</span>
        </div>

        {/* Price and Add button */}
        <div className="product-footer">
          <div className="product-price">
            {discountPrice ? (
              <>
                <span className="price-current">{formatPrice(discountPrice)}</span>
                <span className="price-original">{formatPrice(price)}</span>
              </>
            ) : (
              <span className="price-current">{formatPrice(price)}</span>
            )}
          </div>
          
          <button
            id={`btn-add-to-cart-${product.id}`}
            className="add-to-cart-btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            title="Add to Cart"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
