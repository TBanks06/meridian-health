/* ══════════ MERIDIAN HEALTH — chrome, router, booking engine ══════════ */
(function () {
  'use strict';
  const { DEPARTMENTS, DOCTORS, PACKAGES, GALLERY, STORIES, NEWS, TIMELINE, FAQS, INSURERS, TICKER, HERO } = window.MH;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const Q  = new URLSearchParams(location.search);
  const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const dept = id => DEPARTMENTS.find(d => d.id === id);
  const docByName = n => DOCTORS.find(d => d.name === n || slug(d.name) === n);
  // <img> with guaranteed display: Unsplash first, Picsum seed on error
  const img = (src, fb, alt, extra = '') => `<img src="${src}" data-fb="${fb}" alt="${alt}" loading="lazy" ${extra}>`;
  document.addEventListener('error', e => {
    const t = e.target;
    if (t.tagName === 'IMG' && t.dataset.fb && !t.dataset.fbd) { t.dataset.fbd = 1; t.src = `https://picsum.photos/seed/${t.dataset.fb}/900/700`; }
  }, true);

  /* ---------- toasts ---------- */
  function toast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast toast--${type}`; el.textContent = msg;
    $('#toast-stack').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 450); }, 4200);
  }

  /* ---------- shared chrome (header / footer / modal) ---------- */
  const PAGE = document.body.dataset.page;
  const ACTIVE = { home:'index.html', departments:'departments.html', department:'departments.html', doctors:'doctors.html', doctor:'doctors.html', packages:'packages.html', contact:'contact.html' }[PAGE];
  const NAV = [['index.html','Home'],['departments.html','Departments'],['doctors.html','Doctors'],['packages.html','Packages'],['contact.html','Visit us']];

  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="progress-bar" id="progress-bar" aria-hidden="true"></div>
    <div class="utility-bar"><div class="container utility-inner">
      <p class="util-item"><span class="dot dot--live"></span> Emergency 24/7 · <a href="tel:+18005550911">1-800-555-0911</a></p>
      <div class="util-links"><span class="util-item">📍 Harborline Campus</span><span class="util-item">Mon–Sat 08–20h</span><a class="util-item" href="contact.html">Patient portal ↗</a></div>
    </div></div>
    <header class="site-header" id="site-header"><div class="container nav-wrap">
      <a class="brand" href="index.html" aria-label="Meridian Health home">
        <svg viewBox="0 0 32 32" width="36" height="36" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#0e2420"/><path d="M6 16h6l2.5-6 4 12 2.5-6h5" stroke="#e2603f" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="brand-text">Meridian<small>HEALTH · EST. 1993</small></span></a>
      <nav class="main-nav" aria-label="Primary">${NAV.map(([h, l]) => `<a href="${h}" ${h === ACTIVE ? 'class="is-active"' : ''}>${l}</a>`).join('')}</nav>
      <div class="nav-actions"><a class="nav-phone" href="tel:+18005550911">1-800-555-0911</a>
        <button class="btn btn--primary" data-open-booking>Book appointment</button>
        <button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-label="Menu"><span></span><span></span><span></span></button></div>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}
      <button class="btn btn--primary btn--block" data-open-booking>Book appointment</button></nav>
    </header>`);

  document.body.insertAdjacentHTML('beforeend', `
    <footer class="site-footer"><div class="container footer-grid">
      <div class="footer-brand"><span class="brand-text brand-text--light">Meridian<small>HEALTH</small></span>
        <p>Medicine with precision, care with a heartbeat. A 480-bed teaching hospital serving the Portside District since 1993.</p>
        <form class="newsletter" id="newsletter-form" novalidate>
          <label for="newsletter-email">Monthly health letter — one email, zero spam.</label>
          <div class="newsletter-row"><input type="email" id="newsletter-email" placeholder="you@email.com" /><button class="btn btn--clay" type="submit">Subscribe</button></div>
          <p class="form-hint" id="newsletter-hint" role="status"></p></form></div>
      <nav aria-label="Departments"><h4>Departments</h4>${DEPARTMENTS.map(d => `<a href="department.html?dept=${d.id}">${d.name}</a>`).join('')}<a href="department.html?dept=emergency">Emergency 24/7</a></nav>
      <nav aria-label="Hospital lists"><h4>Hospital lists</h4><a href="departments.html">All departments</a><a href="doctors.html">All doctors</a><a href="packages.html">Health-check packages</a><a href="contact.html">Hours & directions</a><a href="contact.html#faq">FAQ</a></nav>
      <div><h4>Contact</h4><p class="footer-contact">14 Harborline Avenue<br />Portside District<br /><a href="tel:+18005550911">1-800-555-0911</a><br /><a href="mailto:care@meridianhealth.example">care@meridianhealth.example</a></p></div>
    </div>
    <div class="container footer-legal"><p>© 2026 Meridian Health System.</p><p>Privacy · Terms · Accessibility</p></div></footer>
    <div class="modal" id="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" hidden>
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-card">
        <header class="modal-head"><div><p class="eyebrow">Same-day slots available</p><h2 id="booking-title">Book an appointment</h2></div>
          <button class="icon-btn" id="modal-close" aria-label="Close">✕</button></header>
        <form id="booking-form" novalidate><div class="form-grid">
          <div class="field"><label for="f-dept">Department *</label><select id="f-dept" required><option value="">Select…</option></select><p class="error-msg" id="err-dept"></p></div>
          <div class="field"><label for="f-doctor">Doctor *</label><select id="f-doctor" required><option value="">Department first…</option></select><p class="error-msg" id="err-doctor"></p></div>
          <div class="field"><label for="f-date">Date *</label><input type="date" id="f-date" required /><p class="error-msg" id="err-date"></p></div>
          <div class="field"><label>Time slot *</label><div class="slot-grid" id="slot-grid" role="radiogroup" aria-label="Slots"><p class="slot-hint">Pick a department & date.</p></div><p class="error-msg" id="err-slot"></p></div>
          <div class="field"><label for="f-name">Full name *</label><input type="text" id="f-name" autocomplete="name" required /><p class="error-msg" id="err-name"></p></div>
          <div class="field"><label for="f-phone">Phone *</label><input type="tel" id="f-phone" autocomplete="tel" required /><p class="error-msg" id="err-phone"></p></div>
          <div class="field field--full"><label for="f-email">Email *</label><input type="email" id="f-email" autocomplete="email" required /><p class="error-msg" id="err-email"></p></div>
          <div class="field field--full"><label for="f-notes">Reason <small>(optional)</small></label><textarea id="f-notes" rows="2"></textarea></div>
        </div>
        <footer class="modal-foot"><p class="modal-note">Instant confirmation. Free cancellation until your slot starts.</p>
          <button class="btn btn--primary btn--lg" type="submit" id="booking-submit">Confirm booking</button></footer></form>
      </div></div>
    <div class="toast-stack" id="toast-stack" aria-live="polite"></div>`);

  /* ---------- chrome behaviour ---------- */
  addEventListener('scroll', () => {
    $('#site-header').classList.toggle('is-scrolled', scrollY > 8);
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#progress-bar').style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  }, { passive: true });
  $('#menu-toggle').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $$('.mobile-nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); $$('.counter', e.target).forEach(runCounter); io.unobserve(e.target); } }), { threshold: .15 });
  function observeReveals() { $$('.reveal:not(.in-view)').forEach(el => io.observe(el)); }
  function runCounter(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const t = +el.dataset.target; if (REDUCED) { el.textContent = t; return; }
    const t0 = performance.now();
    (function s(n) { const p = Math.min((n - t0) / 1400, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(s); })(t0);
  }

  /* ---------- shared card templates ---------- */
  const deptCard = d => `
    <article class="dept-card reveal">
      <a class="dept-media" href="department.html?dept=${d.id}">${img(d.img, d.fb, d.name + ' department')}<span class="dept-wait">${d.wait}</span></a>
      <div class="dept-body"><span class="dept-tag">${d.tag}</span><h3><a href="department.html?dept=${d.id}">${d.name}</a></h3>
      <p>${d.desc}</p><ul class="dept-services">${d.services.slice(0, 3).map(s => `<li>${s}</li>`).join('')}</ul>
      <div class="dept-meta"><span>${d.docs} specialists</span><span>Head: ${d.head.split(' ').slice(0, 2).join(' ')}</span></div>
      <div class="doc-actions"><a class="btn btn--ghost btn--sm" href="department.html?dept=${d.id}">Details</a>
      <button class="btn btn--primary btn--sm" data-open-booking data-dept="${d.id}">Book</button></div></div></article>`;

  const docCard = d => `
    <article class="doctor-card reveal">
      <a class="doc-media" href="doctor.html?doc=${slug(d.name)}">${img(d.photo, d.fb, 'Portrait of ' + d.name)}<span class="doc-tag">${dept(d.dept).name}</span></a>
      <div class="doc-body"><h3><a href="doctor.html?doc=${slug(d.name)}">${d.name}</a></h3><p class="doc-role">${d.role}</p>
        <div class="doc-meta"><span class="doc-rating">★ ${d.rating}</span><span>${d.yrs} yrs</span><span>${d.langs.length} languages</span></div>
        <div class="doc-slots">${d.slots.map(s => `<span>${s}</span>`).join('')}</div>
        <div class="doc-actions"><a class="btn btn--ghost btn--sm" href="doctor.html?doc=${slug(d.name)}">Profile</a>
        <button class="btn btn--primary btn--sm" data-open-booking data-dept="${d.dept}" data-doctor="${d.name}">Book</button></div></div></article>`;

  const pkgCard = p => `
    <article class="pkg-card${p.hot ? ' pkg-card--hot' : ''} reveal">${p.hot ? '<span class="pkg-flag">Most booked</span>' : ''}
      <h3>${p.name}</h3><p class="pkg-for">${p.for}</p><p class="pkg-price">$${p.price}<small> / visit</small></p>
      <ul class="pkg-list">${p.list.map(i => `<li>${i}</li>`).join('')}</ul>
      <button class="btn ${p.hot ? 'btn--clay' : 'btn--primary'}" data-open-booking data-dept="checkup">Book ${p.name}</button></article>`;

  /* ═════════ PAGE: HOME ═════════ */
  if (PAGE === 'home') {
    $('#ticker-track').innerHTML = [...TICKER, ...TICKER].map(t => `<span>${t}</span>`).join('');
    $('#dept-preview').innerHTML = DEPARTMENTS.slice(0, 6).map(deptCard).join('');
    $('#doc-preview').innerHTML = DOCTORS.slice(0, 4).map(docCard).join('');
    $('#pkg-preview').innerHTML = PACKAGES.map(pkgCard).join('');
    $('#gallery-track').innerHTML = GALLERY.map(g => `<figure>${img(g.img, g.fb, g.cap)}<figcaption>${g.cap}</figcaption></figure>`).join('');
    $('#story-track').innerHTML = STORIES.map(s => `
      <figure class="story"><div class="story-stars">★★★★★</div><blockquote>“${s.quote}”</blockquote>
      <figcaption>${img(s.img, s.fb, s.name, 'width="52" height="52"')}<span><b>${s.name}</b><span>${s.tag}</span></span></figcaption></figure>`).join('');
    $('#news-grid').innerHTML = NEWS.map(n => `
      <article class="news-card reveal"><figure>${img(n.img, n.fb, n.title)}</figure>
      <div class="news-body"><div class="news-meta"><b>${n.cat}</b><span>${n.date} · ${n.read}</span></div>
      <h3>${n.title}</h3><p>${n.text}</p><span class="link-btn">Read article →</span></div></article>`).join('');
    $('#faq-list').innerHTML = FAQS.map(f => `
      <div class="faq-item"><button class="faq-q" aria-expanded="false">${f[0]}<span class="faq-icon"></span></button><div class="faq-a"><p>${f[1]}</p></div></div>`).join('');
    initFaq(); initSlider(); initTools();
    (function scramble() { const el = $('#hero-eyebrow'); if (!el || REDUCED) return;
      const t = el.dataset.text, g = '#%&·<>/01245789'; let f = 0;
      const iv = setInterval(() => { el.textContent = t.split('').map((c, i) => i < f / 2 ? c : (c === ' ' ? ' ' : g[(Math.random() * g.length) | 0])).join(''); if (f++ / 2 > t.length) { clearInterval(iv); el.textContent = t; } }, 28); })();
    setInterval(() => { const c = $('#clock-time'); if (c) c.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }, 1000);
    setInterval(() => { const b = $('#bpm-value'); if (b) b.textContent = 68 + Math.round(Math.random() * 6); }, 2200);
  }

  /* ═════════ PAGE: DEPARTMENTS LIST ═════════ */
  if (PAGE === 'departments') {
    $('#dept-grid').innerHTML = DEPARTMENTS.map(deptCard).join('') + `
      <article class="dept-card dept-card--em reveal"><div class="dept-body">
        <span class="dept-tag" style="color:var(--gold)">No appointment needed</span><h3>Emergency & Trauma</h3>
        <p>Triage in under five minutes, always. Ambulances dispatch in under 90 seconds on the hotline.</p>
        <div class="dept-meta"><span style="color:#8ef0b6">● Open now</span><span>365 days</span></div>
        <a class="link-btn" style="color:var(--gold)" href="department.html?dept=emergency">Emergency details →</a></div></article>`;
    $('#dir-list').innerHTML = DEPARTMENTS.map(d => `<li><a href="department.html?dept=${d.id}">${d.name}</a><span>${d.docs} specialists · ${d.wait}</span></li>`).join('');
  }

  /* ═════════ PAGE: DEPARTMENT DETAIL (?dept=) ═════════ */
  if (PAGE === 'department') {
    const d = dept(Q.get('dept')) || dept('emergency');
    $('#crumbs').innerHTML = `<a href="index.html">Home</a> / <a href="departments.html">Departments</a> / <b>${d.name}</b>`;
    $('#dept-hero').innerHTML = `
      <div class="ph-grid">
        <div><p class="eyebrow eyebrow--mint">${d.tag}</p><h1>${d.name}</h1><p class="ph-lede">${d.desc}</p>
          <div class="ph-stats">${d.stats.map(s => `<div><strong>${s[1]}</strong><span>${s[0]}</span></div>`).join('')}</div>
          <div class="hero-cta"><button class="btn btn--clay btn--lg" data-open-booking data-dept="${d.id}">Book ${d.name}</button>
          <a class="btn btn--ghost btn--ghost--light" href="doctors.html?dept=${d.id}">Meet the team</a></div></div>
        <figure class="ph-media">${img(d.img, d.fb, d.name + ' facilities')}</figure>
      </div>`;
    $('#dept-main').innerHTML = `
      <h2 class="h2">About the institute</h2><p class="body-lg">${d.long}</p>
      <h2 class="h2">What we treat & do</h2>
      <ul class="detail-list">${d.services.map(s => `<li>${s}</li>`).join('')}</ul>
      <h2 class="h2">Practical information</h2>
      <dl class="hours"><div><dt>Outpatient clinics</dt><dd>Mon–Sat · 08:00–20:00</dd></div>
      <div><dt>Average wait today</dt><dd class="em">${d.wait}</dd></div>
      <div><dt>Head of department</dt><dd>${d.head}</dd></div>
      <div><dt>Location</dt><dd>Harborline Campus · Wing ${d.name[0]}</dd></div></dl>`;
    $('#dept-aside').innerHTML = `
      <div class="aside-card"><h3>Hospital lists</h3>
        <ul class="list-link">${DEPARTMENTS.filter(x => x.id !== d.id).map(x => `<li><a href="department.html?dept=${x.id}">${x.name} →</a></li>`).join('')}
        <li><a href="doctors.html">All doctors →</a></li><li><a href="packages.html">Health-check packages →</a></li></ul></div>
      <div class="aside-card aside-card--cta"><h3>Not sure where to start?</h3><p>Book a checkup and we’ll route you to the right institute.</p>
        <button class="btn btn--clay btn--block" data-open-booking data-dept="checkup">Book a health check</button></div>`;
    $('#dept-doctors').innerHTML = DOCTORS.filter(x => x.dept === d.id).map(docCard).join('') ||
      `<p class="body-lg">Consultants rotate through ${d.name} — <a class="link-btn" href="doctors.html?dept=${d.id}">see today’s on-call list</a>.</p>`;
  }

  /* ═════════ PAGE: DOCTORS LIST (?dept= optional) ═════════ */
  if (PAGE === 'doctors') {
    const start = Q.get('dept') && dept(Q.get('dept')) ? Q.get('dept') : 'all';
    $('#doctor-filters').innerHTML = ['all', ...DEPARTMENTS.map(d => d.id)]
      .map(f => `<button class="chip${f === start ? ' is-active' : ''}" data-filter="${f}">${f === 'all' ? 'All' : dept(f).name}</button>`).join('');
    const render = f => { $('#doctor-grid').innerHTML = DOCTORS.filter(d => f === 'all' || d.dept === f).map(docCard).join(''); observeReveals(); };
    render(start);
    $('#doctor-filters').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $$('#doctor-filters .chip').forEach(c => c.classList.remove('is-active')); b.classList.add('is-active'); render(b.dataset.filter); });
    $('#dir-list').innerHTML = DEPARTMENTS.map(d => `<li><a href="doctors.html?dept=${d.id}">${d.name}</a><span>${DOCTORS.filter(x => x.dept === d.id).length} listed</span></li>`).join('');
  }

  /* ═════════ PAGE: DOCTOR PROFILE (?doc=) ═════════ */
  if (PAGE === 'doctor') {
    const d = docByName(Q.get('doc')) || DOCTORS[0];
    const dp = dept(d.dept);
    $('#crumbs').innerHTML = `<a href="index.html">Home</a> / <a href="doctors.html">Doctors</a> / <b>${d.name}</b>`;
    $('#doc-hero').innerHTML = `
      <div class="profile-grid">
        <figure class="profile-photo">${img(d.photo, d.fb, 'Portrait of ' + d.name)}</figure>
        <div><p class="eyebrow eyebrow--mint">${dp.tag}</p><h1>${d.name}</h1>
          <p class="ph-lede">${d.role} · ${d.yrs} years at Meridian</p>
          <p class="dm-rating">★ ${d.rating} patient rating · ${d.langs.length} languages</p>
          <div class="doc-slots doc-slots--lg">${d.slots.map(s => `<span>${s}</span>`).join('')}</div>
          <div class="hero-cta"><button class="btn btn--clay btn--lg" data-open-booking data-dept="${d.dept}" data-doctor="${d.name}">Book with ${d.name.split(' ')[1]}</button>
          <a class="btn btn--ghost btn--ghost--light" href="department.html?dept=${d.dept}">${dp.name} institute →</a></div></div>
      </div>`;
    $('#doc-main').innerHTML = `
      <h2 class="h2">Biography</h2><p class="body-lg">${d.bio}</p>
      <h2 class="h2">Education & fellowships</h2><ul class="detail-list">${d.edu.map(x => `<li>${x}</li>`).join('')}</ul>
      <h2 class="h2">Languages</h2><ul class="dm-chips">${d.langs.map(x => `<li>${x}</li>`).join('')}</ul>`;
    $('#doc-aside').innerHTML = `
      <div class="aside-card"><h3>More in ${dp.name}</h3>
        <ul class="list-link">${DOCTORS.filter(x => x.dept === d.dept && x.name !== d.name).map(x => `<li><a href="doctor.html?doc=${slug(x.name)}">${x.name} →</a></li>`).join('') || '<li><a href="doctors.html">Browse all doctors →</a></li>'}
        <li><a href="doctors.html?dept=${d.dept}">Full ${dp.name} team →</a></li></ul></div>
      <div class="aside-card aside-card--cta"><h3>Bring your records</h3><p>Imaging and labs from other hospitals are reviewed free of charge at first consult.</p>
        <a class="btn btn--clay btn--block" href="contact.html">Plan your visit</a></div>`;
  }

  /* ═════════ PAGE: PACKAGES ═════════ */
  if (PAGE === 'packages') {
    $('#pkg-grid').innerHTML = PACKAGES.map(pkgCard).join('');
    $('#ins-grid').innerHTML = INSURERS.map(i => `<li>${i}</li>`).join('') + '<li>+ 33 more</li>';
    $('#faq-list').innerHTML = FAQS.slice(0, 4).map(f => `
      <div class="faq-item"><button class="faq-q" aria-expanded="false">${f[0]}<span class="faq-icon"></span></button><div class="faq-a"><p>${f[1]}</p></div></div>`).join('');
    initFaq();
  }

  /* ═════════ PAGE: CONTACT ═════════ */
  if (PAGE === 'contact') {
    $('#map-figure').innerHTML = img(HERO.map, HERO.fbMap, 'Map of the Harborline District') + '<span class="map-pin" aria-hidden="true">📍</span>';
    $('#dept-quick').innerHTML = DEPARTMENTS.map(d => `<li><a href="department.html?dept=${d.id}">${d.name}</a></li>`).join('');
    $('#faq-list').innerHTML = FAQS.map(f => `
      <div class="faq-item"><button class="faq-q" aria-expanded="false">${f[0]}<span class="faq-icon"></span></button><div class="faq-a"><p>${f[1]}</p></div></div>`).join('');
    initFaq();
    // working contact form
    $('#contact-form').addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#c-name').value.trim(), email = $('#c-email').value.trim(), msg = $('#c-msg').value.trim();
      const hint = $('#contact-hint');
      if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || msg.length < 10) {
        hint.textContent = 'Please fill name, a valid email and a message of 10+ characters.'; hint.style.color = 'var(--clay)'; return;
      }
      hint.textContent = 'Message received — the patient desk replies within one working hour.'; hint.style.color = 'var(--gold)';
      toast('Message sent to the patient desk.'); e.target.reset();
    });
  }

  /* ---------- shared widgets ---------- */
  function initFaq() {
    $$('.faq-q').forEach(q => q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      $$('.faq-q').forEach(x => { x.setAttribute('aria-expanded', 'false'); $('.faq-a', x.parentElement).classList.remove('open'); });
      if (!open) { q.setAttribute('aria-expanded', 'true'); $('.faq-a', q.parentElement).classList.add('open'); }
    }));
  }
  function initSlider() {
    const track = $('#story-track'), dots = $('#story-dots'); if (!track) return;
    const n = STORIES.length; let i = 0, timer;
    dots.innerHTML = STORIES.map((_, k) => `<button aria-label="Story ${k + 1}"></button>`).join('');
    const go = (k, m) => { i = (k + n) % n; track.style.transform = `translateX(-${i * 100}%)`; $$('button', dots).forEach((d, j) => d.classList.toggle('is-active', j === i)); if (m) restart(); };
    const restart = () => { clearInterval(timer); if (!REDUCED) timer = setInterval(() => go(i + 1), 6500); };
    $('#story-prev').addEventListener('click', () => go(i - 1, true));
    $('#story-next').addEventListener('click', () => go(i + 1, true));
    dots.addEventListener('click', e => { const k = [...dots.children].indexOf(e.target); if (k > -1) go(k, true); });
    go(0); restart();
  }
  function initTools() {
    const bmi = () => { const h = +$('#bmi-height').value / 100, w = +$('#bmi-weight').value; if (!h || !w || h < 1) return;
      const v = w / (h * h); $('#bmi-value').textContent = v.toFixed(1);
      const c = v < 18.5 ? ['Underweight', '#4f9fd8'] : v < 25 ? ['Healthy range', '#3fae7a'] : v < 30 ? ['Overweight', '#e0b64f'] : ['Obese range', '#e2603f'];
      const el = $('#bmi-category'); el.textContent = c[0]; el.style.color = c[1];
      $('#bmi-marker').style.left = Math.min(Math.max(((v - 14) / 26) * 100, 0), 100) + '%'; };
    const hr = () => { const max = 220 - Math.min(Math.max(+$('#hr-age').value || 34, 10), 100);
      $('#hr-low').textContent = Math.round(max * .6) + ' bpm'; $('#hr-high').textContent = Math.round(max * .8) + ' bpm'; $('#hr-max').textContent = max + ' bpm'; };
    $('#bmi-form')?.addEventListener('input', e => { e.preventDefault(); bmi(); }); bmi();
    $('#hr-form')?.addEventListener('input', e => { e.preventDefault(); hr(); }); hr();
  }

  /* ---------- booking engine (dialog closes on clean confirm) ---------- */
  const DEPT_DOCTORS = {}; DEPARTMENTS.forEach(d => DEPT_DOCTORS[d.id] = DOCTORS.filter(x => x.dept === d.id).map(x => x.name));
  DEPT_DOCTORS.checkup = ['Checkup coordinator'];
  const LABELS = Object.fromEntries(DEPARTMENTS.map(d => [d.id, d.name])); LABELS.checkup = 'Health Checkup Clinic';
  const modal = $('#booking-modal'), form = $('#booking-form');
  let lastFocused = null, selectedSlot = null;
  Object.keys(DEPT_DOCTORS).forEach(id => $('#f-dept').insertAdjacentHTML('beforeend', `<option value="${id}">${LABELS[id]}</option>`));
  $('#f-date').min = new Date().toISOString().split('T')[0];

  function openBooking(p = {}) {
    lastFocused = document.activeElement;
    modal.hidden = false; document.body.style.overflow = 'hidden';
    if (p.dept) $('#f-dept').value = p.dept;
    populateDoctors(); if (p.doctor) $('#f-doctor').value = p.doctor;
    setTimeout(() => $('#f-dept').focus(), 60);
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; if (lastFocused) lastFocused.focus(); }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open-booking]');
    if (o) openBooking({ dept: o.dataset.dept, doctor: o.dataset.doctor });
    if (e.target.closest('[data-close-modal]') || e.target.closest('#modal-close')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  function populateDoctors() {
    const d = $('#f-dept').value, s = $('#f-doctor');
    s.innerHTML = d ? `<option value="any">First available specialist</option>` + DEPT_DOCTORS[d].map(x => `<option>${x}</option>`).join('') : `<option value="">Department first…</option>`;
  }
  $('#f-dept').addEventListener('change', () => { populateDoctors(); renderSlots(); });
  $('#f-date').addEventListener('change', renderSlots);
  const SLOTS = ['09:00','09:45','10:30','11:15','12:00','14:00','14:45','15:30','16:15','17:00'];
  function renderSlots() {
    const d = $('#f-dept').value, dt = $('#f-date').value, g = $('#slot-grid');
    selectedSlot = null; clearError('slot');
    if (!d || !dt) { g.innerHTML = `<p class="slot-hint">Pick a department & date.</p>`; return; }
    const seed = (dt + d).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    g.innerHTML = SLOTS.map((t, i) => { const taken = (seed * (i + 3)) % 7 === 0;
      return `<button type="button" class="slot${taken ? ' taken' : ''}" data-time="${t}" ${taken ? 'disabled' : ''} role="radio" aria-checked="false">${t}</button>`; }).join('');
  }
  $('#slot-grid').addEventListener('click', e => {
    const s = e.target.closest('.slot'); if (!s || s.classList.contains('taken')) return;
    $$('#slot-grid .slot').forEach(x => { x.classList.remove('selected'); x.setAttribute('aria-checked', 'false'); });
    s.classList.add('selected'); s.setAttribute('aria-checked', 'true'); selectedSlot = s.dataset.time; clearError('slot');
  });
  const setError = (k, m) => { const el = $('#err-' + k); el.textContent = m; el.closest('.field').classList.toggle('invalid', !!m); };
  const clearError = k => setError(k, '');
  form.addEventListener('input', e => { const m = { 'f-name':'name','f-phone':'phone','f-email':'email','f-dept':'dept','f-doctor':'doctor','f-date':'date' }; if (m[e.target.id]) clearError(m[e.target.id]); });
  function validate() {
    let bad = null;
    const flag = (k, c, m, el) => { setError(k, c ? m : ''); if (c && !bad) bad = el; };
    flag('dept', !$('#f-dept').value, 'Choose a department.', $('#f-dept'));
    flag('doctor', !$('#f-doctor').value, 'Choose a doctor.', $('#f-doctor'));
    flag('date', !$('#f-date').value, 'Pick a date.', $('#f-date'));
    flag('slot', !selectedSlot, 'Select a time slot.', $('#slot-grid'));
    flag('name', $('#f-name').value.trim().length < 2, 'Enter your full name.', $('#f-name'));
    flag('phone', !/^[+\d][\d\s\-()]{6,17}$/.test($('#f-phone').value.trim()), 'Enter a valid phone.', $('#f-phone'));
    flag('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#f-email').value.trim()), 'Enter a valid email.', $('#f-email'));
    if (bad) { const c = $('.modal-card', modal); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); bad.focus?.(); return false; }
    return true;
  }
  const KEY = 'meridian_appointments';
  let appts = JSON.parse(localStorage.getItem(KEY) || '[]');
  form.addEventListener('submit', e => {
    e.preventDefault(); if (!validate()) return;
    const btn = $('#booking-submit'); btn.disabled = true; btn.textContent = 'Confirming…';
    setTimeout(() => {
      const ref = 'MH-' + Date.now().toString(36).toUpperCase().slice(-6);
      appts.push({ ref, dept: LABELS[$('#f-dept').value], doctor: $('#f-doctor').value === 'any' ? 'First available specialist' : $('#f-doctor').value, date: $('#f-date').value, time: selectedSlot, name: $('#f-name').value.trim() });
      localStorage.setItem(KEY, JSON.stringify(appts));
      btn.disabled = false; btn.textContent = 'Confirm booking';
      form.reset(); renderSlots(); populateDoctors(); selectedSlot = null;
      closeModal();                       // ← dialog disappears; page (home or current) visible
      toast(`Appointment confirmed · Ref ${ref}`, 'success');
      const w = $('#appointment-section'); if (w) { renderWallet(); w.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' }); }
    }, 900);
  });
  function renderWallet() {
    const box = $('#appointment-list'), sec = $('#appointment-section'); if (!box) return;
    if (!appts.length) { sec.hidden = true; box.innerHTML = ''; return; }
    sec.hidden = false;
    box.innerHTML = appts.map(a => `<div class="appt-card"><div><p class="appt-ref">Ref ${a.ref}</p><h3>${a.dept} — ${a.doctor}</h3>
      <p class="appt-meta">${new Date(a.date + 'T00:00').toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' })} at ${a.time} · ${a.name}</p></div>
      <button class="appt-cancel" data-cancel="${a.ref}">Cancel</button></div>`).join('');
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-cancel]'); if (!b) return;
    appts = appts.filter(a => a.ref !== b.dataset.cancel); localStorage.setItem(KEY, JSON.stringify(appts)); renderWallet(); toast('Appointment cancelled — slot released.', 'error'); });
  renderWallet();

  /* ---------- newsletter ---------- */
  $('#newsletter-form').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#newsletter-email').value.trim(), h = $('#newsletter-hint');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { h.textContent = 'Please enter a valid email address.'; return; }
    h.textContent = 'Welcome aboard — first letter arrives next month.'; toast('Subscribed to the Meridian health letter.'); e.target.reset();
  });

  requestAnimationFrame(() => { document.body.classList.add('is-loaded'); observeReveals(); });
})();
