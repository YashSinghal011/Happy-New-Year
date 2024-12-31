let soundEnabled = true;
let autoEnabled = true;
let currentColorMode = 'random';
let autoFireworkInterval;
let audioContext;

// Initialize audio context on user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Function to create a short beep sound for launch
function createLaunchSound() {
    if (!audioContext || !soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Function to create explosion sound
function createExplosionSound() {
    if (!audioContext || !soundEnabled) return;
    
    const noise = audioContext.createBufferSource();
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const gainNode = audioContext.createGain();
    noise.buffer = buffer;
    noise.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    noise.start();
    noise.stop(audioContext.currentTime + 0.1);
}

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

function getFireworkColor() {
    const colors = {
        'random': ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#ff8c00', '#fff'],
        'gold': ['#FFD700', '#FFA500', '#FFB52E', '#FFD900', '#FFED4A'],
        'rainbow': ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff']
    };
    
    const colorSet = colors[currentColorMode];
    return colorSet[Math.floor(Math.random() * colorSet.length)];
}

function createFirework(x, y) {
    if (soundEnabled) {
        createExplosionSound();
    }

    for (let i = 0; i < 150; i++) {
        const color = getFireworkColor();
        setTimeout(() => {
            createParticle(x, y, color);
        }, Math.random() * 100);
    }
}

function shootFirework(startX) {
    if (soundEnabled) {
        createLaunchSound();
    }

    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = startX + 'px';
    firework.style.backgroundColor = '#fff';

    const duration = 1000;
    firework.style.animation = `shoot ${duration}ms ease-out forwards`;

    document.body.appendChild(firework);

    setTimeout(() => {
        const rect = firework.getBoundingClientRect();
        createFirework(rect.left, rect.top);
        firework.remove();
    }, duration);
}

function autoFirework() {
    if (autoEnabled) {
        const x = Math.random() * window.innerWidth;
        shootFirework(x);
    }
}

// Event Listeners
document.addEventListener('click', (e) => {
    initAudio(); // Initialize audio context on first click
    if (e.target.classList.contains('btn')) return;
    shootFirework(e.clientX);
});

document.getElementById('toggleSound').addEventListener('click', function() {
    initAudio(); // Initialize audio context when toggling sound
    soundEnabled = !soundEnabled;
    this.textContent = `🔊 Sound: ${soundEnabled ? 'On' : 'Off'}`;
});

document.getElementById('toggleAuto').addEventListener('click', function() {
    autoEnabled = !autoEnabled;
    this.textContent = `🎆 Auto: ${autoEnabled ? 'On' : 'Off'}`;
    if (autoEnabled) {
        autoFireworkInterval = setInterval(autoFirework, 2000);
    } else {
        clearInterval(autoFireworkInterval);
    }
});

document.getElementById('colorMode').addEventListener('click', function() {
    const modes = ['random', 'gold', 'rainbow'];
    const currentIndex = modes.indexOf(currentColorMode);
    currentColorMode = modes[(currentIndex + 1) % modes.length];
    this.textContent = `🎨 ${currentColorMode.charAt(0).toUpperCase() + currentColorMode.slice(1)}`;
});

// Initial setup
setTimeout(autoFirework, 500);
autoFireworkInterval = setInterval(autoFirework, 2000);