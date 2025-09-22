
(function(){
  function ready(fn){ if(document.readyState!='loading'){fn()} else {document.addEventListener('DOMContentLoaded',fn)} }
  function setHref(sel, href){ document.querySelectorAll(sel).forEach(a=>{ a.setAttribute('href', href); a.setAttribute('target','_blank'); a.setAttribute('rel','noopener') }) }
  ready(function(){
    var C = window.SITE_CONFIG || {};
    // WhatsApp
    if(C.whatsapp){ setHref('[data-contact="whatsapp"]', 'https://wa.me/'+C.whatsapp); }
    // Calendly
    if(C.calendly){ var ifr=document.getElementById('calendly-embed'); if(ifr) ifr.src=C.calendly; }
    // Email
    if(C.email){ setHref('[data-contact="email"]', 'mailto:'+C.email); document.querySelectorAll('[data-text="email"]').forEach(e=>e.textContent=C.email); }
    // Brand
    if(C.brand){ document.querySelectorAll('[data-text="brand"]').forEach(e=>e.textContent=C.brand); }
    // WeChat
    if(C.wechatId){ document.querySelectorAll('#wechat-id,[data-text="wechat"]').forEach(e=>e.textContent=C.wechatId); }
    // Socials
    if(C.facebook){ setHref('[data-contact="facebook"]', C.facebook); }
    if(C.instagram){ setHref('[data-contact="instagram"]', C.instagram); }
    if(C.tiktok){ setHref('[data-contact="tiktok"]', C.tiktok); }
  });
})();
// WeChat modal
function openQR(){ document.getElementById('qr-modal').classList.add('open'); }
function closeQR(){ document.getElementById('qr-modal').classList.remove('open'); }
// ===== HERO: controlar play/pause, som e número de execuções =====
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.hero-video');
  const btnPlay = document.getElementById('heroPlayPause');
  const btnMute = document.getElementById('heroMute');

  if (!video || !btnPlay || !btnMute) return;

  let plays = 0;        // quantidade de vezes que o vídeo terminou
  const MAX_PLAYS = 2;  // tocar 2 vezes no total

  // garantir estado inicial
  video.loop = false;
  video.muted = true;

  // tentar tocar (alguns navegadores podem bloquear; o botão Play resolve)
  video.play().then(() => {
    btnPlay.textContent = '❚❚'; // pausas
  }).catch(() => {
    btnPlay.textContent = '▶︎';  // se não tocou, mostra play
  });

  // quando terminar, decide se toca de novo
  video.addEventListener('ended', () => {
    plays += 1;
    if (plays < MAX_PLAYS) {
      video.currentTime = 0;
      video.play().catch(()=>{});
    } else {
      // para no final
      btnPlay.textContent = '▶︎';
    }
  });

  // alternar play/pause
  btnPlay.addEventListener('click', () => {
    if (video.paused) {
      video.play().then(()=>{ btnPlay.textContent = '❚❚'; }).catch(()=>{});
    } else {
      video.pause();
      btnPlay.textContent = '▶︎';
    }
  });

  // alternar som
  btnMute.addEventListener('click', () => {
    video.muted = !video.muted;
    btnMute.textContent = video.muted ? '🔇' : '🔊';
  });
});
// ===== Menu de Idiomas (globo) =====
document.addEventListener('DOMContentLoaded', () => {
  const lang = document.querySelector('.lang');
  const toggle = document.getElementById('langToggle');
  if (!lang || !toggle) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    lang.classList.toggle('open');
    toggle.setAttribute('aria-expanded', lang.classList.contains('open') ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!lang.contains(e.target)) {
      lang.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
});
/* ==== Reveal simples (foto + texto Quem somos) ==== */
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {threshold:.18});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ==== Sequência de balões em Diferenciais ==== */
(function(){
  const list = document.querySelectorAll('#diferenciais .pill');
  if(!list.length) return;
  const kick = ()=>{
    list.forEach((pill, i)=> setTimeout(()=> pill.classList.add('in'), i*170));
  };
  const guard = new IntersectionObserver((entries)=>{
    if(entries.some(e=>e.isIntersecting)){ kick(); guard.disconnect(); }
  }, {rootMargin:'-20% 0px -20% 0px'});
  guard.observe(document.querySelector('#diferenciais'));
})();
// === Slider "Plataforma do Cliente" ===========================
document.addEventListener('DOMContentLoaded', () => {
  const stage     = document.querySelector('#plataforma');
  if (!stage) return;

  const wrap      = stage.querySelector('#platSlides');
  const slides    = Array.from(wrap.querySelectorAll('.slide'));
  const dotsWrap  = stage.querySelector('.dots');
  const btnPrev   = stage.querySelector('.nav.prev');
  const btnNext   = stage.querySelector('.nav.next');

  let i = 0, timer = null, AUTOPLAY_MS = 5500, paused = false;

  // cria dots
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir para slide ${idx+1}`);
    b.addEventListener('click', () => go(idx, true));
    dotsWrap.appendChild(b);
  });

  function syncUI(){
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dotsWrap.querySelectorAll('button').forEach((d, idx) => d.classList.toggle('active', idx === i));
  }
  function go(n, manual=false){
    i = (n + slides.length) % slides.length;
    syncUI();
    if (manual) restart(); // ao clicar, reinicia o autoplay
  }
  function next(){ go(i+1) }
  function prev(){ go(i-1) }

  btnNext.addEventListener('click', () => go(i+1, true));
  btnPrev.addEventListener('click', () => go(i-1, true));
  document.addEventListener('keydown', (e) => {
    if (!stage.matches(':hover')) return;
    if (e.key === 'ArrowRight') go(i+1, true);
    if (e.key === 'ArrowLeft')  go(i-1, true);
  });

  function start(){ if (!timer) timer = setInterval(next, AUTOPLAY_MS); }
  function stop(){ clearInterval(timer); timer = null; }
  function restart(){ stop(); start(); }

  // pausa ao passar o mouse / foco
  const tablet = stage.querySelector('.tablet');
  ['mouseenter','focusin','touchstart'].forEach(ev => tablet.addEventListener(ev, () => { paused=true; stop(); }, {passive:true}));
  ['mouseleave','focusout','touchend'].forEach(ev => tablet.addEventListener(ev, () => { if (paused){ paused=false; start(); } }, {passive:true}));

  syncUI(); start();
});
