import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  useEffect(() => {
    // Shared animation helper available globally
    window.animateCard = function(card, show = true, delay = 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          if (show) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              resolve();
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
              resolve();
            }, 300);
          }
        }, delay);
      });
    };

    window.animateCards = function(cards, show = true) {
      return Promise.all(cards.map((card, index) => 
        animateCard(card, show, index * 50)
      ));
    };

    // Sort dropdown functionality
    const sortBtn = document.querySelector('.sort-dropdown-btn');
    const sortDropdown = document.querySelector('.sort-dropdown');
    const sortOptions = document.querySelectorAll('.sort-option');
    const productContainer = document.querySelector('.grid');
    let originalOrder = null;

    // Helper function to get products in current order
    function getProducts() {
      return Array.from(document.querySelectorAll('.product-card'));
    }

    // Store original order when first sort is clicked
    function storeOriginalOrder() {
      if (!originalOrder) {
        originalOrder = getProducts();
      }
    }

    // Sort products by given criteria
    function sortProducts(criteria) {
      storeOriginalOrder();
      const products = getProducts();
      
      // Guard against empty product array
      if (!products.length) {
        console.warn('No products to sort');
        return;
      }
      
      const container = products[0].parentElement;

      // Remove all products from DOM temporarily
      products.forEach(product => product.remove());

      // Sort products based on criteria
      let sortedProducts;
      switch(criteria) {
        case 'newest':
          sortedProducts = products.sort((a, b) => 
            parseInt(b.dataset.dateTs) - parseInt(a.dataset.dateTs));
          break;
        case 'default':
          sortedProducts = [...originalOrder];
          break;
      }

      // Reinsert products and animate them
      sortedProducts.forEach(product => {
        container.appendChild(product);
        product.style.opacity = '0';
        product.style.transform = 'translateY(20px)';
      });

      // Animate all products and update filter state after animation
      animateCards(sortedProducts, true).then(() => {
        if (typeof updateProducts === 'function') {
          updateProducts();
        }
      });
    }

    // Add click handler for sort button
    sortBtn.addEventListener('click', function() {
      sortDropdown.classList.toggle('hidden');
    });

    // Add click handlers for sort options
    sortOptions.forEach(option => {
      option.addEventListener('click', function() {
        const value = this.dataset.value;
        const text = this.textContent;
        sortBtn.querySelector('span').textContent = text;
        sortDropdown.classList.add('hidden');
        sortProducts(value);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!sortBtn.contains(e.target) && !sortDropdown.contains(e.target)) {
        sortDropdown.classList.add('hidden');
      }
    });

    // Search and product interactions
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');

    function animateCards(cards, show = true) {
      cards.forEach((card, index) => {
        setTimeout(() => {
          if (show) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
          }
        }, index * 50);
      });
    }

    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
      const searchTerm = this.value;
      clearTimeout(searchTimeout);
      this.classList.add('animate-pulse-soft');
      searchTimeout = setTimeout(() => {
        if (typeof updateProducts === 'function') {
          updateProducts();
        }
        this.classList.remove('animate-pulse-soft');
      }, 150);
    });

    productCards.forEach(card => {
      card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      });
      const image = card.querySelector('.product-image');
      card.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.08) translateY(-2%)';
      });
      card.addEventListener('mouseleave', () => {
        image.style.transform = '';
      });
    });

    animateCards(productCards);

    // Filter functionality
    const brandRadios = document.querySelectorAll('input[name="brand"]');
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    const productCountDisplay = document.getElementById('productCount');
    
    function animateCard(card, show, delay = 0) {
      setTimeout(() => {
        if (show) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      }, delay);
    }

    // Expose updateProducts globally
    window.updateProducts = function() {
      const selectedBrand = document.querySelector('input[name="brand"]:checked').value;
      const selectedCategory = document.querySelector('input[name="category"]:checked').value;
      let visibleCount = 0;

      // Get current search term if any
      const searchInput = document.getElementById('searchInput');
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

      productCards.forEach((card, index) => {
        const brand = card.dataset.brand;
        const category = card.dataset.category;
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const brandKey = card.dataset.brand;
        
        // Map brand keys to human-readable labels for search
        const brandLabels = {
          'best': 'best',
          'action': 'action',
          'brilliant': 'brilliant',
          'chinese': 'chinese',
          'walkaroo': 'walkaroo'
        };
        
        const matchesBrand = selectedBrand === 'all' || brand === selectedBrand;
        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        const matchesSearch = !searchTerm || 
          productName.includes(searchTerm) || 
          brandKey.includes(searchTerm) || 
          (brandLabels[brandKey] && brandLabels[brandKey].includes(searchTerm));
        
        const shouldShow = matchesBrand && matchesCategory && matchesSearch;
        
        if (shouldShow) {
          visibleCount++;
          animateCard(card, true, index * 50);
        } else {
          animateCard(card, false, index * 30);
        }
      });

      // Update product count display
      productCountDisplay.textContent = `Showing ${visibleCount} product${visibleCount !== 1 ? 's' : ''}`;
    }

    // Add change event listeners for filters
    brandRadios.forEach(radio => {
      radio.addEventListener('change', updateProducts);
    });

    categoryRadios.forEach(radio => {
      radio.addEventListener('change', updateProducts);
    });

    // Integrate with existing search functionality
    const originalSearchHandler = searchInput.oninput;
    searchInput.oninput = function(e) {
      clearTimeout(this.searchTimeout);
      this.classList.add('animate-pulse-soft');
      
      this.searchTimeout = setTimeout(() => {
        updateProducts();
        this.classList.remove('animate-pulse-soft');
      }, 150);
    };

    // Initial update to set correct product count and apply default filter state
    updateProducts();

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const handleMobileMenuClick = () => {
      mobileMenu?.classList.toggle('hidden');
    };

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', handleMobileMenuClick);
    }

    // Mobile filter
    const filterBtn = document.getElementById('mobile-filter-btn');
    const closeFilterBtn = document.getElementById('close-filter-btn');
    const filterPanel = document.getElementById('filters-panel');
    const filterOverlay = document.getElementById('filter-overlay');
    let isFilterOpen = false;

    function openFilter() {
      filterPanel.classList.remove('-translate-x-full');
      filterOverlay.classList.remove('hidden');
      setTimeout(() => filterOverlay.classList.remove('opacity-0'), 10);
      document.body.style.overflow = 'hidden';
      filterBtn.setAttribute('aria-expanded', 'true');
      isFilterOpen = true;
    }

    function closeFilter() {
      filterPanel.classList.add('-translate-x-full');
      filterOverlay.classList.add('opacity-0');
      setTimeout(() => filterOverlay.classList.add('hidden'), 300);
      document.body.style.overflow = '';
      filterBtn.setAttribute('aria-expanded', 'false');
      isFilterOpen = false;
    }

    filterBtn.addEventListener('click', openFilter);
    closeFilterBtn.addEventListener('click', closeFilter);
    filterOverlay.addEventListener('click', closeFilter);

    // Close filter panel on window resize if it reaches desktop breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && isFilterOpen) {
        closeFilter();
      }
    });

    // Handle escape key to close filter panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isFilterOpen) {
        closeFilter();
      }
    });

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

    // Smooth scroll
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

    // Ensure initial state is set after all other scripts have loaded
    setTimeout(updateProducts, 0);

    return () => {
      if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener('click', handleMobileMenuClick);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div id="brand-1"></div>
      <div id="brand-2"></div>
      <div id="brand-3"></div>
      <div id="brand-4"></div>
      
      <header className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-secondary mb-4">All Products</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our complete collection of premium footwear from all brands</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-search-line"></i>
                </div>
              </div>
              <input type="text" id="searchInput" className="search-focus search-input-animation w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm placeholder-gray-500 transition-all duration-200" placeholder="Search products, brands..." />
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Overlay */}
          <div id="filter-overlay" className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden hidden transition-opacity duration-300 ease-in-out"></div>
          
          <aside id="filters-panel" role="dialog" aria-modal="true" aria-labelledby="filters-title" className="fixed lg:relative inset-y-0 left-0 z-50 w-80 lg:w-64 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out lg:flex-shrink-0 h-full lg:h-auto overflow-y-auto">
            <div className="bg-white h-full rounded-none lg:rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 id="filters-title" className="text-lg font-semibold text-secondary">Filters</h2>
                <button id="close-filter-btn" className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-secondary mb-4">Brand</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="brand" value="all" className="custom-radio mr-3" defaultChecked />
                      <span className="text-sm text-gray-700">All</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="brand" value="best" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">BEST</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="brand" value="walkaroo" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">Walkaroo</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="brand" value="action" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">Action</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="brand" value="brilliant" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">Brilliant</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="brand" value="chinese" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">Chinese</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary mb-4">Category</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="category" value="all" className="custom-radio mr-3" defaultChecked />
                      <span className="text-sm text-gray-700">All</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="category" value="kids" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">Kids</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="category" value="mens" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">Men's</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="category" value="womens" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">Women's</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="category" value="unisex" className="custom-radio mr-3" />
                      <span className="text-sm text-gray-700">Unisex</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <p id="productCount" className="text-gray-600">Showing 8 products</p>
                <button id="mobile-filter-btn" aria-expanded="false" className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-gray-300 transition-colors">
                  <i className="ri-filter-3-line"></i>
                  <span>Filters</span>
                </button>
              </div>
              <div className="relative w-full sm:w-auto">
                <button className="sort-dropdown-btn flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-gray-300 transition-colors w-full sm:w-auto">
                  <span>Default</span>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-down-s-line text-gray-500"></i>
                  </div>
                </button>
                <div className="sort-dropdown absolute right-0 left-0 sm:left-auto top-full mt-1 w-full sm:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 hidden">
                  <div className="py-1">
                    <button className="sort-option w-full text-left px-4 py-2 text-sm hover:bg-gray-50" data-value="default">Default</button>
                    <button className="sort-option w-full text-left px-4 py-2 text-sm hover:bg-gray-50" data-value="newest">Newest First</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Link to="/product" className="product-card bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" data-brand="best" data-category="mens" data-date="2024-12-15T00:00:00Z" data-date-ts="1734038400000">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-secondary text-white px-2 py-1 rounded text-xs font-medium">BEST</span>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img src="https://readdy.ai/api/search-image?query=Premium%20black%20leather%20comfort%20PU%20slippers%20for%20men%2C%20professional%20footwear%2C%20clean%20white%20background%2C%20product%20photography%2C%20modern%20minimalist%20style%2C%20high%20quality%20materials%2C%20comfortable%20design&width=300&height=300&seq=1&orientation=squarish"
                      alt="Premium Comfort PU Slippers" className="product-image w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="p-4 product-info-wrapper">
                  <h3 className="font-medium text-secondary mb-1">Premium Comfort PU Slippers</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-orange-400">
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/product" className="product-card bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" data-brand="action" data-category="womens" data-date="2024-12-20T00:00:00Z" data-date-ts="1734470400000">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">Action</span>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img src="https://readdy.ai/api/search-image?query=Womens%20black%20EVA%20casual%20footwear%2C%20lightweight%20comfortable%20shoes%2C%20modern%20design%2C%20clean%20white%20background%2C%20product%20photography%2C%20sleek%20minimalist%20style%2C%20durable%20materials&width=300&height=300&seq=2&orientation=squarish"
                      alt="Women's EVA Casual Footwear" className="product-image w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-secondary mb-1">Women's EVA Casual Footwear</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-orange-400">
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/product" className="product-card bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" data-brand="brilliant" data-category="kids" data-date="2024-12-25T00:00:00Z" data-date-ts="1734902400000">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">Brilliant</span>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img src="https://readdy.ai/api/search-image?query=Kids%20premium%20colorful%20sneakers%2C%20childrens%20athletic%20footwear%2C%20vibrant%20colors%2C%20comfortable%20design%2C%20clean%20white%20background%2C%20product%20photography%2C%20modern%20style%2C%20high%20quality%20materials&width=300&height=300&seq=3&orientation=squarish"
                      alt="Kids Premium Sneakers" className="product-image w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-secondary mb-1">Kids Premium Sneakers</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-orange-400">
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/product" className="product-card bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" data-brand="chinese" data-category="unisex" data-date="2024-12-10T00:00:00Z" data-date-ts="1733606400000">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">Chinese</span>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img src="https://readdy.ai/api/search-image?query=Summer%20flip-flops%20colorful%20beach%20sandals%2C%20casual%20footwear%2C%20bright%20tropical%20colors%2C%20comfortable%20design%2C%20clean%20white%20background%2C%20product%20photography%2C%20modern%20style%2C%20lightweight%20materials&width=300&height=300&seq=4&orientation=squarish"
                      alt="Summer Flip-Flops" className="product-image w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-secondary mb-1">Summer Flip-Flops</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-orange-400">
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/product" className="product-card bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" data-brand="walkaroo" data-category="mens" data-date="2024-12-05T00:00:00Z" data-date-ts="1733174400000">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">Walkaroo</span>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img src="https://readdy.ai/api/search-image?query=Mens%20formal%20leather%20dress%20shoes%2C%20professional%20business%20footwear%2C%20classic%20black%20design%2C%20clean%20white%20background%2C%20product%20photography%2C%20elegant%20style%2C%20premium%20materials%2C%20sophisticated%20look&width=300&height=300&seq=5&orientation=squarish"
                      alt="Men's Formal Leather Shoes" className="product-image w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-secondary mb-1">Men's Formal Leather Shoes</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-orange-400">
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-line text-sm"></i>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/product" className="product-card bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" data-brand="best" data-category="womens" data-date="2024-12-28T00:00:00Z" data-date-ts="1735161600000">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-secondary text-white px-2 py-1 rounded text-xs font-medium">BEST</span>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img src="https://readdy.ai/api/search-image?query=Womens%20athletic%20running%20shoes%2C%20sports%20footwear%2C%20modern%20design%2C%20breathable%20materials%2C%20clean%20white%20background%2C%20product%20photography%2C%20performance%20style%2C%20comfortable%20fit&width=300&height=300&seq=6&orientation=squarish"
                      alt="Women's Athletic Running Shoes" className="product-image w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-secondary mb-1">Women's Athletic Running Shoes</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-orange-400">
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-half-line text-sm"></i>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/product" className="product-card bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" data-brand="action" data-category="kids" data-date="2024-12-18T00:00:00Z" data-date-ts="1734297600000">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">Action</span>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img src="https://readdy.ai/api/search-image?query=Kids%20school%20shoes%20black%20leather%2C%20childrens%20formal%20footwear%2C%20durable%20construction%2C%20clean%20white%20background%2C%20product%20photography%2C%20classic%20style%2C%20comfortable%20design%20for%20daily%20wear&width=300&height=300&seq=7&orientation=squarish"
                      alt="Kids School Shoes" className="product-image w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-secondary mb-1">Kids School Shoes</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-orange-400">
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/product" className="product-card bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" data-brand="brilliant" data-category="mens" data-date="2024-12-22T00:00:00Z" data-date-ts="1734643200000">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">Brilliant</span>
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img src="https://readdy.ai/api/search-image?query=Mens%20casual%20canvas%20sneakers%2C%20comfortable%20everyday%20footwear%2C%20modern%20design%2C%20versatile%20style%2C%20clean%20white%20background%2C%20product%20photography%2C%20trendy%20look%2C%20durable%20materials&width=300&height=300&seq=8&orientation=squarish"
                      alt="Men's Casual Canvas Sneakers" className="product-image w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-secondary mb-1">Men's Casual Canvas Sneakers</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-orange-400">
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-fill text-sm"></i>
                      <i className="ri-star-line text-sm"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .filter-animation {
          transition: all 0.3s ease-in-out;
        }

        .product-card {
          transition: all 0.3s ease-in-out, background-color 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
          position: relative;
          overflow: hidden;
        }

        .product-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.05), transparent);
          transition: height 0.3s ease;
          z-index: 1;
        }

        .product-card:hover {
          background-color: #fafafa;
        }

        .product-card:hover::after {
          height: 100%;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-input-animation {
          transition: all 0.3s ease;
        }

        .search-input-animation:focus {
          transform: scale(1.02);
          box-shadow: 0 0 20px rgba(224, 47, 38, 0.1);
        }

        .product-image {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease;
          transform-origin: center center;
        }

        .product-card:hover .product-image {
          transform: scale(1.12) translateY(-2%);
          filter: brightness(1.08) contrast(1.05);
        }

        .product-info-wrapper {
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-info-wrapper {
          transform: translateY(-4px);
        }

        .animate-pulse-soft {
          animation: pulseSoft 2s infinite;
        }

        @keyframes pulseSoft {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-image {
          transition: transform 0.3s ease-in-out;
        }

        .search-focus:focus {
          outline: none;
          border-color: #e02f26;
          box-shadow: 0 0 0 3px rgba(224, 47, 38, 0.1);
        }

        .custom-radio {
          appearance: none;
          width: 1rem;
          height: 1rem;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
        }

        .custom-radio:checked {
          border-color: #e02f26;
          background-color: #e02f26;
        }

        .custom-radio:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
        }

        .dropdown-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
        }

        .dropdown-content.open {
          max-height: 200px;
        }
      `}</style>
    </div>
  );
};

export default SearchPage;