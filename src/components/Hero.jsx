import React, { useState, useEffect } from 'react';
import './Hero.css';

const slides = [
  {
    badge: "✨ Exclusive Seasonal Launch",
    title: "The Future of Sound",
    subtitle: "Experience studio-quality audio with adaptive active noise cancellation, premium memory foam, and up to 50 hours of battery life.",
    cta: "Explore Audio",
    promo: "Use code WELCOME10 for 10% off",
    img: "/images/headphones.png",
    price: "$249",
    name: "Aether Pro Wireless",
    desc: "Best Seller • Studio Audio",
    gradient: "linear-gradient(135deg, hsl(var(--bg-secondary)) 0%, #1e1b4b 100%)", // Deep premium indigo-slate
    accentColor: "var(--primary)"
  },
  {
    badge: "🔥 New Apparel Drop",
    title: "Step Into Premium Style",
    subtitle: "Engineered for maximum street comfort and lightweight responsiveness. Breathable knit mesh with ultra-traction grip.",
    cta: "Shop Sneakers",
    promo: "15% off first order with signup",
    img: "/images/sneakers.png",
    price: "$99",
    name: "Veloce Street Sneakers",
    desc: "Trending Now • Lightweight",
    gradient: "linear-gradient(135deg, hsl(var(--bg-secondary)) 0%, #064e3b 100%)", // Deep forest green
    accentColor: "#10b981"
  },
  {
    badge: "💡 Workspace Elevation",
    title: "Light Up Your Creativity",
    subtitle: "Minimalist brass arch design featuring warm-to-cool gesture controls and an integrated wireless charging pad.",
    cta: "View Desk Accessories",
    promo: "Limited quantities available",
    img: "/images/lamp.png",
    price: "$79",
    name: "Helios Ambient Lamp",
    desc: "Design Piece • Wireless Charging",
    gradient: "linear-gradient(135deg, hsl(var(--bg-secondary)) 0%, #7c2d12 100%)", // Deep warm mahogany orange
    accentColor: "var(--accent)"
  }
];

export default function Hero({ onShopNow }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto rotate slides every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  // Interactive 3D tilt for the active image
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    const rotateX = -(y / (box.height / 2)) * 10;
    const rotateY = (x / (box.width / 2)) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="hero">
      <div 
        className="hero-slides-track" 
        style={{ 
          transform: `translateX(-${currentSlide * 33.3333}%)`,
          width: '300%'
        }}
      >
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className="hero-slide"
            style={{ 
              width: '33.3333%'
            }}
          >
            {/* Background glow and floating particles */}
            <div className="hero-glow-1"></div>
            <div className="hero-glow-2"></div>
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>

            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-sparkle">✨</span>
                <span>{slide.badge}</span>
              </div>
              
              <h1 className="hero-title">{slide.title}</h1>
              
              <p className="hero-subtitle">{slide.subtitle}</p>

              <div className="hero-actions">
                <button 
                  id={`btn-hero-cta-${idx}`}
                  className="btn btn-primary btn-lg" 
                  onClick={onShopNow}
                >
                  Explore Catalog
                  <span className="btn-arrow">→</span>
                </button>
                
                <div className="promo-tag">
                  <span className="promo-dot"></span>
                  {slide.promo}
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card-wrapper">
                <div 
                  className="hero-card glass-panel interactive-tilt-card"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`,
                    transition: tilt.x === 0 ? 'transform 0.5s ease' : 'none'
                  }}
                >
                  <div className="hero-card-header">
                    <span className="card-badge">Featured</span>
                    <span className="card-price">{slide.price}</span>
                  </div>
                  <img src={slide.img} alt={slide.name} className="hero-card-img" />
                  <div className="hero-card-info">
                    <h3>{slide.name}</h3>
                    <p>{slide.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        id="btn-carousel-prev"
        className="carousel-arrow prev-arrow" 
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        ‹
      </button>
      <button 
        id="btn-carousel-next"
        className="carousel-arrow next-arrow" 
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {slides.map((_, idx) => (
          <span 
            key={idx} 
            className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(idx);
            }}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
