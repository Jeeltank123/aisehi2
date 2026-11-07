'use strict';

(function () {
  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  if (!audio || !toggle) return;

  const storage = window.sessionStorage;
  const playingKey = 'birthdayMusicPlaying';
  const timeKey = 'birthdayMusicTime';
  const resumeOnLoad = storage.getItem(playingKey) === 'true';
  const savedTime = Number(storage.getItem(timeKey) || 0);

  audio.src = encodeURI('Chalre Chalre Waal Bhojpuri Version Tu 🌸 Baru Kasturi trending chauhanakash [youaretube.com].mp3');
  audio.loop = true;
  audio.volume = 0.35;

  function updateToggle(isPlaying) {
    toggle.classList.toggle('is-playing', isPlaying);
    toggle.textContent = isPlaying ? '🔊' : '🔇';
    toggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  }

  function tryPlay() {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        updateToggle(true);
        storage.setItem(playingKey, 'true');
      }).catch(() => updateToggle(false));
      return;
    }
    updateToggle(!audio.paused);
    storage.setItem(playingKey, String(!audio.paused));
  }

  audio.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(savedTime) && savedTime > 0) {
      audio.currentTime = Number.isFinite(audio.duration)
        ? Math.min(savedTime, Math.max(0, audio.duration - 0.1))
        : savedTime;
    }
  }, { once: true });
  audio.addEventListener('timeupdate', () => {
    if (!audio.paused) storage.setItem(timeKey, String(audio.currentTime));
  });
  audio.addEventListener('play', () => updateToggle(true));
  audio.addEventListener('pause', () => updateToggle(false));

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      tryPlay();
      return;
    }
    audio.pause();
    storage.setItem(playingKey, 'false');
  });

  window.addEventListener('pagehide', () => {
    storage.setItem(playingKey, String(!audio.paused));
    if (Number.isFinite(audio.currentTime)) {
      storage.setItem(timeKey, String(audio.currentTime));
    }
  });

  updateToggle(false);
  if (resumeOnLoad) tryPlay();
  function unlockMusic(event) {
    if (toggle.contains(event.target)) return;
    window.removeEventListener('pointerdown', unlockMusic);
    window.removeEventListener('keydown', unlockMusic);
    tryPlay();
  }
  window.addEventListener('pointerdown', unlockMusic, { passive: true });
  window.addEventListener('keydown', unlockMusic);
  if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/')) {
    setTimeout(tryPlay, 1200);
  }
})();
