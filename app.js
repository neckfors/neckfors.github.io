(function () {
  var USER = 'neckfors', HUB = USER + '.github.io';
  var list = document.getElementById('list');
  var ICONS = { tower: '🏰', life: '❤️', math: '🚀', rocket: '🚀', maze: '🌀', word: '⌨️', random: '🎲', dice: '🎲', deck: '🃏' };
  function icon(n) { for (var k in ICONS) if (n.indexOf(k) > -1) return ICONS[k]; return '🎮'; }
  function pretty(n) { return n.replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
  fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=pushed')
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (all) {
      var repos = all.filter(function (r) { return r.has_pages && !r.private && !r.fork && !r.archived && r.name !== HUB; });
      list.innerHTML = repos.map(function (r, i) {
        var url = r.homepage || ('https://' + HUB + '/' + r.name + '/');
        return '<a class="card" style="--i:' + i + '" href="' + esc(url) + '"><span class="icon">' + icon(r.name) + '</span>' +
          '<span class="txt"><h2>' + esc(pretty(r.name)) + '</h2><p>' + esc(r.description) + '</p></span><span class="go">›</span></a>';
      }).join('') || '<p class="msg">Nothing here yet.</p>';
    })
    .catch(function () { list.innerHTML = '<p class="msg">Could not load the list. Try again in a minute.</p>'; });
})();
