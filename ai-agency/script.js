/* ===========================
   JavaScript — NexusAI
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PARTICLE CANVAS ---------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 70, 229, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();
  window.addEventListener('resize', initParticles);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(79, 70, 229, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
      // Mouse interaction
      if (mouse.x !== null) {
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ---------- MOBILE NAV ---------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- ANIMATED STAT COUNTERS ---------- */
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statValues.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, 25);
      });
    }
  }, { threshold: 0.3 });

  if (statValues.length > 0) {
    statsObserver.observe(statValues[0].closest('.about-stats'));
  }

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  let currentSlide = 0;
  let autoplayTimer;

  function createDots() {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(idx) {
    currentSlide = idx;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % cards.length);
  }
  function prevSlide() {
    goToSlide((currentSlide - 1 + cards.length) % cards.length);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  if (cards.length > 0) {
    createDots();
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    resetAutoplay();
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- CHAT WIDGET ---------- */
  const chatFab = document.getElementById('chatFab');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  window.openChat = function() {
    chatWindow.classList.add('open');
    chatFab.querySelector('.chat-fab-badge').style.display = 'none';
  };

  chatFab.addEventListener('click', openChat);
  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  const botResponses = {
    'services': "We offer 6 core services:\n\n🤖 AI Chatbots & Assistants\n⚡ Workflow Automation\n👥 AI Lead Generation\n📊 AI-Powered Analytics\n🧠 Custom AI Models\n💡 AI Strategy Consulting\n\nWant to know more about any of these?",
    'pricing': "Our projects typically range from $5K–$50K depending on scope. Every project comes with ROI projections before you commit, plus our 90-day ROI guarantee. Want to book a free strategy call to get a custom quote?",
    'book': "Great choice! You can book a free 30-minute strategy call right on this page. Scroll down to the 'Book Your Spot' section, or I can take you there now. The call is completely free with no sales pressure!",
    'support': "We're here for you 24/7! You can:\n\n💬 Chat with us right here\n📧 Email: hello@nexusai.agency\n📞 Call: +1 (555) 234-5678\n\nEnterprise clients get a dedicated Slack channel with 1-hour response guarantee.",
    'default': "Thanks for your message! Our team typically responds within 2 hours during business days. In the meantime, feel free to:\n\n📋 Get your free AI audit report\n📅 Book a strategy call\n📚 Browse our support resources\n\nIs there anything specific I can help you with?"
  };

  function addMessage(text, type) {
    // Remove quick replies if they exist
    const quickReplies = chatMessages.querySelector('.chat-quick-replies');
    if (quickReplies) quickReplies.remove();

    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    msg.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotResponse(input) {
    const lower = input.toLowerCase();
    if (lower.includes('service') || lower.includes('what do you') || lower.includes('offer')) return botResponses.services;
    if (lower.includes('cost') || lower.includes('price') || lower.includes('pricing') || lower.includes('how much')) return botResponses.pricing;
    if (lower.includes('book') || lower.includes('call') || lower.includes('schedule') || lower.includes('appointment')) return botResponses.book;
    if (lower.includes('support') || lower.includes('help') || lower.includes('issue') || lower.includes('problem')) return botResponses.support;
    return botResponses.default;
  }

  function sendChat() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(text);
      addMessage(response, 'bot');
    }, 800 + Math.random() * 600);
  }

  chatSend.addEventListener('click', sendChat);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChat();
  });

  // Quick replies
  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      const reply = btn.getAttribute('data-reply');
      chatInput.value = reply;
      sendChat();
    });
  });

  /* ---------- FORM HANDLERS ---------- */
  function showFormSuccess(form, title, message) {
    form.innerHTML = `
      <div class="form-success">
        <div class="success-icon">✅</div>
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;
  }

  // Lead gen form
  const leadGenForm = document.getElementById('leadGenForm');
  if (leadGenForm) {
    leadGenForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = leadGenForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        showFormSuccess(leadGenForm, 'Report On Its Way! 🚀', 'Check your inbox within 24 hours for your personalized AI Growth Report.');
      }, 1500);
    });
  }

  // Booking form
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    // Set min date to today
    const dateInput = document.getElementById('bookDate');
    if (dateInput) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = bookingForm.querySelector('button[type="submit"]');
      btn.textContent = 'Confirming...';
      btn.disabled = true;

      setTimeout(() => {
        showFormSuccess(bookingForm, 'You\'re Booked! 🎉', 'We\'ll send a calendar invite to your email within the hour. Talk soon!');
      }, 1500);
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        showFormSuccess(contactForm, 'Message Sent! 📨', 'We\'ll get back to you within 2 hours during business days.');
      }, 1500);
    });
  }

  /* ---------- SMOOTH SCROLL for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
