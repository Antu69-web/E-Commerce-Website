import React, { useState } from 'react';
import './SettingsModal.css';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDatabase,
  onPlaySound,
  onOpenAdmin
}) {
  if (!isOpen) return null;

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)', symbol: '$', rate: 1 },
    { code: 'BDT', name: 'Bangladeshi Taka (৳)', symbol: '৳', rate: 120 },
    { code: 'EUR', name: 'Euro (€)', symbol: '€', rate: 0.92 },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£', rate: 0.78 }
  ];

  const themes = [
    { id: 'light', name: 'Light Mode', icon: '☀️' },
    { id: 'dark', name: 'Dark Mode', icon: '🌙' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '👾' },
    { id: 'amoled', name: 'AMOLED Black', icon: '🌌' }
  ];

  const [name, setName] = useState(settings.name || '');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(settings.currency.code);
  const [selectedTheme, setSelectedTheme] = useState(settings.theme);
  const [soundEffects, setSoundEffects] = useState(settings.soundEffects);

  const handleSave = (e) => {
    e.preventDefault();
    const newCurrency = currencies.find(c => c.code === selectedCurrencyCode) || currencies[0];
    onUpdateSettings({
      name: name.trim(),
      currency: newCurrency,
      theme: selectedTheme,
      soundEffects
    });
    onPlaySound('success');
    onClose();
  };

  const handleResetClick = () => {
    if (window.confirm('WARNING: This will restore default store products and clear your shopping cart, order history, and custom settings. Do you want to proceed?')) {
      onResetDatabase();
      onClose();
    }
  };

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    onPlaySound('click');
  };

  const handleToggleSound = () => {
    const nextVal = !soundEffects;
    setSoundEffects(nextVal);
    if (nextVal) {
      // Play a quick test sound if toggling on
      setTimeout(() => {
        onPlaySound('click', true); // Force play click sound
      }, 50);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="settings-content glass-panel anim-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ System Settings</h2>
          <button id="btn-close-settings" className="settings-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSave} className="settings-form">
          <div className="form-group">
            <label htmlFor="settings-name">Profile / Customer Name</label>
            <input
              id="settings-name"
              type="text"
              className="input-field"
              placeholder="Your Name (e.g. John)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-currency">Store Currency</label>
            <select
              id="settings-currency"
              className="sort-select w-full"
              value={selectedCurrencyCode}
              onChange={(e) => {
                setSelectedCurrencyCode(e.target.value);
                onPlaySound('click');
              }}
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Interface Theme Mode</label>
            <div className="theme-grid">
              {themes.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-card-btn ${selectedTheme === t.id ? 'active' : ''}`}
                  onClick={() => handleThemeChange(t.id)}
                >
                  <span className="theme-card-icon">{t.icon}</span>
                  <span className="theme-card-name">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group sound-toggle-group">
            <div className="sound-toggle-label">
              <span>Interactive Audio Synthesizer</span>
              <p className="subtext">Play micro-synthesizer beeps on clicks and action successes.</p>
            </div>
            <label className="toggle-switch">
              <input
                id="settings-sound-toggle"
                type="checkbox"
                checked={soundEffects}
                onChange={handleToggleSound}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="form-group admin-section-group">
            <label>Administration</label>
            <button
              id="btn-settings-admin"
              type="button"
              className="btn btn-secondary w-full admin-panel-trigger-btn"
              onClick={() => {
                onOpenAdmin();
                onClose();
              }}
            >
              🔐 Access Admin Panel
            </button>
          </div>

          <div className="settings-actions">
            <button
              id="btn-settings-reset"
              type="button"
              className="btn btn-secondary reset-btn"
              onClick={handleResetClick}
            >
              Wipe Database
            </button>
            <button id="btn-settings-save" type="submit" className="btn btn-primary save-btn">
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
