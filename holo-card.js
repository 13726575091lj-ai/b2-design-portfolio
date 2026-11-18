/* A small, dependency-free equivalent of the requested HoloCard interaction. */
(() => {
 const settings={intensity:.85,foilColor:'#e2e6ec',edgeSparkle:.8,frame:4,glare:.5,tiltMax:14,hoverScale:1.04,radius:14,idle:true,shadow:true};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 let frame=0,lastTime=0;
 const states=[...document.querySelectorAll('.holo-card')].map((card,index)=>({
  card,stage:card.parentElement,visible:false,hover:false,focus:false,x:.5,y:.5,
  rx:0,ry:0,scale:1,level:.28,phase:index*1.8
 }));
 if(!states.length)return;
 function start(){if(!frame&&!reduced.matches&&!document.hidden&&states.some(s=>s.visible))frame=requestAnimationFrame(render);}
 function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0;}
 function reset(){stop();for(const s of states){s.rx=0;s.ry=0;s.scale=1;s.level=.18;s.card.classList.remove('is-interacting');s.card.style.setProperty('--holo-rx','0deg');s.card.style.setProperty('--holo-ry','0deg');s.card.style.setProperty('--holo-scale','1');s.card.style.setProperty('--holo-level','.18');}}
 function render(time){
  frame=0;if(reduced.matches||document.hidden)return;
  const ease=1-Math.exp(-Math.min(time-(lastTime||time-16),50)/85);lastTime=time;
  for(const s of states){
   if(!s.visible)continue;
   const active=s.hover||s.focus;
   const wave=time/2800+s.phase;
   const x=active?s.x:.5+Math.sin(wave)*.24;
   const y=active?s.y:.5+Math.cos(wave*.72)*.23;
   const tilt=active?settings.tiltMax:(finePointer.matches?1.7:.7);
   const target={rx:(.5-y)*2*tilt,ry:(x-.5)*2*tilt,scale:active?settings.hoverScale:1,level:active?1:.3+Math.sin(wave)*.07};
   for(const key of ['rx','ry','scale','level'])s[key]+=(target[key]-s[key])*ease;
   s.card.style.setProperty('--holo-rx',s.rx.toFixed(2)+'deg');
   s.card.style.setProperty('--holo-ry',s.ry.toFixed(2)+'deg');
   s.card.style.setProperty('--holo-scale',s.scale.toFixed(4));
   s.card.style.setProperty('--holo-level',s.level.toFixed(3));
   s.card.style.setProperty('--holo-x',(x*100).toFixed(2)+'%');
   s.card.style.setProperty('--holo-y',(y*100).toFixed(2)+'%');
  }
  start();
 }
 function point(s,event){const r=s.stage.getBoundingClientRect();s.x=Math.max(0,Math.min(1,(event.clientX-r.left)/r.width));s.y=Math.max(0,Math.min(1,(event.clientY-r.top)/r.height));}
 for(const s of states){
  s.card.style.setProperty('--holo-intensity',settings.intensity);
  s.card.style.setProperty('--holo-glare',settings.glare);
  s.card.style.setProperty('--holo-sparkle',settings.edgeSparkle);
  s.stage.addEventListener('pointerenter',event=>{if(event.pointerType==='touch'||!finePointer.matches||reduced.matches)return;s.hover=true;s.card.classList.add('is-interacting');point(s,event);start();});
  s.stage.addEventListener('pointermove',event=>{if(s.hover)point(s,event);},{passive:true});
  const leave=()=>{s.hover=false;if(!s.focus)s.card.classList.remove('is-interacting');};
  s.stage.addEventListener('pointerleave',leave);s.stage.addEventListener('pointercancel',leave);
  s.card.addEventListener('focus',()=>{s.focus=s.card.matches(':focus-visible');if(s.focus&&!reduced.matches){s.x=.5;s.y=.5;s.card.classList.add('is-interacting');start();}});
  s.card.addEventListener('blur',()=>{s.focus=false;if(!s.hover)s.card.classList.remove('is-interacting');});
 }
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){const s=states.find(s=>s.card===entry.target);s.visible=entry.isIntersecting;if(!s.visible){s.hover=false;s.focus=false;s.card.classList.remove('is-interacting');}}if(states.some(s=>s.visible))start();else stop();},{threshold:.05});
 states.forEach(s=>observer.observe(s.card));
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 reduced.addEventListener('change',()=>reduced.matches?reset():start());
 if(reduced.matches)reset();
})();
