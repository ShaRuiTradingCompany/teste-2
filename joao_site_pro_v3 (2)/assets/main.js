
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
