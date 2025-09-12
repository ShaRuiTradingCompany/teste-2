
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
