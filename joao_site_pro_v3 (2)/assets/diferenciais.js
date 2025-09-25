// ===== Diferenciais (página) — Rota com navio e balões =====
(function(){
  // 1) Mantém a variável --header-h sincronizada (útil p/ offset de âncoras etc.)
  const header = document.getElementById('siteHeader');
  function syncHeader(){
    document.documentElement.style.setProperty('--header-h', (header?.offsetHeight || 72) + 'px');
  }
  syncHeader();
  addEventListener('resize', syncHeader);

  // 2) Rota do navio (#rota-branca)
  const sec = document.getElementById('rota-branca');
  if(!sec) return; // se a seção não existir nesta página, não faz nada

  const path     = sec.querySelector('#rw-path');
  const prog     = sec.querySelector('#rw-prog');
  const ship     = sec.querySelector('#rw-ship');
  const dots     = Array.from(sec.querySelectorAll('.rw-dots circle'));
  const balloons = Array.from(sec.querySelectorAll('#rw-balloons li'));
  const live     = sec.querySelector('#rwLive');
  const prev     = sec.querySelector('#rwPrev');
  const next     = sec.querySelector('#rwNext');

  if(!path || !ship) return;

  const L = path.getTotalLength();
  // Frações ao longo do caminho (0–1) alinhadas com os pontos visuais
  const tStops = [0.12, 0.28, 0.43, 0.60, 0.78, 0.92];

  let i = 0, raf = 0;

  function placeShipAt(t){
    const len = Math.max(0, Math.min(L, L * t));
    const pt  = path.getPointAtLength(len);
    const pv  = path.getPointAtLength(Math.max(0, len - 1));
    const ang = Math.atan2(pt.y - pv.y, pt.x - pv.x) * 180 / Math.PI;

    ship.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);
    prog.setAttribute('stroke-dasharray', `${len} ${L - len}`);
  }

  function updateUI(step){
    dots.forEach((d,k)=> d.classList.toggle('active', k <= step));
    // leve destaque no balão ativo
    balloons.forEach((b,k)=> b.style.opacity = (k === step ? '1' : '0.88'));
    if(live) live.textContent = `Etapa ${step+1} de ${tStops.length}`;
  }

  function setStep(k, animate = true){
    const to = Math.max(0, Math.min(tStops.length - 1, k));
    const t1 = tStops[to];
    const t0 = tStops[i] ?? 0;

    updateUI(to);

    if(!animate){
      i = to;
      placeShipAt(t1);
      return;
    }

    const tStart = performance.now();
    const dur = 900;
    cancelAnimationFrame(raf);

    function tick(now){
      const p = Math.min(1, (now - tStart) / dur);
      const cur = t0 + (t1 - t0) * p;
      placeShipAt(cur);
      if(p < 1){
        raf = requestAnimationFrame(tick);
      }else{
        i = to;
      }
    }
    raf = requestAnimationFrame(tick);
  }

  // Controles
  prev?.addEventListener('click', ()=> setStep(i - 1));
  next?.addEventListener('click', ()=> setStep(i + 1));
  addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') setStep(i + 1);
    if(e.key === 'ArrowLeft')  setStep(i - 1);
    if(e.key === 'Enter')      setStep(i + 1);
  });

  // Inicial
  setStep(0, false);
})();
