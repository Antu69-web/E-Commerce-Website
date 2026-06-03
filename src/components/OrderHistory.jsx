import React, { useState, useEffect } from 'react';
import './OrderHistory.css';

export default function OrderHistory({ onShopNow }) {
  const [orders, setOrders] = useState([]);

  // Load orders from local storage
  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('shopbd_orders') || '[]');
    setOrders(savedOrders);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Clear orders handler
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to wipe your local order history? This action is permanent.')) {
      localStorage.removeItem('shopbd_orders');
      setOrders([]);
    }
  };

  return (
    <section className="order-history-section anim-fade-in">
      <div className="section-header-row">
        <div>
          <h2>Your Orders</h2>
          <p>View, track, and manage your client-side transaction history.</p>
        </div>
        
        {orders.length > 0 && (
          <button id="btn-wipe-orders" className="btn btn-secondary wipe-history-btn" onClick={handleClearHistory}>
            Wipe Order History
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders-view glass-panel">
          <span className="empty-orders-icon">📜</span>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet. Add items to your cart and proceed to checkout.</p>
          <button id="btn-orders-empty-shop" className="btn btn-primary" onClick={onShopNow}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card glass-panel">
              {/* Card Header Info */}
              <div className="order-card-header">
                <div className="header-meta-group">
                  <span className="meta-label">ORDER PLACED</span>
                  <span className="meta-value">{order.date}</span>
                </div>

                <div className="header-meta-group">
                  <span className="meta-label">TOTAL PAID</span>
                  <span className="meta-value highlight-price">${order.total}</span>
                </div>

                <div className="header-meta-group">
                  <span className="meta-label">SHIP TO</span>
                  <span className="meta-value" title={order.shipping.address}>
                    {order.shipping.name}
                  </span>
                </div>

                <div className="header-meta-right">
                  <span className="meta-label">ORDER ID</span>
                  <span className="meta-value order-id-bold">{order.id}</span>
                </div>
              </div>

              {/* Card Body Products List */}
              <div className="order-card-body">
                <div className="order-status-badge">
                  <span className="status-dot animate-pulse"></span>
                  Status: <strong>Preparing Shipment</strong>
                </div>

                <div className="order-items-list">
                  {order.items.map((item, idx) => (
                    <div key={`${item.id}-${item.selectedColor || idx}`} className="order-product-row">
                      <div className="order-product-img">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="order-product-details">
                        <h4>{item.name}</h4>
                        <p className="order-product-option">Colorway: {item.selectedColor || 'Standard'}</p>
                        <p className="order-product-qty">Qty: {item.quantity}</p>
                      </div>

                      <div className="order-product-price">
                        ${(item.discountPrice || item.price) * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
