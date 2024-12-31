function createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.backgroundColor = color;
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 150;
    const startX = 0;
    const startY = 0;
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity;

    particle.style.setProperty('--startX', startX + 'px');
    particle.style.setProperty('--startY', startY + 'px');
    particle.style.setProperty('--endX', endX + 'px');
    particle.style.setProperty('--endY', endY + 'px');

    particle.style.animation = 'explode 1s ease-out forwards';

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }

  function createFirework(x, y) {
    const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#ff8c00', '#fff'];
    
    // Create multiple particles for a bigger explosion
    for (let i = 0; i < 150; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      setTimeout(() => {
        createParticle(x, y, color);
      }, Math.random() * 100);
    }
  }

  function shootFirework(startX) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = startX + 'px';
    firework.style.backgroundColor = '#fff';
    
    // Random ending height
    const duration = 1000;
    firework.style.animation = `shoot ${duration}ms ease-out forwards`;
    
    document.body.appendChild(firework);

    setTimeout(() => {
      const rect = firework.getBoundingClientRect();
      createFirework(rect.left, rect.top);
      firework.remove();
    }, duration);
  }

  // Click handler
  document.addEventListener('click', (e) => {
    shootFirework(e.clientX);
  });

  // Auto fireworks
  function autoFirework() {
    const x = Math.random() * window.innerWidth;
    shootFirework(x);
  }

  // Initial fireworks
  setTimeout(() => {
    autoFirework();
  }, 500);

  // Create random fireworks
  setInterval(autoFirework, 2000);