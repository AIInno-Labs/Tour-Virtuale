(function () {
  'use strict';

  var T = window.TOUR;
  var $ = function (s) { return document.querySelector(s); };
  var rad = Marzipano.util.degToRad;
  var deg = function (r) { return r * 180 / Math.PI; };
  var EDIT = /[?&]edit\b/.test(location.search);
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TILES_DIR = 'assets/tiles/';
  var FACE_SIZE = 3072;
  var LEVELS = [
    { tileSize: 512, size: 512, fallbackOnly: true },
    { tileSize: 1536, size: 1536 },
    { tileSize: 1536, size: 3072 }
  ];

  /* ---------- language ---------- */
  var I = window.I18N;
  var lang = 'it';
  try { if (localStorage.getItem('tour-lang') === 'en') lang = 'en'; } catch (e) {}
  function t(key, vars) {
    var str = (I[lang] && I[lang][key]) || I.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { str = str.replace('{' + k + '}', vars[k]); });
    return str;
  }
  function nm(o) { return (lang === 'it' && o.nameIt) || o.name; }
  function pick(o, key) { return (lang === 'it' && o[key + 'It']) || o[key]; }
  var labelers = [];

  // Readable links: /#oak-tree-2 (English) or /#quercia-2 (Italian). Old links with the file code still work.
  function slugify(str) {
    return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  var slugToId = {};
  function slugOf(id) { return slugify(nm(byId[id])); }
  function idFromHash(h) {
    h = decodeURIComponent(h || '').toLowerCase();
    return byId[h] ? h : (slugToId[h] || null);
  }

  /* ---------- data ---------- */
  var all = T.scenes.filter(function (s) { return !s.pending; });
  // A homeOnly scene is just the picture behind the welcome screen: it stays out of the Areas list and Previous / Next.
  var scenes = all.filter(function (s) { return !s.homeOnly; });
  var byId = {};
  scenes.forEach(function (s, i) { s.index = i; });
  all.forEach(function (s) { byId[s.id] = s; });
  var chapterById = {};
  T.chapters.forEach(function (c) {
    c.scenes = scenes.filter(function (s) { return s.chapter === c.id; });
    c.scenes.forEach(function (s, i) { s.chIndex = i; });
    chapterById[c.id] = c;
  });
  scenes.forEach(function (s) {
    slugToId[slugify(s.name)] = s.id;
    if (s.nameIt) slugToId[slugify(s.nameIt)] = s.id;
  });
  all.forEach(function (s) {
    s.links = (s.links || []).filter(function (l) { return byId[l.to]; });
  });

  /* ---------- viewer ---------- */
  var viewer = new Marzipano.Viewer($('#pano'), { stage: { progressive: true } });
  var geometry = new Marzipano.CubeGeometry(LEVELS);
  // Marzipano's fov is the VERTICAL angle. The widest view allowed is 130 degrees, both across and up-down.
  var MAX_FOV = rad(130);
  var limiter = Marzipano.RectilinearView.limit.traditional(FACE_SIZE, MAX_FOV, MAX_FOV);

  // Every place opens fully zoomed out (the widest view the limiter allows); the + button zooms in from there.
  function defaultFov() {
    var acrossLimit = 2 * Math.atan(Math.tan(MAX_FOV / 2) * window.innerHeight / window.innerWidth);
    return Math.min(MAX_FOV, acrossLimit);
  }

  var cache = {};
  var current = null;

  function getScene(id) {
    var d = byId[id];
    if (!d) return null;
    if (cache[id]) return cache[id];
    var source = Marzipano.ImageUrlSource.fromString(TILES_DIR + id + '/{z}/{f}/{y}/{x}.jpg');
    var view = new Marzipano.RectilinearView({ yaw: 0, pitch: 0, fov: defaultFov() }, limiter);
    var scene = viewer.createScene({ source: source, geometry: geometry, view: view, pinFirstLevel: true });
    d.links.forEach(function (l) { addHotspot(scene, l.yaw, l.pitch, linkElement(l)); });
    return (cache[id] = { data: d, scene: scene });
  }

  function addHotspot(scene, yaw, pitch, el) {
    scene.hotspotContainer().createHotspot(el, { yaw: rad(yaw), pitch: rad(pitch) });
  }

  // Hotspot badge: a ring of beads and a four-pointed star, echoing the emblem in the logo.
  var BADGE = (function () {
    var beads = '';
    for (var i = 0; i < 20; i++) {
      var a = i * Math.PI / 10;
      beads += '<circle cx="' + (24 + 18.5 * Math.cos(a)).toFixed(2) + '" cy="' + (24 + 18.5 * Math.sin(a)).toFixed(2) + '" r="1.1"/>';
    }
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><g class="hs-beads">' + beads + '</g><path class="hs-star" d="M24 15l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>';
  })();

  function hotspotBase(kind, o) {
    var el = document.createElement('div');
    el.className = 'hs ' + kind;
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', o.label);
    el.innerHTML = '<span class="hs-card"><span class="thumb"><img alt=""></span><b></b><small></small></span>' +
      '<span class="hs-pin">' + BADGE + '</span>';
    el.querySelector('b').textContent = o.label;
    el.querySelector('small').textContent = o.sub;
    var img = el.querySelector('img');
    img.onerror = function () { img.parentNode.style.display = 'none'; };
    img.src = o.thumb;
    ['pointerdown', 'mousedown', 'touchstart'].forEach(function (ev) {
      el.addEventListener(ev, function (e) { e.stopPropagation(); });
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
    // Keep the card centred on the arrow while hovering, even if the view moves (drag, rotate, keys).
    var watching = 0;
    function place() {
      var r = el.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var flip = r.top < 260;
      if (flip !== el._flip) { el._flip = flip; el.classList.toggle('flip', flip); }
      var dx = 0;
      if (cx < 112) dx = 112 - cx;
      else if (cx > window.innerWidth - 112) dx = window.innerWidth - 112 - cx;
      el.style.setProperty('--dx', dx.toFixed(1) + 'px');
      watching = requestAnimationFrame(place);
    }
    el.addEventListener('mouseenter', function () {
      cancelAnimationFrame(watching);
      place();
      holdRotate(true);
      if (o.prefetch) prefetchScene(o.prefetch);
    });
    el.addEventListener('mouseleave', function () { cancelAnimationFrame(watching); holdRotate(false); });
    return el;
  }

  function linkElement(l) {
    var dest = byId[l.to];
    // A link can carry its own name (label / labelIt); otherwise it shows the name of the place it leads to.
    function linkName() { return (lang === 'it' && l.labelIt) || l.label || nm(dest); }
    var el = hotspotBase('hs-link', { label: linkName(), sub: nm(chapterById[dest.chapter]), thumb: 'assets/thumbs/' + dest.id + '.jpg', prefetch: dest.id });
    el.addEventListener('click', function () {
      var r = el.querySelector('.hs-pin').getBoundingClientRect();
      goTo(l.to, { link: l, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
    });
    labelers.push(function () {
      el.querySelector('b').textContent = linkName();
      el.querySelector('small').textContent = nm(chapterById[dest.chapter]);
      el.setAttribute('aria-label', linkName());
    });
    return el;
  }

  /* ---------- navigation ---------- */
  var progress = $('#progress');
  var stableWaiters = [];
  viewer.stage().addEventListener('renderComplete', function (stable) {
    if (!stable) return;
    progress.hidden = true;
    var w = stableWaiters; stableWaiters = [];
    w.forEach(function (fn) { fn(); });
  });
  // Resolves the next time the viewer has finished loading everything it can see (or after maxMs).
  function waitStable(maxMs) {
    return new Promise(function (res) {
      var done = false;
      function fin() { if (!done) { done = true; res(); } }
      stableWaiters.push(fin);
      setTimeout(fin, maxMs);
    });
  }

  var busy = false;
  var visited = [];
  var skipVisited = false;
  var ease = {
    in2: function (t) { return t * t; },
    in3: function (t) { return t * t * t; },
    out3: function (t) { return 1 - Math.pow(1 - t, 3); },
    out5: function (t) { return 1 - Math.pow(1 - t, 5); },
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  };

  function animate(dur, fn) {
    return new Promise(function (resolve) {
      var t0 = performance.now();
      (function frame(now) {
        var k = Math.min(1, Math.max(0, (now - t0) / dur));
        fn(k);
        if (k < 1) requestAnimationFrame(frame); else resolve();
      })(t0);
    });
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  var prefetched = {};
  function prefetchScene(id, tick) {
    if (prefetched[id]) { if (tick) prefetched[id].then(function () { tick(1); }); return prefetched[id]; }
    var n = 0;
    return (prefetched[id] = Promise.all('fblrud'.split('').map(function (f) {
      return new Promise(function (res) {
        var im = new Image();
        im.onload = im.onerror = function () { n++; if (tick) tick(n / 6); res(); };
        im.src = TILES_DIR + id + '/0/' + f + '/0/0.jpg';
      });
    })));
  }

  /* loading progress shown by filling the 360 pill */
  var pan = $('#pan'), loadP = 0, loadTimer = 0;
  function loadSet(p) { loadP = Math.max(loadP, Math.min(1, p)); pan.style.setProperty('--p', loadP.toFixed(3)); }
  function loadStart() {
    clearTimeout(loadTimer);
    loadP = 0;
    pan.classList.remove('loading');
    pan.style.setProperty('--p', 0);
    void pan.offsetWidth;
    pan.classList.add('loading');
    loadSet(.05);
  }
  function loadDone() {
    loadSet(1);
    clearTimeout(loadTimer);
    loadTimer = setTimeout(function () {
      pan.classList.remove('loading');
      loadTimer = setTimeout(function () { loadP = 0; pan.style.setProperty('--p', 0); }, 800);
    }, 450);
  }

  /* speed trail: the current view is captured, then drawn scaled up about the clicked hotspot with a fading
     stack of smaller ghosts behind it, which reads as a fast push forward */
  var tc = $('#trailCanvas'), tctx = tc.getContext('2d');
  var TRAIL_GHOSTS = 18;
  function snapshotView() {
    var st = viewer.stage(), c = st.domElement();
    st.render();
    var k = Math.min(1, 1600 / c.width);
    tc.width = Math.round(c.width * k);
    tc.height = Math.round(c.height * k);
    var snap = document.createElement('canvas');
    snap.width = tc.width; snap.height = tc.height;
    snap.getContext('2d').drawImage(c, 0, 0, tc.width, tc.height);
    return snap;
  }
  function drawTrail(snap, ox, oy, scale, trailLen) {
    var W = tc.width, H = tc.height;
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.globalAlpha = 1;
    tctx.clearRect(0, 0, W, H);
    function layer(sc, alpha) {
      tctx.globalAlpha = alpha;
      tctx.setTransform(sc, 0, 0, sc, ox * (1 - sc), oy * (1 - sc));
      tctx.drawImage(snap, 0, 0);
    }
    layer(scale, 1);
    for (var i = 1; i <= TRAIL_GHOSTS; i++) {
      layer(scale / (1 + trailLen * i / TRAIL_GHOSTS), .13 * (1 - i / (TRAIL_GHOSTS + 1)) * Math.min(1, trailLen * 6));
    }
    tctx.globalAlpha = 1;
    tctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // Cross-fade used only for instant / first loads; hotspots appear once the new place is mostly visible.
  function fadeScenes(val, ns) {
    var e = ease.inOut(val);
    ns.listLayers().forEach(function (l) { l.mergeEffects({ opacity: e }); });
    ns.hotspotContainer().domElement().style.opacity = ease.inOut(Math.max(0, (val - .55) / .45));
  }
  function plainSwitch(val, ns) { ns.listLayers().forEach(function (l) { l.mergeEffects({ opacity: val }); }); }

  function enter(target, id, ms, opts, update) {
    if (current !== id) progress.hidden = false;
    current = id;
    target.scene.switchTo({ transitionDuration: ms, transitionUpdate: update || fadeScenes });
    if (!opts.deferUI) updateScene();
    if (!opts.noHash) { try { var hash = '#' + slugOf(id); if (opts.instant || location.hash === hash) history.replaceState(null, '', hash); else history.pushState(null, '', hash); } catch (e) {} }
    target.data.links.forEach(function (l) { prefetchScene(l.to); });
  }

  // Click a hotspot: the view pushes forward toward it with a speed trail. The new place is switched in underneath
  // the trail right away, so it loads while the push plays and nothing has to wait afterwards. When it is ready the
  // trail dissolves and the new place settles into place.
  function goTo(id, opts) {
    opts = opts || {};
    var target = getScene(id);
    if (!target || (busy && !opts.instant)) return;
    var v = opts.view || target.data.view || { yaw: 0, pitch: 0 };
    var from = current && cache[current];
    if (from === target) return;
    if (from && !opts.back && !opts.instant && !skipVisited) { visited.push(current); if (visited.length > 60) visited.shift(); }
    skipVisited = false;
    var nv = target.scene.view();
    var nf = defaultFov();

    if (opts.instant || REDUCED || !from) {
      nv.setParameters({ yaw: rad(v.yaw), pitch: rad(v.pitch), fov: nf });
      loadStart();
      enter(target, id, opts.instant ? 0 : 300, opts);
      waitStable(6000).then(loadDone);
      resumeRotate();
      return;
    }

    busy = true;
    pauseRotate();
    viewer.controls().disable();
    var oc = from.scene.hotspotContainer().domElement();
    oc.style.transition = 'opacity .35s';
    oc.style.opacity = 0;

    // origin of the push: the hotspot that was clicked, or the middle of the screen
    var snap = snapshotView();
    var kx = tc.width / window.innerWidth, ky = tc.height / window.innerHeight;
    var o = opts.origin || { x: window.innerWidth / 2, y: window.innerHeight * .55 };
    var ox = o.x * kx, oy = o.y * ky;
    tc.className = 'on';
    drawTrail(snap, ox, oy, 1, 0);
    loadStart();

    // switch to the new place underneath the trail, so it starts loading now
    nv.setParameters({ yaw: rad(v.yaw), pitch: rad(v.pitch), fov: nf });
    var nc = target.scene.hotspotContainer().domElement();
    nc.style.transition = 'none';
    nc.style.opacity = 0;
    enter(target, id, 0, { noHash: opts.noHash, deferUI: true }, plainSwitch);
    var loaded = false;
    waitStable(9000).then(function () { loaded = true; });

    var PUSH = 1500, MAXS = 2.3, MAXT = .34;
    var scale = 1, trailLen = 0;
    animate(PUSH, function (k) {
      scale = 1 + (MAXS - 1) * ease.in3(k);
      trailLen = MAXT * ease.in2(k);
      drawTrail(snap, ox, oy, scale, trailLen);
      loadSet(.05 + .55 * ease.out3(k));
    }).then(function () {
      // keep gliding gently (never a frozen frame) until the new place has finished loading
      return new Promise(function (res) {
        var t0 = performance.now(), last = t0;
        (function glide(now) {
          var dt = Math.min(50, now - last); last = now;
          scale += (.18 * dt / 1000) * scale * .5;
          drawTrail(snap, ox, oy, scale, trailLen);
          loadSet(loadP + (.95 - loadP) * .06);
          if ((loaded && now - t0 > 120) || now - t0 > 6000) res(); else requestAnimationFrame(glide);
        })(t0);
      });
    }).then(function () {
      oc.style.transition = '';
      loadDone();
      updateScene();
      // dissolve the trail while the new place settles in from a slight zoom
      var pano = $('#pano');
      tc.className = 'on fade';
      nc.style.transition = 'opacity .9s ease .35s';
      nc.style.opacity = 1;
      return animate(1500, function (k) {
        pano.style.transform = 'scale(' + (1 + .14 * (1 - ease.out5(k))).toFixed(4) + ')';
      }).then(function () { pano.style.transform = ''; });
    }).then(function () {
      tc.className = '';
      nc.style.transition = '';
      busy = false;
      viewer.controls().enable();
      resumeRotate();
    });
  }

  function goBack() {
    if (busy) return;
    var prev = visited.pop();
    if (prev) goTo(prev, { back: true }); else showIntro();
  }

  function step(delta) {
    var i = byId[current].index + delta;
    if (i >= 0 && i < scenes.length) goTo(scenes[i].id);
  }

  /* ---------- scene title, Areas list ---------- */
  function updateScene() {
    var d = byId[current];
    var ch = chapterById[d.chapter];
    $('#sceneChapter').textContent = nm(ch);
    $('#sceneName').textContent = nm(d);
    $('#btnPrev').disabled = d.index === 0;
    $('#btnNext').disabled = d.index === scenes.length - 1;
    $('#btnPhotos').hidden = !d.gallery;
    document.title = nm(d) + ' - ' + T.name;
    var sc = $('#scene');
    sc.classList.remove('reveal');
    void sc.offsetWidth;
    sc.classList.add('reveal');
    Array.prototype.forEach.call(document.querySelectorAll('.stop'), function (b) {
      b.classList.toggle('current', b.dataset.id === current);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.pin'), function (p) {
      p.classList.toggle('current', p.dataset.id === current);
    });
  }

  function buildAreas() {
    var body = $('#areasBody');
    body.textContent = '';
    T.chapters.forEach(function (ch) {
      if (!ch.scenes.length) return;
      var sec = document.createElement('section');
      sec.className = 'chapter';
      var h = document.createElement('h3');
      h.innerHTML = '<b></b><span></span>';
      h.firstChild.textContent = nm(ch);
      h.lastChild.textContent = ch.scenes.length;
      sec.appendChild(h);
      var ol = document.createElement('ol');
      ol.className = 'route';
      ch.scenes.forEach(function (s) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'stop';
        b.dataset.id = s.id;
        b.innerHTML = '<img loading="lazy" alt="" width="76" height="46"><b></b><small></small>';
        b.querySelector('img').src = 'assets/thumbs/' + s.id + '.jpg';
        b.querySelector('b').textContent = nm(s);
        b.querySelector('small').textContent = ('0' + (s.index + 1)).slice(-2);
        b.addEventListener('click', function () {
          hideIntro();
          goTo(s.id);
          if (window.innerWidth < 900) setPanel('areas', false);
        });
        li.appendChild(b);
        ol.appendChild(li);
      });
      sec.appendChild(ol);
      body.appendChild(sec);
    });
  }

  function buildPlan() {
    if (!T.map || !T.map.image) return;
    $('#btnMap').hidden = false;
    $('#planImg').src = T.map.image;
    Object.keys(T.map.pins).forEach(function (id) {
      if (!byId[id]) return;
      var p = T.map.pins[id];
      var b = document.createElement('button');
      b.className = 'pin';
      b.dataset.id = id;
      b.style.cssText = 'position:absolute;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:2px solid #fff;background:#17384d;left:' + p.x + '%;top:' + p.y + '%';
      b.title = nm(byId[id]);
      b.addEventListener('click', function () { goTo(id); setPanel('plan', false); });
      $('#planWrap').style.position = 'relative';
      $('#planWrap').appendChild(b);
    });
  }

  var PANELS = { areas: '#btnAreas', plan: '#btnMap', menu: '#btnMenu', inquire: '#btnInquire' };
  function setPanel(id, open) {
    var el = document.getElementById(id);
    el.classList.toggle('open', open);
    el.setAttribute('aria-hidden', String(!open));
    var btn = $(PANELS[id]);
    if (btn) btn.setAttribute('aria-expanded', String(open));
    if (open) {
      Object.keys(PANELS).forEach(function (k) { if (k !== id) setPanel(k, false); });
      var cur = el.querySelector('.stop.current');
      if (cur) cur.scrollIntoView({ block: 'center' });
    }
  }
  function closePanels() { Object.keys(PANELS).forEach(function (k) { setPanel(k, false); }); }
  function togglePanel(id) { setPanel(id, !document.getElementById(id).classList.contains('open')); }

  /* ---------- controls ---------- */
  var controls = viewer.controls();
  var PAN = 0.28, ZOOM = 0.5, FRICTION = 3;
  [['zIn', 'zoom', -ZOOM], ['zOut', 'zoom', ZOOM], ['panL', 'x', -PAN], ['panR', 'x', PAN]].forEach(function (c) {
    controls.registerMethod(c[0], new Marzipano.ElementPressControlMethod($('#' + c[0]), c[1], c[2], FRICTION), true);
  });
  // Keyboard: arrow keys look around, + and - zoom.
  [[37, 'x', -PAN], [39, 'x', PAN], [38, 'y', -PAN], [40, 'y', PAN], [187, 'zoom', -ZOOM], [107, 'zoom', -ZOOM], [189, 'zoom', ZOOM], [109, 'zoom', ZOOM]]
    .forEach(function (k) {
      controls.registerMethod('key' + k[0], new Marzipano.KeyControlMethod(k[0], k[1], k[2], FRICTION), true);
    });

  // Day / night: only the button for now. It starts from the visitor's system theme; the night walk is not connected yet.
  var mode = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'night' : 'day';
  function setMode(m) {
    mode = m;
    document.documentElement.setAttribute('data-mode', m);
    Array.prototype.forEach.call(document.querySelectorAll('#mDay, #mNight'), function (b) {
      b.setAttribute('aria-pressed', String(b.id === 'mDay' ? m === 'day' : m === 'night'));
    });
    var label = t(m === 'day' ? 'toNight' : 'toDay'), btn = $('#btnMode');
    btn.setAttribute('data-tip', label);
    btn.setAttribute('aria-label', label);
  }
  $('#btnMode').addEventListener('click', function () { setMode(mode === 'day' ? 'night' : 'day'); });
  $('#mDay').addEventListener('click', function () { setMode('day'); });
  $('#mNight').addEventListener('click', function () { setMode('night'); });
  setMode(mode);

  // Slow turn on by default; it pauses while you drag or hover an exit, and resumes after 3 s.
  var autorotate = Marzipano.autorotate({ yawSpeed: 0.045, yawAccel: 0.03, targetPitch: null });
  var rotating = false;
  function setRotate(on) {
    rotating = on;
    if (on) { viewer.startMovement(autorotate); viewer.setIdleMovement(3000, autorotate); }
    else { viewer.stopMovement(); viewer.setIdleMovement(Infinity); }
    updateRotateUI();
  }
  function updateRotateUI() {
    var b = $('#btnRotate'), label = t(rotating ? 'pauseRotate' : 'playRotate');
    b.setAttribute('aria-pressed', String(rotating));
    b.setAttribute('data-tip', label);
    b.setAttribute('aria-label', label);
  }
  function pauseRotate() { if (rotating) viewer.stopMovement(); }
  function resumeRotate() { if (rotating) viewer.startMovement(autorotate); }
  function holdRotate(on) {
    if (!rotating || busy) return;
    if (on) viewer.stopMovement(); else viewer.startMovement(autorotate);
  }

  $('#btnAreas').addEventListener('click', function () { togglePanel('areas'); });
  $('#btnMap').addEventListener('click', function () { togglePanel('plan'); });
  $('#btnMenu').addEventListener('click', function () { togglePanel('menu'); });
  $('#btnInquire').addEventListener('click', function () { togglePanel('inquire'); });
  $('#btnBack').addEventListener('click', goBack);
  document.addEventListener('click', function (e) {
    if ($('#inquire').classList.contains('open') && !e.target.closest('#inquire, #btnInquire')) setPanel('inquire', false);
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-close]'), function (b) {
    b.addEventListener('click', function () { setPanel(b.dataset.close, false); });
  });
  $('#btnPrev').addEventListener('click', function () { step(-1); });
  $('#btnNext').addEventListener('click', function () { step(1); });
  $('#btnRotate').addEventListener('click', function () { setRotate(!rotating); });
  $('#btnPhotos').addEventListener('click', function () { openGallery(byId[current]); });

  if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled)) $('#btnFull').hidden = true;
  $('#btnFull').addEventListener('click', function () {
    var de = document.documentElement;
    if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else (de.requestFullscreen || de.webkitRequestFullscreen).call(de);
  });

  /* ---------- photo galleries ---------- */
  var galleryCache = {};
  var lb = { list: [], i: 0 };

  function exists(src) {
    return fetch(src, { method: 'HEAD' }).then(function (r) { return r.ok; }).catch(function () {
      return new Promise(function (res) {
        var im = new Image();
        im.onload = function () { res(true); };
        im.onerror = function () { res(false); };
        im.src = src;
      });
    });
  }

  function loadGallery(g) {
    if (galleryCache[g.folder]) return galleryCache[g.folder];
    var srcs = [];
    for (var n = 1; n <= (g.count || 10); n++) srcs.push(g.folder + '/' + ('0' + n).slice(-2) + '.jpg');
    return (galleryCache[g.folder] = Promise.all(srcs.map(exists)).then(function (ok) {
      return srcs.filter(function (s, i) { return ok[i]; });
    }));
  }

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.hidden = true; }, 4500);
  }

  // The gallery opens as a grid of equal-width photos. Clicking a photo opens it large, Close goes back to the grid.
  function measure(src) {
    return new Promise(function (res) {
      var im = new Image();
      im.onload = function () { res({ src: src, ar: im.naturalWidth / im.naturalHeight }); };
      im.onerror = function () { res(null); };
      im.decoding = 'async';
      im.src = src;
    });
  }

  // Every photo gets the same width. The number of columns adapts to the screen, so the width adapts too,
  // and each photo keeps its own height (extreme shapes are trimmed a little so no tile gets too tall or too flat).
  function layoutGrid() {
    var grid = $('#galGrid');
    if (!lb.items || grid.hidden) return;
    var cs = getComputedStyle(grid);
    var W = grid.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (W <= 0) return;
    var gap = parseFloat(cs.getPropertyValue('--gap')) || 12;
    var minCol = parseFloat(cs.getPropertyValue('--col')) || 320;
    var cols = Math.max(1, Math.min(lb.items.length, Math.floor((W + gap) / (minCol + gap))));
    var colW = (W - (cols - 1) * gap) / cols;
    grid.textContent = '';
    var wrap = document.createElement('div');
    wrap.className = 'bcols';
    var colEls = [], heights = [];
    for (var c = 0; c < cols; c++) {
      var ce = document.createElement('div');
      ce.className = 'bcol';
      ce.style.width = colW.toFixed(2) + 'px';
      wrap.appendChild(ce);
      colEls.push(ce); heights.push(0);
    }
    lb.items.forEach(function (it, k) {
      var shortest = heights.indexOf(Math.min.apply(null, heights));
      var h = colW / Math.min(2.2, Math.max(0.8, it.ar));
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tile';
      b.style.setProperty('--i', k);
      b.style.width = colW.toFixed(2) + 'px';
      b.style.height = h.toFixed(2) + 'px';
      b.setAttribute('aria-label', t('photoN', { n: k + 1 }));
      var im = new Image();
      im.alt = ''; im.decoding = 'async'; im.src = it.src;
      b.appendChild(im);
      b.addEventListener('click', function () { showPhoto(k); });
      colEls[shortest].appendChild(b);
      heights[shortest] += h + gap;
    });
    grid.appendChild(wrap);
  }
  var layoutTimer = 0;
  window.addEventListener('resize', function () { clearTimeout(layoutTimer); layoutTimer = setTimeout(layoutGrid, 120); });

  function openGallery(d) {
    if (!d.gallery) return;
    loadGallery(d.gallery).then(function (list) {
      if (!list.length) { toast(t('noPhotos', { folder: d.gallery.folder })); return; }
      return Promise.all(list.map(measure)).then(function (items) {
        items = items.filter(Boolean);
        if (!items.length) return;
        lb.items = items; lb.list = items.map(function (x) { return x.src; }); lb.i = 0; lb.d = d;
        $('#lbTitle').textContent = nm(d);
        var strip = $('#lbStrip');
        strip.textContent = '';
        items.forEach(function (it, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', t('photoN', { n: i + 1 }));
          b.style.aspectRatio = it.ar;
          var im = new Image();
          im.alt = ''; im.decoding = 'async'; im.src = it.src;
          b.appendChild(im);
          b.addEventListener('click', function () { showPhoto(i); });
          strip.appendChild(b);
        });
        $('#lightbox').hidden = false;
        showGrid();
      });
    });
  }

  function showGrid() {
    $('#lightbox').classList.remove('viewing');
    $('#lbStage').hidden = true;
    $('#lbStrip').hidden = true;
    $('#galGrid').hidden = false;
    $('#lbImg').removeAttribute('src');
    $('#lbCount').textContent = t('photoCount', { n: lb.list.length });
    var keep = $('#galGrid').scrollTop;
    layoutGrid();
    $('#galGrid').scrollTop = lb.viewedOnce ? keep : 0;
  }

  function showPhoto(i) {
    lb.i = (i + lb.list.length) % lb.list.length;
    lb.viewedOnce = true;
    var img = $('#lbImg');
    img.classList.remove('in');
    void img.offsetWidth;
    img.src = lb.list[lb.i];
    img.classList.add('in');
    $('#lightbox').classList.add('viewing');
    $('#galGrid').hidden = true;
    $('#lbStage').hidden = false;
    $('#lbStrip').hidden = false;
    Array.prototype.forEach.call($('#lbStrip').children, function (b, k) {
      b.classList.toggle('current', k === lb.i);
      if (k === lb.i) {
        var st = $('#lbStrip');
        st.scrollTo({ left: b.offsetLeft - (st.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
    $('#lbCount').textContent = (lb.i + 1) + ' / ' + lb.list.length;
    var multi = lb.list.length > 1;
    $('#lbPrev').hidden = !multi; $('#lbNext').hidden = !multi;
    [1, -1].forEach(function (o) { new Image().src = lb.list[(lb.i + o + lb.list.length) % lb.list.length]; });
  }

  function closeGallery() {
    if ($('#lightbox').classList.contains('viewing')) { showGrid(); return; }
    $('#lightbox').hidden = true;
    lb.viewedOnce = false;
  }
  $('#lbClose').addEventListener('click', closeGallery);
  $('#lbPrev').addEventListener('click', function () { showPhoto(lb.i - 1); });
  $('#lbNext').addEventListener('click', function () { showPhoto(lb.i + 1); });
  $('#lbStage').addEventListener('click', function (e) { if (e.target === this) showGrid(); });
  var touchX = null;
  $('#lbStage').addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  $('#lbStage').addEventListener('touchend', function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50 && lb.list.length > 1) showPhoto(lb.i + (dx < 0 ? 1 : -1));
  });

  document.addEventListener('keydown', function (e) {
    if (!$('#lightbox').hidden) {
      if (e.key === 'Escape') closeGallery();
      else if (e.key === 'ArrowLeft' && $('#lightbox').classList.contains('viewing')) showPhoto(lb.i - 1);
      else if (e.key === 'ArrowRight' && $('#lightbox').classList.contains('viewing')) showPhoto(lb.i + 1);
      return;
    }
    if (e.key === 'Escape') closePanels();
    else if (e.key === 'm' || e.key === 'M') togglePanel('menu');
    else if (e.key === 'a' || e.key === 'A') togglePanel('areas');
    else if (e.key === 'PageDown') step(1);
    else if (e.key === 'PageUp') step(-1);
  });

  // The browser / phone back gesture walks back through the places, and to the welcome screen at the start.
  window.addEventListener('hashchange', function () {
    var id = idFromHash(location.hash.slice(1));
    if (id) {
      if (id !== current) { hideIntro(); goTo(id, { back: true }); }
      else if (location.hash !== '#' + slugOf(id)) { try { history.replaceState(null, '', '#' + slugOf(id)); } catch (e) {} }
    }
    else if (!location.hash.slice(1) && $('#intro').hidden) showIntro();
  });

  /* ---------- edit helper: click the panorama to get yaw/pitch ---------- */
  if (EDIT) {
    $('#crosshair').hidden = false;
    var down = null;
    pano.addEventListener('mousedown', function (e) { down = { x: e.clientX, y: e.clientY }; });
    pano.addEventListener('click', function (e) {
      if (!down || Math.abs(e.clientX - down.x) > 5 || Math.abs(e.clientY - down.y) > 5) return;
      var c = viewer.view().screenToCoordinates({ x: e.clientX, y: e.clientY });
      var txt = '{ to: "", yaw: ' + Math.round(deg(c.yaw)) + ', pitch: ' + Math.round(deg(c.pitch)) + ' }';
      if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(function () {});
      toast(txt);
    });
  }

  /* ---------- home screen ---------- */
  function showIntro() {
    $('#intro').hidden = false;
    document.body.classList.add('intro-on');
    visited = [];
    closePanels();
    goTo(T.home.scene, { instant: true, noHash: true, view: T.home.view });
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  function hideIntro() {
    if ($('#intro').hidden) return;
    $('#intro').hidden = true;
    document.body.classList.remove('intro-on');
    skipVisited = true;
  }

  $('#brand').addEventListener('click', function () { closePanels(); showIntro(); });
  $('#introStart').addEventListener('click', function () { hideIntro(); goTo(T.home.startScene); });

  /* ---------- contact, menu, share, welcome text ---------- */
  var C = T.contact;
  var touchOnly = window.matchMedia && matchMedia('(hover: none)').matches;
  function telHref(p) { return 'tel:' + p.replace(/[^\d+]/g, ''); }

  function fillContact() {
    ['inqPhone', 'menuPhone'].forEach(function (id) {
      var a = $('#' + id);
      a.textContent = C.phone;
      a.href = telHref(C.phone);
    });
    $('#inqCall').href = telHref(C.phone);
    $('#inqMail').href = 'mailto:' + C.email;
    $('#btnWebsite').href = C.website;
  }

  function share() {
    var url = location.href;
    if (touchOnly && navigator.share) {
      navigator.share({ title: T.name, text: byId[current] ? nm(byId[current]) : T.name, url: url }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { toast(t('linkCopied')); }, function () { toast(url); });
    } else toast(url);
  }

  function buildMenu() {
    var withGallery = scenes.filter(function (s) { return s.gallery; });
    var gBtn = $('[data-act="galleries"]'), gList = $('#miGalList');
    if (!withGallery.length) gBtn.hidden = true;
    withGallery.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.gal = s.id;
      b.innerHTML = '<img alt="" width="64" height="38"><span></span><small></small>';
      b.querySelector('img').src = 'assets/thumbs/' + s.id + '.jpg';
      gList.appendChild(b);
    });
    if (T.map && T.map.image) $('[data-act="plan"]').hidden = false;

    var acts = {
      start: function () { closePanels(); hideIntro(); goTo(T.home.startScene); },
      areas: function () { setPanel('areas', true); },
      aerial: function () { closePanels(); hideIntro(); goTo(T.home.aerial || T.home.scene); },
      galleries: function (b) { var open = gList.hidden; gList.hidden = !open; b.setAttribute('aria-expanded', String(open)); },
      plan: function () { setPanel('plan', true); },
      share: share,
      welcome: function () { closePanels(); showIntro(); }
    };
    $('#menuList').addEventListener('click', function (e) {
      var g = e.target.closest('[data-gal]');
      if (g) { closePanels(); hideIntro(); goTo(g.dataset.gal); openGallery(byId[g.dataset.gal]); return; }
      var b = e.target.closest('[data-act]');
      if (b && acts[b.dataset.act]) acts[b.dataset.act](b);
    });
  }

  function refreshMenu() {
    $('#miAreasCount').textContent = scenes.length;
    $('#miGalCount').textContent = scenes.filter(function (s) { return s.gallery; }).length;
    Array.prototype.forEach.call(document.querySelectorAll('#miGalList [data-gal]'), function (b) {
      var sc = byId[b.dataset.gal];
      b.querySelector('span').textContent = nm(sc);
      b.querySelector('small').textContent = nm(chapterById[sc.chapter]);
    });
  }

  function fillIntro() {
    var lead = $('#introLead');
    lead.textContent = '';
    pick(T.home, 'lead').split('*').forEach(function (part, i) {
      if (!part) return;
      if (i % 2) { var em = document.createElement('em'); em.textContent = part; lead.appendChild(em); }
      else lead.appendChild(document.createTextNode(part));
    });
    $('#introStart .lbl').textContent = t('start');
    $('#introHint').textContent = t(touchOnly ? 'hintTouch' : 'hintDesktop');
  }

  function applyLang() {
    document.documentElement.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-label]'), function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-label'))); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-tip]'), function (el) {
      var tip = t(el.getAttribute('data-i18n-tip'));
      el.setAttribute('data-tip', tip);
      el.setAttribute('aria-label', tip);
    });
    $('#brandTag').textContent = t('tagline');
    $('#btnLang').textContent = lang.toUpperCase();
    labelers.forEach(function (fn) { fn(); });
    buildAreas();
    refreshMenu();
    fillIntro();
    fillContact();
    updateRotateUI();
    setMode(mode);
    if (current) updateScene();
    if (current && $('#intro').hidden) { try { history.replaceState(null, '', '#' + slugOf(current)); } catch (e) {} }
    if (!$('#lightbox').hidden && lb.d) { $('#lbTitle').textContent = nm(lb.d); if (!$('#lightbox').classList.contains('viewing')) $('#lbCount').textContent = t('photoCount', { n: lb.list.length }); }
  }

  $('#btnLang').addEventListener('click', function () {
    lang = lang === 'it' ? 'en' : 'it';
    try { localStorage.setItem('tour-lang', lang); } catch (e) {}
    applyLang();
  });

  /* ---------- start ---------- */
  $('#brandName').textContent = T.name;
  $('#areasBrandName').textContent = T.name;
  buildMenu();
  buildPlan();
  applyLang();

  var hashId = idFromHash(location.hash.slice(1));
  if (hashId) goTo(hashId, { instant: true });
  else if (EDIT) goTo(scenes[0].id, { instant: true });
  else showIntro();
  setRotate(!EDIT && !REDUCED);
})();
