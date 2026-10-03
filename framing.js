import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { tasks, partProgress, phaseIndex, validateTask } from './framing-model.mjs';
const $=id=>document.getElementById(id);
const viewer=$('viewer');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true});}catch(error){$('loading').textContent='3D krever WebGL. Prøv en oppdatert nettleser med maskinvareakselerasjon.';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xd6e5eb);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;viewer.prepend(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.01,50);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=1;controls.maxDistance=12;controls.maxPolarAngle=Math.PI*.85;
function resetView(){camera.position.set(4.6,3.2,6.7);controls.target.set(0,1.1,0);controls.update();}
resetView();scene.add(new THREE.HemisphereLight(0xffffff,0x698592,2.5));
const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,6,4);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-5,right:5,top:5,bottom:-5});light.shadow.bias=-.001;scene.add(light);
const wood=new THREE.MeshStandardMaterial({color:0xc8a77c,roughness:.85});
const activeWood=new THREE.MeshStandardMaterial({color:0xcdb18b,roughness:.82,emissive:0x53786b,emissiveIntensity:.12});
const concrete=new THREE.MeshStandardMaterial({color:0xe0e3df,roughness:.97});
const fastenerMat=new THREE.MeshStandardMaterial({color:0x147c69,roughness:.35,metalness:.45,emissive:0x147c69,emissiveIntensity:.18});
function cube(w,h,d,material,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
cube(5.4,.12,2.4,concrete,0,-.06,.35);
const lineMat=new THREE.LineBasicMaterial({color:0xc6cecb});
for(let x=-2.7;x<2.8;x+=.6){scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,.003,-.85),new THREE.Vector3(x,.003,1.55)]),lineMat));}
const groups=tasks.map(()=>({parts:[],markers:[]}));
function part(task,w,h,d,x,y,z,offset){const mesh=cube(w,h,d,wood,x,y,z);const target=mesh.position.clone();groups[task].parts.push({mesh,target,offset:new THREE.Vector3(...offset)});return mesh;}
// Intentionally schematic: no construction dimensions or fixing distances are specified.
part(0,2.35,.09,.12,-.925,.045,0,[0,.75,.3]);part(0,.75,.09,.12,1.725,.045,0,[0,.75,.3]);
const studXs=[-2.1,-1.4,-.35,.25,1.35,2.1];
for(const x of studXs)part(1,.055,2.22,.12,x,1.2,0,[0,.35,.7]);
part(2,4.25,.09,.12,0,2.355,0,[0,.75,0]);
for(const y of [.9,1.9])part(3,.995,.055,.12,-.875,y,0,[0,.3,.7]);
part(3,.055,.7825,.12,-.875,.48125,0,[0,.2,.7]);part(3,.055,.3375,.12,-.875,2.09625,0,[0,.2,.7]);
part(4,1.045,.055,.12,.8,1.98,0,[0,.3,.7]);part(4,.055,.3025,.12,.8,2.15875,0,[0,.2,.7]);
function marker(task,x,y,z){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.029,14,10),fastenerMat);mesh.position.set(x,y,z);mesh.userData.task=task;scene.add(mesh);groups[task].markers.push(mesh);}
for(const x of [-1.75,-.6,1.8])marker(0,x,.11,.075);
for(const x of studXs)marker(1,x,.16,.075);
for(const x of studXs)marker(2,x,2.36,.075);
for(const x of [-1.35,-.40])for(const y of [.9,1.9])marker(3,x,y,.075);
for(const x of [.30,1.30])marker(4,x,1.98,.075);
const labelDefs=[['Bunnsvill',0,new THREE.Vector3(-1,.05,.13)],['Stender',1,new THREE.Vector3(-2.1,1.5,.13)],['Toppsvill',2,new THREE.Vector3(0,2.4,.13)],['Losholt ved vindu',3,new THREE.Vector3(-.875,.9,.13)],['Overstykke ved dør',4,new THREE.Vector3(.8,1.98,.13)]];
const labels=labelDefs.map(([text,task,position])=>{const el=document.createElement('span');el.className='tag';el.textContent=text;$('tags').append(el);return {el,task,position};});
let task=0,progress=0,playing=false,all=false,last=performance.now(),advanceAt=null;
function renderParts(){groups.forEach((group,i)=>{group.parts.forEach((p,j)=>{p.mesh.visible=i<=task;const t=i<task?1:partProgress(progress,j,group.parts.length);p.mesh.position.copy(p.target).addScaledVector(p.offset,1-t);p.mesh.rotation.y=i===task?(1-t)*.08:0;p.mesh.material=i===task?activeWood:wood;});group.markers.forEach((m,j)=>{const t=THREE.MathUtils.clamp((progress-.72)/.28*group.markers.length-j,0,1);m.visible=$('fasteners').checked&&(i<task||(i===task&&t>0));m.scale.setScalar(i<task?1:Math.max(.05,t));});});}
function sync(){
 $('scene-title').textContent=tasks[task].title;$('stage-title').textContent=tasks[task].title;$('stage-description').textContent=tasks[task].description;$('stage-label').textContent='ARBEIDSOPPGAVE 0'+(task+1);$('task-count').textContent=(task+1)+' / 5';$('open-detail').textContent=task===0?'Detaljert bunnsvill':'Se festepunkt';
 $('phase-text').textContent=tasks[task].phase[phaseIndex(progress)];$('timeline').value=Math.round(progress*1000);$('progress-text').textContent=Math.round(progress*100)+' %';
 $('play-task').textContent=playing?'Pause':progress>=1?'Spill på nytt':progress>0?'Fortsett':'Spill dette steget';$('play-all').textContent=all?'Stopp hele oppbygningen':'Spill hele oppbygningen';
 $('previous-task').disabled=task===0;$('next-task').disabled=task===tasks.length-1;
 document.querySelectorAll('[data-task]').forEach(b=>{const active=Number(b.dataset.task)===task;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderParts();
}
function selectTask(index,continueAll=false){if(!validateTask(index))return;task=index;progress=0;playing=continueAll;all=continueAll;advanceAt=null;last=performance.now();sync();}
document.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>{const index=Number(b.dataset.task);if(index===0){location.assign('bunnsvill.html');return;}selectTask(index);}));
$('play-task').addEventListener('click',()=>{if(playing){playing=false;}else{if(progress>=1)progress=0;playing=true;last=performance.now();}advanceAt=null;sync();});
$('replay-task').addEventListener('click',()=>{selectTask(task);playing=true;sync();});
$('play-all').addEventListener('click',()=>{if(all){all=false;playing=false;sync();}else{selectTask(0,true);}});
$('timeline').addEventListener('input',()=>{playing=false;all=false;advanceAt=null;progress=Number($('timeline').value)/1000;sync();});
$('previous-task').addEventListener('click',()=>selectTask(task-1));$('next-task').addEventListener('click',()=>selectTask(task+1));$('reset-view').addEventListener('click',resetView);
$('fasteners').addEventListener('change',renderParts);
const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();let pointerDown=null;
function intersects(e){const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(mouse,camera);return raycaster.intersectObjects(groups.flatMap(g=>g.markers).filter(m=>m.visible));}
renderer.domElement.addEventListener('pointerdown',e=>{pointerDown=[e.clientX,e.clientY];});renderer.domElement.addEventListener('pointerup',e=>{if(!pointerDown)return;const moved=Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1]);pointerDown=null;if(moved>5)return;const hits=intersects(e);if(hits.length)openDetail(hits[0].object.userData.task);});
renderer.domElement.addEventListener('pointermove',e=>{renderer.domElement.style.cursor=intersects(e).length?'pointer':'grab';});

let miniRenderer,miniScene,miniCamera,miniScrew,miniStart=0,detailTask=0;
function initMini(){miniRenderer=new THREE.WebGLRenderer({antialias:true});miniRenderer.setPixelRatio(Math.min(devicePixelRatio,2));miniRenderer.setClearColor(0xe1ebed);$('fastener-viewer').append(miniRenderer.domElement);miniScene=new THREE.Scene();miniCamera=new THREE.PerspectiveCamera(35,1,.01,10);miniCamera.position.set(.27,.22,.30);miniCamera.lookAt(0,.015,0);miniScene.add(new THREE.HemisphereLight(0xffffff,0x6c8792,3));const l=new THREE.DirectionalLight(0xffffff,3);l.position.set(1,3,2);miniScene.add(l);rebuildMini();}
function rebuildMini(){
 // Keep lights; rebuild the section so each connection gets a distinct orientation.
 miniScene.children.filter(o=>!o.isLight).forEach(o=>{miniScene.remove(o);o.traverse(n=>{if(n.geometry)n.geometry.dispose();});});
 if(detailTask===0){cube(.18,.06,.08,concrete,-.01,-.03,-.02,miniScene);cube(.16,.035,.035,wood,0,.0175,-.0175,miniScene);}
 else if(detailTask===1){cube(.18,.035,.06,wood,0,-.0175,-.025,miniScene);cube(.035,.13,.035,wood,0,.065,-.0175,miniScene);}
 else if(detailTask===2){cube(.035,.12,.035,wood,0,-.06,-.0175,miniScene);cube(.18,.035,.06,wood,0,.0175,-.025,miniScene);}
 else {cube(.035,.18,.035,wood,.05,0,-.0175,miniScene);cube(.12,.035,.035,wood,-.0275,0,-.0175,miniScene);}
 miniScrew=new THREE.Group();miniScene.add(miniScrew);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.002,.002,.06,12),fastenerMat);shaft.position.y=-.03;miniScrew.add(shaft);const head=new THREE.Mesh(new THREE.CylinderGeometry(.005,.003,.003,16),fastenerMat);miniScrew.add(head);
 const points=[];for(let i=0;i<=240;i++){const t=i/240;points.push(new THREE.Vector3(Math.cos(t*Math.PI*20)*.0025,-.005-t*.05,Math.sin(t*Math.PI*20)*.0025));}miniScrew.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),240,.0004,5,false),fastenerMat));
}
function resizeMini(){if(!miniRenderer)return;const w=$('fastener-viewer').clientWidth;if(!w)return;miniRenderer.setSize(w,250);miniCamera.aspect=w/250;miniCamera.updateProjectionMatrix();}
function openDetail(index=task){detailTask=index;$('detail-title').textContent=tasks[index].detail;$('detail-description').textContent=tasks[index].detailDescription;if(!$('fastener-dialog').open)$('fastener-dialog').showModal();if(!miniRenderer)initMini();else rebuildMini();resizeMini();miniStart=performance.now();}
$('open-detail').addEventListener('click',()=>{if(task===0){location.assign('bunnsvill.html');return;}openDetail();});$('close-detail').addEventListener('click',()=>$('fastener-dialog').close());$('replay-detail').addEventListener('click',()=>{miniStart=performance.now();});
$('fastener-dialog').addEventListener('click',e=>{const r=$('fastener-dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('fastener-dialog').close();});
function resize(){renderer.setSize(viewer.clientWidth,viewer.clientHeight);camera.aspect=viewer.clientWidth/viewer.clientHeight;camera.updateProjectionMatrix();resizeMini();}new ResizeObserver(resize).observe(viewer);window.addEventListener('resize',resize);resize();
const projected=new THREE.Vector3();
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.1);last=now;
 if(playing){if(progress<1){progress=Math.min(1,progress+dt/6.5);sync();}else if(all){if(advanceAt===null)advanceAt=now+800;if(now>=advanceAt){if(task<tasks.length-1)selectTask(task+1,true);else{playing=false;all=false;sync();}}}else{playing=false;sync();}}
 controls.update();renderer.render(scene,camera);
 for(const label of labels){projected.copy(label.position).project(camera);const visible=$('part-labels').checked&&label.task<=task&&(label.task<task||progress>.72)&&projected.z>=-1&&projected.z<=1;label.el.style.display=visible?'block':'none';label.el.style.left=(projected.x*.5+.5)*viewer.clientWidth+'px';label.el.style.top=(-projected.y*.5+.5)*viewer.clientHeight+'px';}
 if(miniRenderer&&$('fastener-dialog').open){const t=Math.min((now-miniStart)/3000,1),smooth=t*t*(3-2*t),remaining=1-smooth;
  miniScrew.rotation.set(0,t*Math.PI*16,detailTask===1?-.6:detailTask>=3?Math.PI/2:0);
  if(detailTask>=3)miniScrew.position.set(-.015-.09*remaining,0,.003);else miniScrew.position.set(detailTask===1?-.01:0,.045+.09*remaining,.003);
  miniRenderer.render(miniScene,miniCamera);$('detail-state').textContent=t<1?'Symbolsk innfesting …':'Bevegelsen er ferdig';
 }
}
const requested=new URLSearchParams(location.search).get('oppgave');const initial=requested!==null&&/^[0-4]$/.test(requested)?Number(requested):0;
$('loading').remove();selectTask(initial);requestAnimationFrame(frame);
