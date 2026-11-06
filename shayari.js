(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Falling petals + sparkles */
  var layer = document.getElementById('petals');
  if (!reduce && layer) {
    var rand = function (a, b) { return a + Math.random() * (b - a); };
    for (var i = 0; i < 16; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      p.style.left = rand(0, 100) + 'vw';
      p.style.setProperty('--dx', rand(-120, 120) + 'px');
      p.style.animationDuration = rand(12, 22) + 's';
      p.style.animationDelay = rand(-20, 0) + 's';
      p.style.transform = 'scale(' + rand(0.6, 1.2) + ')';
      layer.appendChild(p);
    }
    for (var j = 0; j < 14; j++) {
      var s = document.createElement('span');
      s.className = 'sparkle';
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 100) + '%';
      s.style.animationDuration = rand(3, 6) + 's';
      s.style.animationDelay = rand(-6, 0) + 's';
      layer.appendChild(s);
    }
  }

  /* Lightbox */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var closeBtn = document.getElementById('lb-close');
  var lastFocus = null;

  function openLb(img, trigger) {
    lastFocus = trigger;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lb.classList.remove('closing');
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeLb() {
    if (lb.hidden) return;
    var done = function () {
      lb.hidden = true;
      lb.classList.remove('closing');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    if (reduce) { done(); return; }
    lb.classList.add('closing');
    setTimeout(done, 250);
  }

  document.querySelectorAll('.photo').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLb(btn.querySelector('img'), btn);
    });
  });
  closeBtn.addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
})();
