/* ============================================
   Loop Kit Playground — Landing Page Scripts
   Particles · Typing · Scroll Reveal · Demo
   ============================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────────
  // 1. Particle Canvas
  // ──────────────────────────────────────────
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 140;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.5,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.strokeStyle = 'rgba(0,240,255,' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,240,255,0.5)';
      ctx.fill();
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ──────────────────────────────────────────
  // 2. Typing Animation
  // ──────────────────────────────────────────
  const PHRASES = [
    'A lightweight utility toolkit for modern JavaScript.',
    'No dependencies. No build step. Just functions.',
    'capitalize · sum · clamp · truncate · slugify',
  ];

  const typingEl = document.getElementById('typing-text');
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTimer = 0;

  function typeLoop() {
    const phrase = PHRASES[phraseIdx];

    if (!deleting) {
      typingEl.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        pauseTimer = 60; // pause before deleting
      }
    } else {
      if (pauseTimer > 0) { pauseTimer--; requestAnimationFrame(typeLoop); return; }
      charIdx--;
      typingEl.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % PHRASES.length;
      }
    }

    const speed = deleting ? 25 : 45;
    setTimeout(() => requestAnimationFrame(typeLoop), speed);
  }
  setTimeout(typeLoop, 800);

  // ──────────────────────────────────────────
  // 3. Scroll Reveal (IntersectionObserver)
  // ──────────────────────────────────────────
  const revealElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealElements.forEach((el) => observer.observe(el));

  // ──────────────────────────────────────────
  // 4. Inline Utility Functions (browser-safe)
  // ──────────────────────────────────────────
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function sum(numbers) {
    if (!Array.isArray(numbers)) return 0;
    return numbers.reduce(function (a, b) { return a + b; }, 0);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function truncate(str, maxLength) {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= maxLength) return str;
    if (maxLength < 3) return '.'.repeat(maxLength);
    return str.slice(0, maxLength - 3) + '...';
  }

  function slugify(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // ──────────────────────────────────────────
  // 5. Live Demo
  // ──────────────────────────────────────────
  const fnSelect = document.getElementById('fn-select');
  const demoInput = document.getElementById('demo-input');
  const demoOutput = document.getElementById('demo-output');
  const demoHint = document.getElementById('demo-hint');

  const HINTS = {
    capitalize: 'Enter any string → first letter will be capitalized.',
    sum:        'Enter comma-separated numbers, e.g. 1,2,3,4',
    clamp:      'Enter three numbers separated by commas: value, min, max',
    truncate:   'Enter text, then a comma, then maxLength. e.g. Hello World,8',
    slugify:    'Enter any string → converts to a URL-friendly slug.',
  };

  const DEFAULT_INPUTS = {
    capitalize: 'hello world',
    sum:        '1, 2, 3, 4, 5',
    clamp:      '15, 0, 10',
    truncate:   'Hello World, 8',
    slugify:    'Hello World! How are you?',
  };

  function runDemo() {
    const fn = fnSelect.value;
    const raw = demoInput.value;
    let result;

    try {
      switch (fn) {
        case 'capitalize':
          result = capitalize(raw);
          break;
        case 'sum': {
          const nums = raw.split(',').map(function (s) { return parseFloat(s.trim()); }).filter(function (n) { return !isNaN(n); });
          result = sum(nums);
          break;
        }
        case 'clamp': {
          var parts = raw.split(',').map(function (s) { return parseFloat(s.trim()); });
          if (parts.length < 3 || parts.some(isNaN)) {
            result = '⚠ Provide 3 numbers: value, min, max';
          } else {
            result = clamp(parts[0], parts[1], parts[2]);
          }
          break;
        }
        case 'truncate': {
          var lastComma = raw.lastIndexOf(',');
          if (lastComma === -1) {
            result = truncate(raw, 20);
          } else {
            var text = raw.slice(0, lastComma);
            var len = parseInt(raw.slice(lastComma + 1).trim(), 10);
            result = isNaN(len) ? truncate(text, 20) : truncate(text, len);
          }
          break;
        }
        case 'slugify':
          result = slugify(raw);
          break;
        default:
          result = '?';
      }
    } catch (e) {
      result = '⚠ Error: ' + e.message;
    }

    demoOutput.textContent = String(result);
  }

  function updateHint() {
    demoHint.textContent = HINTS[fnSelect.value] || '';
  }

  fnSelect.addEventListener('change', function () {
    demoInput.value = DEFAULT_INPUTS[fnSelect.value] || '';
    updateHint();
    runDemo();
  });

  demoInput.addEventListener('input', runDemo);

  // Initialize
  updateHint();
  runDemo();

  // ──────────────────────────────────────────
  // 6. Smooth CTA scroll
  // ──────────────────────────────────────────
  document.getElementById('cta-btn').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  });
})();
