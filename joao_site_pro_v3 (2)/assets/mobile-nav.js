// ===== SHA RUI — Mobile Nav (hambúrguer + drawer) =====
(function(){
  const header = document.getElementById('siteHeader');
  if(!header) return;
  const wrap = header.querySelector('.nav-wrap');
  const menu = header.querySelector('.menu');
  if(!wrap || !menu) return;

  // Cria botão hambúrguer sem mexer no HTML existente
  const btn = document.createElement('button');
  btn.className = 'menu-toggle';
  btn.setAttribute('aria-label', 'Abrir menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
  wrap.appendChild(btn);

  function toggle(){
    const open = header.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open);
    document.documentElement.classList.toggle('no-scroll', open);
  }
  btn.addEventListener('click', toggle);

  // Fecha ao clicar em um link
  menu.addEventListener('click', (e)=>{
    if(e.target.closest('a')){ header.classList.remove('menu-open'); document.documentElement.classList.remove('no-scroll'); btn.setAttribute('aria-expanded','false'); }
  });

  // Garante a CSS var com a altura do header (compensa conteúdo)
  function setHeaderH(){
    const h = header.offsetHeight || 72;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  setHeaderH(); addEventListener('resize', setHeaderH);
})();
