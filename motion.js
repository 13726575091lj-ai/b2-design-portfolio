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
 const headings=[...document.querySelectorAll('.hero h1,.intro h2,.section-title,.category-heading,.about-content h2')];
 headings.forEach(splitText);
 const reveals=[...headings,...document.querySelectorAll('.intro-copy,.intro-sign,.section-note,.category-subline,.work-tabs,.work-card,.about-content>p,.about-left,.next-category,.footer-word')];
 reveals.forEach(e=>e.dataset.reveal='');
 document.querySelectorAll('.work-grid').forEach(grid=>[...grid.children].forEach((e,i)=>e.style.setProperty('--reveal-delay',(i%2)*95+'ms')));
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
})();
