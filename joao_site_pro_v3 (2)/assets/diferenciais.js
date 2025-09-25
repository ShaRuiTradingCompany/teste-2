// ===== Diferenciais — Rota com navio + balão lateral + detalhamento =====
(function(){
  // Mantém --header-h coerente (ancoras e sticky)
  const header = document.getElementById('siteHeader');
  function syncHeader(){
    document.documentElement.style.setProperty('--header-h', (header?.offsetHeight || 72) + 'px');
  }
  syncHeader(); addEventListener('resize', syncHeader);

  // Seção da rota
  const sec   = document.getElementById('rota-branca');
  if(!sec) return;

  const svg   = sec.querySelector('#rw-svg');
  const path  = sec.querySelector('#rw-path');
  const prog  = sec.querySelector('#rw-prog');
  const ship  = sec.querySelector('#rw-ship');
  const dotsG = sec.querySelector('#rw-dots');
  const factory = sec.querySelector('#rwFactory');
  const cliente = sec.querySelector('#rwCliente');

  const balloons = Array.from(sec.querySelectorAll('#rw-balloons li'));
  const live     = sec.querySelector('#rwLive');
  const prevBtn  = sec.querySelector('#rwPrev');
  const nextBtn  = sec.querySelector('#rwNext');

  // FRAÇÕES ao longo da rota (0–1)
  const tStops = [0.02, 0.22, 0.40, 0.60, 0.80, 0.98]; // 6 pontos
  let L = 0, i = 0, raf = 0;
  let dotEls = [];

  // Cria dots conforme a curva
  function buildDots(){
    dotsG.innerHTML = '';
    dotEls = tStops.map((t, idx)=>{
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      placeCircleAt(t, c, 6);
      c.addEventListener('click', ()=> setStep(idx));
      dotsG.appendChild(c);
      return c;
    });
  }
  function placeCircleAt(t, el, r=6){
    const len = L * t;
    const pt  = path.getPointAtLength(len);
    el.setAttribute('cx', pt.x);
    el.setAttribute('cy', pt.y);
    el.setAttribute('r',  r);
  }

  // Posição do navio e progresso
  function placeShipAt(t){
    const len = Math.max(0, Math.min(L, L*t));
    const pt  = path.getPointAtLength(len);
    const pv  = path.getPointAtLength(Math.max(0, len - 1));
    const ang = Math.atan2(pt.y - pv.y, pt.x - pv.x) * 180/Math.PI;

    ship.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);
    prog.setAttribute('stroke-dasharray', `${len} ${L - len}`);
  }

  // Marcadores especiais (fábrica e cliente) — um pouco acima do ponto
  function placeMarkerAt(t, g){
    const len = L * t;
    const pt  = path.getPointAtLength(len);
    g.setAttribute('transform', `translate(${pt.x},${pt.y - 18})`);
  }

  function updateUI(step){
    dotEls.forEach((d,k)=> d.classList.toggle('active', k <= step));
    balloons.forEach((b,k)=> b.classList.toggle('active', k === step));
    if(live) live.textContent = `Etapa ${step+1} de ${tStops.length}`;
  }

  function setStep(k, animate = true){
    const to = Math.max(0, Math.min(tStops.length-1, k));
    const t1 = tStops[to];
    const t0 = tStops[i];

    updateUI(to);

    if(!animate){
      i = to; placeShipAt(t1); return;
    }

    const tStart = performance.now();
    const dur = 900;
    cancelAnimationFrame(raf);

    function tick(now){
      const p = Math.min(1, (now - tStart)/dur);
      const cur = t0 + (t1 - t0) * p;
      placeShipAt(cur);
      if(p<1){ raf = requestAnimationFrame(tick); }
      else{ i = to; }
    }
    raf = requestAnimationFrame(tick);
  }

  // Resize/reflow: recalcula comprimento, dots, marcadores e reposiciona navio
  function recalc(){
    L = path.getTotalLength();
    buildDots();
    placeMarkerAt(tStops[0], factory);
    placeMarkerAt(tStops[tStops.length-1], cliente);
    placeShipAt(tStops[i]);
    updateUI(i);
  }

  // Controles
  prevBtn?.addEventListener('click', ()=> setStep(i-1));
  nextBtn?.addEventListener('click', ()=> setStep(i+1));
  addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight') setStep(i+1);
    if(e.key==='ArrowLeft')  setStep(i-1);
    if(e.key==='Enter')      setStep(i+1);
  });
  addEventListener('resize', ()=> { clearTimeout(recalc._t); recalc._t = setTimeout(recalc, 100); });

  // Inicializa
  recalc();
  setStep(0, false);

  // ===== Typewriter (títulos/textos das seções conforme entram) =====
  function typewrite(el, speed=18){
    if(el.dataset.done) return;
    const text = el.dataset.ty || el.getAttribute('data-ty') || el.textContent.trim();
    el.dataset.ty = text;
    el.textContent = '';
    let i = 0;
    (function step(){
      el.textContent = text.slice(0, i++);
      if(i <= text.length){
        const ch = text.charAt(i-1);
        const extra = ch==='.' ? 120 : ch===',' ? 60 : 0;
        setTimeout(step, speed + extra);
      }else{
        el.dataset.done = '1';
      }
    })();
  }

  // Observa: cabeçalho da rota + cada slide do detalhamento
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.typewrite').forEach((el, idx)=>{
        setTimeout(()=> typewrite(el), idx * 140);
      });
      io.unobserve(e.target);
    });
  }, { threshold:.3 });

  const rwHead = document.querySelector('#rota-branca .rw-head');
  if(rwHead) io.observe(rwHead);

  document.querySelectorAll('#rw-details .rw-slide').forEach(s=> io.observe(s));
})();
