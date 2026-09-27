/* Blynq, shared behaviour for every page.
   Loaded with `defer`. Everything here enhances a page that already works
   without it: no content is hidden unless this script has run and the
   reader has not asked for reduced motion. */
(function(){
  const root = document.documentElement;

  /* ---------- motion ----------
     ?reduced=1 / ?reduced=0 force either path without touching OS settings. */
  const forced = new URLSearchParams(location.search).get('reduced');
  const reduced = forced === '1' ? true
                : forced === '0' ? false
                : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced) root.dataset.motion = 'on';
  window.__blynqReduced = reduced;

  /* ---------- mobile menu ---------- */
  const btn = document.querySelector('.menu-btn');
  const sheet = document.getElementById('sheet');
  if(btn && sheet){
    const label = btn.querySelector('.menu-btn__t');
    function setOpen(open, returnFocus){
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(label) label.textContent = open ? 'Close' : 'Menu';
      sheet.dataset.open = open ? 'true' : 'false';
      sheet.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      if(open){ const first = sheet.querySelector('a'); if(first) first.focus(); }
      else if(returnFocus){ btn.focus(); }
    }
    btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true', false));
    sheet.addEventListener('click', e => { if(e.target.closest('a')) setOpen(false, false); });
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', m => { if(m.matches) setOpen(false, false); });
  }

  /* ---------- the gap device's speech bars ----------
     Deterministic so the figure is identical on every load. Heights are a
     percentage of the lane, so the figure scales with the layout. */
  document.querySelectorAll('[data-bars]').forEach(el => {
    const n = +el.dataset.bars || 60, seed = +el.dataset.seed || 0;
    const frag = document.createDocumentFragment();
    for(let i = 0; i < n; i++){
      const k = i + seed;
      const h = 8 + Math.abs(Math.sin(k * 1.7) * Math.cos(k * .6)) * 88;
      const b = document.createElement('i');
      b.style.height = h.toFixed(1) + '%';
      frag.appendChild(b);
    }
    el.appendChild(frag);
  });

  /* ---------- reveal on scroll ---------- */
  const rv = document.querySelectorAll('.rv');
  if(!reduced && rv.length && 'IntersectionObserver' in window){
    root.dataset.reveal = 'armed';
    const io = new IntersectionObserver(entries => {
      for(const en of entries){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rv.forEach(el => io.observe(el));
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
