import React, { useState } from 'react';
import './AdminPanel.css';

export default function AdminPanel({
  products = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onClose
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Listing filter state
  const [filterCategory, setFilterCategory] = useState('All');

  // Dynamic category extraction
  const defaultCategories = ['Electronics', 'Apparel', 'Accessories', 'Home Decor', 'Toys'];
  const existingCategories = products ? [...new Set(products.map(p => p?.category).filter(Boolean))] : [];
  const allCategories = [...new Set([...defaultCategories, ...existingCategories])];

  // Filter listings based on category selection
  const filteredListings = products.filter(product => 
    filterCategory === 'All' || product.category === filterCategory
  );

  // Custom Category State
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    category: 'Electronics',
    description: '',
    image: '/images/headphones.png',
    tag: '',
    specs: ''
  });

  // Default image suggestions to choose from
  const imagePresets = [
    { label: 'Headphones', value: '/images/headphones.png' },
    { label: 'Smartwatch', value: '/images/smartwatch.png' },
    { label: 'Sneakers', value: '/images/sneakers.png' },
    { label: 'Backpack', value: '/images/backpack.png' },
    { label: 'Desk Lamp', value: '/images/lamp.png' },
    { label: 'Sunglasses', value: '/images/sunglasses.png' },
    { label: 'Keyboard', value: '/images/keyboard.png' },
    { label: 'Vases Set', value: '/images/vases.png' },
    { label: 'Hoodie', value: '/images/hoodie.png' },
    { label: 'Leather Jacket', value: '/images/jacket.png' },
    { label: 'Wool Coat', value: '/images/coat.png' },
    { label: 'Toy Robot', value: '/images/toy_robot.png' },
    { label: 'Toy Drone', value: '/images/toy_drone.png' },
    { label: 'Toy Puzzle', value: '/images/toy_puzzle.png' }
  ];

  // Open modal for adding
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsCustomCategory(false);
    setCustomCategoryText('');
    setFormData({
      name: '',
      price: '',
      discountPrice: '',
      category: 'Electronics',
      description: '',
      image: '/images/headphones.png',
      tag: '',
      specs: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (product) => {
    if (!product) return;
    setEditingProduct(product);
    setIsCustomCategory(false);
    setCustomCategoryText('');

    // Safely parse price and discountPrice to strings, ensuring they are defined
    const priceStr = product.price !== undefined && product.price !== null ? product.price.toString() : '';
    const discountPriceStr = product.discountPrice !== undefined && product.discountPrice !== null ? product.discountPrice.toString() : '';

    // Safely parse specs to a comma-separated string, handling arrays or raw strings
    let specsStr = '';
    if (Array.isArray(product.specs)) {
      specsStr = product.specs.join(', ');
    } else if (typeof product.specs === 'string') {
      specsStr = product.specs;
    }

    setFormData({
      name: product.name || '',
      price: priceStr,
      discountPrice: discountPriceStr,
      category: product.category || 'Electronics',
      description: product.description || '',
      image: product.image || '/images/headphones.png',
      tag: product.tag || '',
      specs: specsStr
    });
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please enter Name and Price.');
      return;
    }

    const finalCategory = isCustomCategory ? customCategoryText.trim() : formData.category;
    if (isCustomCategory && !customCategoryText.trim()) {
      alert('Please specify the custom category name.');
      return;
    }

    const processedProduct = {
      name: formData.name,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      category: finalCategory,
      description: formData.description,
      image: formData.image,
      tag: formData.tag,
      specs: formData.specs ? formData.specs.split(',').map(s => s.trim()).filter(Boolean) : [],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviews: editingProduct ? editingProduct.reviews : 1
    };

    if (editingProduct) {
      // Editing
      onEditProduct(editingProduct.id, processedProduct);
    } else {
      // Adding
      onAddProduct(processedProduct);
    }
    setIsModalOpen(false);
  };

  // Handle Delete Click
  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store listings?`)) {
      onDeleteProduct(id);
    }
  };

  return (
    <div className="admin-panel anim-fade-in">
      <div className="admin-header-row">
        <div>
          <h2>Store Listings Dashboard</h2>
          <p>Visual product manager. Add, edit, and delete products in real-time without touching code.</p>
        </div>
        <div className="admin-actions-group">
          <button id="btn-admin-add" className="btn btn-primary" onClick={handleOpenAdd}>
            + Add New Product
          </button>
          <button id="btn-admin-close" className="btn btn-secondary" onClick={onClose}>
            Back to Shop
          </button>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="admin-filter-row">
        <div className="admin-filter-group">
          <label htmlFor="admin-category-filter">Filter Listings by Category:</label>
          <select
            id="admin-category-filter"
            className="admin-filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {allCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="admin-stats">
          Showing <strong>{filteredListings.length}</strong> of <strong>{products.length}</strong> products
        </div>
      </div>

      {/* Listings Table */}
      <div className="admin-table-wrapper glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Tag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-admin-data">
                  {products.length === 0 
                    ? 'No products in inventory. Click "Add New Product" to start listings.' 
                    : `No products listed under the "${filterCategory}" category.`}
                </td>
              </tr>
            ) : (
              filteredListings.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <div className="admin-table-img">
                      <img src={product.image} alt={product.name} />
                    </div>
                  </td>
                  <td className="bold-cell">{product.name}</td>
                  <td>
                    <span className={`admin-category-badge cat-${(product.category || '').toLowerCase().replace(/\s+/g, '-')}`}>
                      {product.category}
                    </span>
                  </td>
                  <td>
                    {product.discountPrice ? (
                      <div className="admin-price-cell">
                        <span className="disc-price">${product.discountPrice}</span>
                        <span className="orig-price">${product.price}</span>
                      </div>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </td>
                  <td>
                    {product.tag ? (
                      <span className="badge badge-accent">{product.tag}</span>
                    ) : (
                      <span className="admin-no-tag">—</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        id={`btn-admin-edit-${product.id}`}
                        className="btn-admin-row edit-row"
                        onClick={() => handleOpenEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        id={`btn-admin-del-${product.id}`}
                        className="btn-admin-row delete-row"
                        onClick={() => handleDeleteClick(product.id, product.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL FORM */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="admin-modal-content glass-panel anim-scale-up">
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Product Listings' : 'List New Product'}</h3>
              <button id="btn-admin-modal-close" className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label htmlFor="prod-name">Product Name *</label>
                <input
                  id="prod-name"
                  type="text"
                  className="input-field"
                  placeholder="e.g., Vanguard Leather Sleeve"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prod-category">Category *</label>
                  <select
                    id="prod-category"
                    className="sort-select"
                    value={isCustomCategory ? 'custom' : formData.category}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'custom') {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setFormData({ ...formData, category: val });
                      }
                    }}
                  >
                    {allCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="custom">+ Create New Category...</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="prod-tag">Promo Tag Badge</label>
                  <input
                    id="prod-tag"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Sale, New, Best Seller"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  />
                </div>
              </div>

              {/* Show text input only if custom category selected */}
              {isCustomCategory && (
                <div className="form-group anim-scale-up">
                  <label htmlFor="prod-custom-category">Custom Category Name *</label>
                  <input
                    id="prod-custom-category"
                    type="text"
                    className="input-field"
                    placeholder="Enter new category name (e.g., Books, Cosmetics)"
                    value={customCategoryText}
                    onChange={(e) => setCustomCategoryText(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prod-price">Price ($) *</label>
                  <input
                    id="prod-price"
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="299.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-disc-price">Discount Price ($)</label>
                  <input
                    id="prod-disc-price"
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="249.00 (optional)"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prod-image">Image Template / Link</label>
                <div className="image-select-row">
                  <select
                    id="prod-image-preset"
                    className="sort-select"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  >
                    {imagePresets.map(preset => (
                      <option key={preset.value} value={preset.value}>{preset.label}</option>
                    ))}
                    <option value="custom">Custom URL Link...</option>
                  </select>

                  {/* Show text input only if custom URL selected */}
                  {!imagePresets.some(p => p.value === formData.image) && (
                    <input
                      id="prod-image-url"
                      type="text"
                      className="input-field"
                      placeholder="Paste online image URL..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prod-description">Product Description</label>
                <textarea
                  id="prod-description"
                  className="input-field"
                  rows="3"
                  placeholder="Describe the product features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-specs">Specifications (comma separated)</label>
                <input
                  id="prod-specs"
                  type="text"
                  className="input-field"
                  placeholder="e.g., ANC Wireless, 50 Hours Battery, Fast Charge"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                />
              </div>

              <button id="btn-admin-submit" type="submit" className="btn btn-primary admin-submit-btn">
                {editingProduct ? 'Save Listing Changes' : 'Publish Product Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
