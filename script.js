/**
 * PORTFOLIO SCRIPT
 * Author: Daphal Dnyandev
 * Description: Interactive JavaScript modules powering theme switching, dynamic typing,
 *              particle background canvas, real-time form validation, modals, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. THEME SWITCHER (DARK / LIGHT) WITH LOCAL STORAGE
  // ==========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      if (typeof update3dThemeColors === 'function') {
        update3dThemeColors(newTheme);
      }
      playUiSound('chime');
      showToast('Theme Changed', `Switched to ${newTheme} mode.`, 'info');
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  // ==========================================================================
  // 2. DYNAMIC TYPING EFFECT
  // ==========================================================================
  const typedTextElement = document.getElementById('typedText');
  const roles = [
    'Full Stack Web Developer',
    'BCS Student',
    'Frontend & Backend Developer',
    'JavaScript & React Specialist',
    'Passionate Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function handleTyping() {
    if (!typedTextElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before new word
    }

    setTimeout(handleTyping, typingSpeed);
  }

  setTimeout(handleTyping, 600);

  // ==========================================================================
  // 3. NAVBAR SCROLL EFFECT & ACTIVE NAVIGATION LINK HIGHLIGHTING
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollPos / docHeight) * 100;

    // 1. Reading Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // 2. Navbar Scrolled Glass Effect
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // 3. Highlight Active Section in Navbar
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ==========================================================================
  // 4. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const closeMobileDrawerBtn = document.getElementById('closeMobileDrawerBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mobileResumeBtn = document.getElementById('mobileResumeBtn');

  function openMobileMenu() {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.add('open');
      mobileBackdrop.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.remove('open');
      mobileBackdrop.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (closeMobileDrawerBtn) closeMobileDrawerBtn.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  if (mobileResumeBtn) {
    mobileResumeBtn.addEventListener('click', () => {
      closeMobileMenu();
      openResumeModal();
    });
  }

  // ==========================================================================
  // UI SOUND SYNTHESIZER (WEB AUDIO API - ZERO EXTERNAL ASSET DEPENDENCY)
  // ==========================================================================
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIconOff = document.getElementById('soundIconOff');
  const soundIconOn = document.getElementById('soundIconOn');
  let isSoundActive = false;
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playUiSound(type = 'blip', freq = 740, duration = 0.05) {
    if (!isSoundActive) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      if (type === 'blip') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } else if (type === 'chime') {
        const chord = [523.25, 659.25, 783.99]; // C5, E5, G5
        chord.forEach((f, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.05);

          gain.gain.setValueAtTime(0.045, audioCtx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.05 + 0.28);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(audioCtx.currentTime + i * 0.05);
          osc.stop(audioCtx.currentTime + i * 0.05 + 0.28);
        });
      } else if (type === 'success') {
        const notes = [440, 554.37, 659.25, 880]; // A major fanfare
        notes.forEach((f, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.07);

          gain.gain.setValueAtTime(0.05, audioCtx.currentTime + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.07 + 0.35);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(audioCtx.currentTime + i * 0.07);
          osc.stop(audioCtx.currentTime + i * 0.07 + 0.35);
        });
      }
    } catch (e) {
      // Audio autoplay policy
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudioContext();
      isSoundActive = !isSoundActive;

      if (isSoundActive) {
        soundToggleBtn.classList.add('sound-active');
        if (soundIconOff) soundIconOff.style.display = 'none';
        if (soundIconOn) soundIconOn.style.display = 'block';
        playUiSound('chime');
        showToast('Audio Effects Enabled 🔊', 'Interactive UI chimes are active.', 'info');
      } else {
        soundToggleBtn.classList.remove('sound-active');
        if (soundIconOff) soundIconOff.style.display = 'block';
        if (soundIconOn) soundIconOn.style.display = 'none';
        showToast('Audio Muted 🔇', 'Sound effects turned off.', 'info');
      }
    });
  }

  // Micro-sound hooks on interactive elements
  document.querySelectorAll('.btn, .social-icon-btn, .tab-btn, .filter-chip, .project-filter-btn').forEach((elem) => {
    elem.addEventListener('mouseenter', () => playUiSound('blip', 700, 0.03));
    elem.addEventListener('click', () => playUiSound('blip', 880, 0.05));
  });

  // ==========================================================================
  // 5. IMMERSIVE THREE.JS 3D BACKGROUND ENGINE
  // ==========================================================================
  const webglCanvas = document.getElementById('webglCanvas');
  const toggle3dModeBtn = document.getElementById('toggle3dModeBtn');
  const dock3dModeBtn = document.getElementById('dock3dModeBtn');
  const mode3dLabel = document.getElementById('mode3dLabel');

  const modes3D = ['Wave', 'Warp', 'Crystals'];
  let current3dModeIndex = 0;
  let update3dThemeColors = null;
  let trigger3dShockwave = null;
  let threeJsActive = false;

  if (typeof THREE !== 'undefined' && webglCanvas) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
      camera.position.set(0, 140, 520);

      const renderer = new THREE.WebGLRenderer({
        canvas: webglCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Depth Fog
      const isInitialDark = htmlRoot.getAttribute('data-theme') !== 'light';
      scene.fog = new THREE.FogExp2(isInitialDark ? 0x090d16 : 0xf8fafc, 0.0014);

      // Camera Lerp Targets
      let mouseX = 0, mouseY = 0;
      let targetCamX = 0, targetCamY = 140, targetCamZ = 520;

      // Group Containers for 3 Scenes
      const waveGroup = new THREE.Group();
      const warpGroup = new THREE.Group();
      const crystalGroup = new THREE.Group();

      scene.add(waveGroup);
      scene.add(warpGroup);
      scene.add(crystalGroup);

      warpGroup.visible = false;
      crystalGroup.visible = false;

      // Particle texture generator (Glowing Circular Orbs)
      function createParticleTexture() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const pCtx = pCanvas.getContext('2d');
        const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.25, 'rgba(6, 182, 212, 0.9)');
        grad.addColorStop(0.65, 'rgba(139, 92, 246, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(pCanvas);
      }

      const particleTexture = createParticleTexture();

      // ----------------------------------------------------------------------
      // SCENE 1: 3D CYBER WAVE MATRIX & FLOATING NEON POLYHEDRA
      // ----------------------------------------------------------------------
      const gridX = 46;
      const gridZ = 46;
      const particleCountWave = gridX * gridZ;
      const waveSpacing = 28;

      const waveGeometry = new THREE.BufferGeometry();
      const wavePositions = new Float32Array(particleCountWave * 3);
      const waveColors = new Float32Array(particleCountWave * 3);

      const colorCyan = new THREE.Color(0x06b6d4);
      const colorPurple = new THREE.Color(0x8b5cf6);
      const colorEmerald = new THREE.Color(0x10b981);

      let pIdx = 0;
      for (let ix = 0; ix < gridX; ix++) {
        for (let iz = 0; iz < gridZ; iz++) {
          const x = (ix - gridX / 2) * waveSpacing;
          const z = (iz - gridZ / 2) * waveSpacing;

          wavePositions[pIdx * 3] = x;
          wavePositions[pIdx * 3 + 1] = 0;
          wavePositions[pIdx * 3 + 2] = z;

          const ratio = (ix + iz) / (gridX + gridZ);
          const c = colorCyan.clone().lerp(colorPurple, ratio);
          waveColors[pIdx * 3] = c.r;
          waveColors[pIdx * 3 + 1] = c.g;
          waveColors[pIdx * 3 + 2] = c.b;

          pIdx++;
        }
      }

      waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
      waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

      const waveMaterial = new THREE.PointsMaterial({
        size: 8.5,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: isInitialDark ? 0.88 : 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
      wavePoints.position.y = -65;
      waveGroup.add(wavePoints);

      // Wireframe Floating Polyhedra
      const polyMatCyan = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.38
      });
      const polyMatPurple = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const polyMatEmerald = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.32
      });

      // 1. Torus Knot
      const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(26, 4.5, 75, 14), polyMatCyan);
      torusKnot.position.set(380, 110, -220);
      waveGroup.add(torusKnot);

      // 2. Icosahedron
      const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(40, 1), polyMatPurple);
      icosahedron.position.set(-360, 70, -160);
      waveGroup.add(icosahedron);

      // 3. Octahedron
      const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(28, 0), polyMatEmerald);
      octahedron.position.set(190, -35, 70);
      waveGroup.add(octahedron);

      // Shockwave state
      let shockwaveTime = 999;
      let shockwaveOriginX = 0, shockwaveOriginZ = 0;

      trigger3dShockwave = (x, z) => {
        shockwaveTime = 0;
        shockwaveOriginX = x || 0;
        shockwaveOriginZ = z || 0;
      };

      // ----------------------------------------------------------------------
      // SCENE 2: 3D HYPERDRIVE STARFIELD WARP
      // ----------------------------------------------------------------------
      const starCount = 1800;
      const warpGeometry = new THREE.BufferGeometry();
      const warpPositions = new Float32Array(starCount * 3);
      const warpColors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        warpPositions[i * 3] = (Math.random() - 0.5) * 2000;
        warpPositions[i * 3 + 1] = (Math.random() - 0.5) * 1400;
        warpPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        const starColor = Math.random() > 0.5 ? colorCyan : colorPurple;
        warpColors[i * 3] = starColor.r;
        warpColors[i * 3 + 1] = starColor.g;
        warpColors[i * 3 + 2] = starColor.b;
      }

      warpGeometry.setAttribute('position', new THREE.BufferAttribute(warpPositions, 3));
      warpGeometry.setAttribute('color', new THREE.BufferAttribute(warpColors, 3));

      const warpMaterial = new THREE.PointsMaterial({
        size: 5.5,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const warpPoints = new THREE.Points(warpGeometry, warpMaterial);
      warpGroup.add(warpPoints);

      // ----------------------------------------------------------------------
      // SCENE 3: 3D ORBITING CRYSTALS & CYBER RINGS
      // ----------------------------------------------------------------------
      const crystalCore = new THREE.Mesh(new THREE.DodecahedronGeometry(62, 1), polyMatPurple);
      crystalCore.position.set(0, 0, 0);
      crystalGroup.add(crystalCore);

      const innerCrystal = new THREE.Mesh(new THREE.IcosahedronGeometry(36, 0), polyMatCyan);
      crystalCore.add(innerCrystal);

      const ring1 = new THREE.Mesh(new THREE.RingGeometry(110, 114, 64), polyMatCyan);
      ring1.rotation.x = Math.PI / 3;
      crystalGroup.add(ring1);

      const ring2 = new THREE.Mesh(new THREE.RingGeometry(152, 155, 64), polyMatEmerald);
      ring2.rotation.y = Math.PI / 4;
      crystalGroup.add(ring2);

      const satCount = 450;
      const satGeometry = new THREE.BufferGeometry();
      const satPositions = new Float32Array(satCount * 3);
      for (let i = 0; i < satCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = 135 + Math.random() * 220;
        satPositions[i * 3] = Math.cos(angle) * rad;
        satPositions[i * 3 + 1] = (Math.random() - 0.5) * 130;
        satPositions[i * 3 + 2] = Math.sin(angle) * rad;
      }
      satGeometry.setAttribute('position', new THREE.BufferAttribute(satPositions, 3));
      const satPoints = new THREE.Points(satGeometry, waveMaterial);
      crystalGroup.add(satPoints);

      // ----------------------------------------------------------------------
      // THEME UPDATER FOR 3D
      // ----------------------------------------------------------------------
      update3dThemeColors = (theme) => {
        const isDark = theme === 'dark';
        scene.fog.color.setHex(isDark ? 0x090d16 : 0xf8fafc);
        waveMaterial.opacity = isDark ? 0.88 : 0.62;
        warpMaterial.opacity = isDark ? 0.9 : 0.62;
        polyMatCyan.opacity = isDark ? 0.38 : 0.45;
        polyMatPurple.opacity = isDark ? 0.35 : 0.42;
      };

      // ----------------------------------------------------------------------
      // TICK LOOP
      // ----------------------------------------------------------------------
      let clock = new THREE.Clock();

      function animate3D() {
        requestAnimationFrame(animate3D);

        const elapsedTime = clock.getElapsedTime();
        shockwaveTime += 0.035;

        // Camera Lerp
        camera.position.x += (targetCamX - camera.position.x) * 0.04;
        camera.position.y += (targetCamY - camera.position.y) * 0.04;
        camera.position.z += (targetCamZ - camera.position.z) * 0.04;
        camera.lookAt(0, 0, 0);

        // 1. Wave scene
        if (waveGroup.visible) {
          const positions = waveGeometry.attributes.position.array;
          let idx = 0;

          for (let ix = 0; ix < gridX; ix++) {
            for (let iz = 0; iz < gridZ; iz++) {
              const xPos = positions[idx * 3];
              const zPos = positions[idx * 3 + 2];

              let y = Math.sin(ix * 0.32 + elapsedTime * 1.5) * 22 +
                Math.cos(iz * 0.32 + elapsedTime * 1.2) * 22;

              if (shockwaveTime < 4.0) {
                const dist = Math.sqrt((xPos - shockwaveOriginX) ** 2 + (zPos - shockwaveOriginZ) ** 2);
                const waveRadius = shockwaveTime * 230;
                const waveWidth = 75;
                if (Math.abs(dist - waveRadius) < waveWidth) {
                  const strength = (1 - shockwaveTime / 4.0) * 45;
                  y += Math.sin(((dist - waveRadius) / waveWidth) * Math.PI) * strength;
                }
              }

              positions[idx * 3 + 1] = y;
              idx++;
            }
          }
          waveGeometry.attributes.position.needsUpdate = true;

          torusKnot.rotation.x = elapsedTime * 0.35;
          torusKnot.rotation.y = elapsedTime * 0.45;

          icosahedron.rotation.x = elapsedTime * 0.25;
          icosahedron.rotation.z = elapsedTime * 0.3;

          octahedron.rotation.y = elapsedTime * 0.4;
          octahedron.rotation.z = elapsedTime * 0.2;
        }

        // 2. Warp scene
        if (warpGroup.visible) {
          const wPositions = warpGeometry.attributes.position.array;
          for (let i = 0; i < starCount; i++) {
            wPositions[i * 3 + 2] += 9;
            if (wPositions[i * 3 + 2] > 700) {
              wPositions[i * 3 + 2] = -1200;
            }
          }
          warpGeometry.attributes.position.needsUpdate = true;
          warpGroup.rotation.z = elapsedTime * 0.05;
        }

        // 3. Crystals scene
        if (crystalGroup.visible) {
          crystalCore.rotation.x = elapsedTime * 0.3;
          crystalCore.rotation.y = elapsedTime * 0.4;
          innerCrystal.rotation.y = -elapsedTime * 0.6;

          ring1.rotation.z = elapsedTime * 0.25;
          ring2.rotation.x = -elapsedTime * 0.2;

          satPoints.rotation.y = elapsedTime * 0.15;
        }

        renderer.render(scene, camera);
      }

      animate3D();
      threeJsActive = true;
      const fallback2dCanvas = document.getElementById('ambientCanvas');
      if (fallback2dCanvas) fallback2dCanvas.style.display = 'none';

      // Mouse & Scroll Parallax
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;

        targetCamX = mouseX * 220;
        targetCamY = 140 - (mouseY * 160);
      }, { passive: true });

      window.addEventListener('scroll', () => {
        const scrollFraction = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
        targetCamZ = 520 + scrollFraction * 260;
        targetCamY = 140 - scrollFraction * 120;
      }, { passive: true });

      window.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input, textarea, select')) return;
        const clickX = (e.clientX / window.innerWidth - 0.5) * 600;
        const clickZ = (e.clientY / window.innerHeight - 0.5) * 400;
        if (trigger3dShockwave) trigger3dShockwave(clickX, clickZ);
        playUiSound('blip', 660, 0.05);
      });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, { passive: true });

      // 3D Mode Switcher
      function cycle3dMode() {
        current3dModeIndex = (current3dModeIndex + 1) % modes3D.length;
        const mode = modes3D[current3dModeIndex];

        waveGroup.visible = mode === 'Wave';
        warpGroup.visible = mode === 'Warp';
        crystalGroup.visible = mode === 'Crystals';

        if (mode3dLabel) {
          mode3dLabel.textContent = `3D: ${mode}`;
        }

        showToast('3D Scene Changed', `Active 3D Effect: "${mode}" Mode`, 'info');
        playUiSound('chime');
      }

      if (toggle3dModeBtn) toggle3dModeBtn.addEventListener('click', cycle3dMode);
      if (dock3dModeBtn) dock3dModeBtn.addEventListener('click', cycle3dMode);

    } catch (err) {
      console.warn('Three.js initialization notice:', err);
    }
  }

  // Fallback 2D Canvas if Three.js is not active
  const canvas = document.getElementById('ambientCanvas');
  if (canvas && !threeJsActive) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        const isDark = htmlRoot.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(6, 182, 212, ${this.alpha})`
          : `rgba(2, 132, 199, ${this.alpha * 0.6})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      const isDark = htmlRoot.getAttribute('data-theme') !== 'light';

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(139, 92, 246, ${lineAlpha})`
              : `rgba(99, 102, 241, ${lineAlpha * 0.7})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(renderParticles);
    }

    requestAnimationFrame(renderParticles);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });
  }

  // ==========================================================================
  // 6. 3D TILT EFFECT ON CARDS, SPOTLIGHT GLARE & INTERACTIVE BADGES
  // ==========================================================================
  const profileCard = document.getElementById('profile3dCard');
  const tiltableCards = document.querySelectorAll('#profile3dCard, .project-card, .skill-card, .profile-details-card, .stat-card, .testimonial-card');

  if (window.innerWidth > 992) {
    tiltableCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        const tiltX = (deltaY / centerY) * -7;
        const tiltY = (deltaX / centerX) * 7;

        // Set CSS variables for dynamic radial glare tracking
        const pctX = ((x / rect.width) * 100).toFixed(1);
        const pctY = ((y / rect.height) * 100).toFixed(1);
        card.style.setProperty('--mouse-x', `${pctX}%`);
        card.style.setProperty('--mouse-y', `${pctY}%`);

        if (card.id === 'profile3dCard') {
          const profileTiltX = (deltaY / centerY) * -13;
          const profileTiltY = (deltaX / centerX) * 13;
          card.classList.add('is-interacting');
          card.style.transform = `perspective(1200px) rotateX(${profileTiltX.toFixed(2)}deg) rotateY(${profileTiltY.toFixed(2)}deg) translateY(-8px) scale3d(1.04, 1.04, 1.04)`;
        } else {
          card.style.transform = `perspective(1000px) rotateX(${(tiltX * 0.75).toFixed(2)}deg) rotateY(${(tiltY * 0.75).toFixed(2)}deg) translateY(-4px)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        if (card.id === 'profile3dCard') {
          card.classList.remove('is-interacting');
          card.style.transform = '';
        } else {
          card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        }
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });

    if (profileCard) {
      profileCard.addEventListener('touchmove', (e) => {
        if (!e.touches[0]) return;
        const touch = e.touches[0];
        const rect = profileCard.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const deltaX = x - rect.width / 2;
        const deltaY = y - rect.height / 2;
        const tiltX = (deltaY / (rect.height / 2)) * -10;
        const tiltY = (deltaX / (rect.width / 2)) * 10;
        profileCard.classList.add('is-interacting');
        profileCard.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      }, { passive: true });

      profileCard.addEventListener('touchend', () => {
        profileCard.classList.remove('is-interacting');
        profileCard.style.transform = '';
      });
    }
  }

  // Interactive Floating Badges Clicks & Sound Feedback
  const floatingBadges = document.querySelectorAll('.floating-badge');
  floatingBadges.forEach((badge) => {
    badge.addEventListener('mouseenter', () => {
      playUiSound('pop', 720, 0.04);
    });

    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      playUiSound('chime', 960, 0.08);

      const badgeType = badge.getAttribute('data-badge');
      if (badgeType === 'experience') {
        const expSection = document.getElementById('experience');
        if (expSection) expSection.scrollIntoView({ behavior: 'smooth' });
        showToast('3+ Years Experience', 'Navigating to career timeline & roles.', 'info');
      } else if (badgeType === 'projects') {
        const projSection = document.getElementById('projects');
        if (projSection) projSection.scrollIntoView({ behavior: 'smooth' });
        showToast('25+ Projects', 'Explore featured full-stack production builds.', 'info');
      } else if (badgeType === 'quality') {
        const skillsSection = document.getElementById('skills');
        if (skillsSection) skillsSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Clean Architecture', '100% responsive, accessible & modular code.', 'success');
      } else if (badgeType === 'speed') {
        showToast('98/100 Performance', 'Sub-second load times & 60fps animations.', 'success');
      }
    });
  });

  // ==========================================================================
  // 7. SCROLL REVEAL & STATS COUNTER ANIMATION
  // ==========================================================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  const statCounters = document.querySelectorAll('.counter');
  let hasCountersAnimated = false;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, unobserve to maintain performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Counter animation
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasCountersAnimated) {
          hasCountersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(statsSection);
  }

  function animateCounters() {
    statCounters.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 1600; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * target);

        counter.textContent = currentCount.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ==========================================================================
  // 8. ABOUT TABS INTERACTION
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPaneId = btn.getAttribute('aria-controls');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 9. SKILLS FILTERING & PROGRESS BAR FILL
  // ==========================================================================
  const skillFilters = document.querySelectorAll('.filter-chip');
  const skillCards = document.querySelectorAll('.skill-card');
  const skillSection = document.getElementById('skills');

  // Trigger progress bar animations when Skills section enters view
  let hasSkillsAnimated = false;
  if (skillSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasSkillsAnimated) {
          hasSkillsAnimated = true;
          fillSkillBars();
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillSection);
  }

  function fillSkillBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar) => {
      const width = bar.getAttribute('data-width');
      bar.style.width = width;
    });
  }

  skillFilters.forEach((chip) => {
    chip.addEventListener('click', () => {
      skillFilters.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const category = chip.getAttribute('data-category');

      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory.includes(category)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ==========================================================================
  // 10. PROJECTS FILTERING & CASE STUDY MODAL
  // ==========================================================================
  const projectFilters = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category.includes(filterVal)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Project Details Database
  const projectData = {
    neuroanalytix: {
      title: 'NeuroAnalytix — Enterprise AI Analytics Suite',
      category: 'Full Stack & AI Dashboard',
      image: 'assets/images/project-saas.jpg',
      description:
        'NeuroAnalytix is an end-to-end telemetry dashboard engineered to monitor production machine learning models, streaming predictions, error distributions, and system throughput in real-time. Built with a high-performance React frontend and an asynchronous Python/Node backend.',
      features: [
        'Real-time data visualization with dynamic SVG/Canvas graphs and anomaly alerts.',
        'Sub-second query responses via aggregated caching with Redis.',
        'Secure multi-tenant workspace with role-based access control (RBAC).',
        'Exportable executive telemetry reports in PDF and CSV formats.'
      ],
      stack: ['React', 'TypeScript', 'Node.js', 'Chart.js', 'Python', 'Redis', 'Docker']
    },
    neogear: {
      title: 'NeoGear — Next-Gen Cyber Hardware Store',
      category: 'Full Stack E-Commerce',
      image: 'assets/images/project-ecommerce.jpg',
      description:
        'A high-conversion e-commerce platform designed for cutting-edge electronics and accessories. It combines seamless client-side filtering, instantaneous cart drawer synchronization, Stripe secure payments, and a scalable inventory management backend.',
      features: [
        'Instant animated slide-over shopping cart drawer with optimistic updates.',
        'Real-time inventory decrementing and Stripe payment checkout integration.',
        'Comprehensive product search, multi-attribute filter matrix, and wishlist.',
        'Lighthouse Performance score of 98 with automated image optimization.'
      ],
      stack: ['Next.js', 'Stripe API', 'Zustand', 'PostgreSQL', 'TailwindCSS', 'Vercel']
    },
    devflow: {
      title: 'DevFlow — Real-Time Developer Workspace',
      category: 'Collaborative Web Application',
      image: 'assets/images/project-collab.jpg',
      description:
        'DevFlow brings synchronized pair-programming and agile sprint planning into a single browser interface. Developers can write code collaboratively with multi-cursor presence, manage sprint cards on an interactive Kanban board, and test code snippets in real-time.',
      features: [
        'Bidirectional WebSocket collaboration engine supporting simultaneous editors.',
        'Monaco Code Editor integration with multi-language syntax highlighting.',
        'Drag-and-drop Kanban task management board with real-time lane updates.',
        'In-browser terminal simulator for command verification.'
      ],
      stack: ['WebSockets', 'Monaco Editor', 'Node.js', 'Express', 'Redis', 'Docker']
    },
    aurafin: {
      title: 'AuraFin — Wealth & Stock Analytics Dashboard',
      category: 'FinTech & Web3 Analytics',
      image: 'assets/images/project-fintech.jpg',
      description:
        'A comprehensive financial tracking system uniting traditional equity holdings and cryptocurrency wallets into a unified net-worth portfolio. Provides live currency conversion, historical profit/loss curves, and risk exposure breakdown.',
      features: [
        'Live financial market ticker integration with sub-second polling.',
        'Interactive profit & loss time-series charts with custom date-range zooming.',
        'Secure multi-currency wallet tracking with offline encryption.',
        'Dynamic tax calculation preview for capital gains reporting.'
      ],
      stack: ['JavaScript ES6+', 'Financial APIs', 'HTML5 Canvas', 'CSS Grid', 'FastAPI']
    },
    medivita: {
      title: 'MediVita — Telehealth & Patient Wellness Portal',
      category: 'HealthTech & Telemetry',
      image: 'assets/images/project-health.jpg',
      description:
        'A mission-critical patient care platform enabling doctors to monitor vital signs (heart rate, SpO2, blood pressure) in real time. Features automated critical alert triggers and end-to-end encrypted medical teleconsultation scheduling.',
      features: [
        'Continuous vital sign graph rendering with anomaly threshold warnings.',
        'HIPAA-aligned encrypted patient medical history archive and notes.',
        'Integrated doctor calendar scheduling with automatic appointment notifications.',
        'Emergency alert broadcast system for high-risk triage cases.'
      ],
      stack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'WebRTC', 'Tailwind']
    },
    portfolio: {
      title: 'Engineered Portfolio — Speed & Responsiveness',
      category: 'Personal Portfolio & Design System',
      image: 'assets/images/profile-dnyandev.jpg?v=2026',
      description:
        'This very portfolio website! Crafted with zero bloated external UI frameworks to demonstrate deep mastery of vanilla web foundations: semantic HTML5, modern CSS3 layout & custom properties, and modular ES6 JavaScript with interactive canvas effects.',
      features: [
        '100% responsive fluid design optimized for all screen sizes and orientations.',
        'Subtle particle canvas simulation responding to user interaction.',
        'Strict real-time client-side contact form validation with visual feedback.',
        'Interactive CV reader with browser print-to-PDF formatting.'
      ],
      stack: ['HTML5', 'Modern CSS3', 'ES6+ JavaScript', 'Canvas API', 'FontAwesome']
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseBtnFooter = document.getElementById('modalCloseBtnFooter');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectCategory = document.getElementById('modalProjectCategory');
  const modalProjectImage = document.getElementById('modalProjectImage');
  const modalProjectDesc = document.getElementById('modalProjectDesc');
  const modalProjectFeatures = document.getElementById('modalProjectFeatures');
  const modalProjectStack = document.getElementById('modalProjectStack');
  const modalSimulateLiveBtn = document.getElementById('modalSimulateLiveBtn');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    modalProjectTitle.textContent = data.title;
    modalProjectCategory.textContent = data.category;
    modalProjectImage.src = data.image;
    modalProjectImage.alt = data.title;
    modalProjectDesc.textContent = data.description;

    // Populate Features
    modalProjectFeatures.innerHTML = '';
    data.features.forEach((feat) => {
      const li = document.createElement('li');
      li.textContent = feat;
      modalProjectFeatures.appendChild(li);
    });

    // Populate Tech Pills
    modalProjectStack.innerHTML = '';
    data.stack.forEach((tech) => {
      const pill = document.createElement('span');
      pill.className = 'modal-tech-pill';
      pill.textContent = tech;
      modalProjectStack.appendChild(pill);
    });

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Attach event listeners for details triggers
  document.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  // Live Demo Triggers
  document.querySelectorAll('.live-demo-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      showToast('Live Preview', `Launching interactive sandbox for "${data ? data.title : 'Project'}"...`, 'success');
      setTimeout(() => {
        openProjectModal(projectId);
      }, 400);
    });
  });

  if (modalSimulateLiveBtn) {
    modalSimulateLiveBtn.addEventListener('click', () => {
      showToast('Demo Environment', 'Connecting to deployed sandbox environment. Enjoy exploring!', 'success');
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalCloseBtnFooter) modalCloseBtnFooter.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  // ==========================================================================
  // 11. TIMELINE SWITCHER (EXPERIENCE VS EDUCATION)
  // ==========================================================================
  const btnShowExperience = document.getElementById('btnShowExperience');
  const btnShowEducation = document.getElementById('btnShowEducation');
  const experienceTimeline = document.getElementById('experienceTimeline');
  const educationTimeline = document.getElementById('educationTimeline');

  if (btnShowExperience && btnShowEducation && experienceTimeline && educationTimeline) {
    btnShowExperience.addEventListener('click', () => {
      btnShowExperience.classList.add('active');
      btnShowEducation.classList.remove('active');
      experienceTimeline.style.display = 'block';
      educationTimeline.style.display = 'none';
    });

    btnShowEducation.addEventListener('click', () => {
      btnShowEducation.classList.add('active');
      btnShowExperience.classList.remove('active');
      experienceTimeline.style.display = 'none';
      educationTimeline.style.display = 'block';
    });
  }

  // ==========================================================================
  // 12. RESUME MODAL & PRINT / DOWNLOAD ACTIONS
  // ==========================================================================
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalBackdrop = document.getElementById('resumeModalBackdrop');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const heroCvBtn = document.getElementById('heroCvBtn');
  const resumeModalCloseBtn = document.getElementById('resumeModalCloseBtn');
  const resumeModalCloseBtnFooter = document.getElementById('resumeModalCloseBtnFooter');
  const printResumeBtn = document.getElementById('printResumeBtn');
  const downloadResumeBtnAction = document.getElementById('downloadResumeBtnAction');

  function openResumeModal() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResumeModal);
  if (heroCvBtn) heroCvBtn.addEventListener('click', openResumeModal);
  if (resumeModalCloseBtn) resumeModalCloseBtn.addEventListener('click', closeResumeModal);
  if (resumeModalCloseBtnFooter) resumeModalCloseBtnFooter.addEventListener('click', closeResumeModal);
  if (resumeModalBackdrop) resumeModalBackdrop.addEventListener('click', closeResumeModal);

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (downloadResumeBtnAction) {
    downloadResumeBtnAction.addEventListener('click', () => {
      // Generate clean plain text / markdown resume download
      const resumeContent = `DAPHAL DNYANDEV - FULL STACK WEB DEVELOPER
==================================================
Status: Bachelor of Computer Science (BCS) Student
Location: Sambhajinagar, Maharashtra, India
Phone: +91 8767774541
Email: daphaldnyandev@gmail.com
GitHub: github.com/dnyandevdaphal
LinkedIn: https://www.linkedin.com/in/dnyandev-daphal-530a01347

PROFESSIONAL SUMMARY:
Dedicated BCS student and Full Stack Web Developer based in Sambhajinagar, Maharashtra. Passionate about architecting, developing, and deploying modern web applications with clean code architecture, intuitive UI/UX design, and scalable web solutions.

CORE SKILLS:
- Frontend: HTML5, CSS3, JavaScript ES6+, React.js, Responsive Web Design, Modern UI/UX
- Backend: Node.js, Express.js, RESTful APIs, Python, WebSockets
- Databases: MongoDB, PostgreSQL, SQL, Redis
- Tools & DevOps: Git/GitHub, VS Code, Linux, Vercel

EDUCATION:
- Bachelor of Computer Science (BCS) Student
  Dr. Babasaheb Ambedkar Marathwada University (BAMU), Sambhajinagar, Maharashtra
- Full Stack Web Development Specialization
`;

      const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.download = 'Daphal_Dnyandev_Resume.txt';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(downloadUrl);

      showToast('Resume Downloaded', 'Daphal_Dnyandev_Resume.txt has been downloaded.', 'success');
    });
  }

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // 13. COPY EMAIL INTERACTIONS
  // ==========================================================================
  const myEmail = 'daphaldnyandev@gmail.com';
  const heroCopyEmailBtn = document.getElementById('heroCopyEmailBtn');
  const emailTooltip = document.getElementById('emailTooltip');
  const btnCopyEmailCard = document.getElementById('btnCopyEmailCard');
  const copyBtnText = document.getElementById('copyBtnText');

  function copyEmailToClipboard(triggerBtn, tooltipEl, originalText, feedbackText) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(myEmail).then(() => {
        handleCopySuccess(triggerBtn, tooltipEl, originalText, feedbackText);
      }).catch(() => {
        fallbackCopyText(myEmail);
        handleCopySuccess(triggerBtn, tooltipEl, originalText, feedbackText);
      });
    } else {
      fallbackCopyText(myEmail);
      handleCopySuccess(triggerBtn, tooltipEl, originalText, feedbackText);
    }
  }

  function handleCopySuccess(triggerBtn, tooltipEl, originalText, feedbackText) {
    if (tooltipEl) {
      tooltipEl.textContent = feedbackText;
      triggerBtn.classList.add('active');
      setTimeout(() => {
        tooltipEl.textContent = originalText;
        triggerBtn.classList.remove('active');
      }, 2200);
    }
    showToast('Copied to Clipboard!', myEmail, 'success');
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
    document.body.removeChild(textArea);
  }

  if (heroCopyEmailBtn) {
    heroCopyEmailBtn.addEventListener('click', () => {
      copyEmailToClipboard(heroCopyEmailBtn, emailTooltip, 'Copy Email', 'Copied! ✓');
    });
  }

  if (btnCopyEmailCard) {
    btnCopyEmailCard.addEventListener('click', () => {
      copyEmailToClipboard(btnCopyEmailCard, copyBtnText, 'Copy Email Address', 'Copied to Clipboard! ✓');
    });
  }

  // ==========================================================================
  // 14. REAL-TIME CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('portfolioContactForm');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userSubject = document.getElementById('userSubject');
  const userMessage = document.getElementById('userMessage');
  const charCounter = document.getElementById('charCounter');
  const submitContactBtn = document.getElementById('submitContactBtn');
  const resetContactBtn = document.getElementById('resetContactBtn');

  // Input groups & error containers
  const groupName = document.getElementById('groupName');
  const groupEmail = document.getElementById('groupEmail');
  const groupSubject = document.getElementById('groupSubject');
  const groupMessage = document.getElementById('groupMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  // Validation Rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/;

  function validateName() {
    const val = userName.value.trim();
    if (!val) {
      setFieldError(groupName, nameError, 'Full name is required.');
      return false;
    }
    if (val.length < 2) {
      setFieldError(groupName, nameError, 'Name must be at least 2 characters.');
      return false;
    }
    if (!nameRegex.test(val)) {
      setFieldError(groupName, nameError, 'Please enter a valid name (letters only).');
      return false;
    }
    setFieldSuccess(groupName, nameError);
    return true;
  }

  function validateEmail() {
    const val = userEmail.value.trim();
    if (!val) {
      setFieldError(groupEmail, emailError, 'Email address is required.');
      return false;
    }
    if (!emailRegex.test(val)) {
      setFieldError(groupEmail, emailError, 'Please enter a valid email address (e.g. name@domain.com).');
      return false;
    }
    setFieldSuccess(groupEmail, emailError);
    return true;
  }

  function validateSubject() {
    const val = userSubject.value.trim();
    if (!val) {
      setFieldError(groupSubject, subjectError, 'Subject is required.');
      return false;
    }
    if (val.length < 3) {
      setFieldError(groupSubject, subjectError, 'Subject must be at least 3 characters.');
      return false;
    }
    setFieldSuccess(groupSubject, subjectError);
    return true;
  }

  function validateMessage() {
    const val = userMessage.value.trim();
    if (!val) {
      setFieldError(groupMessage, messageError, 'Message is required.');
      return false;
    }
    if (val.length < 10) {
      setFieldError(groupMessage, messageError, 'Message must be at least 10 characters.');
      return false;
    }
    setFieldSuccess(groupMessage, messageError);
    return true;
  }

  function setFieldError(groupEl, errorEl, message) {
    groupEl.classList.remove('is-valid');
    groupEl.classList.add('is-invalid');
    errorEl.textContent = message;
  }

  function setFieldSuccess(groupEl, errorEl) {
    groupEl.classList.remove('is-invalid');
    groupEl.classList.add('is-valid');
    errorEl.textContent = '';
  }

  function clearFieldStatus(groupEl, errorEl) {
    groupEl.classList.remove('is-valid', 'is-invalid');
    errorEl.textContent = '';
  }

  // Real-time listener bindings
  if (userName) {
    userName.addEventListener('input', () => {
      if (groupName.classList.contains('is-invalid')) validateName();
    });
    userName.addEventListener('blur', validateName);
  }

  if (userEmail) {
    userEmail.addEventListener('input', () => {
      if (groupEmail.classList.contains('is-invalid')) validateEmail();
    });
    userEmail.addEventListener('blur', validateEmail);
  }

  if (userSubject) {
    userSubject.addEventListener('input', () => {
      if (groupSubject.classList.contains('is-invalid')) validateSubject();
    });
    userSubject.addEventListener('blur', validateSubject);
  }

  if (userMessage) {
    userMessage.addEventListener('input', () => {
      const length = userMessage.value.length;
      if (charCounter) {
        charCounter.textContent = `${length} / 500`;
      }
      if (groupMessage.classList.contains('is-invalid')) validateMessage();
    });
    userMessage.addEventListener('blur', validateMessage);
  }

  // Form Reset
  if (resetContactBtn) {
    resetContactBtn.addEventListener('click', () => {
      contactForm.reset();
      clearFieldStatus(groupName, nameError);
      clearFieldStatus(groupEmail, emailError);
      clearFieldStatus(groupSubject, subjectError);
      clearFieldStatus(groupMessage, messageError);
      if (charCounter) charCounter.textContent = '0 / 500';
      showToast('Form Reset', 'All input fields cleared.', 'info');
    });
  }

  // Form Submission Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Trigger all validations
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isSubjectValid = validateSubject();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showToast('Validation Error', 'Please correct the highlighted fields before sending.', 'error');
        // Scroll smoothly to first invalid field
        const firstInvalid = contactForm.querySelector('.is-invalid input, .is-invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Enter loading state
      submitContactBtn.classList.add('loading');
      submitContactBtn.disabled = true;

      const senderName = userName.value.trim();

      // Simulate asynchronous network dispatch
      setTimeout(() => {
        submitContactBtn.classList.remove('loading');
        submitContactBtn.disabled = false;

        // Reset inputs
        contactForm.reset();
        clearFieldStatus(groupName, nameError);
        clearFieldStatus(groupEmail, emailError);
        clearFieldStatus(groupSubject, subjectError);
        clearFieldStatus(groupMessage, messageError);
        if (charCounter) charCounter.textContent = '0 / 500';

        // Display Success Toast & Play Fanfare
        playUiSound('success');
        showToast(
          'Message Dispatched! 🚀',
          `Thank you ${senderName}! Your message was delivered. I'll get back to you within 2–6 hours.`,
          'success'
        );
      }, 1200);
    });
  }

  // ==========================================================================
  // 15. FLOATING BACK TO TOP BUTTON WITH SVG PROGRESS RING
  // ==========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  const progressRingCircle = document.getElementById('progressRingCircle');
  const circumference = 2 * Math.PI * 20; // 125.66

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPos / docHeight;

      if (scrollPos > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      if (progressRingCircle) {
        const offset = circumference - scrollPercent * circumference;
        progressRingCircle.style.strokeDashoffset = Math.max(offset, 0);
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 16. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <h4 class="toast-title">${title}</h4>
        <p class="toast-message">${message}</p>
      </div>
      <button class="toast-close" aria-label="Close notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      dismissToast(toast);
    }, 4500);
  }

  function dismissToast(toast) {
    toast.style.animation = 'slideToastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // Dynamic Year in footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
