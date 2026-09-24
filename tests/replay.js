// Local-only browser input replay. Uses the actual event handlers and frame loop.
const api=window.Wheelbarrow,canvas=document.querySelector('#game'),pressed=new Set();
const mode=new URLSearchParams(location.search).get('replay');
const panel=document.createElement('output');panel.id='replay-result';panel.style.cssText='position:fixed;left:50%;top:90px;transform:translateX(-50%);padding:10px 18px;background:#20352c;color:#fff7d8;font:12px monospace;z-index:5';document.body.append(panel);
function keys(next){for(let k of pressed)if(!next.includes(k)){window.dispatchEvent(new KeyboardEvent('keyup',{key:k}));pressed.delete(k);}for(let k of next)if(!pressed.has(k)){window.dispatchEvent(new KeyboardEvent('keydown',{key:k}));pressed.add(k);}}
function mouse(x,y){const r=canvas.getBoundingClientRect();canvas.dispatchEvent(new PointerEvent('pointermove',{clientX:r.left+r.width*(x+1)/2,clientY:r.top+r.height*(y+1)/2,bubbles:true}));}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function drive(x,y){let start=performance.now();while(true){let c=api.getState().car,dist=Math.hypot(x-c.x,y-c.y);if(dist<12){keys([]);await wait(2000);return;}if(performance.now()-start>45000)throw Error('Waypoint timeout '+x+','+y);let a=Math.atan2(y-c.y,x-c.x)-c.a;while(a>Math.PI)a-=Math.PI*2;while(a< -Math.PI)a+=Math.PI*2;let next=[];if(Math.abs(a)>.05)next.push(a>0?'d':'a');if(Math.abs(a)<.25&&c.v<38)next.push('w');keys(next);await wait(16);}}
async function campaign(){
 for(let job=0;job<3;job++){api.selectLevel(job);mouse(0,0);if(api.getState().levelIndex!==job)throw Error('Job locked after completion');panel.textContent='RUNNING campaign: job '+(job+1);
 for(const [x,y] of api.getState().level.route){await drive(x,y);if(job===2&&x===795){keys(['e']);keys([]);await wait(500);}}
 keys([]);await wait(2200);mouse(0,-1);const start=performance.now();while(api.getState().delivered<6&&performance.now()-start<22000)await wait(100);mouse(0,0);const s=api.getState();if(s.delivered!==6||s.spills)throw Error('Job '+(job+1)+' delivered '+s.delivered+' spills '+s.spills);console.log('PASS campaign job '+(job+1)+' six delivered; zero spills');
 }panel.textContent='PASS campaign: all 3 jobs · 18/18 bricks · zero spills';api.toggle();
}
async function run(){if(mode==='campaign')return campaign();api.reset();mouse(0,0);panel.textContent='RUNNING: '+mode+' browser input replay';
 if(mode==='recovery'){keys(['w']);await wait(2500);keys(['w','d']);await wait(1500);keys([]);await wait(3000);if(api.getState().spills<1)throw Error('No spill');await drive(470,330);await drive(540,330);for(let i=0;i<6;i++){keys(['e']);keys([]);await wait(1500);}await drive(550,325);await drive(870,325);}
 else {await drive(270,550);await drive(900,550);}
 await drive(1070,330);keys([]);await wait(2500);mouse(0,-1);let start=performance.now();while(api.getState().delivered<6&&performance.now()-start<22000)await wait(100);mouse(0,0);
 const s=api.getState();if(s.delivered<4)throw Error('Only '+s.delivered+' delivered');if(mode!=='recovery'&&s.spills)throw Error('Cautious route spilled '+s.spills);panel.textContent='PASS '+mode+': '+s.delivered+'/6 delivered · '+s.spills+' spills · '+Math.round(s.elapsed)+' s';api.toggle();console.log(panel.textContent);
}
run().catch(e=>{keys([]);mouse(0,0);panel.textContent='FAIL: '+e.message;console.error(e);});
