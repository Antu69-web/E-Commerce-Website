import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

export default function Header({
  products = [],
  onSelectProduct,
  cartCount,
  cartBump = false,
  onCartOpen,
  searchQuery,
  onSearchChange,
  activeView,
  onViewChange,
  onLogoClick,
  selectedCategory = 'All',
  onSettingsOpen,
  formatPrice = (p) => `$${p}`
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Filter products based on search query
  const suggestions = searchQuery.trim() !== '' 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Limit to 5 suggestions
    : [];

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (product) => {
    onSelectProduct(product);
    setShowSuggestions(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      e.target.blur();
      if (activeView !== 'shop') {
        onViewChange('shop');
      }
      setTimeout(() => {
        const target = document.getElementById('catalog-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <header className="header glass-panel">
      <div className="header-container">
        {/* Brand Logo & Name */}
        <div className="brand" onClick={onLogoClick} title="Refresh / Home">
          <img src="/images/logo.png" alt="SHOPBD Logo" className="brand-logo-img" />
          <span className="logo-text">SHOPBD</span>
        </div>

        {/* Search Bar with Autocomplete Suggestions */}
        <div className="search-wrapper" ref={searchContainerRef}>
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Search premium products..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleSearchKeyDown}
          />

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && searchQuery.trim() !== '' && (
            <div className="suggestions-dropdown glass-panel">
              {suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <div className="suggestion-img-wrapper">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="suggestion-info">
                      <span className="suggestion-name">{product.name}</span>
                      <span className="suggestion-meta">{product.category}</span>
                    </div>
                    <span className="suggestion-price">
                      {formatPrice(product.discountPrice || product.price)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="no-suggestions">No matches found</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="actions">
          <button
            id="btn-view-home"
            className={`nav-btn ${activeView === 'shop' && searchQuery === '' && selectedCategory === 'All' ? 'active' : ''}`}
            onClick={onLogoClick}
          >
            Home
          </button>

          <button
            id="btn-view-shop"
            className={`nav-btn ${activeView === 'shop' && (searchQuery !== '' || selectedCategory !== 'All') ? 'active' : ''}`}
            onClick={() => onViewChange('shop')}
          >
            Shop
          </button>
          
          <button
            id="btn-view-orders"
            className={`nav-btn ${activeView === 'orders' ? 'active' : ''}`}
            onClick={() => onViewChange('orders')}
          >
            Orders
          </button>



          {/* Settings Button */}
          <button
            id="btn-settings-toggle"
            className="action-btn settings-btn"
            onClick={onSettingsOpen}
            title="Open Settings"
          >
            ⚙️
          </button>

          {/* Cart Button */}
          <button
            id="btn-cart-toggle"
            className={`action-btn cart-btn btn-primary ${cartBump ? 'bump' : ''}`}
            onClick={onCartOpen}
          >
            <span className="cart-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </span>
            <span className="cart-label">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
