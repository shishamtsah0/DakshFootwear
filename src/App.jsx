import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import BrandSections from './components/BrandSections'
import Footer from './components/Footer'
import ContactPage from './pages/ContactPage'
import ProductPage from './pages/ProductPage'
import SearchPage from './pages/SearchPage'
import './App.css'

function HomePage() {
  useEffect(() => {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    const handleMobileMenuClick = () => {
      mobileMenu?.classList.toggle('hidden');
    };

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', handleMobileMenuClick);
    }

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Product interactions
    document.querySelectorAll('.product-card').forEach(card => {
      const handleCardClick = function(e) {
        if (!e.target.closest('button')) {
          this.style.transform = 'scale(0.98)';
          setTimeout(() => {
            this.style.transform = '';
          }, 150);
        }
      };
      card.addEventListener('click', handleCardClick);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      const handleAnchorClick = function(e) {
        const href = this.getAttribute('href');
        const isHashLink = href && href.startsWith('#');
        if (!isHashLink) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      anchor.addEventListener('click', handleAnchorClick);
    });

    // Scroll hint functionality
    const scrollers = document.querySelectorAll('[data-scroller]');
    
    scrollers.forEach(scroller => {
      const scrollHint = scroller.querySelector('[data-scroll-hint]');
      
      const updateScrollHint = () => {
        const isAtEnd = Math.abs(
          scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft
        ) < 1;
        if (scrollHint) {
          scrollHint.style.opacity = isAtEnd ? '0' : '1';
        }
      };
      
      scroller.addEventListener('scroll', updateScrollHint);
      updateScrollHint();
      
      window.addEventListener('resize', updateScrollHint);
      
      scroller.addEventListener('focusin', (e) => {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
          productCard.scrollIntoView({
            inline: 'nearest',
            block: 'nearest',
            behavior: 'smooth'
          });
        }
      });
    });

    // Cleanup function
    return () => {
      if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener('click', handleMobileMenuClick);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <HeroSection />
      <BrandSections />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-white text-secondary font-sans overflow-x-hidden">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App