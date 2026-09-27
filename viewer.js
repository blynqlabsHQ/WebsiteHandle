/* The object viewer on design.html. The reader turns the glasses with a
   slider instead of the page turning them on scroll: user-driven, so it is
   the same experience with or without reduced motion, and a keyboard's
   arrow keys work natively on the range input. */
(function(){
  const range = document.getElementById('turn');
  if(!range) return;
  const TOTAL = 101;
  const PATH = i => `frames/blynq_${String(i).padStart(4,'0')}.jpg`;
  const img = document.getElementById('turn-img');
  const out = document.getElementById('turn-out');
  const cap = document.getElementById('turn-cap');
  const capK = document.getElementById('turn-cap-k');
  const capT = document.getElementById('turn-cap-t');
  const chips = [...document.querySelectorAll('[data-frame]')];
  const reduced = window.__blynqReduced === true;

  // The three reveals, at the frames where each part faces the camera.
  const PARTS = chips.map(c => ({ at:+c.dataset.frame, k:c.dataset.k, t:c.dataset.t, alt:c.dataset.alt, chip:c }));

  const cache = new Array(TOTAL);
  let preloaded = false;
  function preload(){
    if(preloaded) return; preloaded = true;
    for(let i = 0; i < TOTAL; i++){ const im = new Image(); im.src = PATH(i); cache[i] = im; }
  }
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(es => { if(es.some(e => e.isIntersecting)){ preload(); io.disconnect(); } }, { rootMargin:'50% 0px' });
    io.observe(range);
  } else preload();
  ['pointerdown','focus','keydown'].forEach(ev => range.addEventListener(ev, preload, { once:true }));

  function show(i){
    i = Math.max(0, Math.min(TOTAL - 1, Math.round(i)));
    img.src = PATH(i);
    out.textContent = String(i).padStart(3, '0');
    const part = PARTS.find(p => Math.abs(p.at - i) <= 6);
    range.setAttribute('aria-valuetext', part ? `Frame ${i} of 100, the ${part.k.toLowerCase()}` : `Frame ${i} of 100`);
    PARTS.forEach(p => p.chip.setAttribute('aria-pressed', p === part ? 'true' : 'false'));
    if(part){
      cap.hidden = false; capK.textContent = part.k; capT.textContent = part.t; img.alt = part.alt;
    } else {
      cap.hidden = true; img.alt = 'The Blynq glasses, turning on a white turntable.';
    }
  }

  range.addEventListener('input', () => show(+range.value));

  let anim = 0;
  function go(to){
    cancelAnimationFrame(anim);
    preload();
    const from = +range.value;
    if(reduced || from === to){ range.value = to; show(to); return; }
    const t0 = performance.now(), dur = 650;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      const v = Math.round(from + (to - from) * e);
      range.value = v; show(v);
      if(k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  chips.forEach(c => c.addEventListener('click', () => go(+c.dataset.frame)));
  show(+range.value);
})();
