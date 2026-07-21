// ===== BIRTHDAY MAGIC SCRIPT =====

// ---- Particles System ----
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(type) {
    this.type = type;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 4 + 2;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.hue = type === 'sparkle' ? 45 : (Math.random() > 0.5 ? 340 : 280);
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
    this.opacity += (Math.random() - 0.5) * 0.02;
    this.opacity = Math.max(0.1, Math.min(0.7, this.opacity));
    if (this.y < -10) { this.y = canvas.height + 10; this.x = Math.random() * canvas.width; }
    if (this.x < -10) this.x = canvas.width + 10;
    if (this.x > canvas.width + 10) this.x = -10;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    if (this.type === 'sparkle') {
      ctx.fillStyle = `hsl(${this.hue}, 100%, 75%)`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.size * 0.3, this.y);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.lineTo(this.x - this.size * 0.3, this.y);
        ctx.closePath();
      }
      ctx.fill();
    } else {
      ctx.fillStyle = `hsl(${this.hue}, 80%, 80%)`;
      ctx.beginPath();
      const tx = this.x, ty = this.y, s = this.size;
      ctx.moveTo(tx, ty - s * 0.5);
      ctx.bezierCurveTo(tx + s, ty - s * 1.5, tx + s * 1.5, ty + s * 0.3, tx, ty + s);
      ctx.bezierCurveTo(tx - s * 1.5, ty + s * 0.3, tx - s, ty - s * 1.5, tx, ty - s * 0.5);
      ctx.fill();
    }
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(Math.random() > 0.5 ? 'sparkle' : 'heart'));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// ---- Music Control ----
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let musicPlaying = false;

musicToggle.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicToggle.textContent = '🔇';
    musicPlaying = false;
  } else {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {});
    musicToggle.textContent = '🔊';
    musicPlaying = true;
  }
});

function playSfx() {
  const sfx = document.getElementById('sfxPop');
  if (sfx) { sfx.currentTime = 0; sfx.volume = 0.4; sfx.play().catch(() => {}); }
}

// ---- Scene Transitions ----
function goToScene(sceneId) {
  playSfx();
  const current = document.querySelector('.scene.active');
  if (current) {
    current.classList.add('exit');
    current.classList.remove('active');
  }
  setTimeout(() => {
    if (current) current.classList.remove('exit');
    const next = document.getElementById(sceneId);
    if (next) {
      next.classList.add('active');
      if (sceneId === 'scene2') initScene2();
      if (sceneId === 'scene3') initScene3();
      if (sceneId === 'scene5') initPuzzle();
      if (sceneId === 'sceneFlower') initSceneFlower();
      if (sceneId === 'sceneFinal') initFinalScene();
    }
  }, 800);
}

// ---- Confetti Burst ----
function burstConfetti(count = 60) {
  const colors = ['#FFB6C9','#FFD6A5','#D8C4FF','#D8F3DC','#FFE66D','#FF6B6B','#4ECDC4'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = '-10px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = Math.random() * 10 + 5 + 'px';
    el.style.height = Math.random() * 10 + 5 + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.animationDuration = (Math.random() * 2 + 2) + 's';
    el.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ---- Floating Hearts ----
function floatHearts(container, count = 8) {
  const target = typeof container === 'string' ? document.getElementById(container) : container;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.textContent = '❤️';
    h.style.cssText = `position:absolute; font-size:${Math.random()*15+12}px; left:${Math.random()*80+10}%; bottom:${Math.random()*30}%; pointer-events:none; animation:heartFloat ${Math.random()*2+2}s ease forwards; animation-delay:${Math.random()*1}s; z-index:50;`;
    target.appendChild(h);
    setTimeout(() => h.remove(), 4000);
  }
}

// ---- Scene 1: Stars Background ----
(function initScene1Stars() {
  const c = document.getElementById('scene1Stars');
  const emojis = ['✨','⭐','💖','🌸','💫'];
  for (let i = 0; i < 15; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = Math.random() * 90 + 5 + '%';
    s.style.top = Math.random() * 90 + 5 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.fontSize = Math.random() * 15 + 12 + 'px';
    c.appendChild(s);
  }
})();

// ---- Scene 1 Logic ----
function scene1Yes() {
  burstConfetti(40);
  floatHearts('scene1', 6);
  if (!musicPlaying) {
    bgMusic.volume = 0.3;
    bgMusic.play().then(() => { musicPlaying = true; musicToggle.textContent = '🔊'; }).catch(() => {});
  }
  setTimeout(() => goToScene('scene2'), 1000);
}

function scene1No() {
  document.getElementById('catHappy1').style.display = 'none';
  document.getElementById('catAngry1').style.display = 'block';
  document.getElementById('scene1Heading').textContent = 'Then why are u here 😤';
  document.getElementById('scene1Sub').textContent = '';
  document.getElementById('scene1Btns').innerHTML = '<button class="btn btn-primary bounce-in" onclick="scene1GoBack()">GO BACK ❤️</button>';
}

function scene1GoBack() {
  document.getElementById('catHappy1').style.display = 'block';
  document.getElementById('catAngry1').style.display = 'none';
  document.getElementById('scene1Heading').textContent = 'This site is for someone special ✨';
  document.getElementById('scene1Sub').textContent = 'So... are you that special someone?';
  document.getElementById('scene1Btns').innerHTML = `
    <button class="btn btn-primary" onclick="scene1Yes()">YES!! ❤️</button>
    <button class="btn btn-secondary" onclick="scene1No()">NO...? 🙈</button>
  `;
}

// ---- Scene 2 ----
function initScene2() {
  const c = document.getElementById('scene2Balloons');
  c.innerHTML = '';
  // Removed floating emojis, petals, and confetti explosions per request
}

function scene2Yes() {
  burstConfetti(50);
  floatHearts('scene2', 8);
  setTimeout(() => goToScene('scene3'), 1000);
}

function scene2No() {
  document.getElementById('catHappy2').style.display = 'none';
  document.getElementById('catSad2').style.display = 'block';
  document.getElementById('scene2').classList.add('sad-mode');
  const heading = document.getElementById('scene2Heading');
  heading.className = 'heading';
  heading.textContent = "Aww... just give me one chance 🥺";
  document.getElementById('scene2Sub').textContent = '';
  document.getElementById('scene2Btns').innerHTML = '<button class="btn btn-primary bounce-in" onclick="scene2Okay()">Okay Fine ❤️</button>';
}

function scene2Okay() {
  document.getElementById('catHappy2').style.display = 'block';
  document.getElementById('catSad2').style.display = 'none';
  document.getElementById('scene2').classList.remove('sad-mode');
  const heading = document.getElementById('scene2Heading');
  heading.className = 'special-birthday-text';
  heading.textContent = 'HAPPY BIRTHDAY 🎀';
  document.getElementById('scene2Sub').textContent = 'Are you excited for what\'s next?';
  
  // Show ONLY the YES button now!
  document.getElementById('scene2Btns').innerHTML = '<button class="btn btn-primary bounce-in" onclick="scene2Yes()">YES!! ❤️</button>';
  
  floatHearts('scene2', 12);
}

// ---- Scene 3: Blow Candle ----
function initScene3() {
  const c = document.getElementById('scene3Stars');
  if(c) c.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.style.position = 'absolute';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.width = Math.random() * 3 + 1 + 'px';
    s.style.height = s.style.width;
    s.style.backgroundColor = '#fff';
    s.style.borderRadius = '50%';
    s.style.opacity = Math.random() * 0.5 + 0.3;
    s.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate`;
    s.style.animationDelay = (Math.random() * 2) + 's';
    s.style.pointerEvents = 'none';
    if (c) c.appendChild(s);
  }

  // Interactive mouse tracking
  const scene3 = document.getElementById('scene3');
  const cake = document.getElementById('cakeContainer');
  if (scene3) {
    scene3.onmousemove = (e) => {
      // Parallax cake
      if (cake) {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        cake.style.transform = `translate(${x}px, ${y}px)`;
      }
      
      // Spawn Orbs occasionally
      if (Math.random() > 0.8 && !candleBlown) {
        const orb = document.createElement('div');
        orb.className = 'floating-orb';
        orb.style.left = e.pageX + 'px';
        orb.style.top = e.pageY + 'px';
        orb.style.width = Math.random() * 20 + 10 + 'px';
        orb.style.height = orb.style.width;
        document.getElementById('interactiveOrbs').appendChild(orb);
        
        // animate orb
        setTimeout(() => {
          orb.style.transition = 'all 2s ease-out';
          orb.style.transform = `translate(${(Math.random() - 0.5) * 100}px, -100px) scale(0)`;
          orb.style.opacity = '0';
        }, 50);
        setTimeout(() => orb.remove(), 2000);
      }
    };
  }
}

let candleBlown = false;

function blowCandle() {
  if (candleBlown) return;
  candleBlown = true;
  
  const f1 = document.getElementById('flame1');
  const f2 = document.getElementById('flame2');
  const f3 = document.getElementById('flame3');
  if (f1) f1.classList.add('out');
  if (f2) f2.classList.add('out');
  if (f3) f3.classList.add('out');
  
  const btn = document.getElementById('blowBtn');
  if (btn) btn.style.display = 'none';
  
  // Shockwave effect
  const shockwave = document.getElementById('shockwave');
  if (shockwave) shockwave.classList.add('active');
  
  // Clear orbs
  const orbs = document.getElementById('interactiveOrbs');
  if(orbs) orbs.innerHTML = '';
  
  setTimeout(() => {
    const text = document.getElementById('scene3Text');
    const cake = document.getElementById('cakeContainer');
    if (text) {
      text.style.transition = 'opacity 1s, transform 1s';
      text.style.opacity = '0';
      text.style.transform = 'translateY(-20px)';
    }
    if (cake) {
      cake.style.transition = 'opacity 1.5s, transform 1.5s';
      cake.style.opacity = '0';
      cake.style.transform = 'scale(0.8)';
    }
  }, 600);

  burstConfetti(100);
  
  setTimeout(() => {
    const wss = document.getElementById('wishSuccessScreen');
    if (wss) {
      wss.style.display = 'flex';
      setTimeout(() => {
        wss.classList.add('show');
        const star = document.getElementById('shootingStar');
        if(star) star.classList.add('active');
      }, 50);
    }
    floatHearts('scene3', 20);
  }, 1200);
  
  setTimeout(() => goToScene('scene4'), 5500);
}

// Try microphone
(function tryMic() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const mic = audioCtx.createMediaStreamSource(stream);
      mic.connect(analyser);
      analyser.fftSize = 256;
      const data = new Uint8Array(analyser.frequencyBinCount);
      function checkBlow() {
        if (candleBlown) return;
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        if (avg > 50) {
          blowCandle();
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        requestAnimationFrame(checkBlow);
      }
      checkBlow();
      document.getElementById('blowBtn').textContent = '🌬️ Or tap to blow';
    }).catch(() => {});
  }
})();

// ---- Scene 4: Envelope ----
let envelopeOpened = false;
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  playSfx();
  // Flip the flap
  document.getElementById('envelopeBody').classList.add('open');
  // Hide the tap hint
  const hint = document.getElementById('s4TapHint');
  if(hint) hint.style.opacity = '0';
  
  // Step 1: Slide up dummy letter from inside envelope
  setTimeout(() => {
    const dummy = document.getElementById('letterInside');
    if(dummy) dummy.classList.add('slide-up');
  }, 800);

  // Step 2: Hide Phase 1 and show the full letter card
  setTimeout(() => {
    document.getElementById('scene4Phase1').classList.add('hide');
    const card = document.getElementById('letterContainer');
    if(card) card.classList.add('show');
    
    // Step 3: Start typewriter
    setTimeout(() => {
      typewriterEffect();
      floatHearts('scene4', 8);
    }, 800);
  }, 1600);
}

function typewriterEffect() {
  const text = `Today is yours.You are seen,you are heard,you matter a lot. I know u r matured & strong enough to handle things , just leave the hard stuffs that u gothrough dont overthink it , just be happy and even strong hearts needs rest too..... Hope one day u will heal from the things that hurts you & You dont have to be strong with me ,Shakey hands are welcomed here.Unknowingly u makes me happy After a long long time I have been started to smile for a text & thats urs , ur notifications make me happy everyday.Thank You lucky charm💗.\n\nHAPPYYYYY BIRTHDAYYYYY CUTIEEEEE 🎂💕`;
  const container = document.getElementById('letterText');
  container.innerHTML = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      if (text[i] === '\n') {
        container.innerHTML += '<br><br>';
      } else {
        container.innerHTML += text[i];
      }
      i++;
      setTimeout(type, 35);
    } else {
      const btn = document.getElementById('scene4Continue');
      if(btn) { btn.style.display = 'inline-flex'; btn.classList.add('bounce-in'); }
    }
  }
  type();
}

// ---- Scene 5: Birthday Puzzle ----
let puzzlePieces = [];
let selectedPiece = null;
let puzzleImageUrl = 'cat.png'; // default fallback

function initPuzzle() {
  const board = document.getElementById('puzzleBoard');
  board.innerHTML = '';
  puzzlePieces = [];
  selectedPiece = null;
  document.getElementById('puzzleHint').style.display = 'block';
  document.getElementById('puzzleSuccess').style.display = 'none';
  board.style.gap = '3px';
  
  // Create an array 0-8 for positions
  let positions = [0,1,2,3,4,5,6,7,8];
  
  // Shuffle positions array to ensure it is mixed
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  // Create pieces
  for(let i=0; i<9; i++) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.dataset.correctPos = i; 
    piece.dataset.currentPos = positions[i];
    
    // Set background position based on correct Pos
    const row = Math.floor(i / 3);
    const col = i % 3;
    piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
    piece.style.backgroundImage = `url('${puzzleImageUrl}')`;
    
    puzzlePieces.push(piece);
  }
  
  // Append to board in order of currentPos so they show up shuffled
  puzzlePieces.sort((a,b) => parseInt(a.dataset.currentPos) - parseInt(b.dataset.currentPos));
  puzzlePieces.forEach(piece => {
    piece.addEventListener('click', () => handlePieceClick(piece));
    board.appendChild(piece);
  });
}

function handlePieceClick(piece) {
  if (piece.style.pointerEvents === 'none') return;
  
  if(!selectedPiece) {
    selectedPiece = piece;
    piece.classList.add('selected');
    playSfx();
  } else {
    if (selectedPiece !== piece) {
      swapPieces(selectedPiece, piece);
      playSfx();
      setTimeout(checkPuzzleComplete, 100);
    }
    selectedPiece.classList.remove('selected');
    selectedPiece = null;
  }
}

function swapPieces(p1, p2) {
  const tempPos = p1.dataset.currentPos;
  p1.dataset.currentPos = p2.dataset.currentPos;
  p2.dataset.currentPos = tempPos;
  
  const board = document.getElementById('puzzleBoard');
  const sibling1 = p1.nextSibling === p2 ? p1 : p1.nextSibling;
  p2.parentNode.insertBefore(p1, p2);
  p1.parentNode.insertBefore(p2, sibling1);
}

function checkPuzzleComplete() {
  const pieces = document.querySelectorAll('.puzzle-piece');
  let isComplete = true;
  pieces.forEach(p => {
    if(p.dataset.correctPos !== p.dataset.currentPos) {
      isComplete = false;
    }
  });
  
  if(isComplete) {
    playSfx();
    document.getElementById('puzzleHint').style.display = 'none';
    document.getElementById('puzzleSuccess').style.display = 'block';
    burstConfetti(100);
    pieces.forEach(p => {
      p.style.pointerEvents = 'none';
      p.style.transition = 'all 0.5s';
      p.style.border = 'none';
    });
    document.getElementById('puzzleBoard').style.gap = '0px';
  }
}

function handlePuzzleUpload(event) {
  const file = event.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      puzzleImageUrl = e.target.result;
      initPuzzle();
    }
    reader.readAsDataURL(file);
  }
}

// ---- Scene Flower (Placeholder) ----
// Logic removed, currently an empty placeholder

// ---- Scene 6: Gift ----
let giftOpened = false;
let giftClicks = 0;
function openGift() {
  if (giftOpened) return;
  giftClicks++;
  const gc = document.getElementById('giftContainer');
  gc.classList.add('shake');
  playSfx();
  setTimeout(() => gc.classList.remove('shake'), 500);
  if (giftClicks >= 3) {
    giftOpened = true;
    gc.classList.add('opened');
    burstConfetti(100);
    setTimeout(() => {
      gc.style.display = 'none';
      document.getElementById('giftSurprise').classList.add('show');
      floatHearts('scene6', 12);
    }, 1000);
  }
}

// ---- Scene 7: Removed (Empty Placeholder) ----

// ---- Final Scene ----
function initFinalScene() {
  const sc = document.getElementById('starsContainer');
  const fc = document.getElementById('firefliesContainer');
  sc.innerHTML = '';
  fc.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.textContent = Math.random() > 0.7 ? '⭐' : '✦';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.color = 'rgba(255,255,255,0.7)';
    s.style.fontSize = Math.random() * 10 + 8 + 'px';
    s.style.animationDelay = Math.random() * 4 + 's';
    s.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    sc.appendChild(s);
  }
  for (let i = 0; i < 15; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = Math.random() * 90 + 5 + '%';
    f.style.top = Math.random() * 80 + 10 + '%';
    f.style.animationDelay = Math.random() * 5 + 's';
    f.style.animationDuration = (Math.random() * 4 + 4) + 's';
    fc.appendChild(f);
  }
  // Floating lanterns in background
  for (let i = 0; i < 6; i++) {
    const l = document.createElement('div');
    l.style.cssText = `position:absolute; font-size:${Math.random()*20+20}px; left:${Math.random()*80+10}%; bottom:${Math.random()*40+10}%; opacity:0.4; animation: riseLantern ${Math.random()*6+6}s ease-in-out infinite; animation-delay:${Math.random()*3}s;`;
    l.textContent = '🏮';
    sc.appendChild(l);
  }
}

// ---- Replay ----
function replayAll() {
  // Reset all states
  candleBlown = false;
  envelopeOpened = false;
  giftOpened = false;
  giftClicks = 0;
  lanternTapCount = 0;

  // Reset scene 1
  document.getElementById('catHappy1').style.display = 'block';
  document.getElementById('catAngry1').style.display = 'none';
  document.getElementById('scene1Heading').textContent = 'This site is for someone special ✨';
  document.getElementById('scene1Sub').textContent = 'So... are you that special someone?';
  document.getElementById('scene1Btns').innerHTML = `
    <button class="btn btn-primary" onclick="scene1Yes()">YES!! ❤️</button>
    <button class="btn btn-secondary" onclick="scene1No()">NO...? 🙈</button>
  `;

  // Reset scene 2
  document.getElementById('catHappy2').style.display = 'block';
  document.getElementById('catSad2').style.display = 'none';
  document.getElementById('scene2Heading').textContent = 'HAPPY BIRTHDAY ❤️';
  document.getElementById('scene2Sub').textContent = 'Are you excited for what\'s next?';
  document.getElementById('scene2Btns').innerHTML = `
    <button class="btn btn-primary" onclick="scene2Yes()">YES!! ❤️</button>
    <button class="btn btn-secondary" onclick="scene2No()">NO...? 🙈</button>
  `;

  // Reset scene 3
  const f1 = document.getElementById('flame1');
  const f2 = document.getElementById('flame2');
  const f3 = document.getElementById('flame3');
  if (f1) f1.classList.remove('out');
  if (f2) f2.classList.remove('out');
  if (f3) f3.classList.remove('out');
  
  const blowBtn = document.getElementById('blowBtn');
  if(blowBtn) blowBtn.style.display = '';
  
  const wss = document.getElementById('wishSuccessScreen');
  if(wss) {
    wss.style.display = 'none';
    wss.classList.remove('show');
  }
  const star = document.getElementById('shootingStar');
  if(star) star.classList.remove('active');
  
  const text = document.getElementById('scene3Text');
  if(text) {
    text.style.opacity = '1';
    text.style.transform = 'translateY(0)';
  }
  const cake = document.getElementById('cakeContainer');
  if(cake) {
    cake.style.opacity = '1';
    cake.style.transform = 'scale(1)';
  }
  const shockwave = document.getElementById('shockwave');
  if(shockwave) shockwave.classList.remove('active');

  // Reset scene 4
  envelopeOpened = false;
  const eb = document.getElementById('envelopeBody');
  if(eb) eb.classList.remove('open');
  const dummy = document.getElementById('letterInside');
  if(dummy) dummy.classList.remove('slide-up');
  const phase1 = document.getElementById('scene4Phase1');
  if(phase1) phase1.classList.remove('hide');
  const lc = document.getElementById('letterContainer');
  if(lc) lc.classList.remove('show');
  const lt = document.getElementById('letterText');
  if(lt) lt.innerHTML = '';
  const s4c = document.getElementById('scene4Continue');
  if(s4c) s4c.style.display = 'none';
  const hint = document.getElementById('s4TapHint');
  if(hint) hint.style.opacity = '1';

  // Reset scene 5 (Puzzle)
  const pb = document.getElementById('puzzleBoard');
  if(pb) pb.innerHTML = '';
  const ph = document.getElementById('puzzleHint');
  if(ph) ph.style.display = 'block';
  const ps = document.getElementById('puzzleSuccess');
  if(ps) ps.style.display = 'none';

  // Reset scene 6
  const gc = document.getElementById('giftContainer');
  if(gc) {
    gc.classList.remove('opened');
    gc.style.display = '';
  }
  const gs = document.getElementById('giftSurprise');
  if(gs) gs.classList.remove('show');

  // Reset scene 7 (Empty)
  const ct = document.getElementById('constellationText');
  if(ct) ct.classList.remove('show');

  // Go back to scene 1
  goToScene('scene1');
}

// ---- Add sparkle on click anywhere ----
document.addEventListener('click', (e) => {
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('span');
    s.textContent = ['✨','💖','⭐','🌟','💫'][Math.floor(Math.random()*5)];
    s.style.cssText = `position:fixed; left:${e.clientX + (Math.random()-0.5)*40}px; top:${e.clientY + (Math.random()-0.5)*40}px; font-size:${Math.random()*12+10}px; pointer-events:none; z-index:9999; animation:heartFloat ${Math.random()+1}s ease forwards;`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2000);
  }
});
