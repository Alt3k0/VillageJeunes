/**
 * Fonds par type d'utilisateur – Vill'Age Jeunes
 * Un même fond « lampe à lave » (charte graphique) pour tous : adherent, benevole, partenaire, staff.
 */
(function () {
  var body = document.body;
  if (!body) return;

  var role = body.getAttribute('data-user-role');
  if (!role && typeof window.location !== 'undefined' && window.location.pathname) {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('accueil-staff') !== -1 || path.indexOf('staff') !== -1) role = 'staff';
  }
  if (!role) role = 'adherent';

  var normalized = String(role).toLowerCase().replace(/\s/g, '').replace(/é/g, 'e').replace(/è/g, 'e');
  var allowed = ['adherent', 'benevole', 'partenaire', 'staff'];
  var theme = allowed.indexOf(normalized) !== -1 ? normalized : 'adherent';

  body.classList.add('fond-' + theme);
  initLava();
})();

/**
 * Lampe à lave unique pour toutes les pages : blobs charte, un peu plus gros, apaisant.
 */
function initLava() {
  var wrap = document.createElement('div');
  wrap.className = 'fond-lava-wrap';
  wrap.setAttribute('aria-hidden', 'true');

  var colors = [
    'rgba(22, 55, 90, 0.32)',
    'rgba(15, 107, 142, 0.26)',
    'rgba(55, 102, 91, 0.24)',
    'rgba(92, 165, 56, 0.22)',
    'rgba(243, 141, 52, 0.22)',
    'rgba(207, 90, 42, 0.20)',
    'rgba(169, 206, 212, 0.26)',
    'rgba(245, 198, 73, 0.22)'
  ];

  var blobs = [];
  var n = 6;
  var baseSize = Math.max(340, Math.min(520, window.innerWidth * 0.42));
  var start = Date.now();

  for (var i = 0; i < n; i++) {
    var el = document.createElement('div');
    el.className = 'fond-lava-blob';
    el.style.background = colors[i % colors.length];
    el.style.width = (baseSize * (0.85 + Math.random() * 0.5)) + 'px';
    el.style.height = el.style.width;
    wrap.appendChild(el);
    blobs.push({
      el: el,
      phaseX: Math.PI * 2 * (i / n) + Math.random() * 0.5,
      phaseY: Math.PI * 2 * (i / n) * 0.7 + Math.random() * 0.5,
      phaseS: Math.PI * 2 * (i / n) * 0.3,
      speedX: 0.00018 + Math.random() * 0.0001,
      speedY: 0.0002 + Math.random() * 0.0001,
      speedS: 0.00012,
      radiusX: 0.22 + Math.random() * 0.15,
      radiusY: 0.2 + Math.random() * 0.12,
      centerX: 0.3 + Math.random() * 0.4,
      centerY: 0.35 + Math.random() * 0.3
    });
  }

  var bodyEl = document.body;
  if (bodyEl) bodyEl.insertBefore(wrap, bodyEl.firstChild);

  function tick() {
    var t = Date.now() - start;
    var w = window.innerWidth;
    var h = window.innerHeight;
    for (var i = 0; i < blobs.length; i++) {
      var b = blobs[i];
      var xPx = b.centerX * w + Math.sin(t * b.speedX + b.phaseX) * w * b.radiusX;
      var yPx = b.centerY * h + Math.cos(t * b.speedY + b.phaseY) * h * b.radiusY;
      var s = 0.92 + Math.sin(t * b.speedS + b.phaseS) * 0.08;
      b.el.style.left = (xPx / w) * 100 + '%';
      b.el.style.top = (yPx / h) * 100 + '%';
      b.el.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
    }
    requestAnimationFrame(tick);
  }
  tick();
  requestAnimationFrame(tick);
}
