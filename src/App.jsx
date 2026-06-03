import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistory from './components/OrderHistory';
import AdminPanel from './components/AdminPanel';
import SettingsModal from './components/SettingsModal';
import BottomNavigation from './components/BottomNavigation';
import { products } from './data/products';
import './App.css';

export default function App() {
  // Theme state (Dark Mode by default for premium feel)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shopbd_theme') || 'dark';
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('shopbd_cart') || '[]');
  });

  // View state: 'shop' or 'orders'
  const [activeView, setActiveView] = useState('shop');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // System Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('shopbd_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Valued Customer',
      currency: { code: 'USD', name: 'US Dollar ($)', symbol: '$', rate: 1 },
      theme: 'dark',
      soundEffects: true
    };
  });

  // Navigation states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Audio Synthesizer (synthesizes micro beeps and steam white noise)
  const playSound = (type, force = false) => {
    if (!settings.soundEffects && !force) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.error('Audio synthesizer error:', e);
    }
  };

  // Currency price formatter helper
  const formatPrice = (p) => {
    const rate = settings.currency?.rate || 1;
    const symbol = settings.currency?.symbol || '$';
    return `${symbol}${Math.round(p * rate)}`;
  };

  // Load products list from LocalStorage if exists, else load mock database
  const [storeProducts, setStoreProducts] = useState(() => {
    const saved = localStorage.getItem('shopbd_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If we added new default products (e.g. Toys) that are missing from saved, merge them
      const savedIds = new Set(parsed.map(p => p.id));
      const missingDefaults = products.filter(p => !savedIds.has(p.id));
      if (missingDefaults.length > 0) {
        const merged = [...parsed, ...missingDefaults];
        localStorage.setItem('shopbd_products', JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    localStorage.setItem('shopbd_products', JSON.stringify(products));
    return products;
  });

  // Sync storeProducts to LocalStorage
  useEffect(() => {
    localStorage.setItem('shopbd_products', JSON.stringify(storeProducts));
  }, [storeProducts]);

  // Add Product Handler
  const handleAddProduct = (newProd) => {
    const nextId = storeProducts.length > 0 
      ? Math.max(...storeProducts.map(p => p.id)) + 1 
      : 1;
    const finalProd = { ...newProd, id: nextId };
    setStoreProducts(prev => [...prev, finalProd]);
    showToast(`Added ${finalProd.name} to store!`);
  };

  // Edit Product Handler
  const handleEditProduct = (id, updatedFields) => {
    setStoreProducts(prev => 
      prev.map(p => p.id === id ? { ...updatedFields, id } : p)
    );
    showToast(`Updated ${updatedFields.name} details!`);
  };

  // Delete Product Handler
  const handleDeleteProduct = (id) => {
    const targetName = storeProducts.find(p => p.id === id)?.name || 'product';
    setStoreProducts(prev => prev.filter(p => p.id !== id));
    
    // Also clean from cart
    setCart(prev => prev.filter(item => item.id !== id));
    showToast(`Removed ${targetName} from store!`);
  };

  // Modal / Drawer visibility states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [cartBump, setCartBump] = useState(false);

  // Synchronize theme attribute on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shopbd_theme', theme);
    if (settings.theme !== theme) {
      setSettings(prev => ({ ...prev, theme: theme }));
    }
  }, [theme]);

  // Synchronize settings state to localStorage
  useEffect(() => {
    localStorage.setItem('shopbd_settings', JSON.stringify(settings));
  }, [settings]);

  // Synchronize cart state to localStorage
  useEffect(() => {
    localStorage.setItem('shopbd_cart', JSON.stringify(cart));
  }, [cart]);

  // Theme toggle handler
  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    playSound('click');
  };

  // Settings handlers
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    if (newSettings.theme !== theme) {
      setTheme(newSettings.theme);
    }
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('shopbd_products');
    localStorage.removeItem('shopbd_cart');
    localStorage.removeItem('shopbd_orders');
    localStorage.removeItem('shopbd_settings');
    window.location.reload();
  };



  // Add to Cart handler
  const handleAddToCart = (product, quantity = 1, selectedColor = 'Standard') => {
    // If product passed from card doesn't have custom selections
    const targetColor = product.selectedColor || selectedColor;
    const targetQuantity = product.quantity || quantity;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedColor === targetColor
      );

      if (existingItemIndex > -1) {
        // Update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += targetQuantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity: targetQuantity, selectedColor: targetColor }];
      }
    });

    // Provide micro-feedback (custom temporary visual notice)
    showToast(`Added ${product.name} to cart!`);

    // Trigger cart bump animation
    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);
  };

  // Toast feedback helper
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Update Cart Item quantity handler
  const handleUpdateQuantity = (productId, selectedColor, qty) => {
    if (qty <= 0) {
      handleRemoveItem(productId, selectedColor);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  // Remove Cart Item handler
  const handleRemoveItem = (productId, selectedColor) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === productId && item.selectedColor === selectedColor))
    );
  };

  // Checkout initiation
  const handleCheckoutInit = (summary) => {
    setCheckoutSummary(summary);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order success completion
  const handleOrderSuccess = () => {
    setCart([]); // Clear cart
    setActiveView('orders'); // Jump to order history
  };

  // Logo / Home refresh handler
  const handleLogoClick = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('default');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category selection handler
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Smooth scroll down to products grid
    const target = document.getElementById('catalog-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter & Sort products logic
  const filteredProducts = storeProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0; // Default ordering
    });

  // Calculate cart count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = ['All', ...new Set(storeProducts.map(p => p.category))];

  return (
    <div className="app-container" onClick={() => playSound('click')}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification glass-panel anim-scale-up">
          <span className="toast-sparkle">✨</span>
          <span>{toastMessage}</span>
        </div>
      )}



      {/* Header Navigation */}
      <Header
        products={storeProducts}
        onSelectProduct={(prod) => {
          setSelectedProduct(prod);
          setSearchQuery(''); // Clear search on select to restore full catalog view
        }}
        cartCount={cartCount}
        cartBump={cartBump}
        onCartOpen={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === 'shop') {
            setTimeout(() => {
              const target = document.getElementById('catalog-section');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onLogoClick={handleLogoClick}
        selectedCategory={selectedCategory}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        formatPrice={formatPrice}
      />

      {/* Main Container */}
      <main className="main-content">
        
        {activeView === 'shop' && (
          <>
            {/* Promo Hero section */}
            <Hero onShopNow={() => handleCategorySelect('All')} />

            {/* Catalog filter & Search */}
            <section id="catalog-section" className="catalog-section anim-fade-in">
              <div className="catalog-controls">
                {/* Categories Tab buttons */}
                <div className="category-tabs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown Selector */}
                <div className="sort-wrapper">
                  <label htmlFor="sort-select">Sort By</label>
                  <select
                    id="sort-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Products Catalog Grid */}
              {filteredProducts.length === 0 ? (
                <div className="no-results glass-panel">
                  <span className="no-results-icon">🔍</span>
                  <h3>No Products Found</h3>
                  <p>We couldn't find anything matching your search criteria. Try modifying your search or filters.</p>
                </div>
              ) : (
                <div className="products-grid grid grid-cols-2 grid-cols-3 grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={setSelectedProduct}
                      onAddToCart={handleAddToCart}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeView === 'orders' && (
          <OrderHistory onShopNow={() => setActiveView('shop')} formatPrice={formatPrice} />
        )}

        {activeView === 'admin' && (
          <AdminPanel
            products={storeProducts}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onClose={() => setActiveView('shop')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="footer glass-panel">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-brand-wrap">
              <img src="/images/logo.png" alt="SHOPBD Logo" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
              <span className="footer-logo" style={{ marginBottom: 0 }}>SHOPBD</span>
            </div>
            <p>Premium 100% client-side web boutique. Crafted with absolute security and modern aesthetics.</p>
          </div>
          <div className="footer-right">
            <span>© {new Date().getFullYear()} ShopBD Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === 'shop') {
            setTimeout(() => {
              const target = document.getElementById('catalog-section');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
      />

      {/* Sliding Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutInit}
        formatPrice={formatPrice}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
        />
      )}

      {/* Checkout Wizard Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartSummary={checkoutSummary}
          onOrderSuccess={handleOrderSuccess}
          formatPrice={formatPrice}
        />
      )}

      {/* System Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetDatabase={handleResetDatabase}
          onPlaySound={playSound}
          onOpenAdmin={() => {
            setActiveView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

    </div>
  );
}
