import React, { useState } from 'react';
import './CheckoutModal.jsx'; // styling will be in CheckoutModal.css
import './CheckoutModal.css';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartSummary,
  onOrderSuccess
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  // Shipping Form State
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [shippingErrors, setShippingErrors] = useState({});

  // Payment Form State
  const [payment, setPayment] = useState({
    cardNum: '',
    expiry: '',
    cvv: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  // Generated Order Details State
  const [orderDetails, setOrderDetails] = useState(null);

  // Validate Shipping
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!shipping.name) errors.name = 'Name is required';
    if (!shipping.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) errors.email = 'Email is invalid';
    if (!shipping.address) errors.address = 'Address is required';
    if (!shipping.city) errors.city = 'City is required';
    if (!shipping.zip) errors.zip = 'ZIP code is required';

    if (Object.keys(errors).length > 0) {
      setShippingErrors(errors);
    } else {
      setShippingErrors({});
      setStep(2);
    }
  };

  // Validate Payment & Complete Order
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!payment.cardNum || payment.cardNum.replace(/\s/g, '').length < 16) {
      errors.cardNum = 'Valid 16-digit card number is required';
    }
    if (!payment.expiry || !/^\d\d\/\d\d$/.test(payment.expiry)) {
      errors.expiry = 'MM/YY format required';
    }
    if (!payment.cvv || payment.cvv.length < 3) {
      errors.cvv = '3-digit CVV is required';
    }

    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
    } else {
      setPaymentErrors({});
      
      // Order completed successfully, construct order object
      const orderId = 'SBD-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        shipping: shipping,
        items: cartSummary.cartItems,
        subtotal: cartSummary.subtotal,
        discountPercent: cartSummary.discountPercent,
        discountAmount: cartSummary.discountAmount,
        total: cartSummary.total
      };

      // Save to local storage history
      const prevOrders = JSON.parse(localStorage.getItem('shopbd_orders') || '[]');
      localStorage.setItem('shopbd_orders', JSON.stringify([newOrder, ...prevOrders]));

      setOrderDetails(newOrder);
      setStep(3);
    }
  };

  const handleFinalize = () => {
    onOrderSuccess(); // Clears cart in parent
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="checkout-content glass-panel anim-scale-up">
        {/* Header (except success stage) */}
        {step < 3 && (
          <div className="checkout-header">
            <h2>Secure Checkout</h2>
            <div className="step-indicator">
              <span className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</span>
              <span className="step-line"></span>
              <span className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</span>
            </div>
            <button id="btn-close-checkout" className="checkout-close" onClick={onClose}>
              ✕
            </button>
          </div>
        )}

        <div className="checkout-body">
          {/* STEP 1: SHIPPING FORM */}
          {step === 1 && (
            <div className="checkout-step-container">
              <form onSubmit={handleShippingSubmit} className="checkout-form">
                <h3>Shipping Information</h3>
                
                <div className="form-group">
                  <label htmlFor="ship-name">Full Name</label>
                  <input
                    id="ship-name"
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                  />
                  {shippingErrors.name && <span className="error-text">{shippingErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="ship-email">Email Address</label>
                  <input
                    id="ship-email"
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  />
                  {shippingErrors.email && <span className="error-text">{shippingErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="ship-address">Street Address</label>
                  <input
                    id="ship-address"
                    type="text"
                    className="input-field"
                    placeholder="123 Luxury Ave"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  />
                  {shippingErrors.address && <span className="error-text">{shippingErrors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ship-city">City</label>
                    <input
                      id="ship-city"
                      type="text"
                      className="input-field"
                      placeholder="New York"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    />
                    {shippingErrors.city && <span className="error-text">{shippingErrors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="ship-zip">ZIP Code</label>
                    <input
                      id="ship-zip"
                      type="text"
                      className="input-field"
                      placeholder="10001"
                      value={shipping.zip}
                      onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                    />
                    {shippingErrors.zip && <span className="error-text">{shippingErrors.zip}</span>}
                  </div>
                </div>

                <button id="btn-ship-next" type="submit" className="btn btn-primary checkout-btn-next">
                  Continue to Payment
                </button>
              </form>

              {/* Side Summary */}
              <div className="checkout-summary-panel">
                <h3>Order Summary</h3>
                <div className="summary-list">
                  {cartSummary.cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedColor}`} className="summary-item-row">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.discountPrice || item.price) * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="summary-total-details">
                  <div className="summary-sub-row">
                    <span>Subtotal</span>
                    <span>${cartSummary.subtotal}</span>
                  </div>
                  {cartSummary.discountPercent > 0 && (
                    <div className="summary-sub-row discount">
                      <span>Discount ({cartSummary.discountPercent}%)</span>
                      <span>-${cartSummary.discountAmount}</span>
                    </div>
                  )}
                  <div className="summary-sub-row total">
                    <span>Total</span>
                    <span>${cartSummary.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT FORM */}
          {step === 2 && (
            <div className="checkout-step-container">
              <form onSubmit={handlePaymentSubmit} className="checkout-form">
                <h3>Payment Details</h3>
                
                <div className="form-group">
                  <label htmlFor="pay-card">Card Number</label>
                  <input
                    id="pay-card"
                    type="text"
                    className="input-field"
                    placeholder="4111 2222 3333 4444"
                    maxLength="19"
                    value={payment.cardNum}
                    onChange={(e) => {
                      // auto space formatting
                      const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setPayment({ ...payment, cardNum: val });
                    }}
                  />
                  {paymentErrors.cardNum && <span className="error-text">{paymentErrors.cardNum}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pay-expiry">Expiry Date</label>
                    <input
                      id="pay-expiry"
                      type="text"
                      className="input-field"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={payment.expiry}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.length === 2 && !val.includes('/')) {
                          val += '/';
                        }
                        setPayment({ ...payment, expiry: val });
                      }}
                    />
                    {paymentErrors.expiry && <span className="error-text">{paymentErrors.expiry}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pay-cvv">CVV</label>
                    <input
                      id="pay-cvv"
                      type="password"
                      className="input-field"
                      placeholder="123"
                      maxLength="3"
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                    />
                    {paymentErrors.cvv && <span className="error-text">{paymentErrors.cvv}</span>}
                  </div>
                </div>

                <div className="payment-security-notice">
                  🔒 Your transaction is secured with client-side end-to-end 256-bit encryption. No data is stored on servers.
                </div>

                <div className="form-actions-back-next">
                  <button
                    id="btn-pay-back"
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button id="btn-pay-complete" type="submit" className="btn btn-accent flex-grow-1">
                    Pay Now — ${cartSummary.total}
                  </button>
                </div>
              </form>

              {/* Side Summary */}
              <div className="checkout-summary-panel">
                <h3>Order Summary</h3>
                <div className="summary-list">
                  {cartSummary.cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedColor}`} className="summary-item-row">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.discountPrice || item.price) * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="summary-total-details">
                  <div className="summary-sub-row">
                    <span>Subtotal</span>
                    <span>${cartSummary.subtotal}</span>
                  </div>
                  {cartSummary.discountPercent > 0 && (
                    <div className="summary-sub-row discount">
                      <span>Discount ({cartSummary.discountPercent}%)</span>
                      <span>-${cartSummary.discountAmount}</span>
                    </div>
                  )}
                  <div className="summary-sub-row total">
                    <span>Total</span>
                    <span>${cartSummary.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 3 && orderDetails && (
            <div className="success-container anim-scale-up">
              <div className="success-icon-badge">✓</div>
              <h2>Order Confirmed!</h2>
              <p className="success-tagline">Thank you for your purchase, {orderDetails.shipping.name}.</p>
              
              <div className="order-details-box glass-panel">
                <div className="order-details-row">
                  <span>Order Number</span>
                  <span className="bold-val">{orderDetails.id}</span>
                </div>
                <div className="order-details-row">
                  <span>Date</span>
                  <span>{orderDetails.date}</span>
                </div>
                <div className="order-details-row">
                  <span>Total Amount Paid</span>
                  <span className="bold-val accent-val">${orderDetails.total}</span>
                </div>
                <div className="order-details-row">
                  <span>Shipping Address</span>
                  <span>{orderDetails.shipping.address}, {orderDetails.shipping.city}, {orderDetails.shipping.zip}</span>
                </div>
              </div>

              <p className="success-delivery-notice">
                📦 A shipping confirmation email will be sent shortly. Items will ship within 24-48 business hours.
              </p>

              <button id="btn-success-finalize" className="btn btn-primary success-btn" onClick={handleFinalize}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
