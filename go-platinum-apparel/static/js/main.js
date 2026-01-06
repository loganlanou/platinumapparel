/**
 * Platinum Apparel - Luxury E-commerce
 * Interactive functionality
 */

(function() {
  'use strict';

  // ============================================
  // Page Loader
  // ============================================
  const pageLoader = document.getElementById('pageLoader');

  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('loaded');
      }, 1500);
    });
  }

  // ============================================
  // Hero Background Slideshow
  // ============================================
  const heroSlideshow = document.querySelector('.hero-slideshow');

  if (heroSlideshow) {
    const slides = heroSlideshow.querySelectorAll('.slideshow-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds per slide

    function nextSlide() {
      // Remove active class from current slide
      slides[currentSlide].classList.remove('active');

      // Move to next slide
      currentSlide = (currentSlide + 1) % slides.length;

      // Add active class to new slide
      slides[currentSlide].classList.add('active');
    }

    // Start slideshow
    if (slides.length > 1) {
      setInterval(nextSlide, slideInterval);
    }

    // Preload images for smoother transitions
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img && img.src) {
        const preload = new Image();
        preload.src = img.src;
      }
    });
  }

  // ============================================
  // Navigation
  // ============================================
  const nav = document.getElementById('mainNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll behavior for nav
  function handleNavScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  if (nav) {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
  }

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  if (mobileMenu && mobileMenuBtn) {
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // Scroll Animations (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  if (animatedElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

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
    if (testimonialTrack) {
      testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    }

    // Update dots
    if (testimonialDots) {
      const dots = testimonialDots.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTestimonial);
      });
    }
  }

  if (testimonialTrack && testimonialDots && prevBtn && nextBtn) {
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
    if (testimonialCarousel) {
      testimonialCarousel.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
      });

      testimonialCarousel.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
          updateTestimonial(currentTestimonial + 1);
        }, 6000);
      });
    }
  }

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
        const navHeight = nav ? nav.offsetHeight : 0;
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

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

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
  }

  // ============================================
  // Cart Drawer
  // ============================================
  const cartDrawer = document.getElementById('cart-drawer');

  // Listen for HTMX events
  document.body.addEventListener('htmx:afterSwap', function(evt) {
    if (evt.detail.target.id === 'cart-drawer') {
      cartDrawer.classList.add('active');
    }
  });

  // Close cart drawer on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (cartDrawer) cartDrawer.classList.remove('active');
      if (mobileMenu && mobileMenuBtn && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // ============================================
  // Product Card Hover Effect
  // ============================================
  const productCards = document.querySelectorAll('.product-card, .collection-card');

  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================
  // Button Ripple Effect
  // ============================================
  const rippleButtons = document.querySelectorAll('.btn-primary, .btn-gold, .btn-outline');
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
  // Console branding
  // ============================================
  console.log('%c Platinum Apparel ',
    'background: linear-gradient(135deg, #d4b86f, #a77a22); color: #050505; font-family: serif; font-size: 24px; padding: 10px 20px;'
  );
  console.log('%c Luxury Menswear, Jewelry & Timepieces ',
    'color: #a8a8a2; font-size: 12px;'
  );

})();
