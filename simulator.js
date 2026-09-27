/* The conversation simulator on how-it-works.html.
   A scripted meeting on a timeline. Human speech is drawn (and, with sound
   on, played as a soft synthesized murmur); Blynq's output fires only in
   the silences. Its words go to a polite live region, so a screen reader
   hears exactly what the wearer would hear, and nothing else. */
(function(){
  const sim = document.getElementById('sim');
  if(!sim) return;

  const T = 17;   // seconds
  const SPEECH = [
    { s:0,    e:3.0,  who:'A colleague',       text:'“So for Thursday, I think we keep the review short.”' },
    { s:4.0,  e:7.0,  who:'Someone opposite',  text:'“Agreed, as long as the numbers are in by then.”' },
    { s:8.2,  e:10.4, who:'A colleague',       text:'“I will send them tonight, and—”' },
    { s:10.7, e:13.0, who:'Someone opposite',  text:'“—and we go through them first thing.”' },
  ];
  const ROOM_EVENTS = [
    { s:3.0, e:4.0, text:'Silence. Someone walks in and takes the seat on your left.' },
  ];
  const CUES = [
    { t:3.25,  d:.55, label:'Tier 0', sound:'notes',
      say:'Two rising notes. Someone joined the room.', log:'Tone: someone joined.' },
    { t:7.2,   d:.9,  label:'Tier 1', speak:'Someone on your left.',
      say:'“Someone on your left.”', log:'“Someone on your left.”' },
    { t:10.42, d:.26, label:'Held', drop:true,
      say:'A cue was ready. Someone started speaking, so it was dropped.' },
    { t:11.8,  d:0,   press:true,
      say:'You pressed the temple. The answer waits for the next silence.', log:'You pressed the temple.' },
    { t:13.15, d:3.5, label:'Tier 2',
      speak:'Four people at the table. The person who just joined is on your left, facing the group.',
      say:'“Four people at the table. The person who just joined is on your left, facing the group.”',
      log:'“Four people at the table. The person who just joined is on your left, facing the group.”' },
  ];

  const $ = id => document.getElementById(id);
  const playBtn = $('sim-play'), restartBtn = $('sim-restart'), soundBox = $('sim-sound');
  const clock = $('sim-clock'), head = $('sim-head'), room = $('sim-room'), say = $('sim-say'), log = $('sim-log');
  const laneRoom = $('lane-room'), laneBlynq = $('lane-blynq');
  const pct = x => (x / T * 100) + '%';

  /* ---------- draw the lanes ---------- */
  const segEls = SPEECH.map((sp, idx) => {
    const seg = document.createElement('div');
    seg.className = 'sim__seg';
    seg.style.left = pct(sp.s); seg.style.width = pct(sp.e - sp.s);
    const n = Math.round((sp.e - sp.s) * 16);
    for(let i = 0; i < n; i++){
      const k = i + idx * 17;
      const b = document.createElement('i');
      b.style.height = (18 + Math.abs(Math.sin(k * 1.7) * Math.cos(k * .6)) * 82).toFixed(1) + '%';
      seg.appendChild(b);
    }
    laneRoom.appendChild(seg);
    return seg;
  });
  const cueEls = CUES.map(c => {
    const el = document.createElement('div');
    if(c.press){
      el.className = 'sim__press';
      el.style.left = pct(c.t);
    } else {
      el.className = 'sim__cue';
      el.style.left = pct(c.t);
      el.style.width = pct(c.drop ? .35 : Math.max(c.d, .8));
      if(!c.drop) el.textContent = c.label;
    }
    laneBlynq.appendChild(el);
    return el;
  });

  /* ---------- sound (opt-in, all synthesized locally) ---------- */
  let ac = null, murmur = null;
  function ensureAudio(){
    if(ac) { if(ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    ac = new AC();
    const len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), data = buf.getChannelData(0);
    let last = 0;
    for(let i = 0; i < len; i++){ last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; data[i] = last * 3.5; }
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    const bp = ac.createBiquadFilter(); bp.type = 'peaking'; bp.frequency.value = 420; bp.gain.value = 8;
    murmur = ac.createGain(); murmur.gain.value = 0;
    src.connect(lp).connect(bp).connect(murmur).connect(ac.destination);
    src.start();
  }
  function notes(){
    if(!ac) return;
    [[660, 0], [880, .16]].forEach(([f, off]) => {
      const o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + off;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(.18, t0 + .015);
      g.gain.exponentialRampToValueAtTime(.001, t0 + .14);
      o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + .16);
    });
  }
  function speak(text){
    if(!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.15; u.lang = 'en-US';
    speechSynthesis.speak(u);
  }
  function silence(){
    if(murmur && ac) murmur.gain.setTargetAtTime(0, ac.currentTime, .03);
    if('speechSynthesis' in window) speechSynthesis.cancel();
  }
  soundBox.addEventListener('change', () => { if(soundBox.checked) ensureAudio(); else silence(); });

  /* ---------- playback ---------- */
  let t = 0, playing = false, lastTs = 0, fired = new Set(), raf = 0;

  function fmt(x){
    const s = Math.min(x, T);
    return '00:' + String(Math.floor(s)).padStart(2, '0') + '.' + Math.floor((s % 1) * 10);
  }
  function speakingAt(x){ return SPEECH.find(sp => x >= sp.s && x < sp.e); }

  function paint(){
    head.style.transform = `translateX(${laneRoom.offsetLeft + laneRoom.offsetWidth * Math.min(t, T) / T}px)`;
    clock.textContent = fmt(t);

    const sp = speakingAt(t);
    segEls.forEach((el, i) => el.classList.toggle('is-live', SPEECH[i] === sp));
    if(t === 0 && !playing){ room.textContent = 'Four people around a table. Press play.'; }
    else if(sp){ room.innerHTML = ''; const b = document.createElement('b'); b.textContent = sp.who + ': ';
      room.append(b, sp.text); }
    else if(t >= T){ room.textContent = 'The meeting goes on.'; }
    else {
      const ev = ROOM_EVENTS.find(e => t >= e.s && t < e.e);
      room.textContent = ev ? ev.text : 'Silence.';
    }

    let active = false;
    CUES.forEach((c, i) => {
      const done = t >= c.t;
      cueEls[i].classList.toggle(c.drop ? 'is-drop' : 'is-done', done);
      if(t >= c.t && t < c.t + Math.max(c.d, .3) + 1.2) active = true;
    });
    say.classList.toggle('is-quiet', !active);

    if(murmur && ac && soundBox.checked){
      const target = (sp && playing) ? .05 * (.55 + .45 * Math.abs(Math.sin(t * 11 + Math.sin(t * 2.3) * 2))) : 0;
      murmur.gain.setTargetAtTime(target, ac.currentTime, .03);
    }
  }

  function fire(){
    CUES.forEach((c, i) => {
      if(fired.has(i) || t < c.t) return;
      fired.add(i);
      say.textContent = c.say;
      if(c.log){
        const li = document.createElement('li');
        const tm = document.createElement('time'); tm.textContent = fmt(c.t);
        const tx = document.createElement('span'); tx.textContent = c.log;
        li.append(tm, tx); log.appendChild(li); log.scrollTop = log.scrollHeight;
      }
      if(soundBox.checked && ac){
        if(c.sound === 'notes') notes();
        if(c.speak) speak(c.speak);
      }
    });
  }

  function tick(ts){
    if(!playing) return;
    const dt = lastTs ? (ts - lastTs) / 1000 : 0;
    lastTs = ts;
    t = Math.min(T, t + dt);
    fire(); paint();
    if(t >= T){ pause(); playBtn.textContent = 'Play again'; return; }
    raf = requestAnimationFrame(tick);
  }
  function play(){
    if(t >= T) reset();
    if(soundBox.checked) ensureAudio();
    playing = true; lastTs = 0;
    playBtn.textContent = 'Pause';
    raf = requestAnimationFrame(tick);
  }
  function pause(){
    playing = false; cancelAnimationFrame(raf);
    playBtn.textContent = t > 0 && t < T ? 'Resume' : 'Play';
    silence(); paint();
  }
  function reset(){
    t = 0; fired = new Set(); log.textContent = '';
    say.textContent = 'Nothing yet.';
    paint();
  }

  playBtn.addEventListener('click', () => playing ? pause() : play());
  restartBtn.addEventListener('click', () => { const was = playing; pause(); reset(); if(was) play(); else playBtn.textContent = 'Play'; });
  document.addEventListener('visibilitychange', () => { if(document.hidden && playing) pause(); });
  window.addEventListener('resize', paint);
  paint();
})();
