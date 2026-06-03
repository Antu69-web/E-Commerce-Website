import React from 'react';
import './BottomNavigation.css';

export default function BottomNavigation({
  activeView,
  onViewChange,
  cartCount,
  onCartOpen,
  onSettingsOpen
}) {
  return (
    <nav className="bottom-nav glass-panel">
      <button 
        className={`bottom-nav-item ${activeView === 'shop' ? 'active' : ''}`}
        onClick={() => onViewChange('shop')}
      >
        <span className="bottom-nav-icon" style={{ display: 'inline-flex', marginBottom: '2px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </span>
        <span className="bottom-nav-label">For You</span>
      </button>

      <button 
        className="bottom-nav-item"
        onClick={onCartOpen}
      >
        <div className="bottom-nav-icon-wrapper">
          <span className="bottom-nav-icon" style={{ display: 'inline-flex', marginBottom: '2px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </span>
          {cartCount > 0 && (
            <span className="bottom-nav-badge cart-badge-num">{cartCount}</span>
          )}
        </div>
        <span className="bottom-nav-label">Cart</span>
      </button>

      <button 
        className="bottom-nav-item"
        onClick={onSettingsOpen}
      >
        <span className="bottom-nav-icon" style={{ display: 'inline-flex', marginBottom: '2px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </span>
        <span className="bottom-nav-label">Account</span>
      </button>
    </nav>
  );
}
