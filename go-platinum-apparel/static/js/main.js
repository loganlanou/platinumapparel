/**
 * Platinum Apparel - Ultra Luxury E-commerce
 * Rolex-Inspired Premium Interactions
 */

(function() {
  'use strict';

  // ============================================
  // Utility Functions
  // ============================================

  const lerp = (start, end, factor) => start + (end - start) * factor;
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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

  // ============================================
  // Page Loader - Cinematic Entry
  // ============================================

  const pageLoader = document.getElementById('pageLoader');
  const hero = document.querySelector('.hero');

  if (pageLoader) {
    // Minimum display time for loader
    const minLoadTime = 1800;
    const startTime = Date.now();

    const hideLoader = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        pageLoader.classList.add('loaded');
        document.body.style.overflow = '';

        // Trigger hero animation
        if (hero) {
          setTimeout(() => {
            hero.classList.add('loaded');
          }, 300);
        }
      }, remaining);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  } else if (hero) {
    // If no loader, still animate hero
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  // ============================================
  // Smooth Scroll with Lenis-like Effect
  // ============================================

  let scrollY = 0;
  let scrollTarget = 0;
  let isScrolling = false;

  // Simple smooth scroll implementation
  const smoothScroll = () => {
    scrollY = lerp(scrollY, scrollTarget, 0.1);

    if (Math.abs(scrollY - scrollTarget) > 0.5) {
      requestAnimationFrame(smoothScroll);
    } else {
      isScrolling = false;
    }
  };

  // ============================================
  // Navigation - Premium Fixed Header
  // ============================================

  const nav = document.getElementById('mainNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScrollY = 0;
  let navHidden = false;

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

    lastScrollY = currentScrollY;
  };

  if (nav) {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
  }

  // Mobile menu toggle with animation
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileMenu.classList.contains('active');

      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = isActive ? '' : 'hidden';

      // Animate menu links
      if (!isActive) {
        const links = mobileMenu.querySelectorAll('.mobile-link');
        links.forEach((link, i) => {
          link.style.opacity = '0';
          link.style.transform = 'translateY(20px)';
          setTimeout(() => {
            link.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
          }, 100 + (i * 80));
        });
      }
    });

    // Close on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

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

  let parallaxEnabled = window.innerWidth > 768;

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
    window.addEventListener('scroll', handleParallax, { passive: true });
    window.addEventListener('resize', debounce(() => {
      parallaxEnabled = window.innerWidth > 768;
    }, 200));
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

  productCards.forEach(card => {
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

  magneticButtons.forEach(button => {
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

  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
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
  }

  // ============================================
  // Cart Drawer
  // ============================================

  const cartDrawer = document.getElementById('cart-drawer');

  document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.detail.target.id === 'cart-drawer' && cartDrawer) {
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
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
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // ============================================
  // Image Lazy Loading with Fade
  // ============================================

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  lazyImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';

    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });

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
