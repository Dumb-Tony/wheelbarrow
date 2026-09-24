import * as T from 'three';
// Each destination has its own geometry; all reuse the established material palette.
export function buildDestination(level,h){
 const {box,rod,ellipsoid,mat,mats,textSign,pathMat}=h,root=new T.Group();root.name='destination-'+level.map;
 const B=(x,y,z,w,a,d,m=mats.wood,r=0)=>box(x,y,z,w,a,d,m,root,r);
 const R=(a,b,r,m=mats.wood)=>rod(a,b,r,m,root);
 const E=(x,y,z,w,a,d,m)=>ellipsoid(x,y,z,w,a,d,m,root);
 const sign=(text,x,y,z,w=125)=>{const m=textSign(text,w,26);m.position.set(x,y,z);m.rotation.y=-Math.PI/2;root.add(m);B(x,y/2,z,4,y,4,mats.wood);return m;};
 const gravel=pathMat.clone();gravel.color.set(level.map==='construction'?'#b2a18a':level.map==='village'?'#c5b697':'#a9ad70');
 for(const key of ['map','normalMap','roughnessMap']){gravel[key]=gravel[key].clone();gravel[key].repeat.set(40,32);}
 B(600,-4,325,2800,6,2200,gravel);
 const road=mat(level.map==='village'?'#998b74':'#c7ac77');
 let prev=[level.start.x,level.start.y];for(const point of level.route){const dx=point[0]-prev[0],dz=point[1]-prev[1];const p=B((point[0]+prev[0])/2,-.4,(point[1]+prev[1])/2,Math.hypot(dx,dz)+45,1,90,pathMat);p.rotation.y=-Math.atan2(dz,dx);prev=point;}
 for(let x=0;x<1250;x+=65){for(const z of [15,630]){B(x,25,z,5,50,5);if(x<1200){B(x+32,17,z,65,4,4);B(x+32,37,z,65,4,4);}}}
 function house(o,color,roofColor){const wall=mats.plaster.clone(),roof=mats.roof.clone();wall.color.set(color);roof.color.set(roofColor);const cx=o.x+o.w/2,cz=o.y+o.h/2;B(cx,60,cz,o.w,120,o.h,wall,2);B(cx,8,cz,o.w+4,16,o.h+4,mats.stone);for(const side of [-1,1]){const m=B(cx,138,cz+side*o.h*.26,o.w+18,8,o.h*.6,roof);m.rotation.x=side*.4;}for(let x=o.x+32;x<o.x+o.w-20;x+=64){B(x,60,o.y+o.h+2,33,40,4,mats.wood);B(x,60,o.y+o.h+5,26,32,2,mat('#8fa69b'));B(x,60,o.y+o.h+7,2,32,2,mats.cream??mats.plaster);}B(cx,40,o.y+o.h+6,34,80,5,mats.paint);}
 function tree(x,z){R([x,0,z],[x,110,z],6,mats.bark);for(let i=0;i<3;i++)E(x+(i-1)*21,125+i%2*18,z,34,40,32,mat(['#7d9451','#657e45','#93a15f'][i]));}
 for(let i=0;i<14;i++){tree(i*100-60,-120);if(i%2===0)tree(i*100,750);}
 if(level.map==='construction'){
  const yellow=mat('#d6a13b'),black=mat('#45493c');
  for(const o of level.obstacles){if(o.type==='foundation'){B(o.x+o.w/2,9,o.y+o.h/2,o.w,18,o.h,mats.stone);for(const x of [o.x+12,o.x+o.w-12])for(const z of [o.y+12,o.y+o.h-12]){B(x,90,z,11,180,11,mats.steel);R([x,180,o.y+12],[x,180,o.y+o.h-12],4,mats.steel);}for(const y of [70,140]){B(o.x+o.w/2,y,o.y+12,o.w,7,7,mats.wood);B(o.x+o.w/2,y,o.y+o.h-12,o.w,7,7,mats.wood);}for(let x=o.x+20;x<o.x+o.w-15;x+=28)B(x,21,o.y+o.h/2,20,6,o.h-20,mats.wood);}
   else{B(o.x+o.w/2,27,o.y+o.h/2,o.w,54,o.h,yellow,2);for(let z=o.y+10;z<o.y+o.h;z+=26)B(o.x-1,28,z,2,35,12,black);}}
  // A lattice tower crane, suspended hook, material racks and site office.
  for(const x of [910,934])for(const z of [85,109])B(x,175,z,6,350,6,yellow);
  for(let y=20;y<350;y+=30){R([910,y,85],[934,y+30,85],2,yellow);R([934,y,109],[910,y+30,109],2,yellow);B(922,y,97,30,3,30,yellow);}
  B(760,350,97,380,8,24,yellow);B(760,375,97,380,5,18,yellow);for(let x=580;x<960;x+=36)R([x,350,97],[x+36,375,97],2,yellow);
  R([590,350,97],[590,220,97],1.3,black);const hook=new T.Mesh(new T.TorusGeometry(7,2,6,12,Math.PI*1.6),mats.steel);hook.position.set(590,215,97);root.add(hook);
  B(980,55,535,130,110,85,mats.paint,2);B(980,113,535,140,8,95,mats.wood);sign('SITE OFFICE',910,82,535,100);
  for(let i=0;i<6;i++){B(250,4+i*7,110,115,6,30,mats.wood,1);B(310+i*23,11,530,18,22,24,yellow,1);}
  for(let x=480;x<680;x+=25)B(x,2,315,7,4,80,mats.wood,1);
  sign('TIMBER RECEIVING',1165,100,330,160);sign('STEADY THROUGH',220,68,460,110);
 }else if(level.map==='village'){
  for(const o of level.obstacles){if(o.type==='pub'||o.type==='houses'){house(o,o.type==='pub'?'#c7ac80':'#c2b49d',o.type==='pub'?'#795047':'#726950');if(o.type==='pub'){sign('THE TIPSY BADGER',o.x-3,100,o.y+o.h/2,170);for(let x=o.x+10;x<o.x+o.w;x+=30)B(x,94,o.y+o.h+22,28,5,34,mat(x%60?'#b46c4b':'#e4c797'));}}
   else{B(o.x+o.w/2,15,o.y+o.h/2,o.w,30,o.h,mats.stone,2);for(let x=o.x+12;x<o.x+o.w;x+=18)E(x,39,o.y+o.h/2,16,20,20,mats.leaf);}}
  for(let x=100;x<1180;x+=150){for(const z of [290,605]){R([x,0,z],[x,95,z],2,mats.dark);B(x,98,z,14,23,14,mat('#f6d699'),2);B(x,112,z,18,4,18,mats.dark);}}
  for(let x=140;x<460;x+=100){B(x,24,420,38,5,38,mats.wood,1);R([x,0,420],[x,24,420],3);for(const z of [392,448])B(x,12,z,30,4,12,mats.wood,1);}
  // The receiving porch is outside the playable bay, so Gary has room to get out.
  house({x:1185,y:50,w:150,h:190},'#e4cfa9','#7c5946');sign('GARY / HOME',1170,90,155,120);
  for(let i=0;i<13;i++){const x=120+i*83;R([x,165,30],[x+83,165,30],.5);const f=B(x+25,159,30,19,16,1,mat(i%2?'#c28a64':'#91a07a'));f.rotation.z=.15;}
  sign('LAST ORDERS',160,65,470,100);
 }else{
  for(const o of level.obstacles){if(o.type==='barn'){house(o,'#a56145','#786c4e');B(o.x+o.w/2,48,o.y+o.h+7,85,96,5,mats.wood);R([o.x+o.w/2-35,7,o.y+o.h+12],[o.x+o.w/2+35,90,o.y+o.h+12],3,mats.plaster);}
   else if(o.type==='hay'){for(let x=o.x+18;x<o.x+o.w;x+=36)for(let z=o.y+18;z<o.y+o.h;z+=36){B(x,18,z,33,36,33,mat('#c4a557'),3);B(x,19,z,3,38,35,mats.wood);}}
   else{B(o.x+o.w/2,-1,o.y+o.h/2,o.w,2,o.h,mat('#679c98',{roughness:.25,metalness:.25}));for(let z=o.y;z<o.y+o.h;z+=35){B(o.x-3,14,z,5,28,5);B(o.x+o.w+3,14,z,5,28,5);}}}
  for(let x=782;x<867;x+=10)B(x,1,552,9,4,135,mats.wood,1);
  for(const z of [490,620]){R([782,25,z],[866,25,z],2);for(const x of [782,866])B(x,14,z,4,28,4);}
  for(let x=100;x<340;x+=28)for(let z=80;z<220;z+=35){E(x,7,z,10,9,10,mat('#cc8841'));R([x,13,z],[x+2,21,z],1,mats.leaf);}
  const silo=new T.Mesh(new T.CylinderGeometry(40,40,160,18),mats.steel);silo.position.set(660,80,125);root.add(silo);E(660,163,125,42,20,42,mats.rim);
  B(1155,35,520,35,70,155,mats.wood);B(1140,90,520,110,8,175,mats.rim);sign('HARVEST MARKET',1140,96,500,150);sign('BRIDGE →',710,65,550,100);
 }
 for(const r of level.mud){const m=pathMat.clone();m.color.set('#705537');B(r.x+r.w/2,.5,r.y+r.h/2,r.w,1,r.h,m);}
 const b=level.bay;for(const z of [b.y,b.y+b.h])B(b.x+b.w/2,1,z,b.w,2,5,mat('#e4c67d'));for(const x of [b.x,b.x+b.w])B(x,1,b.y+b.h/2,5,2,b.h,mat('#e4c67d'));
 return root;
}

export function createCargo(kind,h){const {box,rod,ellipsoid,mats,mat}=h,g=new T.Group();
 if(kind==='lumber'){box(0,1,0,68,8,10,mats.wood,g,1);for(const x of [-25,25])box(x,5.2,0,2,.3,10,mats.dark,g);}
 if(kind==='pumpkin'){for(let i=0;i<9;i++){const a=i*Math.PI*2/9;ellipsoid(Math.cos(a)*9,18,Math.sin(a)*9,16,23,16,mat(i%2?'#bd7434':'#d59143'),g);}rod([0,39,0],[4,49,2],3,mats.bark,g);ellipsoid(8,41,2,9,1.3,5,mats.leaf,g);}
 if(kind==='gary'){const jacket=mat('#807a9f'),skin=mat('#dab58a'),trousers=mat('#546371');
  box(0,10,0,24,19,27,trousers,g,5);box(-3,27,0,23,28,30,jacket,g,6);
  for(const z of [-10,10]){rod([4,9,z],[28,5,z],5,trousers,g);box(31,3,z,13,8,10,mats.dark,g,3);rod([-1,32,z*1.6],[18,15,z*1.6],4,jacket,g);ellipsoid(19,14,z*1.6,4,5,4,skin,g);}
  ellipsoid(-4,50,0,11,13,11,skin,g);ellipsoid(-1,57,0,10,7,11,mat('#6e5741'),g);ellipsoid(-15,49,0,3,3,3,skin,g);for(const z of [-4,4])ellipsoid(-14,52,z,1,1.2,1,mat('#373f36'),g);box(-14,44,0,1,1,5,mats.dark,g,0);box(-6,29,-16,9,13,1,mats.plaster,g,1);
 }
 return g;
}
