// ====================================================
// SHRED HIMALAYAS — ADMIN PANEL LOGIC v2
// Fully synced with new admin.html UI
// ====================================================

// ─── LOAD ALL (called after login) ───────────────────
function loadAll() {
  renderDashboard();
  loadSettings();
}

// ─── TOAST ──────────────────────────────────────────
function showToast(msg, ok) {
  var t = document.getElementById('toast');
  t.textContent = (ok !== false ? '✅ ' : '❌ ') + msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 3000);
}

// ─── TOAST ALIAS (admin.js used 'toast()') ───────────
function toast(msg, color) {
  showToast(msg.replace(/^[✅❌⚠️]\s*/, ''), color === 'red' ? false : true);
}

// ─── AUTH (LocalStorage Based Authentication) ────────
function doLogin(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  var userEl = document.getElementById('loginUser');
  var passEl = document.getElementById('loginPass');
  var errEl = document.getElementById('loginError');

  var user = userEl ? userEl.value.trim() : '';
  var pass = passEl ? passEl.value : '';

  // Get credentials stored in localStorage or fallback to default
  var storedUser = localStorage.getItem('sh_admin_user') || 'jammu&kashmir';
  var storedPass = localStorage.getItem('sh_admin_pass') || 'admin@2000';

  var isMatch = (user === 'jammu&kashmir' && pass === 'admin@2000') || (user === storedUser && pass === storedPass);

  if (isMatch) {
    if (errEl) {
      errEl.classList.remove('show');
      errEl.style.display = 'none';
    }

    // Save session & credentials in localStorage
    sessionStorage.setItem('sh_admin_logged_in', 'true');
    localStorage.setItem('sh_admin_user', user);
    localStorage.setItem('sh_admin_pass', pass);

    // Sync admin user doc to Firestore in background if available
    if (typeof db !== 'undefined' && db) {
      try {
        db.collection('users').doc('admin').set({
          username: user,
          password: pass
        }).catch(function (err) {
          console.warn('Firestore admin user sync warning:', err);
        });
      } catch (err) {}
    }

    var loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.style.display = 'none';

    var appScr = document.getElementById('app');
    if (appScr) {
      appScr.classList.add('visible');
      appScr.style.display = 'flex';
    }

    if (typeof SHData !== 'undefined' && SHData.init) {
      try { SHData.init(); } catch (err) {}
    }
    if (typeof loadAll === 'function') {
      try { loadAll(); } catch (err) {}
    }
  } else {
    if (errEl) {
      errEl.classList.add('show');
      errEl.style.display = 'flex';
    }
  }
  return false;
}

function doLogout() {
  if (confirm('Are you sure you want to log out from the Admin Panel?')) {
    sessionStorage.removeItem('sh_admin_logged_in');
    var appScr = document.getElementById('app');
    if (appScr) appScr.classList.remove('visible');
    var loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.style.display = 'flex';
    var userEl = document.getElementById('loginUser');
    if (userEl) userEl.value = '';
    var passEl = document.getElementById('loginPass');
    if (passEl) passEl.value = '';
  }
}

function confirmReset() {
  if (confirm('⚠️ Reset ALL content to defaults? This cannot be undone.')) {
    SHData.reset();
    SHData.init().then(function () {
      showToast('Content reset to defaults');
      loadAll();
    });
  }
}

// ─── NAVIGATION ─────────────────────────────────────
function navigate(el) {
  document.querySelectorAll('.nv').forEach(function (n) { n.classList.remove('active'); });
  document.querySelectorAll('.pg').forEach(function (p) { p.classList.remove('active'); });
  el.classList.add('active');
  var page = el.dataset.page;
  var pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  renderPage(page);
  closeSB();
}


function toggleSB() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sbOv').classList.toggle('open');
}
function closeSB() {
  document.getElementById('sidebar').classList.remove('open');
  var ov = document.getElementById('sbOv');
  if (ov) ov.classList.remove('open');
}

// ─── PAGE ROUTER ─────────────────────────────────────
function renderPage(page) {
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'skiing': renderSkiingEditor(); break;
    case 'snowboarding': renderSnowboardingEditor(); break;
    case 'trekking': renderTrekkingEditor(); break;
    case 'activities': renderActivitiesEditor(); break;
    case 'sightseeing': renderSightseeingEditor(); break;
    case 'rentals': renderRentalsEditor(); break;
    case 'transport': renderTransportEditor(); break;
    case 'packages': renderPackagesEditor(); break;
    case 'itineraries': renderItinerariesEditor(); break;
    case 'testimonials': renderTestimonialsEditor(); break;
    case 'team': renderTeamEditor(); break;
    case 'about': renderAboutEditor(); break;
    case 'policies': renderPoliciesEditor(); break;
    case 'settings': loadSettings(); break;
    case 'contacts': renderContactsEditor(); break;
    case 'seo': renderSEOEditor(); break;
  }
}

// ─── DASHBOARD ──────────────────────────────────────
function renderDashboard() {
  var skiing = SHData.get('skiing');
  var snowboarding = SHData.get('snowboarding');
  var trekking = SHData.get('trekking');
  var packages = SHData.get('packages');
  var testimonials = SHData.get('testimonials');
  var team = SHData.get('team') || [];
  var about = SHData.get('about') || (SHData.defaults ? SHData.defaults.about : {});
  var timeline = about.timeline || [];
  var activities = SHData.get('activities');
  var rentals = SHData.get('rentals');
  var transport = SHData.get('transport') || [];
  var sightseeing = SHData.get('sightseeing');
  var contacts = SHData.get('contacts') || [];
  var transportItemCount = transport.reduce(function (a, c) { return a + (c.items ? c.items.length : 0); }, 0);

  var skiCount = skiing.reduce(function (a, c) { return a + c.items.length; }, 0);
  var sbCount = snowboarding.reduce(function (a, c) { return a + c.items.length; }, 0);
  var actCount = (activities.winter ? activities.winter.length : 0) + (activities.summer ? activities.summer.length : 0);

  var stats = [
    { icon: '⛷️', label: 'Skiing Packages', count: skiCount },
    { icon: '🏂', label: 'Snowboarding', count: sbCount },
    { icon: '🥾', label: 'Treks', count: trekking.length },
    { icon: '📦', label: 'Tour Packages', count: packages.length },
    { icon: '💬', label: 'Testimonials', count: testimonials.length },
    { icon: '👥', label: 'Team Members', count: team.length },
    { icon: '📖', label: 'Story Milestones', count: timeline.length },
    { icon: '🎯', label: 'Activities', count: actCount },
    { icon: '📍', label: 'Sightseeing', count: sightseeing.length },
    { icon: '🎿', label: 'Rentals', count: rentals.length },
    { icon: '🚗', label: 'Transport', count: transportItemCount },
    { icon: '📞', label: 'Contact Points', count: contacts.length }
  ];

  var ds = document.getElementById('dashStats');
  if (ds) ds.innerHTML = stats.map(function (s) {
    return '<div class="stat-card"><div class="stat-icon">' + s.icon + '</div><div><div class="stat-count">' + s.count + '</div><div class="stat-label">' + s.label + '</div></div></div>';
  }).join('');

  var quicks = [
    { icon: '⛷️', title: 'Skiing', page: 'skiing', count: skiCount + ' packages' },
    { icon: '🏂', title: 'Snowboarding', page: 'snowboarding', count: sbCount + ' packages' },
    { icon: '🥾', title: 'Trekking', page: 'trekking', count: trekking.length + ' treks' },
    { icon: '🎯', title: 'Activities', page: 'activities', count: 'Winter & Summer' },
    { icon: '📍', title: 'Sightseeing', page: 'sightseeing', count: sightseeing.length + ' spots' },
    { icon: '🎿', title: 'Rentals', page: 'rentals', count: rentals.length + ' items' },
    { icon: '🚗', title: 'Transport', page: 'transport', count: transportItemCount + ' vehicles' },
    { icon: '📦', title: 'Packages', page: 'packages', count: packages.length + ' tours' },
    { icon: '📄', title: 'Itineraries', page: 'itineraries', count: packages.filter(function (p) { return p.itineraryPdf; }).length + ' PDFs' },
    { icon: '💬', title: 'Testimonials', page: 'testimonials', count: testimonials.length + ' reviews' },
    { icon: '👥', title: 'Our Team', page: 'team', count: team.length + ' members' },
    { icon: '📖', title: 'Our Story', page: 'about', count: timeline.length + ' milestones' },
    { icon: '📞', title: 'Contact Info', page: 'contacts', count: contacts.length + ' locations' },
    { icon: '⚙️', title: 'Settings', page: 'settings', count: 'Site config' }
  ];

  var qn = document.getElementById('quickNav');
  if (qn) qn.innerHTML = quicks.map(function (q) {
    return '<div class="qcard" onclick="navigate(document.querySelector(\'[data-page=' + q.page + ']\'))"><div class="qcard-ico">' + q.icon + '</div><div class="qcard-title">' + q.title + '</div><div class="qcard-count">' + q.count + '</div></div>';
  }).join('');
}

// ─── SVG ICONS ───────────────────────────────────────
var SVG_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
var SVG_DEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
var SVG_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
var SVG_HIDE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
var SVG_STAR_FILL = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
var SVG_STAR_OUTLINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

// ─── TOGGLE BUTTON ───────────────────────────────────
function toggleBtn(enabled, onclickStr) {
  var isOn = enabled !== false;
  return '<button class="icon-btn ' + (isOn ? 'icon-btn--disable' : 'icon-btn--enable') + '" title="' + (isOn ? 'Disable (hide from site)' : 'Enable (show on site)') + '" onclick="' + onclickStr + '">' + (isOn ? SVG_EYE : SVG_HIDE) + '</button>';
}

// ─── ROW BUILDER (standard list row with img) ─────────
function itemRow(imgSrc, title, meta, enabled, actions) {
  var thumb = imgSrc ? '<img class="item-thumb" src="' + imgSrc + '" alt="" onerror="this.style.display=\'none\'">' : '';
  var disabledBadge = enabled === false ? '<span class="disabled-badge">Hidden</span>' : '';
  return '<div class="item-row' + (enabled === false ? ' item-row--disabled' : '') + '">' +
    thumb +
    '<div class="item-info"><div class="item-title">' + escHtml(title) + '</div><div class="item-meta">' + meta + '</div></div>' +
    disabledBadge +
    '<div class="item-actions">' + actions + '</div></div>';
}

function simpleRow(title, desc, badge, enabled, actions) {
  var disabledBadge = enabled === false ? '<span class="disabled-badge">Hidden</span>' : '';
  var badgeHtml = badge ? '<span class="item-badge">' + badge + '</span>' : '';
  return '<div class="simple-row' + (enabled === false ? ' item-row--disabled' : '') + '">' +
    '<div class="simple-row-info"><div class="simple-row-title">' + escHtml(title) + '</div>' +
    (desc ? '<div class="simple-row-desc">' + escHtml(desc) + '</div>' : '') + '</div>' +
    badgeHtml + disabledBadge +
    '<div class="item-actions">' + actions + '</div></div>';
}

// ─── SKIING EDITOR ───────────────────────────────────
function renderSkiingEditor() {
  var cats = SHData.get('skiing');
  var el = document.getElementById('skiing-editor');
  if (!el) return;
  el.innerHTML = cats.map(function (cat, ci) {
    var rows = cat.items.map(function (item, ii) {
      var actions =
        toggleBtn(item.enabled, "toggleItem('skiing'," + ci + "," + ii + ")") +
        '<button class="icon-btn icon-btn--edit" title="Edit" onclick="openModal(\'ski-item\',' + ci + ',' + ii + ')">' + SVG_EDIT + '</button>' +
        '<button class="icon-btn icon-btn--delete" title="Delete" onclick="deleteItem(\'skiing\',' + ci + ',' + ii + ')">' + SVG_DEL + '</button>';
      var meta = (item.price || 'No Price') + ' &nbsp;·&nbsp; ' + (item.badge || '') + ' &nbsp;·&nbsp; ' + (item.meta1 || '');
      return itemRow(item.image, item.title, meta, item.enabled, actions);
    }).join('');
    return '<div class="admin-category">' +
      '<div class="admin-cat-header"><div class="admin-cat-title"><div class="admin-cat-title-dot"></div>' + escHtml(cat.title) + '</div>' +
      '<button class="cat-add-btn" onclick="openModal(\'ski-item\',' + ci + ',null)">+ Add Package</button></div>' +
      '<div class="items-list">' + (rows || emptyState('No packages in this category yet')) + '</div></div>';
  }).join('');
}

// ─── SNOWBOARDING EDITOR ──────────────────────────────
function renderSnowboardingEditor() {
  var cats = SHData.get('snowboarding');
  var el = document.getElementById('snowboarding-editor');
  if (!el) return;
  el.innerHTML = cats.map(function (cat, ci) {
    var rows = cat.items.map(function (item, ii) {
      var actions =
        toggleBtn(item.enabled, "toggleItem('snowboarding'," + ci + "," + ii + ")") +
        '<button class="icon-btn icon-btn--edit" title="Edit" onclick="openModal(\'sb-item\',' + ci + ',' + ii + ')">' + SVG_EDIT + '</button>' +
        '<button class="icon-btn icon-btn--delete" title="Delete" onclick="deleteItem(\'snowboarding\',' + ci + ',' + ii + ')">' + SVG_DEL + '</button>';
      var meta = (item.price || 'No Price') + ' &nbsp;·&nbsp; ' + (item.badge || '') + ' &nbsp;·&nbsp; ' + (item.meta1 || '');
      return itemRow(item.image, item.title, meta, item.enabled, actions);
    }).join('');
    return '<div class="admin-category">' +
      '<div class="admin-cat-header"><div class="admin-cat-title"><div class="admin-cat-title-dot"></div>' + escHtml(cat.title) + '</div>' +
      '<button class="cat-add-btn" onclick="openModal(\'sb-item\',' + ci + ',null)">+ Add Package</button></div>' +
      '<div class="items-list">' + (rows || emptyState('No packages in this category yet')) + '</div></div>';
  }).join('');
}

// ─── TREKKING EDITOR ──────────────────────────────────
function renderTrekkingEditor() {
  var treks = SHData.get('trekking');
  var el = document.getElementById('trekking-editor');
  if (!el) return;
  el.innerHTML = treks.length ? treks.map(function (t, ti) {
    var diffClass = 'diff-tag--' + (t.difficultyClass || t.difficulty.toLowerCase());
    var actions =
      toggleBtn(t.enabled, "toggleTrek(" + ti + ")") +
      '<button class="icon-btn icon-btn--edit" title="Edit" onclick="openModal(\'trek\',null,' + ti + ')">' + SVG_EDIT + '</button>' +
      '<button class="icon-btn icon-btn--delete" title="Delete" onclick="deleteTrek(' + ti + ')">' + SVG_DEL + '</button>';
    return '<div class="item-row' + (t.enabled === false ? ' item-row--disabled' : '') + '">' +
      '<img class="item-thumb" src="' + (t.image || '') + '" alt="" onerror="this.style.display=\'none\'">' +
      '<div class="item-info"><div class="item-title">' + escHtml(t.title) + '</div>' +
      '<div class="item-meta">' + (t.price || 'No Price') + ' · ' + (t.days || '') + ' · ' + (t.altitude || '') + '</div></div>' +
      '<span class="diff-tag ' + diffClass + '">' + (t.difficulty || '') + '</span>' +
      (t.enabled === false ? '<span class="disabled-badge">Hidden</span>' : '') +
      '<div class="item-actions">' + actions + '</div></div>';
  }).join('') : emptyState('No treks added yet');
}

// ─── ACTIVITIES EDITOR ────────────────────────────────
function renderActivitiesEditor() {
  var acts = SHData.get('activities');
  var wEl = document.getElementById('winter-activities-editor');
  var sEl = document.getElementById('summer-activities-editor');

  if (wEl) {
    var wRows = (acts.winter || []).map(function (a, ai) {
      var actions =
        toggleBtn(a.enabled, "toggleActivity('winter'," + ai + ")") +
        '<button class="icon-btn icon-btn--edit" onclick="openModal(\'activity\',\'winter\',' + ai + ')">' + SVG_EDIT + '</button>' +
        '<button class="icon-btn icon-btn--delete" onclick="deleteActivity(\'winter\',' + ai + ')">' + SVG_DEL + '</button>';
      return simpleRow(a.name, a.desc, '', a.enabled, actions);
    }).join('');
    wEl.innerHTML = wRows || emptyState('No winter activities yet');
  }

  if (sEl) {
    var sRows = (acts.summer || []).map(function (a, ai) {
      var actions =
        toggleBtn(a.enabled, "toggleActivity('summer'," + ai + ")") +
        '<button class="icon-btn icon-btn--edit" onclick="openModal(\'activity\',\'summer\',' + ai + ')">' + SVG_EDIT + '</button>' +
        '<button class="icon-btn icon-btn--delete" onclick="deleteActivity(\'summer\',' + ai + ')">' + SVG_DEL + '</button>';
      return simpleRow(a.name, a.desc, '', a.enabled, actions);
    }).join('');
    sEl.innerHTML = sRows || emptyState('No summer activities yet');
  }
}

// ─── SIGHTSEEING EDITOR ──────────────────────────────
function renderSightseeingEditor() {
  var items = SHData.get('sightseeing');
  var el = document.getElementById('sightseeing-editor');
  if (!el) return;
  el.innerHTML = items.length ? items.map(function (s, si) {
    var actions =
      toggleBtn(s.enabled, "toggleSight(" + si + ")") +
      '<button class="icon-btn icon-btn--edit" onclick="openModal(\'sightseeing\',null,' + si + ')">' + SVG_EDIT + '</button>' +
      '<button class="icon-btn icon-btn--delete" onclick="deleteSight(' + si + ')">' + SVG_DEL + '</button>';
    return simpleRow(s.title, s.desc, s.place, s.enabled, actions);
  }).join('') : emptyState('No sightseeing destinations yet');
}

// ─── RENTALS EDITOR (Category + Items) ────────────────
function renderRentalsEditor() {
  var cats = SHData.get('rentals');
  var el = document.getElementById('rentals-editor');
  if (!el) return;
  if (!cats || cats.length === 0) {
    el.innerHTML = emptyState('No rental categories yet. Click "Add Category" to get started.');
    return;
  }
  el.innerHTML = cats.map(function (cat, ci) {
    var visibleItems = cat.items ? cat.items : [];
    var isCS = cat.comingSoon || visibleItems.length === 0;
    var itemsHtml = '';
    if (visibleItems.length > 0) {
      itemsHtml = '<div class="items-list">' +
        visibleItems.map(function (item, ii) {
          var actions =
            toggleBtn(item.enabled, 'toggleRentalItem(' + ci + ',' + ii + ')') +
            '<button class="icon-btn icon-btn--edit" title="Edit" onclick="openModal(\'rental-item\',' + ci + ',' + ii + ')">' + SVG_EDIT + '</button>' +
            '<button class="icon-btn icon-btn--delete" title="Delete" onclick="deleteRentalItem(' + ci + ',' + ii + ')">' + SVG_DEL + '</button>';
          var meta = (item.price || 'No price') + (item.desc ? ' &nbsp;&middot;&nbsp; ' + escHtml(item.desc.substring(0, 55)) + (item.desc.length > 55 ? '&hellip;' : '') : '');
          return itemRow(item.image, item.title, meta, item.enabled, actions);
        }).join('') +
        '</div>';
    } else {
      itemsHtml = '<div style="border:1px solid var(--cb);border-top:none;border-radius:0 0 var(--r) var(--r);">' +
        '<div class="empty-state" style="border:none;margin:0;"><div class="empty-state-icon">' + (cat.icon || '\ud83c\udfbf') + '</div>' +
        '<strong>No equipment items yet</strong>This category shows as <em>Coming Soon</em> on the rental page until items are added.</div></div>';
    }
    var catActions =
      '<button class="cat-add-btn" onclick="openModal(\'rental-item\',' + ci + ',null)">+ Add Item</button>' +
      '<button class="cat-add-btn" style="margin-left:5px;background:rgba(224,138,44,.18);border-color:rgba(224,138,44,.35);" onclick="openModal(\'rental-cat\',' + ci + ',null)">\u270f\ufe0f Edit</button>' +
      '<button class="cat-add-btn" style="margin-left:5px;background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.28);" onclick="deleteRentalCat(' + ci + ')">\ud83d\uddd1 Del</button>';
    return '<div class="admin-category">' +
      '<div class="admin-cat-header">' +
      '<div class="admin-cat-title">' +
      '<div class="admin-cat-title-dot"></div>' +
      '<span style="font-size:18px;line-height:1;margin-right:6px;">' + (cat.icon || '\ud83c\udfbf') + '</span>' +
      escHtml(cat.title) +
      (isCS ? '<span style="font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:rgba(255,255,255,.18);color:#fff;padding:2px 8px;border-radius:100px;margin-left:8px;">Coming Soon</span>' : '') +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:3px;">' + catActions + '</div>' +
      '</div>' +
      itemsHtml +
      '</div>';
  }).join('');
}

// ─── TRANSPORT EDITOR (Category + Items — mirrors Rentals) ────
function renderTransportEditor() {
  var cats = SHData.get('transport') || [];
  var el = document.getElementById('transport-editor');
  if (!el) return;
  if (!cats || cats.length === 0) {
    el.innerHTML = emptyState('No transport categories yet. Click "Add Category" to get started.');
    return;
  }
  el.innerHTML = cats.map(function (cat, ci) {
    var visibleItems = cat.items ? cat.items : [];
    var isCS = cat.comingSoon || visibleItems.length === 0;
    var itemsHtml = '';
    if (visibleItems.length > 0) {
      itemsHtml = '<div class="items-list">' +
        visibleItems.map(function (item, ii) {
          var actions =
            toggleBtn(item.enabled, 'toggleTransportItem(' + ci + ',' + ii + ')') +
            '<button class="icon-btn icon-btn--edit" title="Edit" onclick="openModal(\'transport-item\',' + ci + ',' + ii + ')">' + SVG_EDIT + '</button>' +
            '<button class="icon-btn icon-btn--delete" title="Delete" onclick="deleteTransportItem(' + ci + ',' + ii + ')">' + SVG_DEL + '</button>';
          var meta = (item.price || 'No price') + (item.desc ? ' &nbsp;&middot;&nbsp; ' + escHtml(item.desc.substring(0, 55)) + (item.desc.length > 55 ? '&hellip;' : '') : '');
          return itemRow(item.image, item.title, meta, item.enabled, actions);
        }).join('') +
        '</div>';
    } else {
      itemsHtml = '<div style="border:1px solid var(--cb);border-top:none;border-radius:0 0 var(--r) var(--r);">' +
        '<div class="empty-state" style="border:none;margin:0;"><div class="empty-state-icon">' + (cat.icon || '🚗') + '</div>' +
        '<strong>No vehicles yet</strong>This category shows as <em>Coming Soon</em> on the travel page until items are added.</div></div>';
    }
    var catActions =
      '<button class="cat-add-btn" onclick="openModal(\'transport-item\',' + ci + ',null)">+ Add Vehicle</button>' +
      '<button class="cat-add-btn" style="margin-left:5px;background:rgba(224,138,44,.18);border-color:rgba(224,138,44,.35);" onclick="openModal(\'transport-cat\',' + ci + ',null)">\u270f\ufe0f Edit</button>' +
      '<button class="cat-add-btn" style="margin-left:5px;background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.28);" onclick="deleteTransportCat(' + ci + ')">' + '\ud83d\uddd1 Del</button>';
    return '<div class="admin-category">' +
      '<div class="admin-cat-header">' +
      '<div class="admin-cat-title">' +
      '<div class="admin-cat-title-dot"></div>' +
      '<span style="font-size:18px;line-height:1;margin-right:6px;">' + (cat.icon || '🚗') + '</span>' +
      escHtml(cat.title) +
      (isCS ? '<span style="font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:rgba(255,255,255,.18);color:#fff;padding:2px 8px;border-radius:100px;margin-left:8px;">Coming Soon</span>' : '') +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:3px;">' + catActions + '</div>' +
      '</div>' +
      itemsHtml +
      '</div>';
  }).join('');
}

function toggleTransportItem(ci, ii) {
  var cats = SHData.get('transport');
  cats[ci].items[ii].enabled = !cats[ci].items[ii].enabled;
  SHData.set('transport', cats);
  renderTransportEditor();
  showToast('Visibility updated');
}

function deleteTransportItem(ci, ii) {
  if (!confirm('Delete this vehicle?')) return;
  var cats = SHData.get('transport');
  cats[ci].items.splice(ii, 1);
  SHData.set('transport', cats);
  renderTransportEditor();
  showToast('Deleted', false);
}

function deleteTransportCat(ci) {
  if (!confirm('Delete this entire transport category and all its vehicles?')) return;
  var cats = SHData.get('transport');
  cats.splice(ci, 1);
  SHData.set('transport', cats);
  renderTransportEditor();
  showToast('Category deleted', false);
}

// ─── PACKAGES EDITOR ──────────────────────────────────
function renderPackagesEditor() {
  var pkgs = SHData.get('packages');
  var el = document.getElementById('packages-editor');
  if (!el) return;
  el.innerHTML = pkgs.length ? pkgs.map(function (p, pi) {
    var actions =
      toggleBtn(p.enabled, "togglePackage(" + pi + ")") +
      '<button class="icon-btn icon-btn--edit" onclick="openModal(\'package\',null,' + pi + ')">' + SVG_EDIT + '</button>' +
      '<button class="icon-btn icon-btn--delete" onclick="deletePackage(' + pi + ')">' + SVG_DEL + '</button>';
    var meta = (p.price || 'No Price') + ' &nbsp;·&nbsp; ' + (p.duration || '') + ' &nbsp;·&nbsp; ' + (p.accommodation || '');
    return itemRow(p.image, p.title, meta, p.enabled, actions);
  }).join('') : emptyState('No tour packages yet');
}
// ─── TESTIMONIALS EDITOR ─────────────────────────────
function renderTestimonialsEditor() {
  var tms = SHData.get('testimonials');
  var el = document.getElementById('testimonials-editor');
  if (!el) return;
  el.innerHTML = tms.length ? tms.map(function (t, ti) {
    var actions =
      toggleBtn(t.enabled, "toggleTestimonial(" + ti + ")") +
      '<button class="icon-btn icon-btn--edit" onclick="openModal(\'testimonial\',null,' + ti + ')">' + SVG_EDIT + '</button>' +
      '<button class="icon-btn icon-btn--delete" onclick="deleteTestimonial(' + ti + ')">' + SVG_DEL + '</button>';
    return simpleRow(t.name, t.text.substring(0, 80) + '…', t.source, t.enabled, actions);
  }).join('') : emptyState('No testimonials yet');
}

// ─── OUR TEAM EDITOR ──────────────────────────────────
function renderTeamEditor() {
  var team = SHData.get('team') || [];
  var el = document.getElementById('team-editor');
  if (!el) return;
  el.innerHTML = team.length ? team.map(function (m, mi) {
    var actions =
      toggleBtn(m.enabled, "toggleTeamMember(" + mi + ")") +
      '<button class="icon-btn icon-btn--edit" title="Edit" onclick="openModal(\'team-member\',null,' + mi + ')">' + SVG_EDIT + '</button>' +
      '<button class="icon-btn icon-btn--delete" title="Delete" onclick="deleteTeamMember(' + mi + ')">' + SVG_DEL + '</button>';
    var meta = escHtml(m.role || 'Team Member') + (m.badge ? ' &nbsp;·&nbsp; ' + escHtml(m.badge) : '');
    return itemRow(m.photo || 'assets/images/akash-avatar.jpg', m.name, meta, m.enabled, actions);
  }).join('') : emptyState('No team members added yet');
}

function toggleTeamMember(mi) {
  var team = SHData.get('team') || [];
  team[mi].enabled = team[mi].enabled === false ? true : false;
  SHData.set('team', team);
  renderTeamEditor();
  showToast('Visibility updated');
}

function deleteTeamMember(mi) {
  var team = SHData.get('team') || [];
  if (!confirm('Delete team member "' + (team[mi].name || '') + '"?')) return;
  team.splice(mi, 1);
  SHData.set('team', team);
  renderTeamEditor();
  showToast('Deleted', false);
}

// ─── EMPTY STATE ─────────────────────────────────────
function emptyState(msg) {
  return '<div class="empty-state"><div class="empty-state-icon">📭</div><strong>Nothing here yet</strong>' + msg + '</div>';
}

// ─── TOGGLE AND DELETE ────────────────────────────────
function toggleItem(key, ci, ii) {
  var cats = SHData.get(key);
  cats[ci].items[ii].enabled = cats[ci].items[ii].enabled === false ? true : false;
  SHData.set(key, cats);
  if (key === 'skiing') renderSkiingEditor(); else renderSnowboardingEditor();
  showToast('Visibility updated');
}
function deleteItem(key, ci, ii) {
  if (!confirm('Delete this package?')) return;
  var cats = SHData.get(key);
  cats[ci].items.splice(ii, 1);
  SHData.set(key, cats);
  if (key === 'skiing') renderSkiingEditor(); else renderSnowboardingEditor();
  showToast('Deleted', false);
}
function toggleTrek(ti) {
  var treks = SHData.get('trekking');
  treks[ti].enabled = treks[ti].enabled === false ? true : false;
  SHData.set('trekking', treks); renderTrekkingEditor(); showToast('Visibility updated');
}
function deleteTrek(ti) {
  if (!confirm('Delete this trek?')) return;
  var treks = SHData.get('trekking');
  treks.splice(ti, 1); SHData.set('trekking', treks); renderTrekkingEditor(); showToast('Deleted', false);
}
function toggleActivity(type, ai) {
  var acts = SHData.get('activities');
  acts[type][ai].enabled = acts[type][ai].enabled === false ? true : false;
  SHData.set('activities', acts); renderActivitiesEditor(); showToast('Visibility updated');
}
function deleteActivity(type, ai) {
  if (!confirm('Delete this activity?')) return;
  var acts = SHData.get('activities');
  acts[type].splice(ai, 1); SHData.set('activities', acts); renderActivitiesEditor(); showToast('Deleted', false);
}
function toggleSight(si) {
  var items = SHData.get('sightseeing');
  items[si].enabled = items[si].enabled === false ? true : false;
  SHData.set('sightseeing', items); renderSightseeingEditor(); showToast('Visibility updated');
}
function deleteSight(si) {
  if (!confirm('Delete this destination?')) return;
  var items = SHData.get('sightseeing');
  items.splice(si, 1); SHData.set('sightseeing', items); renderSightseeingEditor(); showToast('Deleted', false);
}
function toggleRentalItem(ci, ii) {
  var cats = SHData.get('rentals');
  cats[ci].items[ii].enabled = cats[ci].items[ii].enabled === false ? true : false;
  SHData.set('rentals', cats); renderRentalsEditor(); showToast('Visibility updated');
}
function deleteRentalItem(ci, ii) {
  if (!confirm('Delete this equipment item?')) return;
  var cats = SHData.get('rentals');
  cats[ci].items.splice(ii, 1); SHData.set('rentals', cats); renderRentalsEditor(); showToast('Deleted', false);
}
function toggleRentalCat(ci) {
  var cats = SHData.get('rentals');
  cats[ci].enabled = cats[ci].enabled === false ? true : false;
  SHData.set('rentals', cats); renderRentalsEditor(); showToast('Visibility updated');
}
function deleteRentalCat(ci) {
  var cats = SHData.get('rentals');
  if (!confirm('Delete category "' + cats[ci].title + '" and ALL its items? This cannot be undone.')) return;
  cats.splice(ci, 1); SHData.set('rentals', cats); renderRentalsEditor(); showToast('Category deleted', false);
}
function togglePackage(pi) {
  var pkgs = SHData.get('packages');
  pkgs[pi].enabled = pkgs[pi].enabled === false ? true : false;
  SHData.set('packages', pkgs); renderPackagesEditor(); showToast('Visibility updated');
}
function deletePackage(pi) {
  if (!confirm('Delete this package?')) return;
  var pkgs = SHData.get('packages');
  pkgs.splice(pi, 1); SHData.set('packages', pkgs); renderPackagesEditor(); showToast('Deleted', false);
}
function toggleTestimonial(ti) {
  var tms = SHData.get('testimonials');
  tms[ti].enabled = tms[ti].enabled === false ? true : false;
  SHData.set('testimonials', tms); renderTestimonialsEditor(); showToast('Visibility updated');
}
function deleteTestimonial(ti) {
  if (!confirm('Delete this review?')) return;
  var tms = SHData.get('testimonials');
  tms.splice(ti, 1); SHData.set('testimonials', tms); renderTestimonialsEditor(); showToast('Deleted', false);
}

// ─── CONTACTS ─────────────────────────────────────────
function renderContactsEditor() {
  var contacts = SHData.get('contacts') || [];
  var el = document.getElementById('contacts-editor');
  if (!el) return;

  if (!contacts.length) {
    el.innerHTML = emptyState('No contact locations added yet. Click "Add Contact Point" to get started.');
    return;
  }

  el.innerHTML = contacts.map(function (c, ci) {
    var isDefault = c.isDefault === true;
    var defaultBtnClass = isDefault ? 'icon-btn--star-active' : 'icon-btn--star-inactive';
    var defaultTitle = isDefault ? 'Default contact (active)' : 'Set as Default';
    var actions =
      '<button class="icon-btn ' + defaultBtnClass + '" title="' + defaultTitle + '" onclick="setDefaultContact(' + ci + ')">' +
      (isDefault ? SVG_STAR_FILL : SVG_STAR_OUTLINE) +
      '</button>' +
      toggleBtn(c.enabled, "toggleContact(" + ci + ")") +
      '<button class="icon-btn icon-btn--edit" title="Edit" onclick="openModal(\'contact\',null,' + ci + ')">' + SVG_EDIT + '</button>' +
      '<button class="icon-btn icon-btn--delete" title="Delete" onclick="deleteContact(' + ci + ')">' + SVG_DEL + '</button>';

    var meta = escHtml(c.phone || 'No Phone') + ' &nbsp;·&nbsp; ' + escHtml(c.email || 'No Email') + ' &nbsp;·&nbsp; ' + (isDefault ? '<strong>Default</strong>' : 'Standard');
    return itemRow('', c.name + (c.badge ? ' (' + c.badge + ')' : ''), meta, c.enabled, actions);
  }).join('');
}

function toggleContact(ci) {
  var contacts = SHData.get('contacts') || [];
  contacts[ci].enabled = contacts[ci].enabled === false ? true : false;
  SHData.set('contacts', contacts);
  renderContactsEditor();
  showToast('Visibility updated');
}

function deleteContact(ci) {
  var contacts = SHData.get('contacts') || [];
  if (contacts[ci].isDefault) {
    alert('Cannot delete the default contact point. Set another contact point as default first.');
    return;
  }
  if (!confirm('Delete contact point "' + contacts[ci].name + '"?')) return;
  contacts.splice(ci, 1);
  SHData.set('contacts', contacts);
  renderContactsEditor();
  showToast('Deleted', false);
}

function setDefaultContact(ci) {
  var contacts = SHData.get('contacts') || [];
  contacts.forEach(function (c, idx) {
    c.isDefault = (idx === ci);
    if (idx === ci) c.enabled = true; // Ensure default is enabled
  });
  SHData.set('contacts', contacts);
  renderContactsEditor();
  showToast('Default contact point updated');
}

// ─── SETTINGS ─────────────────────────────────────────
function loadSettings() {
  var s = SHData.get('settings');
  var wa = document.getElementById('s-whatsapp');
  var title = document.getElementById('s-heroTitle');
  var sub = document.getElementById('s-heroSubtitle');
  var video = document.getElementById('s-heroVideo');
  var copy = document.getElementById('s-copyright');
  if (wa) wa.value = s.whatsappNumber || '';
  if (title) title.value = s.heroTitle || '';
  if (sub) sub.value = s.heroSubtitle || '';
  if (video) video.value = s.heroVideoUrl || '';
  if (copy) copy.value = s.footerCopyright || '';
}
function saveSettings() {
  var s = {
    whatsappNumber: (document.getElementById('s-whatsapp') || {}).value || '',
    heroTitle: (document.getElementById('s-heroTitle') || {}).value || '',
    heroSubtitle: (document.getElementById('s-heroSubtitle') || {}).value || '',
    heroVideoUrl: (document.getElementById('s-heroVideo') || {}).value || '',
    footerCopyright: (document.getElementById('s-copyright') || {}).value || ''
  };
  SHData.set('settings', s);
  showToast('Settings saved successfully');
}
function resetToDefaults() { SHData.reset(); }

// ─── OUR STORY / ABOUT EDITOR ─────────────────────────
function renderAboutEditor() {
  var about = SHData.get('about');
  if (!about) about = JSON.parse(JSON.stringify(SHData.defaults.about));

  var lblEl = document.getElementById('ab-label');
  var tpEl = document.getElementById('ab-titlePrefix');
  var tgEl = document.getElementById('ab-titleGradient');
  var qEl = document.getElementById('ab-quote');
  var bEl = document.getElementById('ab-bio');

  if (lblEl) lblEl.value = about.label || 'Our Story';
  if (tpEl) tpEl.value = about.titlePrefix !== undefined ? about.titlePrefix : 'Built By ';
  if (tgEl) tgEl.value = about.titleGradient !== undefined ? about.titleGradient : 'Local Experts';
  if (qEl) qEl.value = about.quote || '';
  if (bEl) bEl.value = about.bio || '';

  var portraitContainer = document.getElementById('ab-portrait-field-container');
  if (portraitContainer) {
    portraitContainer.innerHTML = imageUploadField('ab-portraitImage', about.portraitImage || 'assets/images/founder-portrait.png');
  }

  // Render Timeline Milestones
  var timeline = about.timeline || [];
  var el = document.getElementById('timeline-editor');
  if (!el) return;

  if (!timeline.length) {
    el.innerHTML = emptyState('No timeline milestones added yet. Click "Add Timeline Milestone" to add one.');
    return;
  }

  el.innerHTML = timeline.map(function (item, idx) {
    var actions =
      toggleBtn(item.enabled !== false, "toggleTimelineItem(" + idx + ")") +
      '<button class="icon-btn icon-btn--edit" title="Edit" onclick="openModal(\'timeline-item\', null, ' + idx + ')">' + SVG_EDIT + '</button>' +
      '<button class="icon-btn icon-btn--delete" title="Delete" onclick="deleteTimelineItem(' + idx + ')">' + SVG_DEL + '</button>';

    var title = 'Year ' + escHtml(item.year || 'N/A');
    var desc = escHtml(item.text || 'No description');

    return simpleRow('📅', title, desc, item.enabled !== false, actions);
  }).join('');
}

function saveAboutSettings() {
  var about = SHData.get('about') || JSON.parse(JSON.stringify(SHData.defaults.about));

  var lblEl = document.getElementById('ab-label');
  var tpEl = document.getElementById('ab-titlePrefix');
  var tgEl = document.getElementById('ab-titleGradient');
  var qEl = document.getElementById('ab-quote');
  var bEl = document.getElementById('ab-bio');
  var imgEl = document.getElementById('ab-portraitImage');

  about.label = lblEl ? lblEl.value.trim() : 'Our Story';
  about.titlePrefix = tpEl ? tpEl.value : 'Built By ';
  about.titleGradient = tgEl ? tgEl.value : 'Local Experts';
  about.quote = qEl ? qEl.value.trim() : '';
  about.bio = bEl ? bEl.value.trim() : '';
  if (imgEl) about.portraitImage = imgEl.value.trim();

  SHData.set('about', about);
  showToast('Story content saved successfully!');
  renderAboutEditor();
}

function toggleTimelineItem(idx) {
  var about = SHData.get('about') || JSON.parse(JSON.stringify(SHData.defaults.about));
  if (about.timeline && about.timeline[idx]) {
    about.timeline[idx].enabled = about.timeline[idx].enabled === false ? true : false;
    SHData.set('about', about);
    renderAboutEditor();
    showToast('Visibility updated');
  }
}

function deleteTimelineItem(idx) {
  if (!confirm('Delete this timeline milestone?')) return;
  var about = SHData.get('about') || JSON.parse(JSON.stringify(SHData.defaults.about));
  if (about.timeline) {
    about.timeline.splice(idx, 1);
    SHData.set('about', about);
    renderAboutEditor();
    showToast('Milestone deleted', false);
  }
}

// ─── MODAL CONTROLLER ─────────────────────────────────
var _modalCtx = null;
function openModal(type, ctx1, ctx2) {
  _modalCtx = { type: type, ctx1: ctx1, ctx2: ctx2 };
  var body = document.getElementById('modal-body');
  var titleEl = document.getElementById('modal-title');
  var html = '';
  var item = null;

  if (type === 'ski-item' || type === 'sb-item') {
    var dataKey = type === 'ski-item' ? 'skiing' : 'snowboarding';
    var cats = SHData.get(dataKey);
    var cat = cats[ctx1];
    item = ctx2 !== null && ctx2 !== undefined ? cat.items[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit: ' + item.title : 'Add to "' + cat.title + '"';
    html = packageForm(item);
  } else if (type === 'trek') {
    var treks = SHData.get('trekking');
    item = ctx2 !== null && ctx2 !== undefined ? treks[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit: ' + item.title : 'Add New Trek';
    html = trekForm(item);
  } else if (type === 'activity') {
    var acts = SHData.get('activities');
    item = ctx2 !== null && ctx2 !== undefined ? acts[ctx1][ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit Activity' : 'Add ' + (ctx1 === 'winter' ? 'Winter' : 'Summer') + ' Activity';
    html = activityForm(item);
  } else if (type === 'sightseeing') {
    var sights = SHData.get('sightseeing');
    item = ctx2 !== null && ctx2 !== undefined ? sights[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit: ' + item.title : 'Add Destination';
    html = sightseeingForm(item);
  } else if (type === 'rental-cat') {
    var cats = SHData.get('rentals');
    // ctx1 = category index (edit) or null (new)
    item = ctx1 !== null && ctx1 !== undefined ? cats[ctx1] : {};
    titleEl.textContent = ctx1 !== null && ctx1 !== undefined ? 'Edit Category: ' + item.title : 'Add Rental Category';
    html = rentalCatForm(item);
  } else if (type === 'rental-item') {
    var cats = SHData.get('rentals');
    var cat = cats[ctx1];
    // ctx2 = item index (edit) or null (new)
    item = ctx2 !== null && ctx2 !== undefined ? cat.items[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit: ' + item.title : 'Add Item to "' + cat.title + '"';
    html = rentalItemForm(item);
  } else if (type === 'transport-cat') {
    var cats = SHData.get('transport') || [];
    item = ctx1 !== null && ctx1 !== undefined ? cats[ctx1] : {};
    titleEl.textContent = ctx1 !== null && ctx1 !== undefined ? 'Edit Category: ' + item.title : 'Add Transport Category';
    html = transportCatForm(item);
  } else if (type === 'transport-item') {
    var cats = SHData.get('transport') || [];
    var cat = cats[ctx1];
    item = ctx2 !== null && ctx2 !== undefined ? cat.items[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit: ' + item.title : 'Add Vehicle to "' + cat.title + '"';
    html = transportItemForm(item);
  } else if (type === 'package') {
    var pkgs = SHData.get('packages');
    item = ctx2 !== null && ctx2 !== undefined ? pkgs[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit: ' + item.title : 'Add Tour Package';
    html = tourPackageForm(item);
  } else if (type === 'testimonial') {
    var tms = SHData.get('testimonials');
    item = ctx2 !== null && ctx2 !== undefined ? tms[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit Review' : 'Add Review';
    html = testimonialForm(item);
  } else if (type === 'team-member') {
    var team = SHData.get('team') || [];
    item = ctx2 !== null && ctx2 !== undefined ? team[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit Team Member: ' + item.name : 'Add Team Member';
    html = teamMemberForm(item);
  } else if (type === 'contact') {
    var contacts = SHData.get('contacts') || [];
    item = ctx2 !== null && ctx2 !== undefined ? contacts[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit Contact Location' : 'Add Contact Location';
    html = contactForm(item);
  } else if (type === 'timeline-item') {
    var about = SHData.get('about') || JSON.parse(JSON.stringify(SHData.defaults.about));
    var timeline = about.timeline || [];
    item = ctx2 !== null && ctx2 !== undefined ? timeline[ctx2] : {};
    titleEl.textContent = ctx2 !== null && ctx2 !== undefined ? 'Edit Milestone' : 'Add Timeline Milestone';
    html = timelineItemForm(item);
  }

  body.innerHTML = html;
  document.getElementById('modalBackdrop').classList.add('open');
  document.body.classList.add('no-scroll');
  document.documentElement.classList.add('no-scroll');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.classList.remove('no-scroll');
  document.documentElement.classList.remove('no-scroll');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  _modalCtx = null;
}
function closeModalOnBackdrop(e) {
  if (e.target.id === 'modalBackdrop') closeModal();
}

function v(id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; }
function vc(id) { var el = document.getElementById(id); return el ? el.checked : false; }

function saveModal() {
  var type = _modalCtx.type, ctx1 = _modalCtx.ctx1, ctx2 = _modalCtx.ctx2;
  var isEdit = ctx2 !== null && ctx2 !== undefined;

  if (type === 'ski-item' || type === 'sb-item') {
    var dataKey = type === 'ski-item' ? 'skiing' : 'snowboarding';
    var cats = SHData.get(dataKey);
    var existing = isEdit ? cats[ctx1].items[ctx2] : {};
    var pdf = resolvePdfForSave(existing);
    var newItem = {
      id: isEdit ? existing.id : 'item-' + Date.now(),
      enabled: existing.enabled !== false,
      title: v('f-title'), description: v('f-desc'), badge: v('f-badge'),
      price: v('f-price'), meta1: v('f-meta1'), meta2: v('f-meta2'), meta3: v('f-meta3'),
      includes: v('f-includes'), image: v('f-image'), waMsg: v('f-wamsg'),
      itineraryPdf: pdf.itineraryPdf, itineraryPdfName: pdf.itineraryPdfName
    };
    if (!newItem.title) { showToast('Title is required', false); return; }
    if (isEdit) cats[ctx1].items[ctx2] = newItem; else cats[ctx1].items.push(newItem);
    SHData.set(dataKey, cats);
    if (type === 'ski-item') renderSkiingEditor(); else renderSnowboardingEditor();
  }
  else if (type === 'trek') {
    var treks = SHData.get('trekking');
    var existing = isEdit ? treks[ctx2] : {};
    var diff = v('f-difficulty');
    var pdf = resolvePdfForSave(existing);
    var newT = {
      id: isEdit ? existing.id : 'trek-' + Date.now(),
      enabled: existing.enabled !== false,
      title: v('f-title'), description: v('f-desc'), price: v('f-price'),
      difficulty: diff, difficultyClass: diff.toLowerCase(),
      days: v('f-days'), altitude: v('f-altitude'), distance: v('f-distance'),
      season: v('f-season'), highlights: v('f-highlights'),
      image: v('f-image'), waMsg: v('f-wamsg'),
      itineraryPdf: pdf.itineraryPdf, itineraryPdfName: pdf.itineraryPdfName
    };
    if (!newT.title) { showToast('Title is required', false); return; }
    if (isEdit) treks[ctx2] = newT; else treks.push(newT);
    SHData.set('trekking', treks); renderTrekkingEditor();
  }
  else if (type === 'activity') {
    var acts = SHData.get('activities');
    var existing = isEdit ? acts[ctx1][ctx2] : {};
    var newA = {
      id: isEdit ? existing.id : 'act-' + Date.now(),
      enabled: existing.enabled !== false,
      name: v('f-name'), desc: v('f-desc'), image: v('f-image'),
      badge: v('f-badge'), price: v('f-price'), waMsg: v('f-wamsg')
    };
    if (!newA.name) { showToast('Name is required', false); return; }
    if (isEdit) acts[ctx1][ctx2] = newA; else acts[ctx1].push(newA);
    SHData.set('activities', acts); renderActivitiesEditor();
  }
  else if (type === 'sightseeing') {
    var sights = SHData.get('sightseeing');
    var existing = isEdit ? sights[ctx2] : {};
    var pdf = resolvePdfForSave(existing);
    var newS = {
      id: isEdit ? existing.id : 'sg-' + Date.now(),
      enabled: existing.enabled !== false,
      place: v('f-place'), label: v('f-label'), title: v('f-title'),
      desc: v('f-desc'), image: v('f-image'),
      itineraryPdf: pdf.itineraryPdf, itineraryPdfName: pdf.itineraryPdfName
    };
    if (!newS.title) { showToast('Title is required', false); return; }
    if (isEdit) sights[ctx2] = newS; else sights.push(newS);
    SHData.set('sightseeing', sights); renderSightseeingEditor();
  }
  else if (type === 'rental-cat') {
    var cats = SHData.get('rentals');
    var isCatEdit = ctx1 !== null && ctx1 !== undefined;
    var existingCat = isCatEdit ? cats[ctx1] : {};
    var newCat = {
      id: isCatEdit ? existingCat.id : 'cat-' + Date.now(),
      title: v('f-title'),
      icon: v('f-icon') || '🎿',
      comingSoon: vc('f-coming-soon'),
      items: isCatEdit ? (existingCat.items || []) : []
    };
    if (!newCat.title) { showToast('Category title is required', false); return; }
    if (isCatEdit) cats[ctx1] = newCat; else cats.push(newCat);
    SHData.set('rentals', cats); renderRentalsEditor();
  }
  else if (type === 'rental-item') {
    var cats = SHData.get('rentals');
    var existing = isEdit ? cats[ctx1].items[ctx2] : {};
    var newItem = {
      id: isEdit ? existing.id : 'ri-' + Date.now(),
      enabled: existing.enabled !== false,
      title: v('f-title'),
      desc: v('f-desc'),
      price: v('f-price'),
      image: v('f-image'),
      waMsg: v('f-wamsg')
    };
    if (!newItem.title) { showToast('Title is required', false); return; }
    if (isEdit) cats[ctx1].items[ctx2] = newItem; else cats[ctx1].items.push(newItem);
    SHData.set('rentals', cats); renderRentalsEditor();
  }
  else if (type === 'transport-cat') {
    var cats = SHData.get('transport') || [];
    var isCatEdit = ctx1 !== null && ctx1 !== undefined;
    var existingCat = isCatEdit ? cats[ctx1] : {};
    var newCat = {
      id: isCatEdit ? existingCat.id : 'tr-' + Date.now(),
      title: v('f-title'),
      icon: v('f-icon') || '🚗',
      comingSoon: vc('f-coming-soon'),
      items: isCatEdit ? (existingCat.items || []) : []
    };
    if (!newCat.title) { showToast('Category title is required', false); return; }
    if (isCatEdit) cats[ctx1] = newCat; else cats.push(newCat);
    SHData.set('transport', cats); renderTransportEditor();
  }
  else if (type === 'transport-item') {
    var cats = SHData.get('transport') || [];
    var existing = isEdit ? cats[ctx1].items[ctx2] : {};
    var newItem = {
      id: isEdit ? existing.id : 'tv-' + Date.now(),
      enabled: existing.enabled !== false,
      title: v('f-title'),
      desc: v('f-desc'),
      price: v('f-price'),
      image: v('f-image'),
      waMsg: v('f-wamsg')
    };
    if (!newItem.title) { showToast('Vehicle name is required', false); return; }
    if (!newItem.price) { showToast('Price is required', false); return; }
    if (isEdit) cats[ctx1].items[ctx2] = newItem; else cats[ctx1].items.push(newItem);
    SHData.set('transport', cats); renderTransportEditor();
  }
  else if (type === 'package') {
    var pkgs = SHData.get('packages');
    var existing = isEdit ? pkgs[ctx2] : {};
    var pdf = resolvePdfForSave(existing);
    var newP = {
      id: isEdit ? existing.id : 'pkg-' + Date.now(),
      enabled: existing.enabled !== false,
      title: v('f-title'), description: v('f-desc'), badge: v('f-badge'),
      price: v('f-price'), duration: v('f-duration'), accommodation: v('f-accommodation'),
      transport: v('f-transport'), meals: v('f-meals'),
      destinations: v('f-destinations'), includes: v('f-includes'),
      image: v('f-image'), waMsg: v('f-wamsg'),
      itineraryPdf: pdf.itineraryPdf, itineraryPdfName: pdf.itineraryPdfName
    };
    if (!newP.title) { showToast('Title is required', false); return; }
    if (isEdit) pkgs[ctx2] = newP; else pkgs.push(newP);
    SHData.set('packages', pkgs); renderPackagesEditor();
  }
  else if (type === 'testimonial') {
    var tms = SHData.get('testimonials');
    var existing = isEdit ? tms[ctx2] : {};
    var newTm = {
      id: isEdit ? existing.id : 'tm-' + Date.now(),
      enabled: existing.enabled !== false,
      initials: v('f-initials'), name: v('f-name'),
      source: v('f-source'), text: v('f-text')
    };
    if (!newTm.name || !newTm.text) { showToast('Name and review text required', false); return; }
    if (isEdit) tms[ctx2] = newTm; else tms.push(newTm);
    SHData.set('testimonials', tms); renderTestimonialsEditor();
  }
  else if (type === 'team-member') {
    var team = SHData.get('team') || [];
    var existing = isEdit ? team[ctx2] : {};
    var newM = {
      id: isEdit ? existing.id : 'team-' + Date.now(),
      enabled: existing.enabled !== false,
      name: v('f-name'),
      role: v('f-role'),
      badge: v('f-badge'),
      whatsapp: v('f-whatsapp'),
      photo: v('f-photo'),
      description: v('f-desc')
    };
    if (!newM.name) { showToast('Name is required', false); return; }
    if (!newM.role) { showToast('Role is required', false); return; }
    if (isEdit) team[ctx2] = newM; else team.push(newM);
    SHData.set('team', team); renderTeamEditor();
  }
  else if (type === 'contact') {
    var contacts = SHData.get('contacts') || [];
    var existing = isEdit ? contacts[ctx2] : {};
    var newC = {
      id: isEdit ? existing.id : 'c-' + Date.now(),
      enabled: existing.enabled !== false,
      isDefault: existing.isDefault === true,
      name: v('f-name'),
      badge: v('f-badge'),
      subtitle: v('f-subtitle'),
      address: v('f-address'),
      mapUrl: v('f-mapurl'),
      email: v('f-email'),
      phone: v('f-phone'),
      whatsapp: v('f-whatsapp')
    };
    if (!newC.name) { showToast('Location name is required', false); return; }
    if (!newC.address) { showToast('Address is required', false); return; }
    if (!newC.phone) { showToast('Phone number is required', false); return; }
    if (!newC.whatsapp) { showToast('WhatsApp number is required', false); return; }

    if (contacts.length === 0) {
      newC.isDefault = true;
      newC.enabled = true;
    }

    if (isEdit) contacts[ctx2] = newC; else contacts.push(newC);
    SHData.set('contacts', contacts);
    renderContactsEditor();
  }
  else if (type === 'timeline-item') {
    var about = SHData.get('about') || JSON.parse(JSON.stringify(SHData.defaults.about));
    if (!about.timeline) about.timeline = [];
    var existing = isEdit ? about.timeline[ctx2] : {};
    var newItem = {
      id: isEdit ? existing.id : 'tl-' + Date.now(),
      enabled: existing.enabled !== false,
      year: v('f-year'),
      text: v('f-text')
    };
    if (!newItem.year) { showToast('Year is required', false); return; }
    if (!newItem.text) { showToast('Milestone description is required', false); return; }
    if (isEdit) about.timeline[ctx2] = newItem; else about.timeline.push(newItem);
    SHData.set('about', about);
    renderAboutEditor();
  }

  showToast('Saved successfully');
  closeModal();
  renderDashboard();
}

// ─── HTML HELPERS ─────────────────────────────────────
function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function field(label, id, val, type, placeholder) {
  return '<div class="field"><label>' + label + '</label><input type="' + (type || 'text') + '" id="' + id + '" value="' + escHtml(val || '') + '" placeholder="' + (placeholder || '') + '"></div>';
}
function fieldTA(label, id, val, rows) {
  return '<div class="field"><label>' + label + '</label><textarea id="' + id + '" rows="' + (rows || 3) + '">' + escHtml(val || '') + '</textarea></div>';
}
function fieldSelect(label, id, options, selected) {
  var opts = options.map(function (o) { return '<option value="' + o + '"' + (o === selected ? ' selected' : '') + '>' + o + '</option>'; }).join('');
  return '<div class="field"><label>' + label + '</label><select id="' + id + '">' + opts + '</select></div>';
}

// ─── IMAGE UPLOAD & COMPRESSION ─────────────────────────
function compressImage(file, maxDim, quality, callback) {
  maxDim = maxDim || 1200;
  quality = quality || 0.8;
  if (!file) return callback('');

  if (file.type === 'image/svg+xml' || file.size < 60000) {
    var r = new FileReader();
    r.onload = function (e) { callback(e.target.result); };
    r.onerror = function () { callback(''); };
    r.readAsDataURL(file);
    return;
  }

  var reader = new FileReader();
  reader.onload = function (e) {
    var rawUrl = e.target.result;
    var img = new Image();
    img.onload = function () {
      var w = img.width;
      var h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      var compressed = canvas.toDataURL('image/jpeg', quality);
      callback(compressed);
    };
    img.onerror = function () {
      callback(rawUrl);
    };
    img.src = rawUrl;
  };
  reader.onerror = function () {
    showToast('Failed to read image file', false);
    callback('');
  };
  reader.readAsDataURL(file);
}

function imageUploadField(fieldId, val) {
  var hasVal = val && val.length > 0;
  return '<div class="field"><label>Image</label>' +
    '<div class="img-upload-row">' +
    '<input type="text" id="' + fieldId + '" value="' + escHtml(val || '') + '" placeholder="assets/images/... or click Import" oninput="updateImgPreview(\'' + fieldId + '\')">' +
    '<button type="button" class="import-btn" onclick="triggerImageUpload(\'' + fieldId + '\')">📁 Import</button>' +
    '<input type="file" id="' + fieldId + '-file" accept="image/*" style="display:none" onchange="handleImageUpload(\'' + fieldId + '\')">' +
    '</div>' +
    '<div class="img-preview" id="' + fieldId + '-preview" style="' + (hasVal ? '' : 'display:none') + '">' +
    '<img src="' + escHtml(val || '') + '" alt="Preview" onerror="this.parentElement.style.display=\'none\'">' +
    '</div></div>';
}
function triggerImageUpload(fieldId) {
  var el = document.getElementById(fieldId + '-file');
  if (el) el.click();
}
function handleImageUpload(fieldId) {
  var fileEl = document.getElementById(fieldId + '-file');
  if (!fileEl || !fileEl.files[0]) return;
  var file = fileEl.files[0];
  showToast('Optimizing image...');
  compressImage(file, 1200, 0.8, function (dataUrl) {
    if (!dataUrl) {
      showToast('Image processing failed', false);
      return;
    }
    var input = document.getElementById(fieldId);
    if (input) input.value = dataUrl;
    var preview = document.getElementById(fieldId + '-preview');
    if (preview) {
      preview.style.display = 'block';
      var img = preview.querySelector('img');
      if (img) img.src = dataUrl;
    }
    showToast('Image imported & optimized');
  });
}
function updateImgPreview(fieldId) {
  var val = (document.getElementById(fieldId) || {}).value || '';
  var preview = document.getElementById(fieldId + '-preview');
  if (!preview) return;
  if (val) { preview.style.display = 'block'; var img = preview.querySelector('img'); if (img) img.src = val; }
  else preview.style.display = 'none';
}

// ─── TAG MANAGER ──────────────────────────────────────
function tagManagerField(fieldId, val, labelText) {
  labelText = labelText || 'Includes / Tags';
  var tags = (val || '').split(',').filter(Boolean).map(function (t) { return t.trim(); });
  var pillsHtml = tags.map(function (t) {
    return '<span class="tag-pill">' + escHtml(t) + '<button type="button" onclick="removeTag(\'' + fieldId + '\',\'' + escHtml(t).replace(/'/g, "\\'") + '\')">×</button></span>';
  }).join('');
  return '<div class="field"><label>' + labelText + '</label>' +
    '<input type="hidden" id="' + fieldId + '" value="' + escHtml(val || '') + '">' +
    '<div class="tag-container" id="' + fieldId + '-tags">' + (pillsHtml || '<span class="tag-placeholder">Type below and press Enter to add tags...</span>') + '</div>' +
    '<div class="tag-add-row">' +
    '<input type="text" id="' + fieldId + '-custom" placeholder="Type tag and press Enter..." class="tag-custom-input" onkeydown="if(event.key===\'Enter\'||event.key===\',\'){event.preventDefault();addCustomTag(\'' + fieldId + '\');}">' +
    '<button type="button" class="tag-add-btn" onclick="addCustomTag(\'' + fieldId + '\')">+ Add</button>' +
    '</div></div>';
}
function _getTags(id) { return ((document.getElementById(id) || {}).value || '').split(',').filter(Boolean).map(function (t) { return t.trim(); }); }
function _setTags(id, tags) {
  var input = document.getElementById(id); if (input) input.value = tags.join(',');
  var c = document.getElementById(id + '-tags'); if (!c) return;
  c.innerHTML = tags.length ? tags.map(function (t) { return '<span class="tag-pill">' + escHtml(t) + '<button type="button" onclick="removeTag(\'' + id + '\',\'' + escHtml(t).replace(/'/g, "\\'") + '\')">×</button></span>'; }).join('') : '<span class="tag-placeholder">Type below and press Enter to add tags...</span>';
}
function addCustomTag(id) { var input = document.getElementById(id + '-custom'); var val = (input || {}).value; if (!val || !val.trim()) return; var tags = _getTags(id); val = val.trim(); if (!tags.includes(val)) { tags.push(val); _setTags(id, tags); } if (input) input.value = ''; }
function removeTag(id, tag) { _setTags(id, _getTags(id).filter(function (t) { return t !== tag; })); }

// ─── PDF UPLOAD FIELD (reusable for all card forms) ───
function pdfUploadField(item) {
  var hasPdf = item.itineraryPdf && item.itineraryPdf.length > 100;
  var displayName = item.itineraryPdfName || (hasPdf ? 'itinerary.pdf' : '');
  return '<div class="field"><label>📄 Itinerary PDF (max 10 MB)</label>' +
    '<input type="hidden" id="f-pdf" value="">' +
    '<input type="hidden" id="f-pdf-name" value="' + escHtml(displayName) + '">' +
    '<div id="f-pdf-status">' +
    (hasPdf
      ? '<div style="margin-bottom:8px;font-size:13px;color:var(--gold);display:flex;align-items:center;gap:6px;">📄 <span>' + escHtml(displayName) + '</span></div>'
      : '<div style="margin-bottom:8px;font-size:13px;color:var(--t3);font-style:italic;">No itinerary uploaded</div>') +
    '</div>' +
    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' +
    '<button type="button" class="import-btn" onclick="triggerPdfField()">📁 ' + (hasPdf ? 'Replace' : 'Upload') + ' PDF</button>' +
    (hasPdf ? '<button type="button" class="import-btn" style="background:rgba(255,80,80,0.12);color:#ff6b6b;border-color:rgba(255,80,80,0.25);" onclick="removePdfField()">Remove PDF</button>' : '') +
    '<input type="file" id="f-pdf-file" accept="application/pdf" style="display:none" onchange="handlePdfField()">' +
    '</div></div>';
}
function triggerPdfField() { var el = document.getElementById('f-pdf-file'); if (el) el.click(); }
function handlePdfField() {
  var fileEl = document.getElementById('f-pdf-file');
  if (!fileEl || !fileEl.files[0]) return;
  var file = fileEl.files[0];
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    showToast('Please select a PDF file', false); fileEl.value = ''; return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast('File too large (max 10MB)', false); fileEl.value = ''; return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('f-pdf').value = e.target.result;
    document.getElementById('f-pdf-name').value = file.name;
    var status = document.getElementById('f-pdf-status');
    if (status) status.innerHTML = '<div style="margin-bottom:8px;font-size:13px;color:var(--gold);display:flex;align-items:center;gap:6px;">📄 <span>' + escHtml(file.name) + ' ✓</span></div>';
    showToast('PDF attached');
  };
  reader.readAsDataURL(file);
}
function removePdfField() {
  document.getElementById('f-pdf').value = '__REMOVED__';
  document.getElementById('f-pdf-name').value = '';
  var status = document.getElementById('f-pdf-status');
  if (status) status.innerHTML = '<div style="margin-bottom:8px;font-size:13px;color:var(--t3);font-style:italic;">PDF will be removed on save</div>';
}
function resolvePdfForSave(existing) {
  var pdfEl = document.getElementById('f-pdf');
  var pdfVal = pdfEl ? (pdfEl.value || '') : '';
  var nameEl = document.getElementById('f-pdf-name');
  var pdfName = nameEl ? (nameEl.value || '').trim() : '';
  if (pdfVal === '__REMOVED__') return { itineraryPdf: '', itineraryPdfName: '' };
  if (pdfVal.length > 100) return { itineraryPdf: pdfVal, itineraryPdfName: pdfName };
  return { itineraryPdf: existing.itineraryPdf || '', itineraryPdfName: existing.itineraryPdfName || '' };
}

// ─── FORM BUILDERS ────────────────────────────────────
function packageForm(item) {
  return '<div class="form-row">' + field('Package Title *', 'f-title', item.title) + field('Badge (e.g. Beginner, Elite)', 'f-badge', item.badge) + '</div>' +
    fieldTA('Description *', 'f-desc', item.description, 4) +
    '<div class="form-row">' + field('Price (e.g. ₹15,000)', 'f-price', item.price) + field('Duration (meta 1)', 'f-meta1', item.meta1) + '</div>' +
    '<div class="form-row">' + field('Level/Type (meta 2)', 'f-meta2', item.meta2) + field('Extra Info (meta 3)', 'f-meta3', item.meta3) + '</div>' +
    tagManagerField('f-includes', item.includes, 'What\'s Included') +
    imageUploadField('f-image', item.image) +
    pdfUploadField(item) +
    field('WhatsApp Message', 'f-wamsg', item.waMsg, 'text', "I'm interested in...");
}
function trekForm(item) {
  return field('Trek Name *', 'f-title', item.title) +
    fieldTA('Description *', 'f-desc', item.description, 4) +
    '<div class="form-row">' + field('Price (e.g. ₹16,500)', 'f-price', item.price) + field('Best Season (e.g. Jun – Sep)', 'f-season', item.season) + '</div>' +
    '<div class="form-row">' + fieldSelect('Difficulty *', 'f-difficulty', ['Easy', 'Moderate', 'Challenging'], item.difficulty) + field('Duration (e.g. 7 Days / 6 Nights)', 'f-days', item.days) + '</div>' +
    '<div class="form-row">' + field('Max Altitude (e.g. 3,800m)', 'f-altitude', item.altitude) + field('Distance (e.g. 72 km)', 'f-distance', item.distance) + '</div>' +
    tagManagerField('f-highlights', item.highlights, 'Trek Highlights') +
    imageUploadField('f-image', item.image) +
    pdfUploadField(item) +
    field('WhatsApp Message', 'f-wamsg', item.waMsg, 'text', "I'm interested in...");
}
function activityForm(item) {
  return '<div class="form-row">' + field('Activity Name *', 'f-name', item.name) + field('Badge (e.g. Adventure, Leisure)', 'f-badge', item.badge) + '</div>' +
    field('Short Description *', 'f-desc', item.desc) +
    '<div class="form-row">' + field('Price (e.g. ₹2,999)', 'f-price', item.price) + field('WhatsApp Message', 'f-wamsg', item.waMsg, 'text', "I'm interested in...") + '</div>' +
    imageUploadField('f-image', item.image);
}
function sightseeingForm(item) {
  return field('Place ID (e.g. gulmarg)', 'f-place', item.place) +
    field('Map Label', 'f-label', item.label) +
    field('Display Title *', 'f-title', item.title) +
    fieldTA('Description', 'f-desc', item.desc, 3) +
    imageUploadField('f-image', item.image) +
    pdfUploadField(item);
}
function rentalCatForm(item) {
  return field('Category Title *', 'f-title', item.title, 'text', 'e.g. Ski Rental') +
    field('Icon (emoji)', 'f-icon', item.icon || '🎿', 'text', 'e.g. ⛷️') +
    '<div class="field"><label style="display:flex;align-items:center;gap:8px;cursor:pointer;text-transform:none;letter-spacing:0;font-size:13px;">' +
    '<input type="checkbox" id="f-coming-soon" ' + (item.comingSoon ? 'checked' : '') + ' style="width:auto;accent-color:var(--gold);"> Mark as "Coming Soon" (overrides items)</label></div>';
}
function transportCatForm(item) {
  return field('Category Title *', 'f-title', item.title, 'text', 'e.g. Airport Transfers') +
    field('Icon (emoji)', 'f-icon', item.icon || '🚗', 'text', 'e.g. ✈️') +
    '<div class="field"><label style="display:flex;align-items:center;gap:8px;cursor:pointer;text-transform:none;letter-spacing:0;font-size:13px;">' +
    '<input type="checkbox" id="f-coming-soon" ' + (item.comingSoon ? 'checked' : '') + ' style="width:auto;accent-color:var(--gold);"> Mark as "Coming Soon" (overrides items)</label></div>';
}
function transportItemForm(item) {
  return field('Vehicle Name *', 'f-title', item.title, 'text', 'e.g. Toyota Fortuner') +
    fieldTA('Description', 'f-desc', item.desc, 3) +
    field('Price / Rate * (e.g. ₹7,000/day)', 'f-price', item.price) +
    imageUploadField('f-image', item.image) +
    field('WhatsApp Message', 'f-wamsg', item.waMsg, 'text', "I'm interested in...");
}
function rentalItemForm(item) {
  return field('Item Title *', 'f-title', item.title, 'text', 'e.g. Ski Package (Skis + Boots + Poles)') +
    fieldTA('Description', 'f-desc', item.desc, 3) +
    field('Price / Rate (e.g. ₹800/day)', 'f-price', item.price) +
    imageUploadField('f-image', item.image) +
    field('WhatsApp Message', 'f-wamsg', item.waMsg, 'text', "I'm interested in renting...");
}
function tourPackageForm(item) {
  return '<div class="form-row">' + field('Package Title *', 'f-title', item.title) + field('Badge (e.g. Bestseller)', 'f-badge', item.badge) + '</div>' +
    fieldTA('Description *', 'f-desc', item.description, 4) +
    '<div class="form-row">' + field('Price (e.g. ₹65,000)', 'f-price', item.price) + field('Duration (e.g. 7N / 8D)', 'f-duration', item.duration) + '</div>' +
    '<div class="form-row">' + field('Accommodation', 'f-accommodation', item.accommodation) + field('Transport', 'f-transport', item.transport) + '</div>' +
    '<div class="form-row">' + field('Meals', 'f-meals', item.meals) + field('Destinations (comma-separated)', 'f-destinations', item.destinations, 'text', 'Srinagar,Gulmarg,...') + '</div>' +
    tagManagerField('f-includes', item.includes, 'What\'s Included') +
    imageUploadField('f-image', item.image) +
    pdfUploadField(item) +
    field('WhatsApp Message', 'f-wamsg', item.waMsg, 'text', "I'm interested in...");
}
function testimonialForm(item) {
  return '<div class="form-row">' + field('Reviewer Name *', 'f-name', item.name) + field('Initials (e.g. AK)', 'f-initials', item.initials, 'text', 'AK') + '</div>' +
    field('Source (e.g. Google Review ★ 5.0)', 'f-source', item.source) +
    fieldTA('Review Text *', 'f-text', item.text, 5);
}
function teamMemberForm(item) {
  item = item || {};
  return '<div class="form-row">' + field('Full Name *', 'f-name', item.name) + field('Role / Title *', 'f-role', item.role) + '</div>' +
    '<div class="form-row">' + field('Badge / Tag (e.g. 12+ Yrs Exp)', 'f-badge', item.badge) + field('WhatsApp Number (digits only)', 'f-whatsapp', item.whatsapp || '919149974118', 'text', '919149974118') + '</div>' +
    imageUploadField('f-photo', item.photo) +
    fieldTA('Description / Bio', 'f-desc', item.description, 3);
}
function contactForm(item) {
  return '<div class="form-row">' +
    field('Location Name * (e.g. Tangmarg Head Office)', 'f-name', item.name) +
    field('Badge Label (e.g. Shred Himalayas Expeditions)', 'f-badge', item.badge) +
    '</div>' +
    field('Subtitle', 'f-subtitle', item.subtitle, 'text', 'e.g. We are here to craft your bespoke Kashmiri experience.') +
    fieldTA('Address * (supports multiple lines)', 'f-address', item.address, 4) +
    field('Map Link / Search URL', 'f-mapurl', item.mapUrl, 'text', 'https://maps.google.com/?q=...') +
    field('Email Address', 'f-email', item.email, 'email', 'e.g. info@shredhimalayas.com') +
    '<div class="form-row">' +
    field('Phone Number *', 'f-phone', item.phone, 'text', 'e.g. +91 91499 74118') +
    field('WhatsApp Number * (digits only, e.g. 919149974118)', 'f-whatsapp', item.whatsapp, 'text', '919149974118') +
    '</div>';
}
function timelineItemForm(item) {
  item = item || {};
  return field('Year / Date * (e.g. 2024)', 'f-year', item.year, 'text', 'e.g. 2024') +
    fieldTA('Milestone Description *', 'f-text', item.text, 3, 'Describe the milestone achievement...');
}

// ─── ITINERARY EDITOR ─────────────────────────────────
function renderItinerariesEditor() {
  var pkgs = SHData.get('packages') || [];
  var el = document.getElementById('itineraries-editor');
  if (!el) return;

  if (!pkgs.length) {
    el.innerHTML = emptyState('No packages available. Add some packages first.');
    return;
  }

  el.innerHTML = pkgs.map(function (p, pi) {
    var hasPdf = p.itineraryPdf && p.itineraryPdf.length > 0;
    var filename = p.itineraryPdfName || (hasPdf ? 'uploaded-itinerary.pdf' : '');
    var currentPdfHtml = hasPdf
      ? '<div class="pdf-status" style="margin-bottom:12px; font-size:13px; color:var(--gold); display:flex; align-items:center; gap:6px;">📄 <span>' + escHtml(filename) + '</span></div>'
      : '<div class="pdf-status" style="margin-bottom:12px; font-size:13px; color:var(--t3); font-style:italic;">No PDF uploaded</div>';

    var uploadBtnLabel = hasPdf ? 'Replace PDF' : 'Upload PDF';
    var removeBtnHtml = hasPdf
      ? '<button type="button" class="tbtn tbtn--danger" onclick="removeItinerary(' + pi + ')">Remove</button>'
      : '';

    return '<div class="settings-card" style="margin-bottom:16px;">' +
      '<div class="settings-card-header"><div class="settings-card-icon">📦</div><h3>Package: ' + escHtml(p.title) + '</h3></div>' +
      '<div class="field">' +
      '<label>Itinerary PDF (Accepts PDF files only, Max 10MB)</label>' +
      currentPdfHtml +
      '<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">' +
      '<button type="button" class="save-btn" onclick="triggerPdfUpload(' + pi + ')">📁 ' + uploadBtnLabel + '</button>' +
      removeBtnHtml +
      '<input type="file" id="pdf-file-' + pi + '" accept="application/pdf" style="display:none" onchange="handlePdfUpload(' + pi + ')">' +
      '</div>' +
      '<div id="upload-loading-' + pi + '" style="display:none; margin-top:12px; font-size:12.5px; color:var(--gold);">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite; vertical-align:middle; margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>' +
      '<span>Uploading itinerary...</span>' +
      '</div>' +
      '</div>' +
      '</div>';
  }).join('');
}

function triggerPdfUpload(pi) {
  var fileEl = document.getElementById('pdf-file-' + pi);
  if (fileEl) fileEl.click();
}

function handlePdfUpload(pi) {
  var fileEl = document.getElementById('pdf-file-' + pi);
  if (!fileEl || !fileEl.files[0]) return;
  var file = fileEl.files[0];

  // Validation: accepts PDF only
  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    showToast('Invalid file type. Please select a PDF file.', false);
    fileEl.value = '';
    return;
  }

  // Validation: size limit (10MB)
  var maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showToast('File is too large. Maximum size is 10 MB.', false);
    fileEl.value = '';
    return;
  }

  // Show loading state
  var loadingEl = document.getElementById('upload-loading-' + pi);
  if (loadingEl) loadingEl.style.display = 'block';

  // Read file as Base64 Data URL
  var reader = new FileReader();
  reader.onload = function (e) {
    var dataUrl = e.target.result;

    // Save PDF in package data
    var pkgs = SHData.get('packages');
    pkgs[pi].itineraryPdf = dataUrl;
    pkgs[pi].itineraryPdfName = file.name;
    SHData.set('packages', pkgs);

    // Hide loading
    if (loadingEl) loadingEl.style.display = 'none';

    showToast('Itinerary PDF uploaded successfully');
    renderItinerariesEditor();
  };
  reader.onerror = function () {
    if (loadingEl) loadingEl.style.display = 'none';
    showToast('Failed to upload PDF', false);
  };

  // Simulate minor delay for loading state visibility
  setTimeout(function () {
    reader.readAsDataURL(file);
  }, 600);
}

function removeItinerary(pi) {
  if (!confirm('Remove this itinerary PDF?')) return;

  var pkgs = SHData.get('packages');
  pkgs[pi].itineraryPdf = '';
  pkgs[pi].itineraryPdfName = '';
  SHData.set('packages', pkgs);

  showToast('Itinerary PDF removed');
  renderItinerariesEditor();
}

// ─── POLICIES EDITOR ─────────────────────────────────
function renderPoliciesEditor() {
  var policies = SHData.getPolicies();
  var pEl = document.getElementById('pol-privacy');
  var tEl = document.getElementById('pol-terms');
  var cEl = document.getElementById('pol-cancellation');
  if (pEl) pEl.value = policies.privacy || '';
  if (tEl) tEl.value = policies.terms || '';
  if (cEl) cEl.value = policies.cancellation || '';
}

function savePolicies() {
  var pEl = document.getElementById('pol-privacy');
  var tEl = document.getElementById('pol-terms');
  var cEl = document.getElementById('pol-cancellation');

  var newPolicies = {
    privacy: pEl ? pEl.value : '',
    terms: tEl ? tEl.value : '',
    cancellation: cEl ? cEl.value : ''
  };

  SHData.setPolicies(newPolicies);
  showToast('Legal Policies updated successfully!');
}

function resetPolicies() {
  if (confirm('⚠️ Reset all Legal Policies to initial default text?')) {
    var defs = SHData.defaults.policies;
    SHData.setPolicies(defs);
    renderPoliciesEditor();
    showToast('Policies reset to defaults');
  }
}


// ─────────────────────────────────────────────────────────
// SEO MANAGER
// ─────────────────────────────────────────────────────────

var _seoKeywords = [];   // working array of keyword strings

function renderSEOEditor() {
  var seo = SHData.get('seo');
  if (!seo) seo = JSON.parse(JSON.stringify(SHData.defaults.seo));

  // Populate simple text / textarea / select fields
  function setField(id, val) {
    var el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = !!val;
    else el.value = val || '';
  }

  setField('seo-metaTitle',         seo.metaTitle);
  setField('seo-metaDescription',   seo.metaDescription);
  setField('seo-ogTitle',           seo.ogTitle);
  setField('seo-ogDescription',     seo.ogDescription);
  setField('seo-ogImage',           seo.ogImage);
  setField('seo-canonicalUrl',      seo.canonicalUrl);
  setField('seo-twitterTitle',      seo.twitterTitle);
  setField('seo-twitterDescription',seo.twitterDescription);
  setField('seo-twitterSite',       seo.twitterSite);
  setField('seo-twitterCard',       seo.twitterCard);
  setField('seo-robotsDirective',   seo.robotsDirective);
  setField('seo-schemaEnabled',     seo.schemaEnabled !== false);

  // Keywords — parse from comma-string stored in metaKeywords
  _seoKeywords = (seo.metaKeywords || '')
    .split(',')
    .map(function(k){ return k.trim(); })
    .filter(function(k){ return k.length > 0; });
  seoRenderTags();

  // Char counters
  seoCharCount('metaTitle', 60);
  seoCharCount('metaDesc', 160);

  // Live preview
  seoUpdatePreview();

  // Keyword input: add on Enter or comma
  var ghostInput = document.getElementById('kw-ghost-input');
  if (ghostInput) {
    // Remove old listener to prevent duplicates
    ghostInput.replaceWith(ghostInput.cloneNode(true));
    var fresh = document.getElementById('kw-ghost-input');
    fresh.addEventListener('keydown', function(e) {
      var val = fresh.value.trim().replace(/,+$/, '');
      if ((e.key === 'Enter' || e.key === ',') && val) {
        e.preventDefault();
        seoAddKeyword(val);
        fresh.value = '';
      } else if (e.key === 'Backspace' && fresh.value === '' && _seoKeywords.length) {
        _seoKeywords.pop();
        seoRenderTags();
      }
    });
    fresh.addEventListener('blur', function() {
      var val = fresh.value.trim().replace(/,+$/, '');
      if (val) { seoAddKeyword(val); fresh.value = ''; }
    });
  }
}

function seoAddKeyword(kw) {
  var cleaned = kw.replace(/,/g, '').trim();
  if (!cleaned) return;
  // Prevent duplicates (case-insensitive)
  var lower = cleaned.toLowerCase();
  if (_seoKeywords.some(function(k){ return k.toLowerCase() === lower; })) return;
  _seoKeywords.push(cleaned);
  seoRenderTags();
}

function seoRemoveKeyword(idx) {
  _seoKeywords.splice(idx, 1);
  seoRenderTags();
}

function seoRenderTags() {
  var container = document.getElementById('kw-tags-container');
  if (!container) return;
  container.innerHTML = _seoKeywords.map(function(kw, i) {
    return '<span class="kw-tag">' +
      escHtmlAdmin(kw) +
      '<button type="button" onclick="seoRemoveKeyword(' + i + ')" title="Remove keyword">&times;</button>' +
      '</span>';
  }).join('');
  // Update count badge
  var badge = document.getElementById('cc-kwCount');
  if (badge) badge.textContent = _seoKeywords.length + ' keyword' + (_seoKeywords.length !== 1 ? 's' : '');
}

function seoCharCount(fieldKey, max) {
  // fieldKey: 'metaTitle' or 'metaDesc'
  var inputId = fieldKey === 'metaTitle' ? 'seo-metaTitle' : 'seo-metaDescription';
  var badgeId = fieldKey === 'metaTitle' ? 'cc-metaTitle' : 'cc-metaDesc';
  var el = document.getElementById(inputId);
  var badge = document.getElementById(badgeId);
  if (!el || !badge) return;
  var len = el.value.length;
  badge.textContent = len + ' / ' + max;
  badge.className = 'seo-char-count';
  if (len > max) badge.classList.add('over');
  else if (len > max * 0.85) badge.classList.add('warn');
}

function seoUpdatePreview() {
  var titleEl  = document.getElementById('seo-metaTitle');
  var descEl   = document.getElementById('seo-metaDescription');
  var urlEl    = document.getElementById('seo-canonicalUrl');
  var ogTitle  = document.getElementById('seo-ogTitle');

  var pTitle = document.getElementById('seo-prev-title');
  var pDesc  = document.getElementById('seo-prev-desc');
  var pUrl   = document.getElementById('seo-prev-url');

  if (!pTitle) return;

  // Title: use og:title if available, otherwise page title
  var titleVal = (ogTitle && ogTitle.value.trim()) || (titleEl && titleEl.value.trim()) || 'Your Page Title';
  pTitle.textContent = titleVal.length > 60 ? titleVal.slice(0, 57) + '...' : titleVal;

  // Description
  var descVal = descEl && descEl.value.trim() ? descEl.value.trim() : 'No description set yet.';
  pDesc.textContent = descVal;

  // URL — strip protocol
  var rawUrl = urlEl && urlEl.value.trim() ? urlEl.value.trim() : 'https://shredhimalayas.com';
  pUrl.textContent = rawUrl.replace(/^https?:\/\//i, '');
}

function escHtmlAdmin(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function saveSEOSettings() {
  var seo = {
    metaTitle:           (document.getElementById('seo-metaTitle')         || {}).value || '',
    metaDescription:     (document.getElementById('seo-metaDescription')   || {}).value || '',
    metaKeywords:        _seoKeywords.join(', '),
    ogTitle:             (document.getElementById('seo-ogTitle')            || {}).value || '',
    ogDescription:       (document.getElementById('seo-ogDescription')      || {}).value || '',
    ogImage:             (document.getElementById('seo-ogImage')            || {}).value || '',
    ogUrl:               (document.getElementById('seo-canonicalUrl')       || {}).value || '',
    canonicalUrl:        (document.getElementById('seo-canonicalUrl')       || {}).value || '',
    twitterCard:         (document.getElementById('seo-twitterCard')        || {}).value || 'summary_large_image',
    twitterSite:         (document.getElementById('seo-twitterSite')        || {}).value || '',
    twitterTitle:        (document.getElementById('seo-twitterTitle')       || {}).value || '',
    twitterDescription:  (document.getElementById('seo-twitterDescription') || {}).value || '',
    robotsDirective:     (document.getElementById('seo-robotsDirective')    || {}).value || 'index, follow',
    schemaEnabled:       !!(document.getElementById('seo-schemaEnabled')    || {}).checked
  };

  SHData.set('seo', seo);
  showToast('🔎 SEO settings saved! Tags will be injected on next page load.');
}

// Real-time synchronization callback for admin panel UI
if (typeof SHData !== 'undefined' && SHData.onChange) {
  SHData.onChange(function () {
    var appScr = document.getElementById('app');
    if (appScr && appScr.classList.contains('visible')) {
      var activePage = document.querySelector('.pg.active');
      if (activePage) {
        var pageId = activePage.id.replace('page-', '');
        if (typeof renderPage === 'function') {
          renderPage(pageId);
        }
      }
    }
  });
}

// Auto-login persistence check ONLY on reload
(function() {
  var navEntries = performance.getEntriesByType("navigation");
  var isReload = navEntries.length > 0 && navEntries[0].type === "reload";
  if (isReload && sessionStorage.getItem('sh_admin_logged_in') === 'true') {
    var loginScr = document.getElementById('loginScreen');
    if (loginScr) loginScr.style.display = 'none';
    var appScr = document.getElementById('app');
    if (appScr) appScr.classList.add('visible');

    // Fetch site data from Firestore and populate dashboard views
    if (typeof SHData !== 'undefined' && SHData.init) {
      SHData.init().then(function () {
        if (typeof loadAll === 'function') {
          loadAll();
        }
      });
    }
  } else {
    // If not a reload, clear the session so they must log in
    sessionStorage.removeItem('sh_admin_logged_in');
  }
})();


