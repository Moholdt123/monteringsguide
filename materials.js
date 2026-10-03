import * as THREE from 'three';
// Deterministic procedural surface textures, not photographs or technical measurements.
function texture(kind){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d');let seed=12345;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 if(kind==='wood'){
  ctx.fillStyle='#d4b88b';ctx.fillRect(0,0,512,256);
  for(let i=0;i<150;i++){const y=random()*256;ctx.strokeStyle=`rgba(102,67,30,${.07+random()*.16})`;ctx.lineWidth=.3+random()*1.6;ctx.beginPath();for(let x=0;x<=512;x+=8){const yy=y+Math.sin(x*.022+i)*(.6+random()*1.7);x?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}ctx.stroke();}
  for(let i=0;i<3;i++){const x=80+random()*350,y=40+random()*175;ctx.save();ctx.translate(x,y);ctx.scale(1,.38);for(let r=5;r<23;r+=3){ctx.strokeStyle='rgba(91,59,27,.15)';ctx.beginPath();ctx.ellipse(0,0,r*2,r,0,0,Math.PI*2);ctx.stroke();}ctx.restore();}
 }else if(kind==='end'){
  ctx.fillStyle='#ccb088';ctx.fillRect(0,0,512,256);for(let r=8;r<600;r+=7){ctx.strokeStyle='rgba(104,72,40,.17)';ctx.beginPath();ctx.ellipse(70,190,r,r*.72,.2,0,Math.PI*2);ctx.stroke();}
 }else{
  const base=kind==='membrane'?54:184;const pixels=ctx.createImageData(512,256);for(let i=0;i<pixels.data.length;i+=4){const n=base+(random()-.5)*(kind==='membrane'?35:45);pixels.data[i]=n;pixels.data[i+1]=n+3;pixels.data[i+2]=n+4;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);
  for(let i=0;i<700;i++){ctx.fillStyle=kind==='membrane'?'rgba(180,190,195,.1)':'rgba(75,91,100,.09)';ctx.beginPath();ctx.arc(random()*512,random()*256,random()*2+.4,0,Math.PI*2);ctx.fill();}
 }
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;return map;
}
export function createMaterialSurfaces(){const grain=texture('wood'),end=texture('end'),concrete=texture('concrete'),membrane=texture('membrane');const long=new THREE.MeshStandardMaterial({map:grain,color:0xffffff,roughness:.85,bumpMap:grain,bumpScale:.0009});const cut=new THREE.MeshStandardMaterial({map:end,color:0xffffff,roughness:.9});return {wood:[cut,cut,long,long,long,long],concrete:new THREE.MeshStandardMaterial({map:concrete,color:0xffffff,roughness:.95,bumpMap:concrete,bumpScale:.0018}),membrane:new THREE.MeshStandardMaterial({map:membrane,color:0xffffff,roughness:.98,bumpMap:membrane,bumpScale:.0005})};}
