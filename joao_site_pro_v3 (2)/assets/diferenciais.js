// ===== Diferenciais (página) – menu sequencial + animações =====
(function(){
  const header = document.getElementById('siteHeader');
  function syncHeader(){ document.documentElement.style.setProperty('--header-h', (header?.offsetHeight || 72) + 'px'); }
  syncHeader(); addEventListener('resize', syncHeader);

  const root = document.querySelector('.tech-journey');
  if(!root) return;

  const nodes  = Array.from(root.querySelectorAll('.seq .node'));
  const panels = Array.from(root.querySelectorAll('.seq .panel'));
  const progress = root.querySelector('.seq .progress');
  const live = root.querySelector('#seqLive');

  let idx = 0, shipRAF = null;

  function setActive(i){
    idx = Math.max(0, Math.min(panels.length-1, i));
    nodes.forEach((n,k)=> n.classList.toggle('active', k<=idx));
    panels.forEach((p,k)=> p.classList.toggle('active', k===idx));
    const ratio = (idx)/(nodes.length-1);
    if(progress) progress.style.width = (ratio*100).toFixed(2) + '%';
    if(live) live.textContent = `Etapa ${idx+1} de ${nodes.length}`;

    // animações por painel
    stopShip();
    const p = panels[idx];
    if(p?.classList.contains('f-embarque')) startShip(p);
  }

  // clique nos nós
  nodes.forEach((n,k)=> n.addEventListener('click', ()=> setActive(k)));

  // botões
  const btnPrev = root.querySelector('#stepPrev');
  const btnNext = root.querySelector('#stepNext');
  btnPrev?.addEventListener('click', ()=> setActive(idx-1));
  btnNext?.addEventListener('click', ()=> setActive(idx+1));

  // teclado
  addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight') setActive(idx+1);
    if(e.key==='ArrowLeft')  setActive(idx-1);
    if(e.key==='Enter')      setActive(idx+1);
  });

  // ===== Navio no embarque (animação SVG ao longo do caminho) =====
  function startShip(panel){
    const path = panel.querySelector('#seaPath');
    const ship = panel.querySelector('#cargoShip');
    if(!path || !ship) return;
    const L = path.getTotalLength();
    const t0 = performance.now(), dur = 1600;

    function tick(now){
      const p = Math.min(1, (now - t0)/dur);
      const d = L * p;
      const pt = path.getPointAtLength(d);
      const prev = path.getPointAtLength(Math.max(0, d-1));
      const ang = Math.atan2(pt.y-prev.y, pt.x-prev.x) * 180/Math.PI;
      ship.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);
      if(p<1 && panels[idx].classList.contains('f-embarque')) shipRAF = requestAnimationFrame(tick);
    }
    shipRAF = requestAnimationFrame(tick);
  }
  function stopShip(){ if(shipRAF){ cancelAnimationFrame(shipRAF); shipRAF = null; } }

  // inicial
  setActive(0);
})();
