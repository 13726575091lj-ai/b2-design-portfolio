(() => {
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const layer=document.getElementById('page-transition');
 const destination=document.getElementById('transition-destination');
 const app=document.getElementById('app');
 const route=path=>path.replace(/\/index(?:\.html)?\/?$/,'/').replace(/\.html$/,'').replace(/\/$/,'')||'/';
 const routes=new Map([['/','B2'],['/music-video','ANIMATION MUSIC VIDEO'],['/animation','ANIMATION'],['/live-action','LIVE ACTION']]);
 let navigating=false;
 function resetNavigation(){root.classList.remove('is-leaving','is-entering','is-arriving');document.body.classList.remove('is-navigating');app.inert=false;navigating=false;}
 function splitText(element){
  let index=0;
  function walk(node){
   for(const child of [...node.childNodes]){
    if(child.nodeType===Node.TEXT_NODE){
     const fragment=document.createDocumentFragment();
     for(const word of child.textContent.match(/\S+|\s+/gu)||[]){
      if(/^\s+$/u.test(word)){fragment.append(document.createTextNode(word));continue;}
      const wrapper=document.createElement('span');wrapper.className='motion-word';
      for(const char of word){const letter=document.createElement('i');letter.className='motion-letter';letter.style.setProperty('--letter',Math.min(index++,24));letter.textContent=char;wrapper.append(letter);}
      fragment.append(wrapper);
     }
     child.replaceWith(fragment);
    }else if(child.nodeType===Node.ELEMENT_NODE)walk(child);
   }
  }
  // Keep the accessible heading as a continuous name while letters animate.
  element.setAttribute('aria-label',element.innerText.replace(/\s+/g,' ').trim());walk(element);
 }
 const headings=[...document.querySelectorAll('.hero h1,.intro h2,.section-title,.category-heading,.about-content h2,.contact-title')];
 headings.forEach(splitText);
 const reveals=[...headings,...document.querySelectorAll('.hero-topline,.hero-kicker,.hero-lede,.hero-actions,.hero-bottom,.hero-scribble,.intro .label,.intro .star,.intro-copy,.intro-sign,.section-note,.category-topline,.category-subline,.work-tabs,.work-card,.view-all,.about-content>p,.about-bottom,.about-left,.next-category,.contact-head,.contact-row,.footer-top')];
 reveals.forEach(e=>e.dataset.reveal='');
 document.querySelectorAll('.work-grid').forEach(grid=>[...grid.children].forEach((e,i)=>e.style.setProperty('--reveal-delay',(i%2)*140+'ms')));
 // Hero sequence, timed to start as the 3D heart lands (~0.55s) and the camera settles.
 const heroDelays={'.hero-topline':250,'.hero-kicker':520,'.hero h1':620,'.hero-lede':1050,'.hero-actions':1200,'.hero-bottom':1400};
 for(const [selector,delay] of Object.entries(heroDelays))document.querySelector(selector)?.style.setProperty('--reveal-delay',delay+'ms');
 let observer;
 if(!reduced.matches)document.body.classList.add('motion-ready');
 function beginReveals(){
  if(reduced.matches||!('IntersectionObserver' in window)){reveals.forEach(e=>e.classList.add('is-visible'));return;}
  document.body.classList.add('motion-ready');
  observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}},{threshold:.06,rootMargin:'0px 0px -25px 0px'});
  reveals.forEach(e=>observer.observe(e));
 }
 if(root.classList.contains('is-entering')&&!reduced.matches){
  destination.textContent=routes.get(route(location.pathname))||'B2';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{root.classList.remove('is-entering');root.classList.add('is-arriving');setTimeout(beginReveals,160);setTimeout(()=>root.classList.remove('is-arriving'),650);}));
 }else{resetNavigation();beginReveals();}
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||(link.target&&link.target!=='_self')||link.hasAttribute('data-project'))return;
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||route(url.pathname)===route(location.pathname)||!routes.has(route(url.pathname))||reduced.matches)return;
  event.preventDefault();if(navigating)return;navigating=true;
  destination.textContent=routes.get(route(url.pathname));
  try{sessionStorage.setItem('b2-page-transition',JSON.stringify({to:url.pathname,at:Date.now()}));}catch{}
  root.classList.remove('is-arriving','is-entering');root.classList.add('is-leaving');document.body.classList.add('is-navigating');app.inert=true;
  // Let the supplied orbital animation play briefly, then use normal navigation.
  setTimeout(()=>location.assign(url.href),860);
 });
 window.addEventListener('pageshow',event=>{if(event.persisted){resetNavigation();try{sessionStorage.removeItem('b2-page-transition');}catch{}}});
 reduced.addEventListener('change',()=>{if(reduced.matches){observer?.disconnect();reveals.forEach(e=>e.classList.add('is-visible'));}});

 // ---- scroll-linked motion: progress line, tucking header, hero parallax (one rAF per scroll burst)
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 const header=document.getElementById('site-header'),panel=document.getElementById('index-panel'),hero=document.querySelector('.hero--heart');
 let lastY=scrollY,ticking=false;
 function onScroll(){
  ticking=false;
  const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
  progress.style.setProperty('--progress',max>0?(y/max).toFixed(4):0);
  const menuOpen=panel&&!panel.hidden;
  if(header&&!menuOpen&&!reduced.matches){
   if(y>innerHeight*.6&&y>lastY+4)header.classList.add('is-tucked');
   else if(y<lastY-4||y<innerHeight*.6)header.classList.remove('is-tucked');
  }
  if(hero&&!reduced.matches&&y<hero.offsetHeight*1.1){
   const k=Math.min(1,y/hero.offsetHeight);
   hero.style.setProperty('--hero-shift',(-y*.28).toFixed(1)+'px');
   hero.style.setProperty('--hero-fade',(1-k*1.35).toFixed(3));
  }
  lastY=y;
 }
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
 header?.addEventListener('focusin',()=>header.classList.remove('is-tucked'));
 onScroll();

 // ---- pointer companion + magnetic buttons (mouse / trackpad only)
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 if(fine.matches&&!reduced.matches){
  const cursor=document.createElement('div');cursor.className='cursor';cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML='<div class="cursor-ring"><span></span></div>';document.body.append(cursor);
  const label=cursor.querySelector('span');
  let tx=-100,ty=-100,cx=-100,cy=-100,raf=0;
  const loop=()=>{cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cursor.style.transform=`translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;raf=Math.abs(tx-cx)+Math.abs(ty-cy)>.1?requestAnimationFrame(loop):0;};
  addEventListener('pointermove',e=>{
   if(e.pointerType!=='mouse')return;
   tx=e.clientX;ty=e.clientY;
   const target=e.target instanceof Element?e.target:null;
   // The video dialog lives in the top layer, above anything we can draw; step aside there.
   if(target?.closest('.project-dialog')){cursor.classList.remove('is-on');return;}
   cursor.classList.add('is-on');
   const play=target?.closest('[data-project]');
   cursor.classList.toggle('is-play',!!play);
   cursor.classList.toggle('is-link',!play&&!!target?.closest('a,button,[data-heart-touch]'));
   cursor.classList.toggle('is-dark',!!target?.closest('.intro,.about,.index-panel,.next-category,.page-transition,.project-dialog'));
   if(play)label.textContent=language()==='en'?'PLAY':'播放';
   if(!raf)raf=requestAnimationFrame(loop);
  },{passive:true});
  document.addEventListener('pointerleave',()=>cursor.classList.remove('is-on'));
  addEventListener('pointerdown',()=>cursor.classList.add('is-down'));
  addEventListener('pointerup',()=>cursor.classList.remove('is-down'));
  document.querySelectorAll('.magnetic').forEach(el=>{
   el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);el.style.translate=`${(dx*.22).toFixed(1)}px ${(dy*.3).toFixed(1)}px`;});
   el.addEventListener('pointerleave',()=>{el.style.translate='';});
  });
 }
 function language(){return document.documentElement.lang.startsWith('en')?'en':'zh';}
})();
