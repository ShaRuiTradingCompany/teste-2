// ===== Diferenciais (página) – animação full-screen =====
(function(){
  const header = document.getElementById('siteHeader');
  function syncHeaderH(){
    const h = header?.offsetHeight || 72;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  syncHeaderH(); addEventListener('resize', syncHeaderH);

  const root   = document.querySelector('.journey-fs');
  if(!root) return;

  const frames = Array.from(root.querySelectorAll('.frame'));
  const nextBtns = root.querySelectorAll('.next');
  const live  = root.querySelector('#journeyLive');

  let idx = 0;
  activate(0);

  // seta, teclado e swipe
  nextBtns.forEach(b => b.addEventListener('click', goNext));
  document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight' || e.key==='Enter') goNext();
  });
  // swipe básico
  let x0=null; root.addEventListener('touchstart', e=> x0 = e.touches[0].clientX, {passive:true});
  root.addEventListener('touchend', e=>{
    if(x0==null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if(dx < -30) goNext();
    x0 = null;
  });

  function goNext(){
    idx = Math.min(frames.length-1, idx+1);
    activate(idx);
  }

  function activate(i){
    frames.forEach((f,k)=> f.classList.toggle('active', k===i));
    if(live) live.textContent = `Etapa ${i+1} de ${frames.length}`;
    // dispara animação específica
    const f = frames[i];
    if(f.classList.contains('f1')) walkToFactory(f);
    if(f.classList.contains('f2')) drawTreasure(f);
    if(f.classList.contains('f3')) sailShip(f);
    if(f.classList.contains('f4')) {/* CSS animado */}
    if(f.classList.contains('f5')) driveTruck(f);
  }

  // ===== Animação 1: pessoa caminha até a fábrica
  function walkToFactory(f){
    const path = f.querySelector('#walkPath');
    const walker = f.querySelector('#walker');
    if(!path || !walker) return;
    const L = path.getTotalLength();
    let start=null;
    const dur = 900;
    function step(ts){
      if(!f.classList.contains('active')) return; // para ao sair
      if(start==null) start = ts;
      const t = Math.min(1, (ts-start)/dur);
      const d = L*t;
      const pt = path.getPointAtLength(d);
      const prev = path.getPointAtLength(Math.max(0, d-1));
      const ang = Math.atan2(pt.y - prev.y, pt.x - prev.x) * 180 / Math.PI;
      walker.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);
      if(t<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ===== Animação 2: rota dourada + texto digitando
  function drawTreasure(f){
    const path = f.querySelector('#goldenRoute');
    if(!path) return;
    const L = path.getTotalLength();
    path.style.strokeDasharray = `0 ${L}`;
    path.style.strokeDashoffset = 0;
    const t0 = performance.now(), dur=900;
    function tick(now){
      if(!f.classList.contains('active')) return;
      const p = Math.min(1,(now-t0)/dur);
      const len = L*p;
      path.style.strokeDasharray = `${len} ${L-len}`;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    const target = f.querySelector('.type');
    if(target){
      const lines = (target.dataset.lines||'').split('|');
      typeLines(target, lines, 26);
    }
  }
  function typeLines(el, lines, speed){
    el.textContent = ''; let i=0, j=0;
    (function nextChar(){
      if(i>=lines.length) return;
      const line = lines[i];
      el.textContent = lines.slice(0,i).join('\n') + (i?'\n':'') + line.slice(0, j+1);
      j++;
      if(j<line.length) setTimeout(nextChar, speed);
      else{ i++; j=0; setTimeout(nextChar, 280); }
    })();
  }

  // ===== Animação 3: navio vermelho navegando
  function sailShip(f){
    const path = f.querySelector('#seaPath');
    const ship = f.querySelector('#cargoShip');
    if(!path || !ship) return;
    const L = path.getTotalLength();
    const t0 = performance.now(), dur=1400;
    function tick(now){
      if(!f.classList.contains('active')) return;
      const p = Math.min(1,(now-t0)/dur);
      const d = L*p;
      const pt = path.getPointAtLength(d);
      const prev = path.getPointAtLength(Math.max(0, d-1));
      const ang = Math.atan2(pt.y - prev.y, pt.x - prev.x) * 180 / Math.PI;
      ship.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ===== Animação 5: caminhão até o depósito
  function driveTruck(f){
    const path = f.querySelector('#truckPath');
    const truck = f.querySelector('#truck');
    if(!path || !truck) return;
    const L = path.getTotalLength();
    const t0 = performance.now(), dur=1100;
    function tick(now){
      if(!f.classList.contains('active')) return;
      const p = Math.min(1,(now-t0)/dur);
      const d = L*p;
      const pt = path.getPointAtLength(d);
      truck.setAttribute('transform', `translate(${pt.x},${pt.y})`);
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Reduced motion: só mostra conteúdos, sem animações
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  if(mq.matches){
    frames.forEach(f => f.classList.add('active'));
  }
})();
