import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createMaterialSurfaces } from './materials.js';
import { sillSteps, clamp, ease, snapLift, toolDepth } from './sill-steps.mjs';
const $=id=>document.getElementById(id), viewer=$('viewer');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true});}catch(error){$('loading').textContent='3D krever WebGL i en oppdatert nettleser.';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xd6e5eb);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;viewer.prepend(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.01,30),controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.minDistance=.25;controls.maxDistance=12;controls.maxPolarAngle=Math.PI*.8;
scene.add(new THREE.HemisphereLight(0xffffff,0x647e8a,2.4));const sun=new THREE.DirectionalLight(0xffffff,2.8);sun.position.set(2,5,3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-4,right:4,top:4,bottom:-4});sun.shadow.bias=-.0005;scene.add(sun);
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.7,...extra});
const surfaces=createMaterialSurfaces();
const concrete=mat(0xb5bec0),wood=mat(0xcfa877),rubber=mat(0x30373b),blue=mat(0x276e9a),yellow=mat(0xe4b549),steel=mat(0x89999f,{metalness:.75,roughness:.3}),teal=mat(0x147c69,{metalness:.5}),membraneMat=mat(0x343d44);
function box(w,h,d,m,x,y,z,parent=scene){const a=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;}
function cylinder(r,h,m,x,y,z,parent=scene){const a=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,24),m);a.position.set(x,y,z);a.castShadow=true;parent.add(a);return a;}
const floorBack=box(5,.25,.9,concrete,0,-.125,-.45),floorFront=box(5,.25,.9,concrete,0,-.125,.45);
const sill=new THREE.Group();scene.add(sill);const woodBack=box(4.2,.09,.06,wood,0,.057,-.03,sill),woodFront=box(4.2,.09,.06,wood,0,.057,.03,sill);
const membrane=box(4.2,.012,.145,membraneMat,0,.006,0);const roll=new THREE.Group();scene.add(roll);const rollBody=cylinder(.075,.145,membraneMat,0,0,0,roll);rollBody.rotation.x=Math.PI/2;const rollCore=cylinder(.024,.148,mat(0xae946c),0,0,0,roll);rollCore.rotation.x=Math.PI/2;
const tape=box(1,.006,.038,yellow,0,.007,.25),tapeCase=box(.11,.085,.065,yellow,-2.1,.05,.25),tapeGrip=box(.04,.07,.068,rubber,-2.1,.05,.25);
const ticks=new THREE.Group();scene.add(ticks);for(let i=0;i<=42;i++){const x=-2.1+i*.1;box(.004,.002,i%5===0?.025:.014,rubber,x,.012,.25,ticks);}
const chalkCase=new THREE.Group();scene.add(chalkCase);box(.12,.075,.09,blue,0,0,0,chalkCase);cylinder(.025,.004,rubber,0,.04,0,chalkCase);
const endpoints=new THREE.Group();scene.add(endpoints);for(const x of [-2.1,2.1]){box(.065,.002,.012,mat(0xc05542),x,.005,-.06,endpoints);box(.012,.002,.065,mat(0xc05542),x,.005,-.06,endpoints);}
function string(color){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(65*3),3));const line=new THREE.Line(g,new THREE.LineBasicMaterial({color}));scene.add(line);return line;}
const chalkString=string(0x376ccd),straightString=string(0xe4a934);
function updateString(line,length,lift,z,y=.012){const a=line.geometry.attributes.position;for(let i=0;i<65;i++){const t=i/64;a.setXYZ(i,-2.1+length*t,y+Math.sin(Math.PI*t)*lift,z);}a.needsUpdate=true;line.geometry.computeBoundingSphere();}
floorBack.material=surfaces.concrete;floorFront.material=surfaces.concrete;woodBack.material=surfaces.wood;woodFront.material=surfaces.wood;membrane.material=surfaces.membrane;rollBody.material=surfaces.membrane;
const chalkLine=box(4.2,.002,.008,mat(0x3274ca),0,.003,-.06);
const pegs=new THREE.Group();scene.add(pegs);for(const x of [-2.16,2.16]){cylinder(.008,.16,steel,x,.08,.08,pegs);}
const targetX=-.9;
const ccCenters=[-1.8,-1.2,-.6,0,.6,1.2,1.8],ccMarks=new THREE.Group();scene.add(ccMarks);
ccCenters.forEach(x=>{const mark=new THREE.Group();box(.004,.001,.10,rubber,x,.104,0,mark);const diagonal=box(.025,.001,.003,rubber,x+.018,.104,.025,mark);diagonal.rotation.y=-.5;ccMarks.add(mark);});
const pencil=new THREE.Group();scene.add(pencil);const pencilBody=cylinder(.007,.19,yellow,0,.1,0,pencil);const pencilTip=new THREE.Mesh(new THREE.ConeGeometry(.007,.02,12),rubber);pencilTip.rotation.z=Math.PI;pencilTip.position.y=-.005;pencil.add(pencilTip);pencil.rotation.z=-.30;
const fixingMarks=new THREE.Group();scene.add(fixingMarks);for(const x of [-1.65,-.9,.8,1.65]){box(.016,.002,.06,teal,x,.103,0,fixingMarks);box(.05,.002,.006,teal,x,.103,0,fixingMarks);}
// A narrow dark section illustrates the bore cavity without presenting its size as a specification.
const boreSection=box(.016,.23,.002,mat(0x354750),targetX,-.013,.001);const boreRim=new THREE.Mesh(new THREE.RingGeometry(.008,.014,24),rubber);boreRim.rotation.x=-Math.PI/2;boreRim.position.set(targetX,.103,0);scene.add(boreRim);
function tool(){const g=new THREE.Group();box(.1,.14,.1,blue,0,.21,0,g);box(.037,.09,.05,rubber,.025,.13,.075,g);box(.13,.055,.11,rubber,0,.10,.06,g);cylinder(.024,.045,rubber,0,.13,0,g);scene.add(g);return g;}
const drill=tool(),driver=tool();
const bit=new THREE.Group();drill.add(bit);cylinder(.006,.30,steel,0,-.035,0,bit);
const drillHelix=[];for(let i=0;i<=180;i++){const t=i/180;drillHelix.push(new THREE.Vector3(Math.cos(t*Math.PI*20)*.008,-.18+t*.25,Math.sin(t*Math.PI*20)*.008));}bit.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(drillHelix),180,.002,5,false),steel));
const screwdriverBit=cylinder(.004,.09,steel,0,.04,0,driver);
const screw=new THREE.Group();scene.add(screw);cylinder(.006,.16,teal,0,-.08,0,screw);const head=new THREE.Mesh(new THREE.CylinderGeometry(.017,.017,.009,6),teal);screw.add(head);const washer=cylinder(.022,.003,steel,0,-.006,0,screw);
const screwHelix=[];for(let i=0;i<=240;i++){const t=i/240;screwHelix.push(new THREE.Vector3(Math.cos(t*Math.PI*28)*.009,-.015-t*.14,Math.sin(t*Math.PI*28)*.009));}screw.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(screwHelix),240,.0015,5,false),teal));
const dust=new THREE.Group();scene.add(dust);const dustMat=mat(0xa6afa9);for(let i=0;i<30;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.003+(i%3)*.001,6,5),dustMat);dust.add(m);}

let step=0,progress=0,playing=false,all=false,waitUntil=null,last=performance.now(),cameraTween=null,miniRenderer=null,miniCamera=null;
function cameraFor(index,mini=false){if(index>=7)return {pos:new THREE.Vector3(targetX+.36,.38,.65),target:new THREE.Vector3(targetX,.075,0)};if(index===6)return {pos:new THREE.Vector3(2.7,.38,1.2),target:new THREE.Vector3(0,.08,0)};return {pos:new THREE.Vector3(3.4,2.7,4.3),target:new THREE.Vector3(0,.10,0)};}
function moveCamera(){if(!$('auto-zoom').checked)return;const view=cameraFor(step);cameraTween={start:performance.now(),pos:camera.position.clone(),target:controls.target.clone(),end:view};}
function overview(){cameraTween=null;camera.position.set(3.4,2.7,4.3);controls.target.set(0,.1,0);controls.update();}
overview();controls.addEventListener('start',()=>{cameraTween=null;});
function sceneState(){
 const t=ease(progress),inDetail=step>=7,cut=inDetail&&$('cutaway').checked;
 floorFront.visible=!cut;woodFront.visible=!cut;
 sill.visible=step>=4;sill.position.set(0,step===4?(1-t)*.45:0,step===4?(1-t)*.2:0);
 membrane.visible=step>=3;if(step===3){membrane.scale.x=Math.max(.001,t);membrane.position.x=-2.1+2.1*t;}else{membrane.scale.x=1;membrane.position.x=0;}
 roll.visible=step===3&&progress<1;roll.position.set(-2.1+4.2*t,.09,0);roll.rotation.z=-t*28;
 tape.visible=step===0;tapeCase.visible=step===0;tapeGrip.visible=step===0;ticks.visible=step===0;
 tape.scale.x=Math.max(.001,4.2*t);tape.position.x=-2.1+2.1*t;ticks.children.forEach((m,i)=>m.visible=i/42<=t);
 endpoints.visible=step<=3;chalkCase.visible=step===1||step===2;
 chalkCase.position.set(step===1?-2.1+4.2*t:2.1,.04,-.06);
 chalkString.visible=step===1||step===2;updateString(chalkString,step===1?4.2*t:4.2,step===2?snapLift(progress):0,-.06);
 chalkLine.visible=step>2||(step===2&&progress>=.47);
 straightString.visible=step===6;pegs.visible=step===6;updateString(straightString,step===6?4.2*t:4.2,0,.08,.16);
 fixingMarks.visible=inDetail;drill.visible=step===7&&progress<.95;driver.visible=step===8&&progress<.95;screw.visible=step===8;boreRim.visible=inDetail;
 ccMarks.visible=step>=5;pencil.visible=step===5&&progress<1;
 const marking=progress*ccCenters.length,markIndex=Math.min(ccCenters.length-1,Math.floor(marking)),local=marking-markIndex;
 ccMarks.children.forEach((m,i)=>{m.visible=step>5||i<markIndex||(i===markIndex&&local>.25);});
 pencil.position.set(ccCenters[markIndex]+.004*Math.sin(local*Math.PI*2),.118+(local<.18||local>.8?.055:0),-.05+clamp((local-.18)/.62)*.10);
 const depth=step===7?toolDepth(progress):1;boreSection.visible=inDetail&&cut;boreSection.scale.y=Math.max(.001,depth);boreSection.position.y=.102-.115*depth;
 drill.position.set(targetX,.46-.40*toolDepth(progress),0);bit.rotation.y=progress*160;
 if(step===7&&progress>.78)drill.position.y+=ease((progress-.78)/.17)*.25;
 const down=toolDepth(progress);screw.position.set(targetX,.30-.19*down,0);screw.rotation.y=progress*100;driver.position.set(targetX,.30-.19*down,0);screwdriverBit.rotation.y=progress*100;
 if(step===8&&progress>.78)driver.position.y+=ease((progress-.78)/.17)*.30;
 dust.visible=step===7&&progress>.12&&progress<.78;
 dust.children.forEach((m,i)=>{const p=(progress*7+i/30)%1;m.position.set(targetX+Math.cos(i*2.4)*p*.065,.105+Math.sin(p*Math.PI)*.035,Math.sin(i*2.4)*p*.065);m.scale.setScalar(1-p);});
 $('sill-badge').textContent=cut?'3D · Snitt · Ikke i målestokk':'3D · Oversikt';
}
function sync(){const data=sillSteps[step];$('sill-title').textContent=data.title;$('sill-heading').textContent=data.title;$('sill-description').textContent=data.description;$('sill-stage').textContent='DETALJSTEG '+String(step+1).padStart(2,'0');$('sill-count').textContent=(step+1)+' / '+sillSteps.length;
 $('sill-phase').textContent=progress>=1?'Steget er ferdig':data.phase;$('sill-percent').textContent=Math.round(progress*100)+' %';$('sill-timeline').value=Math.round(progress*1000);
 $('sill-play').textContent=playing?'Pause':progress>=1?'Spill på nytt':progress>0?'Fortsett':'Spill dette steget';$('sill-all').textContent=all?'Stopp alle steg':'Spill alle detaljsteg';$('sill-prev').disabled=step===0;$('sill-next').disabled=step===sillSteps.length-1;
 document.querySelectorAll('[data-sill]').forEach(b=>{const active=Number(b.dataset.sill)===step;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$('sill-dialog-title').textContent=data.title;$('sill-mini-description').textContent=data.description;sceneState();}
function select(index,continueAll=false){if(!Number.isInteger(index)||index<0||index>=sillSteps.length)return;step=index;progress=0;playing=continueAll;all=continueAll;waitUntil=null;last=performance.now();moveCamera();sync();if(miniRenderer)resizeMini();}
document.querySelectorAll('[data-sill]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.sill))));
$('sill-play').addEventListener('click',()=>{if(playing)playing=false;else{if(progress>=1)progress=0;playing=true;last=performance.now();}waitUntil=null;sync();});
function replay(){progress=0;playing=true;last=performance.now();waitUntil=null;sync();}
$('sill-replay').addEventListener('click',replay);$('sill-mini-replay').addEventListener('click',replay);
$('sill-all').addEventListener('click',()=>{if(all){all=false;playing=false;sync();}else select(0,true);});
$('sill-timeline').addEventListener('input',()=>{progress=Number($('sill-timeline').value)/1000;playing=false;all=false;waitUntil=null;sync();});
$('sill-prev').addEventListener('click',()=>select(step-1));$('sill-next').addEventListener('click',()=>select(step+1));$('sill-reset').addEventListener('click',overview);$('cutaway').addEventListener('change',sceneState);$('auto-zoom').addEventListener('change',()=>{$('auto-zoom').checked?moveCamera():cameraTween=null;});
function resizeMini(){if(!miniRenderer)return;const w=$('sill-mini').clientWidth;if(!w)return;miniRenderer.setSize(w,300);miniCamera.aspect=w/300;miniCamera.updateProjectionMatrix();const view=cameraFor(step,true);miniCamera.position.copy(view.pos);miniCamera.lookAt(view.target);}
$('sill-detail').addEventListener('click',()=>{$('sill-dialog').showModal();if(!miniRenderer){miniRenderer=new THREE.WebGLRenderer({antialias:true});miniRenderer.setPixelRatio(Math.min(devicePixelRatio,2));miniRenderer.setClearColor(0xd6e5eb);miniCamera=new THREE.PerspectiveCamera(33,1,.01,30);$('sill-mini').append(miniRenderer.domElement);}resizeMini();replay();});$('sill-close').addEventListener('click',()=>$('sill-dialog').close());
$('sill-dialog').addEventListener('click',e=>{const r=$('sill-dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('sill-dialog').close();});
function resize(){if(!viewer.clientWidth||!viewer.clientHeight)return;renderer.setSize(viewer.clientWidth,viewer.clientHeight);camera.aspect=viewer.clientWidth/viewer.clientHeight;camera.updateProjectionMatrix();resizeMini();}new ResizeObserver(resize).observe(viewer);window.addEventListener('resize',resize);resize();
function frame(now){requestAnimationFrame(frame);if($('sill-animation').hidden){last=now;return;}const dt=Math.min((now-last)/1000,.1);last=now;
 if(playing){if(progress<1){progress=Math.min(1,progress+dt/sillSteps[step].duration);sync();}else if(all){if(waitUntil===null)waitUntil=now+650;if(now>=waitUntil){if(step<sillSteps.length-1)select(step+1,true);else{playing=false;all=false;sync();}}}else{playing=false;sync();}}
 if(cameraTween){const t=ease((now-cameraTween.start)/1200);camera.position.lerpVectors(cameraTween.pos,cameraTween.end.pos,t);controls.target.lerpVectors(cameraTween.target,cameraTween.end.target,t);if(t>=1)cameraTween=null;}
 controls.update();renderer.render(scene,camera);if(miniRenderer&&$('sill-dialog').open)miniRenderer.render(scene,miniCamera);
}
window.addEventListener('sill-intro-open',()=>{playing=false;all=false;sync();});
$('loading').remove();select(0);requestAnimationFrame(frame);
