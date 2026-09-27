/* The product scrub, home page only. Loaded with `defer` after site.js,
   which has already decided the motion path. */
(function(){
  const section = document.getElementById('film');
  if(!section) return;
  const TOTAL = 101;
  const PATH  = i => `frames/blynq_${String(i).padStart(4,'0')}.jpg`;
  const reduced = window.__blynqReduced === true;

  const canvas  = document.getElementById('canvas');
  const ctx     = canvas.getContext('2d', { alpha:false });
  const loading = document.getElementById('loading');
  const pct     = document.getElementById('pct');
  const meter   = document.getElementById('meter');
  const cue     = document.getElementById('scrollcue');
  const reveals = [...section.querySelectorAll('.reveal')];
  const images  = new Array(TOTAL);
  let current = -1;

  function sizeCanvas(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width  = Math.round(r.width  * dpr);
    canvas.height = Math.round(r.height * dpr);
    current = -1;
  }

  // The plate is grey at the top and near-white at the base, so one pad colour
  // fixes one seam and creates the other. Sample each edge separately.
  let pad = null;
  function samplePad(img){
    const t = document.createElement('canvas'); t.width = 1; t.height = 2;
    const tc = t.getContext('2d', {willReadFrequently:true});
    tc.drawImage(img, 0, 0, img.width, 2, 0, 0, 1, 1);
    tc.drawImage(img, 0, img.height-2, img.width, 2, 0, 1, 1, 1);
    const d = tc.getImageData(0,0,1,2).data;
    return { top:`rgb(${d[0]},${d[1]},${d[2]})`, bottom:`rgb(${d[4]},${d[5]},${d[6]})` };
  }

  function draw(i){
    const img = images[i];
    if(!img || !img.naturalWidth || i === current) return;
    current = i;
    if(!pad) pad = samplePad(img);
    const cw = canvas.width, ch = canvas.height;
    const s  = Math.min(cw / img.width, ch / img.height);   // contain: never crop the product
    const dw = img.width * s, dh = img.height * s;
    const dx = (cw-dw)/2, dy = (ch-dh)/2;
    if(dy > 0){
      ctx.fillStyle = pad.top;    ctx.fillRect(0, 0, cw, Math.ceil(dy));
      ctx.fillStyle = pad.bottom; ctx.fillRect(0, Math.floor(dy+dh), cw, Math.ceil(dy)+1);
    }
    if(dx > 0){
      ctx.fillStyle = pad.top;
      ctx.fillRect(0, 0, Math.ceil(dx), ch);
      ctx.fillRect(Math.floor(dx+dw), 0, Math.ceil(dx)+1, ch);
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function progress(){
    const rect = section.getBoundingClientRect();
    const span = section.offsetHeight - window.innerHeight;
    return span <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / span));
  }

  // One render for a given progress, shared by the scroll handler and the test hook.
  function render(p){
    draw(Math.round(p * (TOTAL - 1)));
    meter.style.width = (p*100).toFixed(1) + '%';
    cue.dataset.off = p > 0.02 ? 'true' : 'false';
    for(const el of reveals){
      const at = parseFloat(el.dataset.at);
      el.dataset.on = (p > at - 0.06 && p < at + 0.12) ? 'true' : 'false';
    }
  }

  let ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => { render(progress()); ticking = false; });
  }

  // Reduced motion: one frame, no listeners, and none of the 101 frames requested.
  if(reduced){
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img,0,0);
      loading.hidden = true;
    };
    img.src = 'poster.jpg';
    return;
  }

  // Frames start loading only when the film is near, so the hero is never
  // competing with 3.6 MB of JPEGs for the first paint.
  let started = false;
  function start(){
    if(started) return; started = true;
    let loaded = 0;
    for(let i=0;i<TOTAL;i++){
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        pct.textContent = Math.round(loaded/TOTAL*100);
        if(loaded === TOTAL){ loading.hidden = true; sizeCanvas(); onScroll(); }
      };
      img.src = PATH(i);
      images[i] = img;
    }
  }
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(es => { if(es.some(e => e.isIntersecting)){ start(); io.disconnect(); } },
                                        { rootMargin: '150% 0px' });
    io.observe(section);
  } else start();

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', () => { sizeCanvas(); onScroll(); });

  window.__scrub = { TOTAL, images, sizeCanvas, progress, start,
    seek(p){
      const span = section.offsetHeight - window.innerHeight;
      window.scrollTo(0, section.offsetTop + p*span);
      render(p);
      return Math.round(p*(TOTAL-1));
    }};
})();
