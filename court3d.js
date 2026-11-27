import * as T from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import R from 'https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.17.3/+esm';
export async function createCourt(host){
 await R.init();
 const S=3.05/325, H=3.05, rad=52*S, radius=15*S, speedScale=Math.sqrt(9.81/(880*S));
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/120;
 const scene=new T.Scene();scene.background=new T.Color(0x242a35);scene.fog=new T.Fog(0x242a35,18,42);
 const camera=new T.PerspectiveCamera(55,900/700,.05,60);
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;host.append(renderer.domElement);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,...extra});
 const wood=mat(0xc89053),dark=mat(0x232b38),wall=mat(0x555b63),white=mat(0xf7eee0),orange=mat(0xf26a20),purple=mat(0x412389);
 function box(w,h,d,x,y,z,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);scene.add(o);return o}
 function fixed(w,h,d,x,y,z,restitution=.5){const b=world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(x,y,z));world.createCollider(R.ColliderDesc.cuboid(w/2,h/2,d/2).setRestitution(restitution).setFriction(.5),b);return b}
 box(16,.2,18,0,-.1,1,wood);fixed(16,.2,18,0,-.1,1);
 for(let i=-40;i<=40;i++)box(.008,.002,18,i*.2,.002,1,dark);
 box(16,7,.25,0,3.5,-4.5,wall);box(.2,7,18,-8,3.5,1,wall);box(.2,7,18,8,3.5,1,wall);
 for(let i=-7;i<=7;i++)box(.92,1.8,.16,i,.9,-4.3,dark);
 for(let i=-6;i<=6;i+=3){box(.12,6,.35,i,3,-4.2,dark);box(1.4,.08,.45,i,6,-1,white)}
 const paint=box(3.6,.007,5,0,.008,1.4,dark);
 function line(x1,z1,x2,z2){const dx=x2-x1,dz=z2-z1;const o=box(Math.hypot(dx,dz),.009,.045,(x1+x2)/2,.017,(z1+z2)/2,white);o.rotation.y=-Math.atan2(dz,dx)}
 for(const x of [-1.8,1.8])line(x,-1.1,x,3.9);line(-1.8,3.9,1.8,3.9);line(-7,-1.1,7,-1.1);
 for(let i=0;i<48;i++){const a=i*Math.PI/48,b=(i+1)*Math.PI/48;line(6*Math.cos(a),6*Math.sin(a)-.7,6*Math.cos(b),6*Math.sin(b)-.7)}
 const boardZ=-(794-742)*S;
 box(.18,3.4,.18,0,1.7,boardZ-.7,dark);box(.6,1.2,.65,0,.6,boardZ-.7,dark);box(.16,.14,.8,0,3.42,boardZ-.35,dark);
 box(1.65,1.25,.07,0,3.48,boardZ,mat(0xd5e8ef,{transparent:true,opacity:.68,roughness:.2}));
 const boardBody=fixed(1.6,1.25,.12,0,3.48,boardZ-.06,.55);
 for(const x of [-.8,.8])box(.035,1.25,.025,x,3.48,boardZ+.05,white);
 for(const y of [2.87,4.09])box(1.6,.035,.025,0,y,boardZ+.05,white);
 for(const x of [-.29,.29])box(.025,.45,.025,x,3.31,boardZ+.05,white);
 for(const y of [3.09,3.53])box(.6,.025,.025,0,y,boardZ+.05,white);
 const ring=new T.Mesh(new T.TorusGeometry(rad,.018,10,64),orange);ring.rotation.x=Math.PI/2;ring.position.y=H;scene.add(ring);
 const ringBody=world.createRigidBody(R.RigidBodyDesc.fixed());
 for(let i=0;i<48;i++){let a=i*Math.PI*2/48;world.createCollider(R.ColliderDesc.ball(.027).setTranslation(rad*Math.cos(a),H,rad*Math.sin(a)).setRestitution(.56),ringBody)}
 const netPoints=[];for(let i=0;i<16;i++){let a=i*Math.PI/8;for(let j of [-1,1]){let b=a+j*Math.PI/8;netPoints.push(rad*Math.cos(a),H-.02,rad*Math.sin(a),rad*.62*Math.cos(b),H-.53,rad*.62*Math.sin(b))}}
 const net=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(netPoints,3)),new T.LineBasicMaterial({color:0xffffff}));scene.add(net);
 scene.add(new T.HemisphereLight(0xe9efff,0x8e684b,2.3));const light=new T.DirectionalLight(0xffe6c4,2.2);light.position.set(-4,9,5);scene.add(light);
 const texCanvas=document.createElement('canvas');texCanvas.width=512;texCanvas.height=256;const g=texCanvas.getContext('2d');g.fillStyle='#d96b25';g.fillRect(0,0,512,256);g.strokeStyle='#382216';g.lineWidth=5;for(let x of [0,128,256,384,512]){g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+65,85,x-65,170,x,256);g.stroke()}g.beginPath();g.moveTo(0,128);g.lineTo(512,128);g.stroke();const tex=new T.CanvasTexture(texCanvas);tex.colorSpace=T.SRGBColorSpace;
 const ballMesh=new T.Mesh(new T.SphereGeometry(radius,32,24),mat(0xffffff,{map:tex,roughness:.8}));scene.add(ballMesh);
 const pathLine=new T.Line(new T.BufferGeometry(),new T.LineBasicMaterial({color:0xffbf59}));scene.add(pathLine);
 let body=null,acc=0,prev=null,cross=null,hitBoard=false,hitRim=false,points=[];
 const pos=b=>({x:b.lat*S,y:(638-b.y)*S,z:(742-b.x)*S});
 function clear(){if(body){world.removeRigidBody(body);body=null}acc=0;prev=null;cross=null;hitBoard=hitRim=false;points=[];pathLine.geometry.dispose();pathLine.geometry=new T.BufferGeometry()}
 function launch(b){clear();const p=pos(b);body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(p.x,p.y,p.z).setLinvel(b.vlat*S*speedScale,-b.vy*S*speedScale,-b.vx*S*speedScale).setAngvel({x:7,y:0,z:0}).setCcdEnabled(true));world.createCollider(R.ColliderDesc.ball(radius).setRestitution(.65).setFriction(.55),body);prev=p}
 function step(dt,b,win){if(!body)launch(b);acc+=dt;let scored=false;while(acc>=1/120){world.step();acc-=1/120;const p=body.translation(),v=body.linvel();if(!cross&&prev.y>H&&p.y<=H&&v.y<0){const k=(prev.y-H)/(prev.y-p.y),x=prev.x+(p.x-prev.x)*k,z=prev.z+(p.z-prev.z)*k;cross={x:742-z/S,lat:x/S};if(Math.hypot(x,z)<Math.min(win*S,rad-radius-.018))scored=true;else cross=null}
 world.contactPairsWith(body.collider(0),c=>{const parent=c.parent();if(parent?.handle===boardBody.handle)hitBoard=true;if(parent?.handle===ringBody.handle)hitRim=true});
 prev={x:p.x,y:p.y,z:p.z}}
 const p=body.translation(),v=body.linvel();Object.assign(b,{x:742-p.z/S,y:638-p.y/S,lat:p.x/S,vx:-v.z/S,vy:-v.y/S,vlat:v.x/S,hitBoard,hitRim});if(cross){b.crossX=cross.x;b.crossLat=cross.lat}return scored}
 function render(b,view,theme,guide){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const size=renderer.getSize(new T.Vector2());if(size.x!==w||size.y!==h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 if(view==='side'){camera.position.set(9,4.2,3);camera.lookAt(0,2.1,2.2)}else{camera.position.set(0,1.75,6.7);camera.lookAt(0,2.85,0)}
 paint.material=theme==='arcade'?purple:dark;
 if(b&&body){const p=body.translation(),q=body.rotation();ballMesh.position.set(p.x,p.y,p.z);ballMesh.quaternion.set(q.x,q.y,q.z,q.w);if(guide){points.push(new T.Vector3(p.x,p.y,p.z));if(points.length>240)points.shift();pathLine.geometry.dispose();pathLine.geometry=new T.BufferGeometry().setFromPoints(points)}}else{ballMesh.position.set(.32,1.55,4.95);ballMesh.rotation.set(0,0,0)}
 pathLine.visible=guide;renderer.render(scene,camera)}
 return {launch,step,render,clear};
}
