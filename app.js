import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = id => document.getElementById(id);
const viewer = $('viewer');
let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
catch { $('loading').textContent = '3D krever WebGL. Prøv en oppdatert nettleser med maskinvareakselerasjon.'; throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0xd6e5eb);
viewer.prepend(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, .01, 50);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.minDistance = 1.2; controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI * .85; controls.target.set(0, 1.1, .05);
function resetCamera() { camera.position.set(4, 3.1, 5.5); controls.target.set(-.1, 1.05, .0); controls.update(); }
resetCamera();
scene.add(new THREE.HemisphereLight(0xffffff, 0x637e8a, 2.6));
const sun = new THREE.DirectionalLight(0xffffff, 3.1); sun.position.set(2,6,5); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-4,right:4,top:4,bottom:-4}); sun.shadow.bias=-.001;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xaccddb,1);fill.position.set(-4,2,1);scene.add(fill);

const wood = new THREE.MeshStandardMaterial({color:0xc7a478,roughness:.85});
const plateMaterials = [];
const floorMaterial = new THREE.MeshStandardMaterial({color:0xe1e3df,roughness:.95});
function box(w,h,d,material,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
box(3.5,.1,2.4,floorMaterial,-.15,-.05,.62);
const floorLines = new THREE.Group();scene.add(floorLines);
const lineMat = new THREE.LineBasicMaterial({color:0xc1c9c7});
for(let x=-1.8;x<=1.6;x+=.6){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,.003,-.58),new THREE.Vector3(x,.003,1.8)]);floorLines.add(new THREE.Line(g,lineMat));}
const framing = new THREE.Group();scene.add(framing);
box(2.5,.09,.09,wood,0,.045,0,framing);
box(2.5,.09,.09,wood,0,2.355,0,framing);
for(let x=-1.2;x<=1.21;x+=.6)box(.045,2.22,.09,wood,x,1.2,0,framing);
// A second wall gives the room corner and exposes the framing behind the board.
box(.09,.09,1.65,wood,-1.2,.045,.83,framing);
box(.09,.09,1.65,wood,-1.2,2.355,.83,framing);
for(let z=.6;z<=1.66;z+=.5)box(.09,2.22,.045,wood,-1.2,1.2,z,framing);
box(.09,2.22,.045,wood,-1.2,1.2,1.65,framing);
// Thin grain lines keep the framing legible without external texture assets.
const grainMat = new THREE.LineBasicMaterial({color:0xa88861,transparent:true,opacity:.35});
for(let x=-1.2;x<=1.21;x+=.6){for(const dx of [-.012,.012]){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x+dx,.12,.046),new THREE.Vector3(x+dx,2.28,.046)]);framing.add(new THREE.Line(g,grainMat));}}
const plates = [];
for(let i=0;i<2;i++){
 const mat=new THREE.MeshStandardMaterial({color:0xe5e8e5,roughness:.87,transparent:true});plateMaterials.push(mat);
 const plate=box(1.195,2.3,.025,mat,-.6+i*1.2,1.2,.064);plate.visible=false;plates.push(plate);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(plate.geometry),new THREE.LineBasicMaterial({color:0xa8b9bd,transparent:true,opacity:.5}));plate.add(edge);
}
const screws=new THREE.Group();scene.add(screws);screws.visible=false;
const screwMat=new THREE.MeshStandardMaterial({color:0x147c69,metalness:.45,roughness:.32,emissive:0x0a6351,emissiveIntensity:.25});
const screwMeshes=[];
for(const x of [-1.16,-.6,-.04,.04,.6,1.16]){
 for(let y=.2;y<=2.21;y+=.4){
  const s=new THREE.Mesh(new THREE.CylinderGeometry(.025,.018,.013,16),screwMat);s.rotation.x=Math.PI/2;s.position.set(x,y,.085);s.userData.screw=true;screws.add(s);screwMeshes.push(s);
  const cross=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.012,0,.009),new THREE.Vector3(.012,0,.009),new THREE.Vector3(0,-.012,.009),new THREE.Vector3(0,.012,.009)]),new THREE.LineBasicMaterial({color:0xe9fff5}));
  // Cross stays in the wall plane independent of cylinder orientation.
  cross.position.copy(s.position);screws.add(cross);
 }
}
const measurement=new THREE.Group();scene.add(measurement);measurement.visible=false;
const measurementMat=new THREE.LineBasicMaterial({color:0xb67e16});
function measureLine(points){measurement.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),measurementMat));}
measureLine([[.6,.2,.13],[.84,.2,.13],[.84,.6,.13],[.6,.6,.13]]);
measureLine([[.79,.2,.13],[.89,.2,.13]]);measureLine([[.79,.6,.13],[.89,.6,.13]]);
measureLine([[-.6,2.57,0],[0,2.57,0]]);measureLine([[-.6,2.50,0],[-.6,2.63,0]]);measureLine([[0,2.50,0],[0,2.63,0]]);

const tagDefs=[
 {text:'Toppsvill',position:new THREE.Vector3(.45,2.38,0),kind:'frame'},
 {text:'Bunnsvill',position:new THREE.Vector3(.45,.04,0),kind:'frame'},
 {text:'Stender',position:new THREE.Vector3(.6,1.5,0),kind:'frame'},
 {text:'Gipsplate',position:new THREE.Vector3(-.55,1.3,.10),kind:'plate'},
 {text:'400 mm · demomål',position:new THREE.Vector3(.99,.4,.13),kind:'measure'},
 {text:'600 mm · demomål',position:new THREE.Vector3(-.3,2.73,0),kind:'measure'}
];
for(const t of tagDefs){t.element=document.createElement('span');t.element.className='tag'+(t.kind==='measure'?' measure':'');t.element.textContent=t.text;$('tags').append(t.element);}

let step=0, playing=false, animStart=0, animationProgress=0;
const stageData=[
 ['Veggens oppbygning','Start med veggens ramme','Se hvordan toppsvill, bunnsvill og stendere danner veggens oppbygning.'],
 ['Platen på plass','Se platen bevege seg på plass','Spill bevegelsen og roter veggen for å se platen fra en annen vinkel.'],
 ['Skruer og innfesting','Gå nærmere detaljene','Trykk på en fremhevet skrue for å åpne den lille animasjonen. Målene er kun demonstrasjon.']
];
function updateVisibility(){
 screws.visible=step>0&&$('screws').checked;
 measurement.visible=$('dimensions').checked;
 plateMaterials.forEach(m=>{m.opacity=$('transparent').checked?.22:1;m.depthWrite=!$('transparent').checked;});
}
function setStep(value){
 if(!Number.isInteger(value)||value<0||value>2)throw new Error('Steg må være 0, 1 eller 2.');
 step=value;playing=false;$('play').textContent='Spill monteringen';screwMeshes.forEach(s=>s.visible=true);
 plates.forEach(p=>{p.visible=step>0;p.position.z=.064;});
 $('screws').checked=step===2;updateVisibility();
 document.querySelectorAll('[data-step]').forEach(b=>{const active=Number(b.dataset.step)===step;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 $('scene-title').textContent=stageData[step][0];$('stage-title').textContent=stageData[step][1];$('stage-description').textContent=stageData[step][2];$('stage-label').textContent='STEG 0'+(step+1);$('step-count').textContent=(step+1)+' / 3';
 $('previous').disabled=step===0;$('next').disabled=step===2;
}
function play(){
 if(playing){playing=false;$('play').textContent='Fortsett';return;}
 if($('play').textContent==='Fortsett'){animStart=performance.now()-animationProgress*6500;playing=true;$('play').textContent='Pause';return;}
 setStep(1);animationProgress=0;animStart=performance.now();playing=true;$('play').textContent='Pause';
}
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>setStep(Number(b.dataset.step))));
for(const id of ['screws','dimensions','transparent','labels'])$(id).addEventListener('change',()=>{
 if((id==='screws'||id==='transparent')&&$(id).checked&&step===0)setStep(id==='screws'?2:1);
 updateVisibility();
});
// Changing steps preserves the intended transparency control. Screw toggles are set by the selected step.
$('reset').addEventListener('click',resetCamera);$('play').addEventListener('click',play);
$('previous').addEventListener('click',()=>setStep(step-1));$('next').addEventListener('click',()=>setStep(step+1));

const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
renderer.domElement.addEventListener('pointerup',e=>{
 if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5||!screws.visible)return;
 const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);
 if(raycaster.intersectObjects(screwMeshes).length)openDetail();down=null;
});
renderer.domElement.addEventListener('pointermove',e=>{const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);renderer.domElement.style.cursor=screws.visible&&raycaster.intersectObjects(screwMeshes).length?'pointer':'grab';});

let miniRenderer, miniScene, miniCamera, animatedScrew, miniStart=0;
function initMini(){
 miniRenderer=new THREE.WebGLRenderer({antialias:true});miniRenderer.setPixelRatio(Math.min(devicePixelRatio,2));miniRenderer.setClearColor(0xe1ebed);$('mini-viewer').append(miniRenderer.domElement);
 miniScene=new THREE.Scene();miniCamera=new THREE.PerspectiveCamera(35,1,.01,10);miniCamera.position.set(.18,.18,.38);miniCamera.lookAt(0,0,0);
 miniScene.add(new THREE.HemisphereLight(0xffffff,0x718b97,3));const l=new THREE.DirectionalLight(0xffffff,3);l.position.set(1,2,3);miniScene.add(l);
 // Sectional illustration: the near half is removed to reveal the screw path.
 const miniPlate=new THREE.MeshStandardMaterial({color:0xd2dcdd,roughness:.8});
 box(.08,.08,.0125,miniPlate,-.04,0,.00625,miniScene);
 box(.055,.11,.075,wood,-.0275,0,-.0375,miniScene);
 animatedScrew=new THREE.Group();miniScene.add(animatedScrew);
 const metal=new THREE.MeshStandardMaterial({color:0x147c69,metalness:.65,roughness:.25});
 const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.0019,.0019,.047,12),metal);shaft.rotation.x=Math.PI/2;shaft.position.z=-.0235;animatedScrew.add(shaft);
 const tip=new THREE.Mesh(new THREE.ConeGeometry(.0019,.008,12),metal);tip.rotation.x=-Math.PI/2;tip.position.z=-.051;animatedScrew.add(tip);
 const head=new THREE.Mesh(new THREE.CylinderGeometry(.0045,.002,.004,20),metal);head.rotation.x=Math.PI/2;head.position.z=.001;animatedScrew.add(head);
 const helixPoints=[];for(let i=0;i<=360;i++){const t=i/360;helixPoints.push(new THREE.Vector3(Math.cos(t*Math.PI*24)*.0024,Math.sin(t*Math.PI*24)*.0024,-.004-t*.041));}
 const helix=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints),360,.00045,5,false),metal);animatedScrew.add(helix);
 const slot=new THREE.Mesh(new THREE.BoxGeometry(.006,.0007,.0004),new THREE.MeshStandardMaterial({color:0x08392f}));slot.position.z=.0032;animatedScrew.add(slot);
 resizeMini();
}
function resizeMini(){if(!miniRenderer)return;const w=$('mini-viewer').clientWidth;miniRenderer.setSize(w,250);miniCamera.aspect=w/250;miniCamera.updateProjectionMatrix();}
function openDetail(){if(!$('detail').open)$('detail').showModal();if(!miniRenderer)initMini();resizeMini();miniStart=performance.now();}
$('detail-open').addEventListener('click',openDetail);$('detail-close').addEventListener('click',()=>$('detail').close());$('replay').addEventListener('click',()=>{miniStart=performance.now();});
$('detail').addEventListener('click',e=>{const r=$('detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('detail').close();});
function resize(){const w=viewer.clientWidth,h=viewer.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();resizeMini();}
new ResizeObserver(resize).observe(viewer);window.addEventListener('resize',resize);resize();
const temp=new THREE.Vector3();
function render(now){
 requestAnimationFrame(render);
 if(playing){
  animationProgress=Math.min((now-animStart)/6500,1);
  plates.forEach((p,i)=>{const t=THREE.MathUtils.clamp(animationProgress*2-i*.7,0,1);const eased=t*t*(3-2*t);p.position.z=.064+(1-eased)*.85;p.visible=t>0;});
  if(animationProgress>.78){$('screws').checked=true;screws.visible=true;const shown=Math.floor((animationProgress-.78)/.22*screwMeshes.length);screwMeshes.forEach((s,i)=>{s.visible=i<=shown;});}
  if(animationProgress>=1){playing=false;setStep(2);screwMeshes.forEach(s=>s.visible=true);}
 }
 controls.update();renderer.render(scene,camera);
 for(const t of tagDefs){const isMeasure=t.kind==='measure';let visible=isMeasure?$('dimensions').checked:$('labels').checked;
  if(t.kind==='plate'&&step===0)visible=false;
  if(t.kind==='frame'&&step>0&&!$('transparent').checked)visible=false;
  if(t.kind==='measure'&&t.text.startsWith('400')&&step===0)visible=false;
  temp.copy(t.position).project(camera);if(temp.z>1||temp.z< -1)visible=false;
  t.element.style.display=visible?'block':'none';t.element.style.left=(temp.x*.5+.5)*viewer.clientWidth+'px';t.element.style.top=(-temp.y*.5+.5)*viewer.clientHeight+'px';
 }
 if(miniRenderer&&$('detail').open){const t=Math.min((now-miniStart)/3200,1);const eased=t*t*(3-2*t);animatedScrew.position.z=.075*(1-eased)+.01;animatedScrew.rotation.z=t*Math.PI*18;miniRenderer.render(miniScene,miniCamera);$('mini-state').textContent=t<1?'Skruen festes …':'Bevegelsen er ferdig';}
}
$('loading').remove();setStep(0);requestAnimationFrame(render);

// Optional browser tools reuse the same visible state; ordinary browsers ignore this.
if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();
 const registration=document.modelContext.registerTool({name:'set_assembly_view',title:'Velg monteringsvisning',description:'Velg et demonstrasjonssteg og vis eller skjul skruene i den synlige 3D-modellen.',inputSchema:{type:'object',properties:{step:{type:'integer',minimum:0,maximum:2},showScrews:{type:'boolean'}},required:['step'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||!Number.isInteger(input.step)||input.step<0||input.step>2||Object.keys(input).some(k=>!['step','showScrews'].includes(k))||('showScrews'in input&&typeof input.showScrews!=='boolean'))throw new Error('Ugyldig visning.');if(input.step===0&&input.showScrews)throw new Error('Skruer vises i steg 1 eller 2.');setStep(input.step);if('showScrews'in input){$('screws').checked=input.showScrews;updateVisibility();}return {step,showScrews:screws.visible,demo:true};}}, {signal:lifecycle.signal});
 Promise.resolve(registration).catch(()=>{});window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
