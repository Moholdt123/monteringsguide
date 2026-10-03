const intro=document.getElementById('sill-intro'),animation=document.getElementById('sill-animation');
let initialized=false;
document.querySelectorAll('[data-start-animation]').forEach(button=>button.addEventListener('click',async()=>{
 intro.hidden=true;animation.hidden=false;
 if(!initialized){initialized=true;try{await import('./sill.js');}catch(error){initialized=false;const el=document.getElementById('loading');if(el)el.textContent='Kunne ikke laste 3D-visningen. Kontroller internettilgangen og at WebGL er tilgjengelig.';console.error(error);}}
 document.getElementById('sill-title').focus();
}));
document.getElementById('back-to-intro').addEventListener('click',()=>{animation.hidden=true;intro.hidden=false;window.dispatchEvent(new Event('sill-intro-open'));document.getElementById('intro-title').focus();});
const topics=[...document.querySelectorAll('.learning-card')];
topics.forEach(topic=>topic.addEventListener('toggle',()=>{if(topic.open)topics.filter(other=>other!==topic).forEach(other=>{other.open=false;});}));
const why=document.getElementById('why-dialog');
document.getElementById('step-why').addEventListener('click',()=>{
 const step=Number(document.querySelector('[data-sill][aria-pressed="true"]')?.dataset.sill??0);
 const mapping=['reference','strings','strings',null,'reference','cc','strings','fixing','fixing'];
 const topic=mapping[step]?document.getElementById('topic-'+mapping[step]):null;
 document.getElementById('why-title').textContent=topic?topic.querySelector('summary').textContent:'Hvorfor et fuktskille?';
 const content=document.getElementById('why-content');content.replaceChildren();
 if(topic){content.append(topic.querySelector('.learning-answer').cloneNode(true));}
 else{const p=document.createElement('p');p.textContent='Laget mellom betong og treverk skal beskytte treverket mot fukt fra underlaget. Velg et egnet produkt og følg anvisningen for den aktuelle konstruksjonen.';content.append(p);const a=document.createElement('a');a.href='https://isola.no/produkter/vegg/svill-og-mur';a.target='_blank';a.rel='noopener noreferrer';a.textContent='Produsentens forklaring av fuktskille';content.append(a);}
 why.showModal();
});
document.getElementById('why-close').addEventListener('click',()=>why.close());
why.addEventListener('click',event=>{const r=why.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)why.close();});
