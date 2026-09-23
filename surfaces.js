import * as T from 'three';
// Deterministic albedo, tangent-space normal and roughness maps. No downloaded art.
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
function hash(x,y){let n=Math.imul(x,374761393)+Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function noise(x,y){let ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);return (hash(ix,iy)*(1-u)+hash(ix+1,iy)*u)*(1-v)+(hash(ix,iy+1)*(1-u)+hash(ix+1,iy+1)*u)*v;}
const definitions={
 paint:['#58766a',.56,.32],wood:['#9d744a',.86,0],brick:['#b16a48',.94,0],stone:['#a8a38b',.94,0],plaster:['#d4bd98',.93,0],roof:['#86614b',.88,0],gravel:['#b0a085',.99,0],grass:['#6f8244',.98,0],fabric:['#b79a70',.96,0]
};
export function surface(kind,renderer){let [color,roughness,metalness]=definitions[kind],size=512,c=new T.Color(color).convertLinearToSRGB();let base=[c.r,c.g,c.b]; // encode base to sRGB for the canvas
 let height=new Float32Array(size*size),rgb=new Uint8ClampedArray(size*size*4),rough=new Uint8ClampedArray(rgb.length);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){let i=y*size+x,p=i*4,n=hash(x,y),broad=noise(x/43,y/43),mid=noise(x/8,y/8),h=.5,tone=.9,wear=0;
  if(kind==='wood'){let wave=Math.sin(y*.30+noise(x/95,y/16)*7+Math.sin(x*.022));h=.4+wave*.10+mid*.12;tone=.78+wave*.12+broad*.28;if(Math.abs(Math.sin(y*.12+noise(x/90,y/70)*2))<.045){h-=.2;tone*=.64;}}
  else if(kind==='paint'){let scratch=Math.abs(Math.sin(y*.86+x*.035+noise(x/40,y/55)*2))>.997&&mid>.56;wear=(broad>.70&&mid>.59)?1:0;h=.5+n*.045-(scratch?.13:0);tone=.82+broad*.26+(scratch?.18:0);}
  else if(kind==='fabric'){let weave=(Math.sin(x*1.57)+Math.sin(y*1.57))*.08;h=.5+weave;tone=.88+weave+broad*.19;}
  else if(kind==='grass'){h=.2+mid*.5+n*.2;tone=.62+broad*.48+mid*.18;if(Math.sin(x*.7+y*.17)>.93)tone+=.09;}
  else if(kind==='gravel'){h=Math.pow(mid,1.4)*.75+n*.08;tone=.65+mid*.57+broad*.2;}
  else {let pit=n>.968&&mid<.6;h=.42+mid*.17+(pit?-.25:n*.06);tone=.76+broad*.26+n*.1-(pit?.24:0);if(kind==='brick'&&noise(x/35,y/2)>.81){tone*=.73;h-=.12;}}
  height[i]=h;for(let k=0;k<3;k++)rgb[p+k]=clamp(base[k]*tone*(wear?[.97,.59,.33][k]:1))*255;rgb[p+3]=255;let rr=kind==='paint'?(wear?.96:.43+mid*.3):roughness-.12+mid*.18;rough[p]=rough[p+1]=rough[p+2]=clamp(rr)*255;rough[p+3]=255;
 }
 const normal=new Uint8ClampedArray(rgb.length);for(let y=0;y<size;y++)for(let x=0;x<size;x++){let i=y*size+x,p=i*4,dx=(height[y*size+(x+1)%size]-height[y*size+(x+size-1)%size])*2,dy=(height[((y+1)%size)*size+x]-height[((y+size-1)%size)*size+x])*2,l=Math.hypot(dx,dy,1);normal[p]=(-dx/l*.5+.5)*255;normal[p+1]=(dy/l*.5+.5)*255;normal[p+2]=(1/l*.5+.5)*255;normal[p+3]=255;}
 function tex(data,srgb=false){let can=document.createElement('canvas');can.width=can.height=size;can.getContext('2d').putImageData(new ImageData(data,size,size),0,0);let t=new T.CanvasTexture(can);if(srgb)t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
 return new T.MeshStandardMaterial({map:tex(rgb,true),normalMap:tex(normal),roughnessMap:tex(rough),roughness:1,metalness,normalScale:new T.Vector2(kind==='paint'?.35:.65,kind==='paint'?.35:.65)});
}

