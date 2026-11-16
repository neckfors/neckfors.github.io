(function () {
  var USER = 'neckfors', HUB = USER + '.github.io';
  var games = document.getElementById('games'), apps = document.getElementById('apps');
  var ICONS = { tower: '🏰', life: '❤️', math: '🚀', rocket: '🚀', maze: '🌀', blaster: '⌨️', random: '🎲', dice: '🎲', deck: '🃏' };
  function icon(n) { for (var k in ICONS) if (n.indexOf(k) > -1) return ICONS[k]; return '🎮'; }
  function pretty(n) { return n.replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
  function urlOf(r) { return r.homepage || ('https://' + HUB + '/' + r.name + '/'); }
  function cards(repos, label) {
    return repos.map(function (r) {
      return '<a class="card" data-repo="' + esc(r.name) + '" href="' + esc(urlOf(r)) + '"><span class="icon">' + icon(r.name) + '</span>' +
        '<span class="txt"><h3>' + esc(pretty(r.name)) + '</h3><p>' + esc(r.description) + '</p></span>' +
        '<span class="tags"><span class="tag">' + label + '</span></span><span class="go">›</span></a>';
    }).join('') || '<p class="msg">Nothing here yet.</p>';
  }
  var NO_INSTALL = ['type-blaster'];
  function markInstallable(r) {
    if (NO_INSTALL.indexOf(r.name) > -1) return;
    var base = urlOf(r);
    ['manifest.webmanifest', 'manifest.json'].reduce(function (p, f) {
      return p.then(function (ok) {
        if (ok) return true;
        return fetch(base + f).then(function (x) { return x.ok; }).catch(function () { return false; });
      });
    }, Promise.resolve(false)).then(function (ok) {
      if (!ok) return;
      var t = document.querySelector('.card[data-repo="' + r.name + '"] .tags');
      if (t) t.insertAdjacentHTML('beforeend', '<span class="tag">Install on phone</span>');
    });
  }
  fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=pushed')
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (all) {
      var repos = all.filter(function (r) { return r.has_pages && !r.private && !r.fork && !r.archived && r.name !== HUB; });
      var isGame = function (r) { return (r.topics || []).indexOf('game') > -1; };
      games.innerHTML = cards(repos.filter(isGame), 'Play online');
      apps.innerHTML = cards(repos.filter(function (r) { return !isGame(r); }), 'Open');
      repos.forEach(markInstallable);
    })
    .catch(function () { games.innerHTML = '<p class="msg">Could not load the list. Try again in a minute.</p>'; });
})();
