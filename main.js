/**
 * Platinum Apparel - Luxury E-commerce
 * Refined interactions
 */

(function() {
  'use strict';

  // ── Navigation ──
  const nav = document.getElementById('mainNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  if (nav) {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll Animations ──
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // ── Testimonial Carousel ──
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialDots = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  let currentTestimonial = 0;
  const totalTestimonials = 3;

  function updateTestimonial(index) {
    if (index < 0) index = totalTestimonials - 1;
    if (index >= totalTestimonials) index = 0;
    currentTestimonial = index;

    testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

    testimonialDots.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentTestimonial);
    });
  }

  if (testimonialTrack && testimonialDots && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => updateTestimonial(currentTestimonial - 1));
    nextBtn.addEventListener('click', () => updateTestimonial(currentTestimonial + 1));

    testimonialDots.querySelectorAll('.dot').forEach((dot, i) => {
      dot.addEventListener('click', () => updateTestimonial(i));
    });

    let testimonialInterval = setInterval(() => {
      updateTestimonial(currentTestimonial + 1);
    }, 7000);

    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
      carousel.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
          updateTestimonial(currentTestimonial + 1);
        }, 7000);
      });
    }
  }

  // ── Smooth Scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = nav ? nav.offsetHeight : 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navHeight,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Newsletter Form ──
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const button = newsletterForm.querySelector('button');
      const originalContent = button.innerHTML;

      button.innerHTML = '<span>Subscribing...</span>';
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = '<span>Subscribed</span>';
        button.style.background = '#4ade80';

        setTimeout(() => {
          button.innerHTML = originalContent;
          button.style.background = '';
          button.disabled = false;
          newsletterForm.reset();
        }, 2000);
      }, 1200);
    });
  }

  // ── Keyboard Navigation ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenuBtn && mobileMenu.classList.contains('active')) {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

})();
