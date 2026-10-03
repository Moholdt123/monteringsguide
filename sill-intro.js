const intro=document.getElementById('sill-intro'),animation=document.getElementById('sill-animation');
let initialized=false;
document.querySelectorAll('[data-start-animation]').forEach(button=>button.addEventListener('click',async()=>{
 intro.hidden=true;animation.hidden=false;
 if(!initialized){initialized=true;try{await import('./sill.js');}catch(error){initialized=false;const el=document.getElementById('loading');if(el)el.textContent='Kunne ikke laste 3D-visningen. Kontroller internettilgangen og at WebGL er tilgjengelig.';console.error(error);}}
 document.getElementById('sill-title').focus();
}));
document.getElementById('back-to-intro').addEventListener('click',()=>{animation.hidden=true;intro.hidden=false;window.dispatchEvent(new Event('sill-intro-open'));document.getElementById('intro-title').focus();});
