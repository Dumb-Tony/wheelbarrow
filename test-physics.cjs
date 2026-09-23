const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('index.html','utf8').split('<script>')[1].split('</script>')[0];
const el={textContent:'',getContext:()=>({}),addEventListener:()=>{}};const c={document:{querySelector:()=>el},window:{addEventListener:()=>{}},performance:{now:()=>0},requestAnimationFrame:()=>{}};vm.createContext(c);vm.runInContext(source,c);
const run=s=>vm.runInContext(s,c);
run(`function tick(n){for(let i=0;i<n;i++)step(1/120)}
function drive(x,y){for(let i=0;i<20000;i++){let dx=x-car.x,dy=y-car.y,d=Math.hypot(dx,dy);if(d<12){keys.clear();tick(240);return;}let a=Math.atan2(dy,dx)-car.a;while(a>Math.PI)a-=2*Math.PI;while(a< -Math.PI)a+=2*Math.PI;keys.clear();if(Math.abs(a)>.05)keys.add(a>0?'d':'a');if(Math.abs(a)<.25&&car.v<38)keys.add('w');step(1/120);}throw Error('waypoint timeout')}
function route(){drive(270,550);drive(900,550);drive(1070,330);keys.clear();tick(360);mouseY=-1;tick(2400);keys.clear();tick(600);}`);
run('route()');console.log('safe',run('JSON.stringify({delivered,spills})'));assert(run('delivered>=4'),'safe success');assert.equal(run('spills'),0,'safe route retains all cargo');
run("reset();keys.add('w');tick(300);keys.add('d');tick(180);keys.clear();tick(360)");console.log('aggressive',run('JSON.stringify({spills})'));assert(run('spills>0'),'aggressive spill');
// Recovery is tested using actual movement toward spilled cargo, not teleportation.
run(`let fallen=cargo.find(b=>b.state==='ground');drive(470,330);drive(540,330);for(let n=0;n<6;n++){recover();tick(180)}`);assert.equal(run("cargo.filter(b=>b.state==='tray').length"),6);
run('drive(550,325);drive(870,325);drive(1070,330);mouseY=-1;tick(2400);keys.clear();tick(600)');console.log('recovery delivery',run('JSON.stringify({delivered,spills})'));assert(run('delivered>=4'),'success after recovery');
run('reset();tick(120);toggle()');const time=run('elapsed');run('tick(120)');assert.equal(run('elapsed'),time);run('reset()');assert.equal(run('elapsed'),0);assert.equal(run('cargo.length'),6);assert.equal(run('paused'),false);
console.log('PASS physics, full safe route, recovery interaction, pause and reset');



run("reset();mouseX=1;tick(65);mouseX=-.35;tick(40);mouseX=0;tick(600)");console.log('caught tilt',run('spills'));assert.equal(run('spills'),0,'counter-tilt saves load');
run("reset();mouseX=1;tick(600)");console.log('held tilt',run('spills'));assert.equal(run('spills'),6,'sustained mouse roll spills load');

run("reset();keys.add('arrowup');tick(120)");const arrows=run('car.x');run("reset();keys.add('w');tick(120)");assert.equal(run('car.x'),arrows,'up arrow matches W');
run("reset();keys.add('arrowright');tick(60)");const right=run('car.a');run("reset();keys.add('d');tick(60)");assert.equal(run('car.a'),right,'right arrow matches D');
run("reset();keys.add('arrowdown');tick(60)");assert(run('car.x<145'),'down arrow reverses');run("reset();keys.add('arrowleft');tick(60)");assert(run('car.a<0'),'left arrow turns left');
console.log('PASS mouse counterbalance and arrow controls');
// Check the real renderer transform, not merely the physics variable's sign.
const THREE=require('./vendor/three.module.js'),{applyTrayPose}=require('./controls.mjs');
const tray=new THREE.Object3D();applyTrayPose(tray,0,.4);tray.updateMatrixWorld(true);
const rightRim=new THREE.Vector3(0,0,30).applyMatrix4(tray.matrixWorld);
assert(rightRim.y<0,'mouse-right roll must lower the visible right rim');
applyTrayPose(tray,0,-.4);tray.updateMatrixWorld(true);assert(new THREE.Vector3(0,0,-30).applyMatrix4(tray.matrixWorld).y<0,'mouse-left lowers left rim');
applyTrayPose(tray,.4,0);tray.updateMatrixWorld(true);assert(new THREE.Vector3(35,0,0).applyMatrix4(tray.matrixWorld).y<0,'mouse-up tips the nose forward');
run('reset();mouseX=.4;tick(100)');assert(run('cargo.reduce((sum,b)=>sum+b.y,0)>0'),'cargo shifts toward lowered right rim');
console.log('PASS visible tilt agrees with mouse and gravity');
