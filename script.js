// ===== Configuration =====
const CONFIG = {
  password: 'memorj', // Change this to your secret password (case-insensitive)
  musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  musicVolume: 0.3
};

// ===== Media Items =====
// Add your own photos and videos here!
const mediaItems = [
  {
    id: 1,
    type: 'image',
    src: 'media/1.jpg',
    date: 'June 15, 2021',
    caption: '*Occasion*',
    rotation: -5,
    position: {
      top: '10%',
      left: '5%',
      mobileTop: '7vh',
      mobileLeft: '9vw'
    }
  },
  {
    id: 2,
    type: 'image',
    src: 'media/2.jpg',
    date: 'August 3, 2021',
    caption: '*Occasion*',
    rotation: 8,
    position: {
      top: '15%',
      left: '35%',
      mobileTop: '10vh',
      mobileLeft: '42vw'
    }
  },
  {
    id: 3,
    type: 'video',
    src: 'media/vid1.mp4',
    date: 'December 25, 2021',
    caption: '*Occasion*',
    rotation: -3,
    position: {
      top: '5%',
      left: '65%',
      mobileTop: '18vh',
      mobileLeft: '25vw'
    }
  },
  {
    id: 4,
    type: 'image',
    src: 'media/4.jpg',
    date: 'February 14, 2022',
    caption: '*Occasion*',
    rotation: 12,
    position: {
      top: '40%',
      left: '10%',
      mobileTop: '30vh',
      mobileLeft: '55vw'
    }
  },
  {
    id: 5,
    type: 'image',
    src: 'media/5.jpg',
    date: 'July 20, 2022',
    caption: '*Occasion*',
    rotation: -8,
    position: {
      top: '35%',
      left: '50%',
      mobileTop: '42vh',
      mobileLeft: '8vw'
    }
  },
  {
    id: 6,
    type: 'video',
    src: 'media/vid2.mp4',
    date: 'Octuber 8, 2023',
    caption: '*Occasion*',
    rotation: 6,
    position: {
      top: '45%',
      left: '75%',
      mobileTop: '52vh',
      mobileLeft: '45vw'
    }
  },
  {
    id: 7,
    type: 'image',
    src: 'media/6.jpg',
    date: 'February 4, 2025',
    caption: '*Occasion*',
    rotation: -10,
    position: {
      top: '65%',
      left: '25%',
      mobileTop: '62vh',
      mobileLeft: '18vw'
    }
  },
  {
    id: 8,
    type: 'image',
    src: 'media/7.jpg',
    date: 'September 9, 2025',
    caption: '*Occasion*',
    rotation: 4,
    position: {
      top: '70%',
      left: '60%',
      mobileTop: '72vh',
      mobileLeft: '50vw'
    }
  }
];


// ===== DOM Elements =====
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
const passwordGate = document.getElementById('password-gate');
const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const errorMessage = document.getElementById('error-message');
const gallerySection = document.getElementById('gallery-section');
const polaroidContainer = document.getElementById('polaroid-container');
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const closeLightbox = document.getElementById('close-lightbox');
const musicBtn = document.getElementById('music-btn');
const musicOn = document.getElementById('music-on');
const musicOff = document.getElementById('music-off');
const backgroundMusic = document.getElementById('background-music');

// ===== State =====
let isPlaying = false;
let particles = [];
const particleCount = 60;

// ===== Animated Background =====
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 4 + 2,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.2,
    hue: Math.random() * 30 + 340
  };
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }
}

function drawGradientBackground() {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.8
  );
  gradient.addColorStop(0, 'hsl(350, 70%, 92%)');
  gradient.addColorStop(0.4, 'hsl(30, 40%, 96%)');
  gradient.addColorStop(0.7, 'hsl(45, 60%, 94%)');
  gradient.addColorStop(1, 'hsl(350, 50%, 90%)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawParticle(particle) {
  const gradient = ctx.createRadialGradient(
    particle.x, particle.y, 0,
    particle.x, particle.y, particle.size
  );
  gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 75%, ${particle.opacity})`);
  gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 75%, 0)`);

  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function updateParticle(particle) {
  particle.x += particle.speedX;
  particle.y += particle.speedY;

  if (particle.x < 0) particle.x = canvas.width;
  if (particle.x > canvas.width) particle.x = 0;
  if (particle.y < 0) particle.y = canvas.height;
  if (particle.y > canvas.height) particle.y = 0;

  particle.opacity += (Math.random() - 0.5) * 0.02;
  particle.opacity = Math.max(0.1, Math.min(0.7, particle.opacity));
}

function animateBackground() {
  drawGradientBackground();

  particles.forEach(particle => {
    updateParticle(particle);
    drawParticle(particle);
  });

  // Draw connecting lines
  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `hsla(350, 60%, 75%, ${0.1 * (1 - distance / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animateBackground);
}

// ===== Floating Hearts =====
function createFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  for (let i = 0; i < 8; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${20 + (i % 3) * 10}" height="${20 + (i % 3) * 10}" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    `;
    heart.style.left = `${10 + i * 12}%`;
    heart.style.top = `${20 + (i % 3) * 25}%`;
    heart.style.animationDelay = `${i * 0.5}s`;
    container.appendChild(heart);
  }
}

// ===== Password Gate =====
passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (passwordInput.value.toLowerCase() === CONFIG.password.toLowerCase()) {
    passwordGate.classList.add('unlocking');
    
    setTimeout(() => {
      passwordGate.classList.add('hidden');
      gallerySection.classList.remove('hidden');
      musicBtn.classList.remove('hidden');
      
      // Try to autoplay music
      backgroundMusic.volume = CONFIG.musicVolume;
      backgroundMusic.play().then(() => {
        isPlaying = true;
        updateMusicButton();
      }).catch(() => {
        // Autoplay prevented, wait for user click
      });
    }, 800);
  } else {
    passwordInput.classList.add('shake');
    errorMessage.classList.add('show');
    
    setTimeout(() => {
      passwordInput.classList.remove('shake');
      errorMessage.classList.remove('show');
    }, 500);
  }
});

  const audio = document.getElementById("demoAudio");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const progress = document.getElementById("audioProgress");

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPauseBtn.textContent = "❚❚";
    } else {
      audio.pause();
      playPauseBtn.textContent = "▶";
    }
  });

  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
  });

  audio.addEventListener("ended", () => {
    playPauseBtn.textContent = "▶";
    progress.style.width = "0%";
  });


// ===== Gallery =====
function createPolaroids() {
  mediaItems.forEach((item, index) => {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      polaroid.style.top = item.position.mobileTop || item.position.top;
      polaroid.style.left = item.position.mobileLeft || item.position.left;
    } else {
      polaroid.style.top = item.position.top;
      polaroid.style.left = item.position.left;
    }
    polaroid.style.transform = `rotate(${item.rotation}deg)`;
    polaroid.style.animationDelay = `${index * 0.1}s`;

    const mediaHtml = item.type === 'image' 
      ? `<img src="${item.src}" alt="${item.date}" alt="${item.caption}" loading="lazy">`
      : `
        <video src="${item.src}" muted></video>
        <div class="video-overlay">
          <div class="play-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      `;

    polaroid.innerHTML = `
      <div class="polaroid-media">
        ${mediaHtml}
      </div>
      <p class="polaroid-caption">
        <span class="polaroid-date">${item.date}<br></span>
        ${item.caption}
      </p>
    `;

    polaroid.addEventListener('click', () => openLightbox(item));
    polaroidContainer.appendChild(polaroid);
  });
}


function openLightbox(item) {
  const mediaHtml = item.type === 'image'
    ? `<img src="${item.src}" alt="${item.date}"<br>alt="${item.caption}">`
    : `<video src="${item.src}" controls autoplay></video>`;
  
  lightboxContent.innerHTML = `
    <div class="lightbox-media">
      ${mediaHtml}
    </div>
    <p class="lightbox-caption">${item.date}<br>${item.caption}</p>
  `;
  
  lightbox.classList.remove('hidden');
}

closeLightbox.addEventListener('click', () => {
  lightbox.classList.add('hidden');
  // Pause video if playing
  const video = lightboxContent.querySelector('video');
  if (video) video.pause();
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.add('hidden');
    const video = lightboxContent.querySelector('video');
    if (video) video.pause();
  }
});

// ===== Music Player =====
function updateMusicButton() {
  musicBtn.classList.toggle('playing', isPlaying);
  musicOn.classList.toggle('hidden', !isPlaying);
  musicOff.classList.toggle('hidden', isPlaying);
}

backgroundMusic.addEventListener('play', () => {
  isPlaying = true;
  updateMusicButton();
});

backgroundMusic.addEventListener('pause', () => {
  isPlaying = false;
  updateMusicButton();
});

musicBtn.addEventListener('click', () => {
  isPlaying ? backgroundMusic.pause() : backgroundMusic.play();
});


// ===== Initialize =====
function init() {
  resizeCanvas();
  initParticles();
  animateBackground();
  createFloatingHearts();
  createPolaroids();
  
  // Hide music button initially
  musicBtn.classList.add('hidden');
  
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
}

init();

// ===== Letter Popup =====
const openLetter = document.getElementById('open-letter');
const letterPopup = document.getElementById('letter-popup');
const closeLetter = document.getElementById('close-letter');

openLetter.addEventListener('click', () => {
  letterPopup.classList.remove('hidden');
});

closeLetter.addEventListener('click', () => {
  letterPopup.classList.add('hidden');
});

letterPopup.addEventListener('click', (e) => {
  if (e.target === letterPopup) {
    letterPopup.classList.add('hidden');
  }
});
