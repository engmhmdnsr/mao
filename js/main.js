/**
 * MANAR AL OMRAN (MAO) - MAIN JAVASCRIPT
 * Concept A: Dark Engineering Design System
 * Vanilla JS, lightweight, responsive, high performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle & Backdrop
  initMobileMenu();

  // 2. Sticky Navbar on Scroll
  initStickyNavbar();

  // 3. Stat Counter Animations on Scroll
  initStatCounters();

  // 4. Scroll Reveal Animations (IntersectionObserver)
  initScrollReveals();

  // 5. Cinematic Vertical Projects Showcase (Scroll Reveal, Filters & Parallax)
  initCinematicProjects();

  // 6. Back-To-Top Button
  initBackToTop();

  // 7. Catalog Jump Navigation (for products page)
  initCatalogJump();

  // 8. Projects Filter Tabs (for standard grid fallback)
  initProjectFilters();

  // 9. Contact Form Interactive Handler (for contact page)
  initContactForm();
});

/* ==========================================================================
   1. MOBILE MENU FUNCTIONALITY
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle') || document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobile-menu') || document.getElementById('mobileNav');
  let backdrop = document.querySelector('.mobile-backdrop') || document.getElementById('navBackdrop');
  const closeBtn = document.getElementById('closeMobileNav');

  if (!menuToggle || !mobileMenu) return;

  // Create backdrop if not already in DOM
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleMenu(forceOpen) {
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', shouldOpen);
    if (menuToggle) menuToggle.classList.toggle('active', shouldOpen);
    backdrop.classList.toggle('active', shouldOpen);
    backdrop.classList.toggle('open', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  }

  function closeMenu() {
    toggleMenu(false);
  }

  menuToggle.addEventListener('click', () => toggleMenu());
  backdrop.addEventListener('click', closeMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu when clicking on any mobile menu link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   2. STICKY NAVBAR
   ========================================================================== */
function initStickyNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. STAT COUNTER ANIMATIONS
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target], .counter[data-target]');
  if (statNumbers.length === 0) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.ceil(current).toLocaleString();
      }
    }, stepTime);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    statNumbers.forEach((num) => observer.observe(num));
  } else {
    statNumbers.forEach((num) => {
      num.textContent = parseInt(num.getAttribute('data-target'), 10).toLocaleString();
    });
  }
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-revealed'));
  }
}

/* ==========================================================================
   5. CINEMATIC VERTICAL PROJECTS SHOWCASE
   ========================================================================== */
function initCinematicProjects() {
  const projectCards = document.querySelectorAll('.cinematic-project-card');
  if (projectCards.length === 0) return;

  // 1. Reveal on scroll
  if ('IntersectionObserver' in window) {
    const projectRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    projectCards.forEach((card) => projectRevealObserver.observe(card));
  } else {
    projectCards.forEach((card) => {
      card.classList.add('revealed');
      card.classList.add('is-revealed');
    });
  }

  // 2. Filter Chips
  const filterChips = document.querySelectorAll('.filter-chip, .project-filters-bar button');
  if (filterChips.length > 0) {
    filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        filterChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = (chip.getAttribute('data-filter') || 'all').toLowerCase();

        projectCards.forEach((card) => {
          const categories = (card.getAttribute('data-category') || '').toLowerCase();
          if (filter === 'all' || categories.includes(filter)) {
            card.classList.remove('filtered-out');
            setTimeout(() => {
              card.classList.add('revealed');
              card.classList.add('is-revealed');
            }, 50);
          } else {
            card.classList.add('filtered-out');
          }
        });
      });
    });
  }

  // 3. Subtle Parallax on Desktop
  let ticking = false;
  function updateParallax() {
    if (window.innerWidth > 820) {
      const windowHeight = window.innerHeight;
      projectCards.forEach((card) => {
        if (!card.classList.contains('filtered-out') && (card.classList.contains('revealed') || card.classList.contains('is-revealed'))) {
          const rect = card.getBoundingClientRect();
          if (rect.top < windowHeight && rect.bottom > 0) {
            const img = card.querySelector('.cinematic-project-bg img');
            if (img) {
              const offset = ((rect.top + rect.height / 2) - windowHeight / 2) * 0.07;
              img.style.transform = `scale(1.0) translateY(${offset.toFixed(1)}px)`;
            }
          }
        }
      });
    }
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* ==========================================================================
   6. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    },
    { passive: true }
  );

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* ==========================================================================
   7. CATALOG JUMP NAVIGATION
   ========================================================================== */
function initCatalogJump() {
  const jumpButtons = document.querySelectorAll('.jump-btn');
  if (jumpButtons.length === 0) return;

  const sections = [];
  jumpButtons.forEach((btn) => {
    const targetId = btn.getAttribute('href')?.replace('#', '');
    if (targetId) {
      const section = document.getElementById(targetId);
      if (section) {
        sections.push({ id: targetId, btn: btn, el: section });
      }
    }
  });

  if (sections.length === 0) return;

  window.addEventListener(
    'scroll',
    () => {
      const scrollPos = window.scrollY + 120;
      let activeFound = false;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPos >= sections[i].el.offsetTop) {
          jumpButtons.forEach((b) => b.classList.remove('active'));
          sections[i].btn.classList.add('active');
          activeFound = true;
          break;
        }
      }

      if (!activeFound && jumpButtons.length > 0) {
        jumpButtons.forEach((b) => b.classList.remove('active'));
        jumpButtons[0].classList.add('active');
      }
    },
    { passive: true }
  );
}

/* ==========================================================================
   8. PROJECT FILTER TABS (Classic Grid Fallback)
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.classList.add('is-revealed');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. CONTACT FORM INTERACTIVITY
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Request...';
    }

    setTimeout(() => {
      let existingAlert = contactForm.querySelector('.form-success-alert');
      if (existingAlert) existingAlert.remove();

      const successAlert = document.createElement('div');
      successAlert.className = 'form-success-alert';
      successAlert.style.cssText = 'background-color: rgba(34, 197, 94, 0.15); border: 1px solid #22C55E; color: #4ADE80; padding: 16px 20px; border-radius: 6px; margin-top: 18px; font-weight: 600; font-size: 0.92rem; text-align: center;';
      successAlert.innerHTML = '✓ Thank you! Your engineering inquiry has been submitted. Our technical team in Dammam will respond within 24 hours.';
      
      contactForm.appendChild(successAlert);
      contactForm.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Inquiry Sent ✓';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 4000);
      }
    }, 800);
  });
}
