// Decorative snowfall (Christmas edition). Pointer-events off, skipped for
// reduced-motion users, paused while the tab is hidden.
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0, flakes = [], raf = 0, last = 0;

  function make(initial) {
    var star = Math.random() < 0.28;
    var r = star ? 5 + Math.random() * 5 : 1.6 + Math.random() * 3.2;
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : -r * 2,
      r: r,
      vy: (0.35 + Math.random() * 0.75) * (0.7 + r / 8),
      sway: 8 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      star: star,
      alpha: star ? 0.75 : 0.55 + Math.random() * 0.4
    };
  }

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = w < 700 ? 26 : 52;
    flakes = [];
    for (var i = 0; i < n; i++) flakes.push(make(true));
  }

  function drawStar(f, x, angle) {
    ctx.save();
    ctx.translate(x, f.y);
    ctx.rotate(angle);
    ctx.strokeStyle = 'rgba(104,156,198,' + f.alpha + ')';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (var i = 0; i < 3; i++) {
      var a = (Math.PI / 3) * i;
      var dx = Math.cos(a) * f.r, dy = Math.sin(a) * f.r;
      ctx.moveTo(-dx, -dy); ctx.lineTo(dx, dy);
      for (var k = 0; k < 2; k++) {
        var s = k === 0 ? 1 : -1;
        var bx = Math.cos(a) * f.r * 0.62 * s, by = Math.sin(a) * f.r * 0.62 * s;
        var ba = a + Math.PI / 2, bl = f.r * 0.28;
        ctx.moveTo(bx - Math.cos(ba) * bl, by - Math.sin(ba) * bl);
        ctx.lineTo(bx + Math.cos(ba) * bl, by + Math.sin(ba) * bl);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = last ? Math.min((t - last) / 16.67, 3) : 1;
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.vy * dt;
      f.phase += 0.012 * dt;
      var x = f.x + Math.sin(f.phase) * f.sway;
      if (f.star) {
        drawStar(f, x, f.phase * f.spin * 60);
      } else {
        ctx.beginPath();
        ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + f.alpha + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(104,156,198,' + f.alpha * 0.55 + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      if (f.y > h + f.r * 2) flakes[i] = make(false);
    }
  }

  function start() { if (raf) return; last = 0; raf = requestAnimationFrame(frame); }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  resize();
  start();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
})();
