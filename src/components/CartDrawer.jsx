import React, { useState } from 'react';
import './CartDrawer.css';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Calculate prices
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.discountPrice || item.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  // Apply Coupon Code
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoSuccess('Coupon WELCOME10 applied! 10% off.');
      setPromoError('');
    } else if (promoCode.trim() === '') {
      setPromoError('Please enter a promo code.');
      setPromoSuccess('');
    } else {
      setPromoError('Invalid promo code.');
      setPromoSuccess('');
    }
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer glass-panel anim-slide-left" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <h2>Your Cart ({cartItems.length})</h2>
          <button id="btn-close-cart" className="cart-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Cart items list */}
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <span className="empty-cart-icon" style={{ display: 'inline-flex', color: 'hsl(var(--text-muted))' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </span>
              <h3>Your cart is empty</h3>
              <p>Explore our premium collections and add products to your cart.</p>
              <button id="btn-cart-empty-shop" className="btn btn-primary" onClick={onClose}>
                Go Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = item.discountPrice || item.price;
              return (
                <div key={`${item.id}-${item.selectedColor}`} className="cart-item">
                  <div className="cart-item-img-wrapper">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <span className="cart-item-option">Color: {item.selectedColor}</span>
                    <span className="cart-item-price">${itemPrice} each</span>

                    <div className="cart-item-actions">
                      <div className="cart-qty-selector">
                        <button
                          id={`btn-cart-dec-${item.id}`}
                          className="cart-qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button
                          id={`btn-cart-inc-${item.id}`}
                          className="cart-qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        id={`btn-cart-remove-${item.id}`}
                        className="cart-remove-link"
                        onClick={() => onRemoveItem(item.id, item.selectedColor)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    ${itemPrice * item.quantity}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer calculations & checkout */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code input */}
            <form className="promo-form" onSubmit={handleApplyPromo}>
              <input
                id="promo-input"
                type="text"
                placeholder="Promo Code (WELCOME10)"
                className="input-field promo-input-field"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button id="btn-apply-promo" type="submit" className="btn btn-secondary promo-btn">
                Apply
              </button>
            </form>
            {promoError && <p className="promo-message error">{promoError}</p>}
            {promoSuccess && <p className="promo-message success">{promoSuccess}</p>}

            <hr className="footer-divider" />

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            
            {discountPercent > 0 && (
              <div className="summary-row discount-row">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount}</span>
              </div>
            )}
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <button
              id="btn-cart-checkout"
              className="btn btn-accent checkout-btn-large"
              onClick={() => onCheckout({ subtotal, discountPercent, discountAmount, total, cartItems })}
            >
              Secure Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
