(function () {
  var bg = document.getElementById('bg'), fx = document.getElementById('fx');
  var scoreEl = document.getElementById('score'), nEl = document.getElementById('n');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var total = 0, KEY = 'neckfors.popped';
  try { total = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}
  function show() { nEl.textContent = total; if (total) scoreEl.hidden = false; }
  function add(k) { total += k; show(); try { localStorage.setItem(KEY, total); } catch (e) {} }
  show();

  function burst(x, y, n, big) {
    var cols = ['#fff', '#ffd54d', '#7fd6ff', '#ff9ad5', '#9dffb0'];
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i'), a = Math.random() * 6.28, d = (big ? 90 : 34) + Math.random() * (big ? 160 : 40);
      p.className = 'p';
      p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--dx:' + Math.cos(a) * d + 'px;--dy:' + Math.sin(a) * d +
        'px;--w:' + (big ? 6 + Math.random() * 6 : 5) + 'px;--c:' + cols[big ? i % cols.length : 0];
      fx.appendChild(p);
      setTimeout(function (el) { el.remove(); }, 800, p);
    }
  }

  function spawn() {
    if (document.hidden || bg.children.length > 14) return;
    var b = document.createElement('div'), s = 30 + Math.random() * 80;
    b.className = 'bub';
    b.style.cssText = '--s:' + s + 'px;--x:' + (Math.random() * 96) + '%;--d:' + (14 + Math.random() * 14) + 's';
    b.addEventListener('animationend', function (e) { if (e.animationName === 'rise') b.remove(); });
    b.addEventListener('pointerdown', function (e) {
      var r = b.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 7, false);
      b.remove(); add(1);
    });
    bg.appendChild(b);
  }
  if (!calm) { for (var i = 0; i < 6; i++) setTimeout(spawn, i * 300); setInterval(spawn, 1500); }

  // Easter egg: click the title letters in order
  var letters = document.querySelectorAll('h1 span'), at = 0;
  function reset() { at = 0; letters.forEach(function (l) { l.classList.remove('lit'); }); }
  letters.forEach(function (l, i) {
    l.addEventListener('click', function () {
      if (i !== at) { reset(); if (i !== 0) return; }
      l.classList.add('lit'); at = i + 1;
      if (at === letters.length) {
        var r = document.querySelector('h1').getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 60, true);
        add(50);
        var t = document.createElement('div');
        t.className = 'toast'; t.textContent = 'You found the secret! +50 bubbles';
        document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2300);
        setTimeout(reset, 1200);
      }
    });
  });
})();
