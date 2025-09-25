// ===== Diferenciais v6 — navio + balão ligado ao navio + título fora do quadro =====
(function(){
  // Alinha --header-h para âncoras/sticky
  const header = document.getElementById('siteHeader');
  function syncHeader(){
    document.documentElement.style.setProperty('--header-h', (header?.offsetHeight || 72) + 'px');
  }
  syncHeader(); addEventListener('resize', syncHeader);

  const sec   = document.getElementById('rota-branca');
  if(!sec) return;

  // Etapas (posições 0–1 + conteúdo do balão)
  const steps = [
    { t: 0.02, h: 'Visita à fábrica em 48h', p: 'Checamos capacidade real, prazos e estrutura no local. Você recebe fotos e vídeos — decisão mais segura.' },
    { t: 0.22, h: 'Ficha técnica PT‑ZH', p: 'Especificação bilíngue (materiais, medidas, tolerâncias, embalagem). Base para custo e inspeção.' },
    { t: 0.40, h: 'Negociação local', p: 'Equipe nativa negocia direto na fábrica. Melhor TCO (custo total) e prazos realistas.' },
    { t: 0.60, h: 'Amostra & Inspeção', p: 'Golden sample aprovado + inspeção por amostragem com fotos/vídeos antes do embarque.' },
    { t: 0.80, h: 'Desembaraço com estimativa', p: 'Tributos e despesas previstos antes do pedido. Decisão com números do Brasil.' },
    { t: 0.98, h: 'Entrega & pós‑venda', p: 'Chegou. Monitoramos performance e aceleramos reposições quando necessário.' },
  ];

  // DOM
  const svg   = sec.querySelector('#rw-svg');
  const path  = sec.querySelector('#rw-path');
  const prog  = sec.querySelector('#rw-prog');
  const ship  = sec.querySelector('#rw-ship');
  const dotsG = sec.querySelector('#rw-dots');
  const factory = sec.querySelector('#rwFactory');
  const cliente = sec.querySelector('#rwCliente');

  const speech = sec.querySelector('#rw-speech');
  const live   = sec.querySelector('#rwLive');
  const prevBtn = sec.querySelector('#rwPrev');
  const nextBtn = sec.querySelector('#rwNext');

  const VIEW_W = 1200, VIEW_H = 460;
  let L = 0, idx = 0, raf = 0;

  // Dots conforme steps
  let dots = [];
  function buildDots(){
    dotsG.innerHTML = '';
    dots = steps.map((s, k)=>{
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      placeCircleAt(s.t, c, 7);
      c.addEventListener('click', ()=> setStep(k));
      dotsG.appendChild(c);
      return c;
    });
  }
  function placeCircleAt(t, el, r=6){
    const d = L * t, pt = path.getPointAtLength(d);
    el.setAttribute('cx', pt.x); el.setAttribute('cy', pt.y); el.setAttribute('r', r);
  }

  // Posição do navio e progresso
  function placeShipAtT(t){
    const d = Math.max(0, Math.min(L, L*t));
    const pt = path.getPointAtLength(d);
    const pv = path.getPointAtLength(Math.max(0, d-1));
    const ang = Math.atan2(pt.y - pv.y, pt.x - pv.x) * 180/Math.PI;
    ship.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);
    prog.setAttribute('stroke-dasharray', `${d} ${L - d}`);
    return pt; // para posicionar o balão
  }

  // Marcadores especiais
  function placeMarkerAt(t, g){
    const d = L * t, pt = path.getPointAtLength(d);
    g.setAttribute('transform', `translate(${pt.x},${pt.y - 20})`);
  }

  // Converte coordenada SVG (viewBox) -> CSS na .board
  function toBoardXY(pt){
    const board = sec.querySelector('.board');
    const W = board.clientWidth, H = board.clientHeight;
    return { x: (pt.x / VIEW_W) * W, y: (pt.y / VIEW_H) * H };
  }

  // Posiciona/mostra o balão depois que o navio chega
  function showSpeech(stepIdx){
    const s = steps[stepIdx];
    const d = L * s.t;
    const pt = path.getPointAtLength(d);
    const xy = toBoardXY(pt);

    // texto
    speech.querySelector('h4').textContent = s.h;
    speech.querySelector('p').textContent  = s.p;

    // orientação automática conforme x
    speech.classList.remove('left','right','below','show');
    const relX = pt.x / VIEW_W;
    if(relX > .66) speech.classList.add('left');
    else if(relX < .34) speech.classList.add('right');
    // (opcional) se estiver muito baixo, mostra abaixo:
    if(pt.y > VIEW_H * .78) speech.classList.add('below');

    // posiciona
    speech.style.left = `${xy.x}px`;
    speech.style.top  = `${xy.y}px`;

    // revela
    requestAnimationFrame(()=> speech.classList.add('show'));
  }

  function updateUI(){
    dots.forEach((d, k)=> d.classList.toggle('active', k <= idx));
    if(live) live.textContent = `Etapa ${idx+1} de ${steps.length}`;
  }

  function setStep(nextIdx, animate=true){
    const target = Math.max(0, Math.min(steps.length-1, nextIdx));
    const t0 = steps[idx].t, t1 = steps[target].t;

    // atualiza UI (dots e leitor de tela)
    updateUI();

    // oculta o balão enquanto anima o navio
    speech.classList.remove('show');

    if(!animate){
      idx = target;
      placeShipAtT(t1);
      showSpeech(idx);
      updateUI();
      return;
    }

    cancelAnimationFrame(raf);
    const tStart = performance.now(), dur = 900;

    function tick(now){
      const p = Math.min(1, (now - tStart)/dur);
      const cur = t0 + (t1 - t0) * p;
      placeShipAtT(cur);
      if(p < 1) raf = requestAnimationFrame(tick);
      else{
        idx = target;
        showSpeech(idx);
        updateUI();
      }
    }
    raf = requestAnimationFrame(tick);
  }

  function recalc(){
    L = path.getTotalLength();
    buildDots();
    placeMarkerAt(steps[0].t, factory);
    placeMarkerAt(steps[steps.length-1].t, cliente);
    placeShipAtT(steps[idx].t);
    showSpeech(idx);
    updateUI();
  }

  // Controles e teclado
  prevBtn?.addEventListener('click', ()=> setStep(idx-1));
  nextBtn?.addEventListener('click', ()=> setStep(idx+1));
  addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight') setStep(idx+1);
    if(e.key==='ArrowLeft')  setStep(idx-1);
    if(e.key==='Enter')      setStep(idx+1);
  });
  addEventListener('resize', ()=> { clearTimeout(recalc._t); recalc._t = setTimeout(recalc, 100); });

  // Inicializa
  recalc();
  setStep(0, false);

  // ===== Typewriter para o título no fundo azul + cards =====
  function typewrite(el, speed=18){
    if(el.dataset.done) return;
    const text = el.dataset.ty || el.getAttribute('data-ty') || el.textContent.trim();
    el.dataset.ty = text; el.textContent = ''; let i = 0;
    (function step(){
      el.textContent = text.slice(0, i++);
      if(i <= text.length){
        const ch = text.charAt(i-1);
        setTimeout(step, speed + (ch==='.'?120: ch===','?60: 0));
      }else el.dataset.done = '1';
    })();
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.typewrite').forEach((el, i)=> setTimeout(()=> typewrite(el), i*140));
      io.unobserve(e.target);
    });
  }, {threshold:.3});
  const hero = document.querySelector('.rw-hero'); if(hero) io.observe(hero);
  document.querySelectorAll('#rw-details .rw-slide').forEach(s=> io.observe(s));
})();
