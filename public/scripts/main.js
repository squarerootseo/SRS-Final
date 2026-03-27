/* ============================================
   Square Root SEO — Interactive JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ----- Mobile Nav Toggle -----
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinks = document.querySelector('.navbar__links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
      document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ----- Mobile Services Dropdown Toggle -----
  const dropdownTrigger = document.querySelector('.navbar__dropdown-trigger');
  if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1199) {
        e.preventDefault();
        dropdownTrigger.closest('.navbar__dropdown').classList.toggle('open');
      }
    });
  }

  // ----- Navbar scroll effect -----
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ----- Smooth Scroll -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ----- Hero Image Parallax Tilt -----
  const heroSection = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero__image img');

  if (heroSection && heroImage) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0 to 1
      const y = (e.clientY - rect.top) / rect.height;    // 0 to 1

      const rotateY = (x - 0.5) * 14;  // -7 to +7 degrees
      const rotateX = (0.5 - y) * 14;  // -7 to +7 degrees

      heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // ----- PvS Mobile Tab Toggle -----
  const pvsTabs = document.querySelectorAll('.pvs__tab');
  const pvsWrapper = document.querySelector('.pvs__wrapper');

  pvsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pvsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.tab === 'solutions') {
        pvsWrapper.classList.add('show-solutions');
      } else {
        pvsWrapper.classList.remove('show-solutions');
      }
    });
  });

  // ----- Counter Animation -----
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.getAttribute('data-count');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
        const duration = 2000;
        const startTime = performance.now();

        function animate(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * numericTarget);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = prefix + target + suffix;
        }
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ----- FAQ Accordion -----
  document.querySelectorAll('.accordion-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!wasActive) item.classList.add('active');
    });
  });

  // ----- Scroll Reveal -----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ----- Testimonial Carousel -----
  const carouselTrack = document.querySelector('.testimonial-carousel__track');
  const carouselCards = document.querySelectorAll('.testimonial-carousel .testimonial-card');
  const dotsContainer = document.querySelector('.testimonial-carousel__dots');
  const prevBtn = document.querySelector('.testimonial-carousel__prev');
  const nextBtn = document.querySelector('.testimonial-carousel__next');

  if (carouselTrack && carouselCards.length > 0) {
    let currentSlide = 0;

    // Determine how many cards are visible at once
    function getVisibleCount() {
      return window.innerWidth <= 768 ? 1 : 2;
    }

    function getTotalPages() {
      return Math.ceil(carouselCards.length / getVisibleCount());
    }

    // Create dots
    function buildDots() {
      dotsContainer.innerHTML = '';
      const pages = getTotalPages();
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-carousel__dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.testimonial-carousel__dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function goToSlide(index) {
      const pages = getTotalPages();
      currentSlide = Math.max(0, Math.min(index, pages - 1));
      const cardWidth = carouselCards[0].offsetWidth + 30; // card width + gap
      const scrollTo = currentSlide * getVisibleCount() * cardWidth;
      carouselTrack.scrollTo({ left: scrollTo, behavior: 'smooth' });
      updateDots();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-play
    let autoPlay = setInterval(() => {
      const pages = getTotalPages();
      goToSlide(currentSlide >= pages - 1 ? 0 : currentSlide + 1);
    }, 5000);

    // Pause on hover
    const carouselEl = document.querySelector('.testimonial-carousel');
    carouselEl.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carouselEl.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        const pages = getTotalPages();
        goToSlide(currentSlide >= pages - 1 ? 0 : currentSlide + 1);
      }, 5000);
    });

    // Rebuild dots on resize
    window.addEventListener('resize', () => {
      buildDots();
      goToSlide(0);
    });

    buildDots();
  }

  // ----- Blog Filter Tabs -----
  const filterBtns = document.querySelectorAll('.blog-filter');
  const blogCards = document.querySelectorAll('.blog-page-card');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        blogCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
