(function () {
  var USER = 'neckfors', HUB = USER + '.github.io';
  var grid = document.getElementById('grid'), q = document.getElementById('q'), repos = [];
  function pretty(n) { return n.replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
  function render() {
    var t = q.value.trim().toLowerCase();
    var list = repos.filter(function (r) { return !t || (r.name + ' ' + (r.description || '')).toLowerCase().indexOf(t) > -1; });
    if (!list.length) { grid.innerHTML = '<p class="msg">No apps found.</p>'; return; }
    grid.innerHTML = list.map(function (r) {
      var url = r.homepage || ('https://' + HUB + '/' + r.name + '/');
      return '<article class="card"><h2>' + esc(pretty(r.name)) + '</h2><p>' + esc(r.description) + '</p>' +
        '<div class="meta">' + esc(r.language || '') + (r.stargazers_count ? ' · ★ ' + r.stargazers_count : '') + '</div>' +
        '<div class="btns"><a class="open" href="' + esc(url) + '">Open</a>' +
        '<a href="' + esc(r.html_url) + '" target="_blank" rel="noopener">Code</a></div></article>';
    }).join('');
  }
  fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=pushed')
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (all) {
      repos = all.filter(function (r) { return r.has_pages && !r.fork && !r.archived && r.name !== HUB; });
      render();
    })
    .catch(function () { grid.innerHTML = '<p class="msg">Could not load the list. Try <a href="https://github.com/' + USER + '">github.com/' + USER + '</a>.</p>'; });
  q.addEventListener('input', render);
})();
