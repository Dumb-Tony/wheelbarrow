import * as T from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { mergeGeometries } from './vendor/BufferGeometryUtils.js';

// All scenery and textures are generated here. Nothing is fetched from a CDN.
const canvas=document.querySelector('#game');
let renderer;
try { renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'}); }
catch(error){document.querySelector('#load-status').textContent='This garden needs WebGL 2. Please open it in a browser with graphics acceleration enabled.';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
const scene=new T.Scene();scene.background=new T.Color('#b5d2cb');scene.fog=new T.FogExp2('#b5caba',.00048);
const camera=new T.PerspectiveCamera(59,1,2,6000);
const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();
scene.environment=pmrem.fromScene(room,.04).texture;scene.environmentIntensity=.32;room.dispose();pmrem.dispose();
scene.add(new T.HemisphereLight('#dcebd7','#6a6c37',1.35));
const sun=new T.DirectionalLight('#ffe1a2',3.3);sun.position.set(-250,850,-320);sun.target.position.set(570,0,300);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-920,right:920,top:820,bottom:-820,near:10,far:2400});sun.shadow.bias=-.00015;sun.shadow.normalBias=.65;sun.shadow.radius=2;
scene.add(sun,sun.target);
let seed=4711;function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}function between(a,b){return a+rnd()*(b-a);}
const palette={sage:'#537866',rim:'#83a08a',dark:'#304c41',wood:'#aa7844',bark:'#675238',stone:'#b4ad88',cream:'#e8cfa3',brick:'#b76943',roof:'#97734f'};
function texture(base,kind,size=256){let c=document.createElement('canvas');c.width=c.height=size;let g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,size,size);
 for(let i=0;i<6000;i++){let a=between(.015,.13);g.fillStyle=rnd()>.5?`rgba(255,240,200,${a})`:`rgba(33,40,23,${a})`;let x=rnd()*size,y=rnd()*size;g.fillRect(x,y,kind==='wood'?between(8,90):between(1,4),kind==='wood'?between(.3,1.2):between(1,3));}
 if(kind==='metal')for(let i=0;i<75;i++){g.strokeStyle='rgba(225,222,185,.24)';g.lineWidth=.6;let x=rnd()*size,y=rnd()*size;g.beginPath();g.moveTo(x,y);g.lineTo(x+between(2,20),y+between(-3,3));g.stroke();}
 let t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;
}
const materialCache=new Map();
function mat(color,extra={}){if(!Object.keys(extra).length){if(!materialCache.has(color))materialCache.set(color,new T.MeshStandardMaterial({color,roughness:.85}));return materialCache.get(color);}return new T.MeshStandardMaterial({color,roughness:.85,...extra});}
const mats={paint:mat('#ffffff',{map:texture(palette.sage,'metal'),roughness:.5,metalness:.28}),rim:mat(palette.rim,{roughness:.36,metalness:.45}),steel:mat('#7d8370',{metalness:.7,roughness:.35}),dark:mat(palette.dark),wood:mat('#ffffff',{map:texture(palette.wood,'wood'),roughness:.78}),bark:mat(palette.bark),stone:mat('#ffffff',{map:texture('#bcb494','stone')}),plaster:mat('#ffffff',{map:texture('#dfc598','stone')}),roof:mat('#a78359'),rubber:mat('#313b32',{roughness:.96}),glove:mat('#cfa86b',{roughness:.91}),cuff:mat('#52674e'),soil:mat('#68533b'),terracotta:mat('#b87551'),leaf:mat('#5e7c43'),leafLight:mat('#8b9d52')};
const unit=new T.BoxGeometry(1,1,1),sphere=new T.IcosahedronGeometry(1,1),cylinder=new T.CylinderGeometry(1,1,1,10);
const flowerMats=['#dacb87','#c79aa3','#a29bb9','#f0dfac'].map(c=>mat(c)),flowerCenter=mat('#c99b42');
function mesh(geo,material,parent=scene,x=0,y=0,z=0){let m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(x,y,z,w,h,d,material,parent=scene,r=0){let g=r?new RoundedBoxGeometry(w,h,d,2,r):unit;let m=mesh(g,material,parent,x,y,z);if(!r)m.scale.set(w,h,d);return m;}
function ellipsoid(x,y,z,w,h,d,material,parent=scene){let m=mesh(sphere,material,parent,x,y,z);m.scale.set(w,h,d);return m;}
function rod(a,b,r,material,parent=scene){let av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av),m=mesh(cylinder,material,parent,...av.clone().add(bv).multiplyScalar(.5).toArray());m.scale.set(r,v.length(),r);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m;}
function textSign(text,w,h,color='#f7e7b9',background='#345b47'){let c=document.createElement('canvas');c.width=512;c.height=192;let g=c.getContext('2d');g.fillStyle=background;g.fillRect(0,0,512,192);g.strokeStyle='#d2c591';g.lineWidth=3;g.strokeRect(12,12,488,168);g.fillStyle=color;g.font='bold 47px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,96);let tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,roughness:.9,side:T.DoubleSide}));}

// A textured lawn and broad gravel paths, with the original collision footprint.
const groundTex=texture('#7f9153','grass',512);groundTex.repeat.set(32,32);
const ground=mesh(new T.PlaneGeometry(5000,5000),mat('#ffffff',{map:groundTex}),scene,600,-2,320);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
const pathTex=texture('#c6b68c','stone',512);pathTex.repeat.set(4,1);
const pathMat=mat('#ffffff',{map:pathTex});
function pathSegment(a,b,width){let dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);let m=box((a[0]+b[0])/2,-.1,(a[1]+b[1])/2,len+width/2,2,width,pathMat);m.rotation.y=-Math.atan2(dz,dx);m.castShadow=false;}
pathSegment([65,325],[1050,325],104);pathSegment([145,325],[270,550],105);pathSegment([270,550],[900,550],105);pathSegment([900,550],[1070,330],105);
pathSegment([1070,220],[1070,435],165);
// Pebble and grass batches keep the detailed garden inexpensive to render.
const pebblePositions=[];for(let i=0;i<1800;i++){let x=between(40,1160),z=between(45,585);let shortcut=z>275&&z<375;let wide=z>505&&z<598;let ends=x<305||x>860;if(shortcut||wide||ends)pebblePositions.push([x,between(.1,1),z,between(.6,2)]);}
function instances(geo,material,list){let im=new T.InstancedMesh(geo,material,list.length),dummy=new T.Object3D();for(let i=0;i<list.length;i++){const [x,y,z,s,s2,s3]=list[i];dummy.position.set(x,y,z);dummy.scale.set(s,s2??s,s3??s);dummy.rotation.y=rnd()*6.28;dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);}im.receiveShadow=true;im.castShadow=false;scene.add(im);return im;}
instances(sphere,mat('#d7c9a0'),pebblePositions);
const grasses=[];for(let i=0;i<4100;i++){let x=between(-280,1480),z=between(-330,980);if(x>25&&x<1180&&z>42&&z<606)continue;grasses.push([x,between(1,4),z,between(1,2),between(3,9),between(1,2)]);}instances(new T.ConeGeometry(1,1,3),mat('#829745'),grasses);

// Timber perimeter fence and an open gate at the delivery end.
function fence(a,b){let len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(len/65);for(let i=0;i<=n;i++){let x=a[0]+(b[0]-a[0])*i/n,z=a[1]+(b[1]-a[1])*i/n;box(x,27,z,5,54,5,mats.wood,scene,1);let cap=mesh(new T.ConeGeometry(4.4,6,4),mats.wood,scene,x,57,z);cap.rotation.y=Math.PI/4;}for(let y of [20,42])rod([a[0],y,a[1]],[b[0],y,b[1]],2.1,mats.wood);}
fence([-25,10],[1235,10]);fence([-25,633],[1235,633]);fence([1235,10],[1235,250]);fence([1235,420],[1235,633]);fence([-25,10],[-25,633]);

// North greenhouse: painted ironwork, glass panes and planted benches inside.
const glass=mat('#bad9b1',{transparent:true,opacity:.22,roughness:.22,metalness:.1,side:T.DoubleSide,depthWrite:false});
box(590,5,182.5,360,10,145,mats.stone,scene,2);
for(let x=410;x<=770;x+=45){for(let z of [110,255])rod([x,8,z],[x,108,z],2,mats.rim);rod([x,108,110],[x,150,182.5],2,mats.rim);rod([x,150,182.5],[x,108,255],2,mats.rim);}
for(let z of [110,255])for(let y of [12,61,108])rod([410,y,z],[770,y,z],1.7,mats.rim);
rod([410,150,182.5],[770,150,182.5],2.5,mats.rim);
for(let x=410;x<770;x+=45){for(let z of [110,255])box(x+22.5,61,z,41,91,1,glass);for(let side of [-1,1]){let roof=box(x+22.5,129,182.5+side*36.25,41,1,82,glass);roof.rotation.x=side*.525;}}
for(let x of [410,770]){box(x,55,182.5,1,95,140,glass);rod([x,0,157],[x,105,157],2,mats.rim);rod([x,0,208],[x,105,208],2,mats.rim);}
const greenhouseSign=textSign('THE GLASSHOUSE',115,31);greenhouseSign.position.set(408,88,182.5);greenhouseSign.rotation.y=-Math.PI/2;scene.add(greenhouseSign);
for(let z of [139,225]){box(590,35,z,310,5,21,mats.wood);for(let x=455;x<755;x+=45){box(x,19,z,4,34,4,mats.wood);pot(x,41,z,7,true);}}

// South potting cottage with siding, roof courses, windows, gutter and tools.
box(590,50,447.5,360,100,105,mats.plaster,scene,3);box(590,8,447.5,368,16,111,mats.stone,scene,2);
for(let x of [409,771]){let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([x,98,395,x,141,447.5,x,98,500],3));g.computeVertexNormals();mesh(g,new T.MeshStandardMaterial({map:mats.plaster.map,side:T.DoubleSide,roughness:.9}));}
for(let x=414;x<770;x+=29){box(x,50,393,1.4,83,2,mat('#c7ac80'));}
for(let z of [397,498])box(590,98,z,369,8,6,mats.wood);
for(let side of [-1,1]){const roof=box(590,121,447.5+side*31,389,7,76,mats.roof);roof.rotation.x=side*.56;for(let x=400;x<780;x+=24)for(let j=0;j<4;j++){let zz=447.5+side*(9+j*16),yy=141-j*10;let tile=box(x+11,yy,zz,22,3,21,mat(j%2?'#a8865d':'#aa8b63'),scene,1);tile.rotation.x=side*.56;}}
rod([391,107,387],[785,107,387],3,mats.dark);rod([783,105,387],[783,4,387],2.2,mats.dark);
for(let x of [479,686]){box(x,59,392,49,48,4,mats.wood,scene,1);box(x,59,389,40,39,2,mat('#7caaa2',{roughness:.35,metalness:.2}));box(x,59,387,3,41,2,mats.cream??mats.plaster);box(x,59,387,42,3,2,mats.plaster);box(x,33,384,58,6,12,mats.wood);box(x,29,380,51,13,15,mats.terracotta);for(let xx=-20;xx<=20;xx+=10)flower(x+xx,37,380,13);}
box(591,40,392,56,80,5,mats.dark,scene,2);for(let x=569;x<618;x+=8)box(x,40,388,5.5,75,2,mats.paint);ellipsoid(610,39,384,2,2,2,mats.steel);
const cottageSign=textSign('POTTING & PLANTING',127,23);cottageSign.position.set(590,92,386);cottageSign.rotation.y=Math.PI;scene.add(cottageSign);
box(735,147,462,23,61,25,mats.plaster,scene,2);box(735,179,462,29,6,31,mats.stone,scene,1);
// A crate, watering can, sacks and a garden fork nestled against the shed.
box(737,17,381,39,34,24,mats.wood,scene,1);for(let y=7;y<32;y+=10)box(737,y,367,41,2,2,mats.dark);for(let z of [372,388])box(736,33,z,43,3,3,mats.wood);
for(let i=0;i<3;i++)ellipsoid(425+i*13,10,379,10,12,8,mat('#bfa67a'));
const can=mesh(new T.CylinderGeometry(9,10,18,16),mats.paint,scene,727,44,378);rod([730,42,378],[748,52,378],2,mats.paint);let handle=mesh(new T.TorusGeometry(10,1.5,5,18),mats.rim,scene,718,48,378);handle.rotation.y=Math.PI/2;
rod([657,8,383],[650,77,390],2,mats.wood);for(let i=0;i<4;i++)rod([653+i*3,14,383],[653+i*3,1,383],.75,mats.steel);rod([653,14,383],[662,14,383],1,mats.steel);

// Raised planting beds, flowers and shrubs live beyond the navigable yard edges.
function pot(x,y,z,r,plant=false){mesh(new T.CylinderGeometry(r,r*.72,r*1.4,12),mats.terracotta,scene,x,y+r*.7,z);mesh(new T.TorusGeometry(r,.8,5,16),mats.terracotta,scene,x,y+r*1.4,z).rotation.x=Math.PI/2;mesh(new T.CylinderGeometry(r*.85,r*.85,1,12),mats.soil,scene,x,y+r*1.4,z);if(plant){for(let i=0;i<5;i++){let a=i*1.25;ellipsoid(x+Math.cos(a)*r*.5,y+r*2,z+Math.sin(a)*r*.5,r*.8,r*1.1,r*.65,mats.leaf);}}}
function flower(x,y,z,h){rod([x,y,z],[x,y+h,z],.5,mats.leaf);let material=flowerMats[Math.floor(rnd()*flowerMats.length)];for(let i=0;i<5;i++){let a=i*1.256;ellipsoid(x+Math.cos(a)*2.4,y+h,z+Math.sin(a)*2.4,2.6,1.3,2.6,material);}ellipsoid(x,y+h+1,z,1.8,1.3,1.8,flowerCenter);}

for(let x=140;x<1150;x+=110){for(let z of [-45,686]){box(x,7,z,85,14,43,mats.wood,scene,2);box(x,13,z,79,2,37,mats.soil);for(let j=0;j<8;j++){let xx=x+between(-31,31),zz=z+between(-13,13);ellipsoid(xx,20,zz,8,10,7,mats.leaf);flower(xx,20,zz,between(9,18));}}}
for(let [x,z]of [[382,130],[382,226],[800,125],[800,230],[1010,190],[1140,465]])pot(x,0,z,13,true);

// Stacked stepping stones and rough boards make the risky route legible.
for(let x=380;x<820;x+=28){let timber=box(x,2.5,325,8,5,83,mats.wood,scene,1);timber.rotation.y=between(-.015,.015);for(let z of [292,357])ellipsoid(x,5.5,z,1, .4,1,mats.steel);}
for(let i=0;i<12;i++){let x=322+(i%3)*22,z=146+Math.floor(i/3)*17;let stone=box(x,4,z,20,8,15,mats.stone,scene,2);stone.rotation.y=between(-.15,.15);}

// The destination is an in-world delivery apron with a timber arch.
for(let z of [230,425])for(let x=995;x<1160;x+=19)box(x,1.5,z,14,3,6,mats.stone,scene,1);
for(let x of [990,1160])for(let z=235;z<425;z+=19)box(x,1.5,z,6,3,14,mats.stone,scene,1);
for(let z of [230,425]){box(1173,69,z,10,138,10,mats.wood,scene,2);ellipsoid(1173,142,z,8,6,8,mats.wood);}
box(1173,130,327.5,10,12,208,mats.wood,scene,1);
const deliverySign=textSign('BRICK DELIVERY',153,34);deliverySign.position.set(1166,128,327.5);deliverySign.rotation.y=-Math.PI/2;scene.add(deliverySign);
// Hanging pennants point toward the receiving bay.
for(let i=0;i<9;i++){let z=241+i*21;let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([1165,112,z,1165,112,z+14,1165,94,z+7],3));geo.computeVertexNormals();mesh(geo,new T.MeshStandardMaterial({color:i%2?'#dec883':'#637e51',side:T.DoubleSide}),scene);}
for(let i=0;i<4;i++){box(1121,3+i*5,360,43,4,31,mats.wood,scene,1);}

// Direction boards distinguish the peaceful loop from the rough shortcut.
function routeSign(x,z,text,angle){rod([x,0,z],[x,64,z],2.5,mats.wood);const s=textSign(text,80,22);s.position.set(x+Math.sin(angle)*3,56,z+Math.cos(angle)*3);s.rotation.y=angle;scene.add(s);}
routeSign(283,240,'ROUGH WAY',-Math.PI/2);routeSign(160,444,'GARDEN PATH →',-Math.PI/2);

// Trees frame the scene. The shapes have soft facets and several canopy tones.
const leafTones=['#637e47','#799451','#90a15b','#547342'].map(c=>mat(c));
function tree(x,z,scale=1){let height=between(150,210)*scale;rod([x,0,z],[x+7*scale,height*.78,z],7*scale,mats.bark);
 for(let i=0;i<5;i++){let a=i*1.25,dx=Math.cos(a)*32*scale,dz=Math.sin(a)*32*scale;rod([x,height*.48,z],[x+dx,height*.83,z+dz],3*scale,mats.bark);ellipsoid(x+dx,height+between(-12,22)*scale,z+dz,between(35,47)*scale,between(33,49)*scale,between(34,48)*scale,leafTones[i%4]);}}
for(let i=0;i<21;i++){let x=-180+i*80;tree(x,-155-between(0,130),between(.8,1.4));if(i%2===0)tree(x,800+between(0,180),between(.8,1.3));}
for(let i=0;i<6;i++)tree(1410+between(0,140),i*140-100,between(1,1.6));
for(let i=0;i<24;i++){let x=between(-700,2200),z=i%2?-950-between(0,500):1500+between(0,600);ellipsoid(x,25,z,between(200,450),between(100,280),between(220,420),mat(i%2?'#94aa73':'#a1b480'));}
for(let i=0;i<24;i++){let x=between(-800,2400),z=between(-1900,1900);ellipsoid(x,between(530,650),z,between(80,150),between(15,25),between(45,80),mat('#e8ead6'));}

// Batch static scenery by material: detailed foliage without thousands of draws.
scene.updateMatrixWorld(true);const batches=new Map(),toRemove=[];
scene.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&!o.material.transparent&&o.geometry.attributes.normal&&o.geometry.attributes.uv){let k=o.material.uuid;if(!batches.has(k))batches.set(k,{material:o.material,geos:[],cast:false});let b=batches.get(k),g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);if(g.index)g=g.toNonIndexed();b.geos.push(g);b.cast ||= o.castShadow;toRemove.push(o);}});
for(let o of toRemove)o.removeFromParent();for(let b of batches.values()){let g=mergeGeometries(b.geos);if(g){let m=mesh(g,b.material);m.castShadow=b.cast;}for(let g of b.geos)g.dispose();}

// The player rig. Local X goes forward, local Z goes right, local Y is up.
const rig=new T.Group();scene.add(rig);const tray=new T.Group();rig.add(tray);tray.position.y=35;
// A tapered steel basin, with curved corners on floor, lip and rolled edge.
box(0,-2,0,72,4,47,mats.paint,tray,2);
function basinWall(points){let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();const m=mesh(g,new T.MeshStandardMaterial({map:mats.paint.map,roughness:.52,metalness:.3,side:T.DoubleSide}),tray);return m;}
basinWall([[-36,0,-23.5],[36,0,-23.5],[44,15,-34],[-44,15,-34]]);basinWall([[36,0,23.5],[-36,0,23.5],[-44,15,34],[44,15,34]]);
basinWall([[-36,0,23.5],[-36,0,-23.5],[-44,15,-34],[-44,15,34]]);basinWall([[36,0,-23.5],[36,0,23.5],[44,15,34],[44,15,-34]]);
const rimCurve=new T.CatmullRomCurve3([new T.Vector3(-42,15,-34),new T.Vector3(42,15,-34),new T.Vector3(45,15,-30),new T.Vector3(45,15,30),new T.Vector3(42,15,34),new T.Vector3(-42,15,34),new T.Vector3(-45,15,30),new T.Vector3(-45,15,-30)],true,'catmullrom',.05);
mesh(new T.TubeGeometry(rimCurve,90,1.5,6,true),mats.rim,tray);
// Pressed ribs, screw heads and a few scratches in the floor.
for(let z of [-13,0,13])box(0,.25,z,59,.5,1,mats.rim,tray,.2);
for(let x of [-30,30])for(let z of [-19,19]){ellipsoid(x,1,z,1.1,.45,1.1,mats.steel,tray);box(x,1.4,z,1.3,.12,.2,mats.dark,tray);}
for(let i=0;i<17;i++){const scratch=box(between(-30,30),.45,between(-20,20),between(2,10),.12,.2,mats.rim,tray);scratch.rotation.y=between(-.2,.2);}
for(let z of [-26,26]){rod([-100,-2,z],[-28,-8,z],2.7,mats.wood,tray);rod([-100,-2,z],[-82,-4,z],3.1,mats.rubber,tray);rod([-22,-9,z],[32,-24,0],1.7,mats.steel,tray);rod([-22,-8,z],[-28,-32,z],1.8,mats.steel,tray);}
const wheel=mesh(new T.TorusGeometry(11.5,4.1,9,28),mats.rubber,rig,36,15,0);wheel.rotation.y=0;const hub=mesh(new T.CylinderGeometry(8.3,8.3,7,18),mats.rim,rig,36,15,0);hub.rotation.x=Math.PI/2;
rod([36,15,-12],[36,15,12],1.7,mats.steel,rig);
for(let i=0;i<8;i++){let a=i*Math.PI/4;rod([36,15,4],[36+Math.cos(a)*8,15+Math.sin(a)*8,4],.7,mats.steel,rig);}
// Rounded work gloves and sleeves read as hands rather than blocks.
for(let side of [-1,1]){let z=side*26;box(-68,7,z,17,11,12,mats.glove,tray,4);for(let i=0;i<4;i++)box(-62+i*.3,4,z-4.2+i*2.8,8,8,2.3,mats.glove,tray,1);let thumb=box(-65,4,z-side*7,10,5,5,mats.glove,tray,2);thumb.rotation.y=side*.45;box(-80,6,z,13,12,13,mats.cuff,tray,3);rod([-85,6,z],[-118,-10,z*1.48],6,mats.cuff,tray);for(let j=-1;j<=1;j++)box(-69,12.5,z+j*2.2,9,.2,.25,mats.wood,tray);}

// Each brick is a separate mesh, with bevels, rough material and three holes.
const brickTex=texture('#bf744e','stone',256),brickMat=mat('#ffffff',{map:brickTex,roughness:.95}),holeMat=mat('#744c32');
const brickMeshes=[];for(let i=0;i<6;i++){let g=new T.Group();box(0,0,0,13,9,10,brickMat,g,.85);for(let x of [-4,0,4]){let h=mesh(new T.CylinderGeometry(1.2,1.05,.3,10),holeMat,g,x,4.48,0);h.castShadow=false;}g.rotation.y=(i%2-.5)*.04;scene.add(g);brickMeshes.push(g);}

const map=document.querySelector('#map'),mc=map.getContext('2d'),els={delivered:document.querySelector('#delivered'),time:document.querySelector('#time'),spills:document.querySelector('#spills'),message:document.querySelector('#message'),bearing:document.querySelector('#bearing'),paused:document.querySelector('#paused'),dot:document.querySelector('#balance-dot'),bars:[...document.querySelectorAll('.progress i')]};
document.querySelector('#resume').onclick=()=>window.Wheelbarrow.toggle();
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();
let lastMap=-1,lastHUD=-1,fpsStart=performance.now(),frames=0;
function mapDraw(s){mc.clearRect(0,0,240,140);mc.fillStyle='#718562';mc.fillRect(0,0,240,140);mc.save();mc.translate(5,5);mc.scale(.19,.2);mc.strokeStyle='#d9c9a0';mc.lineWidth=30;mc.lineJoin='round';mc.beginPath();mc.moveTo(145,325);mc.lineTo(270,550);mc.lineTo(900,550);mc.lineTo(1070,330);mc.stroke();mc.strokeStyle='#adad7b';mc.lineWidth=20;mc.beginPath();mc.moveTo(145,325);mc.lineTo(1070,325);mc.stroke();mc.fillStyle='#345c46';for(let b of s.blocks)mc.fillRect(b.x,b.y,b.w,b.h);mc.fillStyle='#e7c26f';mc.fillRect(990,230,170,195);for(let b of s.cargo)if(b.state==='ground'){mc.fillStyle='#e9a477';mc.beginPath();mc.arc(b.x,b.y,13,0,7);mc.fill();}mc.translate(s.car.x,s.car.y);mc.rotate(s.car.a);mc.fillStyle='#fff5d6';mc.beginPath();mc.moveTo(25,0);mc.lineTo(-18,15);mc.lineTo(-12,0);mc.lineTo(-18,-15);mc.closePath();mc.fill();mc.restore();}
window.renderGame=s=>{
 const {car,pitch,roll,cargo}=s;rig.position.set(car.x,0,car.y);rig.rotation.y=-car.a;
 // Match physics: positive pitch lowers the nose; positive roll lowers the right.
 tray.rotation.order='XZY';tray.rotation.x=-roll;tray.rotation.z=-pitch;
 for(let i=0;i<6;i++){let b=cargo[i],m=brickMeshes[i];if(b.state==='tray'){if(m.parent!==tray)tray.add(m);m.position.set(b.x,b.z-1.5,b.y);}else{if(m.parent!==scene)scene.add(m);m.position.set(b.x,Math.max(4.5,b.z),b.y);}}
 camera.position.set(car.x-Math.cos(car.a)*130,106,car.y-Math.sin(car.a)*130);camera.lookAt(car.x+Math.cos(car.a)*300,0,car.y+Math.sin(car.a)*300);
 renderer.render(scene,camera);
 const now=performance.now();frames++;if(now-fpsStart>1000){canvas.dataset.fps=String(Math.round(frames*1000/(now-fpsStart)));canvas.dataset.drawCalls=String(renderer.info.render.calls);frames=0;fpsStart=now;}if(now-lastHUD>90){lastHUD=now;els.delivered.innerHTML=s.delivered+'<span>/6</span>';els.time.textContent=Math.floor(s.elapsed/60)+':'+String(Math.floor(s.elapsed%60)).padStart(2,'0');els.spills.textContent=s.spills;els.paused.hidden=!s.paused;els.bars.forEach((e,i)=>e.classList.toggle('done',i<s.delivered));els.dot.style.transform=`translate(${s.mouseX*22}px,${s.mouseY*22}px)`;
 let b=Math.atan2(325-car.y,1070-car.x)-car.a;while(b>Math.PI)b-=Math.PI*2;while(b< -Math.PI)b+=Math.PI*2;els.bearing.textContent=(Math.abs(b)<.25?'↑':b>0?'→':'←')+' DELIVERY  ·  '+Math.round(Math.hypot(1070-car.x,325-car.y)/10)+' m';
 const near=cargo.some(b=>b.state==='ground'&&Math.hypot(b.x-car.x,b.y-car.y)<90),bay=car.x>990&&car.x<1160&&car.y>230&&car.y<425;
 els.message.textContent=s.delivered===6?'All six delivered. A lovely bit of work. R to try again.':near?'Press E to pick up a nearby brick.':s.elapsed<s.noticeUntil?s.notice:bay?'Stop, then move your mouse to the top center to unload.':s.won?'Job done! You can still bring the remaining bricks.':'Small corrections. Keep the bricks centered and enjoy the long way round.';
 }if(now-lastMap>100){mapDraw(s);lastMap=now;}
};
// A small diagnostic snapshot is read-only and useful for checking rendering cost.
window.gardenDiagnostics=()=>({drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,version:T.REVISION});
window.Wheelbarrow.ready();
if(location.hostname==='localhost'&&new URLSearchParams(location.search).has('replay'))import('./tests/replay.js');

