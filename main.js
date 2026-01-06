/**
 * Platinum Apparel - Luxury E-commerce Website
 * Premium interactive functionality
 */

(function() {
  'use strict';

  // ============================================
  // Page Loader
  // ============================================
  const pageLoader = document.getElementById('pageLoader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      pageLoader.classList.add('loaded');
    }, 1500);
  });

  // ============================================
  // Navigation
  // ============================================
  const nav = document.getElementById('mainNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScrollY = window.scrollY;

  // Scroll behavior for nav
  function handleNavScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  const mobileNavLinks = mobileMenu.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ============================================
  // Scroll Animations (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // ============================================
  // Testimonial Carousel
  // ============================================
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialDots = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  let currentTestimonial = 0;
  const totalTestimonials = 3;

  function updateTestimonial(index) {
    // Wrap around
    if (index < 0) index = totalTestimonials - 1;
    if (index >= totalTestimonials) index = 0;

    currentTestimonial = index;

    // Update track position
    testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

    // Update dots
    const dots = testimonialDots.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentTestimonial);
    });
  }

  prevBtn.addEventListener('click', () => {
    updateTestimonial(currentTestimonial - 1);
  });

  nextBtn.addEventListener('click', () => {
    updateTestimonial(currentTestimonial + 1);
  });

  // Dot navigation
  testimonialDots.querySelectorAll('.dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      updateTestimonial(i);
    });
  });

  // Auto-advance testimonials
  let testimonialInterval = setInterval(() => {
    updateTestimonial(currentTestimonial + 1);
  }, 6000);

  // Pause on hover
  const testimonialCarousel = document.querySelector('.testimonial-carousel');
  testimonialCarousel.addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
  });

  testimonialCarousel.addEventListener('mouseleave', () => {
    testimonialInterval = setInterval(() => {
      updateTestimonial(currentTestimonial + 1);
    }, 6000);
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

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

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = newsletterForm.querySelector('input[type="email"]').value;
    const button = newsletterForm.querySelector('button');
    const originalContent = button.innerHTML;

    // Simulate submission
    button.innerHTML = '<span>Subscribing...</span>';
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = '<span>Subscribed!</span>';
      button.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

      setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = '';
        button.disabled = false;
        newsletterForm.reset();
      }, 2000);
    }, 1500);
  });

  // ============================================
  // Parallax Effect on Scroll
  // ============================================
  const parallaxElements = document.querySelectorAll('.vault-glow, .aura');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = 0.3;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });

  // ============================================
  // Button Ripple Effect
  // ============================================
  document.querySelectorAll('.primary, .secondary').forEach(button => {
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
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transition = 'all 0.6s ease-out';
        ripple.style.width = '300px';
        ripple.style.height = '300px';
        ripple.style.opacity = '0';
      });

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ============================================
  // Cursor Glow Effect (Desktop only)
  // ============================================
  if (window.innerWidth > 992) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212, 184, 111, 0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      const easing = 0.1;
      currentX += (mouseX - currentX) * easing;
      currentY += (mouseY - currentY) * easing;

      cursorGlow.style.left = currentX + 'px';
      cursorGlow.style.top = currentY + 'px';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }

  // ============================================
  // Product Card Hover Tilt Effect
  // ============================================
  const productCards = document.querySelectorAll('.product-card, .collection-card');

  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================
  // Vault Card Shine Effect
  // ============================================
  const vaultCards = document.querySelectorAll('.vault-card');

  vaultCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ============================================
  // Number Counter Animation
  // ============================================
  const counters = document.querySelectorAll('.metric, .stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/^([\d,.]+)/);

    if (!match) return;

    const endValue = parseFloat(match[1].replace(/,/g, ''));
    const suffix = text.replace(match[1], '');
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = endValue * easeOut;

      // Format number
      let displayValue;
      if (endValue >= 1000) {
        displayValue = currentValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
      } else if (endValue < 10 && endValue % 1 !== 0) {
        displayValue = currentValue.toFixed(1);
      } else {
        displayValue = Math.floor(currentValue).toString();
      }

      element.textContent = displayValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = text; // Restore original text
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // Keyboard Navigation Support
  // ============================================
  document.addEventListener('keydown', (e) => {
    // Escape closes mobile menu
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ============================================
  // Performance: Throttle scroll events
  // ============================================
  function throttle(fn, wait) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  }

  // Apply throttling to scroll handlers if needed
  // Already using passive listeners for performance

  // ============================================
  // Preload critical assets
  // ============================================
  const criticalImages = document.querySelectorAll('.hero-visual img, .collection-card img');
  criticalImages.forEach(img => {
    if (img.dataset.src) {
      const preload = new Image();
      preload.src = img.dataset.src;
    }
  });

  // ============================================
  // Console branding
  // ============================================
  console.log('%c Platinum Apparel ',
    'background: linear-gradient(135deg, #d4b86f, #a77a22); color: #050505; font-family: serif; font-size: 24px; padding: 10px 20px;'
  );
  console.log('%c Luxury Menswear, Jewelry & Timepieces ',
    'color: #a8a8a2; font-size: 12px;'
  );

})();
