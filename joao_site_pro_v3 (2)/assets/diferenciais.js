// ===== Diferenciais — hero + navio com balão + digitação =====
(function(){
  // 0) Altura do header -> CSS var
  const header = document.getElementById('siteHeader');
  function syncHeader(){
    const h = (header?.offsetHeight || 72) + 'px';
    document.documentElement.style.setProperty('--header-h', h);
  }
  syncHeader(); addEventListener('resize', syncHeader);

  // 1) ROTA / NAVIO
  const board   = document.querySelector('#rota-branca .board');
  if (board){
    const svg     = board.querySelector('#rwSvg');
    const path    = board.querySelector('#rwPath');
    const prog    = board.querySelector('#rwProg');
    const ship    = board.querySelector('#rwShip');
    const speech  = board.querySelector('#rwSpeech');
    const btnPrev = board.querySelector('#rwPrev');
    const btnNext = board.querySelector('#rwNext');
    const live    = board.querySelector('#rwLive');
    const arrowPrev = board.querySelector('#rwArrowPrev');
    const arrowNext = board.querySelector('#rwArrowNext');

    if (svg && path && ship && prog && speech){
      const VBW = 1200, VBH = 420;
      const L = path.getTotalLength();
      prog.setAttribute('d', path.getAttribute('d') || '');
      prog.style.strokeDasharray = L + 'px';

      const steps = [
        { title:'Visita 48h',          text:'Vamos até a fábrica em até 48h, com fotos e vídeos no local.',                     p:.04 },
        { title:'Ficha técnica',       text:'Contrato técnico PT‑ZH (materiais, medidas, tolerâncias, embalagem).',            p:.22 },
        { title:'Negociação',          text:'Equipe nativa negocia direto em chinês para melhores condições.',                 p:.38 },
        { title:'Amostra & inspeção',  text:'Amostra aprovada e inspeção por amostragem com evidências visuais.',             p:.54 },
        { title:'Embarque',            text:'Check‑points LCL/FCL e documentos na plataforma.',                                p:.74 },
        { title:'Desembaraço',         text:'Estimativa de tributos/despesas antes do pedido — sem susto no Brasil.',          p:.88 },
        { title:'Entrega',             text:'Chegou. Acompanhamos performance e aceleramos reposições quando necessário.',     p:1.00 }
      ];

      let idx = 0, raf = null;
      const clamp = (v,a,b)=> Math.max(a, Math.min(b, v));
      const ease  = (t)=> t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;

      function placeSpeech(pt){
        const r = board.getBoundingClientRect();
        const sx = r.width / VBW, sy = r.height / VBH;
        const w = speech.offsetWidth || 240, h = speech.offsetHeight || 90;

        // “acima e um pouco à direita” do navio
        let left = pt.x * sx + 18;
        let top  = pt.y * sy - (h + 16);

        left = clamp(left, 8, r.width  - w - 8);
        top  = clamp(top,  8, r.height - h - 8);

        speech.style.transform = `translate(${left}px, ${top}px)`;
      }

      function renderAt(pct){
        const d = L * pct;
        // progresso
        prog.style.strokeDashoffset = (L - d) + 'px';

        // posição/ângulo do navio
        const pt = path.getPointAtLength(d);
        const prev = path.getPointAtLength(Math.max(0, d-1));
        const ang = Math.atan2(pt.y - prev.y, pt.x - prev.x) * 180/Math.PI;
        ship.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`);

        // balão acompanhando
        placeSpeech(pt);
      }

      function setStep(i, animate=true){
        const newIdx = clamp(i, 0, steps.length-1);
        const from = steps[idx].p;
        const to   = steps[newIdx].p;
        idx = newIdx;

        const s = steps[idx];
        speech.innerHTML = `<b>${s.title}</b><p>${s.text}</p>`;
        if (live) live.textContent = `Etapa ${idx+1} de ${steps.length}`;

        if(!animate){ renderAt(to); return; }

        const t0 = performance.now(), dur = 900;
        cancelAnimationFrame(raf);
        (function tick(now){
          const t = Math.min(1, (now - t0)/dur);
          const k = from + (to - from) * ease(t);
          renderAt(k);
          if(t < 1) raf = requestAnimationFrame(tick);
        })(t0);
      }

      // Controles (centrais e laterais)
      btnPrev?.addEventListener('click', ()=> setStep(idx-1));
      btnNext?.addEventListener('click', ()=> setStep(idx+1));
      arrowPrev?.addEventListener('click', ()=> setStep(idx-1));
      arrowNext?.addEventListener('click', ()=> setStep(idx+1));
      addEventListener('keydown', (e)=>{
        if(e.key==='ArrowRight' || e.key==='Enter') setStep(idx+1);
        if(e.key==='ArrowLeft') setStep(idx-1);
      });
      addEventListener('resize', ()=> renderAt(steps[idx].p));

      // inicial
      setStep(0, false);
    }
  }

  // 2) Digitação ao rolar (blocos de detalhamento)
  (function(){
    const items = Array.from(document.querySelectorAll('.diff-deep .type'));
    if(!items.length) return;

    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        typeIn(e.target, e.target.classList.contains('delay') ? 220 : 0);
        io.unobserve(e.target);
      });
    }, { threshold:.35 });

    items.forEach(el=> io.observe(el));

    function typeIn(el, delay){
      const txt = el.dataset.text || el.textContent;
      el.textContent = '';
      let i = 0;
      setTimeout(function step(){
        el.textContent += txt.charAt(i++);
        if(i <= txt.length) setTimeout(step, 16);
      }, delay);
    }
  })();
})();
