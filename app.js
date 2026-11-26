(function () {
  var USER = 'neckfors', HUB = USER + '.github.io';
  var games = document.getElementById('games'), apps = document.getElementById('apps');
  var ICONS = { tower: '🏰', life: '❤️', math: '🚀', alarm: '⏰', book: '📚', rocket: '🚀', maze: '🌀', blaster: '⌨️', random: '🎲', dice: '🎲', deck: '🃏', puzzle: '🧩' };
  function icon(n) { for (var k in ICONS) if (n.indexOf(k) > -1) return ICONS[k]; return '🎮'; }
  function pretty(n) { return n.replace(/-releases$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
  function hasApk(r) { return (r.topics || []).indexOf('apk') > -1; }
  function readmeUrl(r) { return 'https://github.com/' + USER + '/' + r.name + '#readme'; }
  // Android-only apps have no web page: the row opens the README, which has the download.
  function urlOf(r) { return r.has_pages ? r.homepage || ('https://' + HUB + '/' + r.name + '/') : readmeUrl(r); }
  function cards(repos, label) {
    return repos.map(function (r) {
      // The name's link covers the whole row; the APK and About links lie on top of it.
      var apk = hasApk(r)
        ? '<a class="tag link" href="https://github.com/' + USER + '/' + r.name + '/releases/latest" aria-label="Download the Android app">APK</a>' : '';
      var about = '<a class="tag link" href="' + esc(readmeUrl(r)) + '" aria-label="About ' + esc(pretty(r.name)) + '">About</a>';
      var web = r.has_pages ? '<span class="tag">' + label + '</span>' : '';
      return '<div class="card" data-repo="' + esc(r.name) + '"><span class="icon">' + icon(r.name) + '</span>' +
        '<span class="txt"><h3><a class="open" href="' + esc(urlOf(r)) + '">' + esc(pretty(r.name)) + '</a></h3><p>' + esc(r.description) + '</p></span>' +
        '<span class="tags">' + web + apk + about + '</span><span class="go">›</span></div>';
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
      if (t) t.firstElementChild.insertAdjacentHTML('afterend', '<span class="tag">Phone</span>');
    });
  }
  fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=pushed')
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (all) {
      var repos = all.filter(function (r) { return (r.has_pages || hasApk(r)) && !r.private && !r.fork && !r.archived && r.name !== HUB && (r.topics || []).indexOf('hidden') < 0; });
      var isGame = function (r) { return (r.topics || []).indexOf('game') > -1; };
      games.innerHTML = cards(repos.filter(isGame), 'Web');
      apps.innerHTML = cards(repos.filter(function (r) { return !isGame(r); }), 'Web');
      repos.filter(function (r) { return r.has_pages; }).forEach(markInstallable);
    })
    .catch(function () { games.innerHTML = '<p class="msg">Could not load the list. Try again in a minute.</p>'; });
})();
