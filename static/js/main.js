/**
 * Platinum Apparel - Ultra Luxury E-commerce
 * Rolex-Inspired Premium Interactions
 */

(function() {
  'use strict';

  // ============================================
  // Utility Functions
  // ============================================

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const hero = document.querySelector('.hero');
  if (hero) setTimeout(() => hero.classList.add('loaded'), 60);

  // ============================================
  // Navigation - Premium Fixed Header
  // ============================================

  const nav = document.getElementById('mainNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const handleNavScroll = () => {
    const currentScrollY = window.scrollY;

    // Add scrolled class
    if (currentScrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Hide/show nav on scroll direction (disabled for now - always visible)
    // if (currentScrollY > lastScrollY && currentScrollY > 300) {
    //   nav.style.transform = 'translateY(-100%)';
    //   navHidden = true;
    // } else {
    //   nav.style.transform = 'translateY(0)';
    //   navHidden = false;
    // }
  };

  // Mobile menu state, focus, and scroll management.
  if (mobileMenuBtn && mobileMenu) {
    const mobileMenuContent = mobileMenu.querySelector('.mobile-menu-content');
    const mobileLinks = Array.from(mobileMenu.querySelectorAll('a'));
    const backgroundTargets = [
      document.getElementById('main-content'),
      document.querySelector('.site-footer'),
      nav?.querySelector('.nav-logo'),
      nav?.querySelector('.nav-search'),
      nav?.querySelector('.nav-cart')
    ].filter(Boolean);

    const setMobileMenuState = (isOpen, restoreFocus = true) => {
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenu.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      backgroundTargets.forEach(target => { target.inert = isOpen; });

      if (isOpen) {
        if (mobileMenuContent) mobileMenuContent.scrollTop = 0;
        requestAnimationFrame(() => mobileLinks[0]?.focus({ preventScroll: true }));
      } else if (restoreFocus) {
        mobileMenuBtn.focus({ preventScroll: true });
      }
    };

    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileMenu.classList.contains('active');

      setMobileMenuState(!isActive);
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => setMobileMenuState(false, false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
        setMobileMenuState(false);
      }
    });

    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
        setMobileMenuState(false, false);
      }
    }, 100));
  }

  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const isCurrent = href === '/' ? currentPath === '/' : currentPath === href || currentPath.startsWith(`${href}/`);
    if (isCurrent) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ============================================
  // Advanced Scroll Animations
  // ============================================

  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  if (animatedElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // Parallax Effect for Hero
  // ============================================

  const heroBackground = document.querySelector('.hero-background');
  const heroContent = document.querySelector('.hero-content');

  let parallaxEnabled = finePointer && window.innerWidth > 768;

  const handleParallax = () => {
    if (!parallaxEnabled || !heroBackground) return;

    const scrolled = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrolled < heroHeight) {
      // Parallax for background
      const bgOffset = scrolled * 0.4;
      heroBackground.style.transform = `translateY(${bgOffset}px)`;

      // Fade and scale content
      if (heroContent) {
        const opacity = 1 - (scrolled / heroHeight) * 1.5;
        const scale = 1 - (scrolled / heroHeight) * 0.1;
        heroContent.style.opacity = clamp(opacity, 0, 1);
        heroContent.style.transform = `scale(${clamp(scale, 0.9, 1)})`;
      }
    }
  };

  if (heroBackground) {
    window.addEventListener('resize', debounce(() => {
      parallaxEnabled = finePointer && window.innerWidth > 768;
    }, 200));
  }

  // Batch all scroll reads and writes into one animation frame.
  let scrollFramePending = false;
  if (nav || heroBackground) {
    window.addEventListener('scroll', () => {
      if (scrollFramePending) return;
      scrollFramePending = true;
      requestAnimationFrame(() => {
        if (nav) handleNavScroll();
        if (heroBackground) handleParallax();
        scrollFramePending = false;
      });
    }, { passive: true });
  }

  // ============================================
  // Counter Animation for Stats
  // ============================================

  const animateCounter = (element) => {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const suffix = element.textContent.replace(/[0-9]/g, '');
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeOutQuart);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  // ============================================
  // Testimonial Carousel - Premium
  // ============================================

  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialDots = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  let currentTestimonial = 0;
  let totalTestimonials = 3;
  let autoplayInterval;

  if (testimonialTrack) {
    totalTestimonials = testimonialTrack.children.length;
  }

  const updateTestimonial = (index, direction = 1) => {
    if (index < 0) index = totalTestimonials - 1;
    if (index >= totalTestimonials) index = 0;

    currentTestimonial = index;

    if (testimonialTrack) {
      testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    }

    if (testimonialDots) {
      const dots = testimonialDots.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTestimonial);
      });
    }
  };

  const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
      updateTestimonial(currentTestimonial + 1);
    }, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  };

  if (testimonialTrack && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      updateTestimonial(currentTestimonial - 1, -1);
      startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      updateTestimonial(currentTestimonial + 1, 1);
      startAutoplay();
    });

    if (testimonialDots) {
      testimonialDots.querySelectorAll('.dot').forEach((dot, i) => {
        dot.addEventListener('click', () => {
          stopAutoplay();
          updateTestimonial(i);
          startAutoplay();
        });
      });
    }

    // Start autoplay
    startAutoplay();

    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
    }

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    testimonialTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          updateTestimonial(currentTestimonial + 1);
        } else {
          updateTestimonial(currentTestimonial - 1);
        }
      }
      startAutoplay();
    }, { passive: true });
  }

  // ============================================
  // Product Card 3D Hover Effect
  // ============================================

  const productCards = document.querySelectorAll('.product-card, .collection-card');

  if (finePointer) productCards.forEach(card => {
    let bounds;
    let isHovering = false;

    const rotateCard = (e) => {
      if (!isHovering) return;

      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        scale(1.02)
      `;
    };

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      isHovering = true;
      card.style.transition = 'none';
    });

    card.addEventListener('mousemove', rotateCard);

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = '';
    });
  });

  // ============================================
  // Magnetic Button Effect
  // ============================================

  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-gold, .btn-outline');

  if (finePointer) magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });

  // ============================================
  // Button Ripple Effect
  // ============================================

  const rippleButtons = document.querySelectorAll('.btn-primary, .btn-gold');

  rippleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: translate(-50%, -50%);
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        ripple.style.width = '400px';
        ripple.style.height = '400px';
        ripple.style.opacity = '0';
      });

      setTimeout(() => ripple.remove(), 800);
    });
  });

  // ============================================
  // Smooth Anchor Scrolling
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Newsletter Form
  // ============================================

  document.querySelectorAll('.newsletter-form').forEach(newsletterForm => {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const button = newsletterForm.querySelector('button');
      const input = newsletterForm.querySelector('input');
      const originalContent = button.innerHTML;

      button.innerHTML = '<span>Subscribing...</span>';
      button.disabled = true;
      input.disabled = true;

      setTimeout(() => {
        button.innerHTML = '<span>Welcome!</span>';
        button.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

        setTimeout(() => {
          button.innerHTML = originalContent;
          button.style.background = '';
          button.disabled = false;
          input.disabled = false;
          newsletterForm.reset();
        }, 2500);
      }, 1500);
    });
  });

  const conciergeForm = document.getElementById('conciergeForm');
  if (conciergeForm) {
    conciergeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = conciergeForm.querySelector('button');
      const status = document.getElementById('conciergeStatus');
      button.disabled = true;
      button.querySelector('span').textContent = 'Request Received';
      if (status) status.textContent = 'Thank you. A private client specialist will respond within one business day.';
      conciergeForm.reset();
    });
  }

  const catalogSearch = document.getElementById('catalogSearch');
  const catalogSort = document.getElementById('catalogSort');
  const catalogGrid = document.querySelector('#catalog .products-grid');
  const productCount = document.getElementById('productCount');
  const catalogEmpty = document.getElementById('catalogEmpty');

  if (catalogGrid && catalogSearch) {
    const catalogCards = Array.from(catalogGrid.querySelectorAll('.product-card'));
	const priceFilter = new URLSearchParams(window.location.search).get('price');
	const matchesPriceFilter = (price) => {
	  if (!priceFilter) return true;
	  if (priceFilter === 'under-1000') return price < 1000;
	  if (priceFilter === '1000-5000') return price >= 1000 && price <= 5000;
	  if (priceFilter === '5000-15000') return price > 5000 && price <= 15000;
	  if (priceFilter === '15000-50000') return price > 15000 && price <= 50000;
	  if (priceFilter === 'over-50000') return price > 50000;
	  return true;
	};
	document.querySelectorAll('.filter-link').forEach(link => {
	  if (priceFilter && link.getAttribute('href')?.includes(`price=${priceFilter}`)) link.classList.add('active');
	});

    const updateCatalog = () => {
      const query = catalogSearch.value.trim().toLowerCase();
      let visible = 0;
      catalogCards.forEach(card => {
		const price = Number((card.dataset.productPrice || '').replace(/[^0-9.]/g, ''));
		const matches = (!query || card.textContent.toLowerCase().includes(query)) && matchesPriceFilter(price);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (productCount) productCount.textContent = `${visible} ${visible === 1 ? 'piece' : 'pieces'}`;
      if (catalogEmpty) catalogEmpty.hidden = visible !== 0;
    };

    catalogSearch.addEventListener('input', debounce(updateCatalog, 120));
	updateCatalog();

    if (catalogSort) {
      catalogSort.addEventListener('change', () => {
        const sorted = [...catalogCards];
        if (catalogSort.value === 'price-low' || catalogSort.value === 'price-high') {
          const direction = catalogSort.value === 'price-low' ? 1 : -1;
          sorted.sort((a, b) => {
            const priceA = Number((a.dataset.productPrice || '').replace(/[^0-9.]/g, ''));
            const priceB = Number((b.dataset.productPrice || '').replace(/[^0-9.]/g, ''));
            return (priceA - priceB) * direction;
          });
        } else if (catalogSort.value === 'newest') {
          sorted.reverse();
        }
        sorted.forEach(card => catalogGrid.appendChild(card));
        updateCatalog();
      });
    }
  }

  // ============================================
  // Cart Drawer
  // ============================================

  const cartDrawer = document.getElementById('cart-drawer');

  document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.detail.target.id === 'cart-drawer' && cartDrawer) {
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
	  const content = cartDrawer.querySelector('[data-cart-count]');
	  const badge = document.getElementById('cart-count');
	  if (content && badge) badge.textContent = content.dataset.cartCount || '0';
    }
  });

  document.body.addEventListener('cart-updated', (event) => {
	const badge = document.getElementById('cart-count');
	if (badge && event.detail && typeof event.detail.count !== 'undefined') {
	  badge.textContent = String(event.detail.count);
	}
  });

  document.body.addEventListener('click', (event) => {
	if (event.target.closest('.cart-close')) closeCart();
  });

  // Close cart drawer
  const closeCart = () => {
    if (cartDrawer) {
      cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
	  const zoomedProduct = document.querySelector('.product-image-stage.is-zoomed');
	  if (zoomedProduct) {
		zoomedProduct.classList.remove('is-zoomed');
		document.body.style.overflow = '';
	  }
    }
  });

  // ============================================
  // Image Lazy Loading with Fade
  // ============================================

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  const applyImageFallback = (img) => {
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.src = '/static/images/product-placeholder.svg';
    img.classList.add('image-placeholder');
  };

  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement) applyImageFallback(event.target);
  }, true);

  lazyImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';

    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });

    if (img.complete && img.naturalWidth === 0) {
	  applyImageFallback(img);
	}

    if (img.complete) {
      img.style.opacity = '1';
    }
  });

  // ============================================
  // Reveal on Scroll - Image Wipe Effect
  // ============================================

  const imageReveals = document.querySelectorAll('.image-reveal');

  if (imageReveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    imageReveals.forEach(el => revealObserver.observe(el));
  }

  // ============================================
  // Split Text Animation
  // ============================================

  const splitTextElements = document.querySelectorAll('.split-text');

  splitTextElements.forEach(element => {
    const text = element.textContent;
    element.innerHTML = '';

    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${i * 30}ms`;
      element.appendChild(span);
    });
  });

  if (splitTextElements.length) {
    const splitObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          splitObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    splitTextElements.forEach(el => splitObserver.observe(el));
  }

  // ============================================
  // Cursor Trail Effect (Desktop Only)
  // ============================================

  if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';

    // Only add if not on touch device
    if (!('ontouchstart' in window)) {
      // Cursor styles are handled in CSS if needed
      // document.body.appendChild(cursor);
    }
  }

  // ============================================
  // Performance: Reduce animations on low-end devices
  // ============================================

  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduce-animations');
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    document.body.classList.add('reduce-animations');
  }

  // ============================================
  // Video Background Optimization
  // ============================================

  const videoBackgrounds = document.querySelectorAll('.hero-bg-video');

  videoBackgrounds.forEach(video => {
    // Pause video when not visible
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.1 });

    videoObserver.observe(video);
  });

  // ============================================
  // Horizontal Scroll Section
  // ============================================

  const horizontalSections = document.querySelectorAll('.horizontal-section');

  horizontalSections.forEach(section => {
    section.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        section.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  });

  // ============================================
  // Form Input Animations
  // ============================================

  const formInputs = document.querySelectorAll('input, textarea, select');

  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      input.parentElement?.classList.remove('focused');
      if (input.value) {
        input.parentElement?.classList.add('has-value');
      } else {
        input.parentElement?.classList.remove('has-value');
      }
    });
  });

  // ============================================
  // Console Branding
  // ============================================

  console.log(
    '%c PLATINUM ',
    'background: linear-gradient(135deg, #c9a962, #8b6914); color: #030303; font-family: serif; font-size: 32px; padding: 15px 30px; font-weight: bold; letter-spacing: 0.3em;'
  );
  console.log(
    '%c Luxury Menswear, Jewelry & Timepieces ',
    'color: #8a8a85; font-size: 12px; letter-spacing: 0.1em;'
  );

})();
