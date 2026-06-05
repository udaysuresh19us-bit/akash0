document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initNavbar();
  initActiveNavLink();
  initScrollTop();
  initTypingEffect();
  initContactForm();
  initModals();
});

/* --- LOADING SCREEN --- */
function initLoader() {
  const loader = document.getElementById('loader-wrapper');
  if (loader) {
    window.addEventListener('load', () => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500); // matches style.css transition speed
    });

    // Fallback: in case window load doesn't fire quickly
    setTimeout(() => {
      if (!loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }
    }, 2000);
  }
}

/* --- THEME SYSTEM --- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Check stored theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  } else if (!userPrefersDark) {
    // If user prefers light, explicitly set it
    document.body.setAttribute('data-theme', 'light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* --- RESPONSIVENESS (MOBILE NAV) --- */
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu if clicking outside navbar
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/* --- ACTIVE NAV LINK HIGHLIGHT --- */
function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Exact match or matches index.html/blank path
    if (currentPath.endsWith(linkPath) || 
        (currentPath.endsWith('/') && linkPath === 'index.html') ||
        (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- SCROLL TO TOP --- */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --- TYPING EFFECT --- */
function initTypingEffect() {
  const typingText = document.getElementById('typing-text');
  if (!typingText) return;

  const roles = [
    "BCA Student",
    "Cybersecurity Enthusiast",
    "Java & Python Developer"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  
  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 120;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full text
      typingDelay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 500;
    }
    
    setTimeout(type, typingDelay);
  }
  
  setTimeout(type, 800);
}

/* --- CONTACT FORM FRONTEND VALIDATION --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;

    // Name Validation
    if (nameInput.value.trim() === '') {
      showError(nameInput, 'Please enter your name.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Email Validation
    if (emailInput.value.trim() === '') {
      showError(emailInput, 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Subject Validation
    if (subjectInput.value.trim() === '') {
      showError(subjectInput, 'Please enter a subject.');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // Message Validation
    if (messageInput.value.trim() === '') {
      showError(messageInput, 'Please write a message.');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      // Simulation of submission
      showToast('success', 'Thank you! Your message has been sent successfully.');
      form.reset();
    } else {
      showToast('error', 'Please fill out all required fields correctly.');
    }
  });

  function showError(input, message) {
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
    input.style.borderColor = '#EF4444';
  }

  function clearError(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      errorEl.style.display = 'none';
    }
    input.style.borderColor = '';
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

/* --- TOAST SYSTEM --- */
function showToast(type, message) {
  // Create toast container if not exists
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Custom icons based on toast type
  let icon = '';
  if (type === 'success') {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

/* --- MODAL SYSTEM (For Code request warning dialogs) --- */
function initModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal) return;

  // Expose function globally so we can open it from inline HTML event handlers
  window.openProjectModal = function(projectName) {
    const titleEl = document.getElementById('modal-project-title');
    const descEl = document.getElementById('modal-project-desc');
    
    if (titleEl && descEl) {
      titleEl.textContent = projectName;
      descEl.textContent = `As this is an academic project, the source code and live site are stored securely. You can request access or a full walk-through by contacting me directly at akashakubl@gmail.com.`;
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Esc key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
}
