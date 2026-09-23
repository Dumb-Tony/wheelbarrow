import * as T from 'three';
import { FullScreenQuad } from './vendor/render-effects.js';
// True multi-bounce GPU path tracing, deliberately isolated from active play.
export function setupPhoto({scene,camera,renderer,mergeGeometries}){
 const button=document.querySelector('#photo'),status=document.querySelector('#photo-status');
 let active=false,busy=false,tracer=null,snapshot=null,environment=null,owned=[],wasPaused=false,generation=0,lastSample=-1,denoise=null,quad=null;
 function cleanup(){tracer?.dispose();tracer=null;denoise?.dispose();quad?.dispose();denoise=quad=null;for(let g of owned)g.dispose();owned=[];environment?.dispose();environment=null;snapshot=null;}
 function exit(){generation++;active=false;busy=false;cleanup();document.body.classList.remove('photo-mode');button.textContent='Ray-traced view';status.hidden=true;if(!wasPaused&&window.Wheelbarrow.getState().paused)window.Wheelbarrow.toggle();}
 async function enter(){if(active){exit();return;}active=true;busy=true;wasPaused=window.Wheelbarrow.getState().paused;if(!wasPaused)window.Wheelbarrow.toggle();document.body.classList.add('photo-mode');button.textContent='Back to play';status.hidden=false;status.textContent='Preparing ray-traced photo… Your load is paused.';const token=++generation;
  try{
   const {WebGLPathTracer,GradientEquirectTexture}=await import('./vendor/raytrace.js');if(token!==generation)return;
   // Let the pause notice paint before preparing the acceleration structure.
   await new Promise(r=>setTimeout(r,60));if(token!==generation)return;
   scene.updateMatrixWorld(true);snapshot=scene.clone(true);snapshot.fog=null;snapshot.updateMatrixWorld(true);
   // The path tracer does not support InstancedMesh. Expand only the snapshot.
   const instances=[];snapshot.traverse(o=>{if(o.isInstancedMesh)instances.push(o);});
   for(let inst of instances){const gs=[],matrix=new T.Matrix4();for(let i=0;i<inst.count;i++){inst.getMatrixAt(i,matrix);matrix.premultiply(inst.matrixWorld);let g=inst.geometry.clone();g.applyMatrix4(matrix);gs.push(g);}const g=mergeGeometries(gs);for(let item of gs)item.dispose();if(g){owned.push(g);snapshot.add(new T.Mesh(g,inst.material));}inst.removeFromParent();}
   environment=new GradientEquirectTexture(256);environment.topColor.set('#c3dae1');environment.bottomColor.set('#74694c');environment.exponent=.65;environment.update();snapshot.environment=environment;snapshot.environmentIntensity=.65;
   tracer=new WebGLPathTracer(renderer);tracer.bounces=4;tracer.transmissiveBounces=4;tracer.filterGlossyFactor=.65;tracer.textureSize.set(512,512);tracer.renderScale=.85;tracer.tiles.set(2,2);tracer.minSamples=1;tracer.renderDelay=0;tracer.fadeDuration=150;tracer.setScene(snapshot,camera);
   denoise=new T.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{map:{value:null},pixel:{value:new T.Vector2()}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`
    uniform sampler2D map; uniform vec2 pixel; varying vec2 vUv;
    void main(){vec3 center=texture2D(map,vUv).rgb;vec3 sum=vec3(0.);float total=0.;
    for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec3 c=texture2D(map,vUv+vec2(float(x),float(y))*pixel).rgb;vec3 delta=c-center;float w=exp(-float(x*x+y*y)*.55-dot(delta,delta)*18.);sum+=c*w;total+=w;}
    gl_FragColor=vec4(sum/total,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`});quad=new FullScreenQuad(denoise);
   tracer.renderToCanvasCallback=(target,r)=>{denoise.uniforms.map.value=target.texture;denoise.uniforms.pixel.value.set(1/target.width,1/target.height);quad.render(r);};
   busy=false;lastSample=-1;
  }catch(error){console.error('Ray-traced view failed',error);cleanup();busy=false;status.textContent='Ray-traced view is unavailable on this device. Use Back to play to continue.';}
 }
 button.onclick=enter;
 window.addEventListener('keydown',e=>{if(active&&['escape','p','r'].includes(e.key.toLowerCase())){e.preventDefault();e.stopImmediatePropagation();let reset=e.key.toLowerCase()==='r';exit();if(reset)window.Wheelbarrow.reset();}},true);
 return {get active(){return active;},render(){if(tracer&&!busy){tracer.renderSample();const n=Math.floor(tracer.samples);if(n!==lastSample){lastSample=n;status.textContent=`Ray-traced photo · ${n} samples · load paused · Esc to return`;status.dataset.samples=String(n);}}else renderer.render(scene,camera);},resize(){if(tracer){tracer.updateCamera();tracer.reset();}},exit};
}
