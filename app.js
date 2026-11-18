const projects=[
 {id:'candy-mutiny',title:'Candy mutiny',category:'music-video',image:'candy-mutiny.webp'},
 {id:'logout',title:'ログアウトできない',category:'music-video',image:'logout.webp'},
 {id:'ashbound',title:'ASHBOUND',category:'animation',image:'ashbound.webp'},
 {id:'my-block',title:'MY BLOCK',category:'animation',image:'my-block.webp'},
 {id:'the-last-bun',title:'THE LAST BUN',category:'animation',image:'the-last-bun.webp'},
 {id:'multiverse',title:'The Multiverse Hates Me',category:'animation',image:'multiverse.webp'},
 {id:'you-are-hired',title:'You Are Hired',category:'animation',image:'you-are-hired.webp'},
 {id:'moms-home',title:'MOM’S HOME',category:'live-action',image:'moms-home.webp'}
];
const categories={
 'music-video':{name:'Animation Music Video',heading:'ANIMATION<br>MUSIC VIDEO.',icon:'note',zh:'让旋律成为画面，让想象随节奏生长。',en:'Melodies become images. Imagination finds its own rhythm.',note:'Turn it up!',next:'animation'},
 'animation':{name:'Animation',heading:'ANIMATION.',icon:'clapper',zh:'从一个念头出发，抵达另一个世界。',en:'From a small idea to an entirely different world.',note:'Anything is possible.',next:'live-action'},
 'live-action':{name:'Live Action',heading:'LIVE ACTION.',icon:'ghost',zh:'真实的面孔，微妙的情绪，镜头里的故事。',en:'Real faces. Quiet emotions. Stories inside the frame.',note:'A little closer to life.',next:'music-video'}
};

function doodle(type='star',extra=''){
 const eyes='<g class="doodle-eyes"><circle class="doodle-eye" cx="25" cy="31" r="1.6"/><circle class="doodle-eye" cx="39" cy="31" r="1.6"/></g>';
 const smile='<path d="M28 37q4 4 8 0"/>';
 const shapes={
  star:'<path d="m32 7 7.5 15.2 16.8 2.4-12.1 11.8 2.8 16.7L32 45.2l-15 7.9 2.9-16.7L7.7 24.6l16.8-2.4Z"/>'+eyes+smile+'<path class="doodle-cheek" d="M19 35h3m20 0h3"/>',
  clapper:'<rect x="10" y="23" width="44" height="31" rx="7"/><g class="clap-lid"><path d="m10 23-2-11L51 5l2 11Z"/><path d="m17 10 8 10m7-12 8 10m7-12 6 7"/></g><path d="M10 31h44"/><g class="doodle-eyes"><circle class="doodle-eye" cx="25" cy="39" r="1.6"/><circle class="doodle-eye" cx="39" cy="39" r="1.6"/></g><path d="M28 45q4 4 8 0"/>',
  note:'<path d="M26 43V15l23-5v28M26 23l23-5"/><ellipse cx="18" cy="45" rx="8" ry="7"/><ellipse cx="41" cy="40" rx="8" ry="7"/><path d="M13 44h1m7 0h1m-6 4q2 2 4 0M36 39h1m7 0h1m-6 4q2 2 4 0M8 17l2-4m4 9 4-1"/>',
  ghost:'<path d="M13 51V29C13 15 22 8 32 8s19 7 19 21v22l-9-5-10 7-10-7Z"/>'+eyes+smile+'<path class="doodle-cheek" d="M19 36h3m20 0h3"/><path d="m54 8 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"/>',
  planet:'<circle cx="32" cy="32" r="20"/><path d="M13 24C-4 39 7 48 32 39S68 12 51 19M48 7v6m-3-3h6M7 51l-2 4m6-1 3 2"/>'+eyes+smile
 };
 return `<svg class="doodle doodle--${type} ${extra}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes[type]||shapes.star}</svg>`;
}

const t=(zh,en)=>`<span data-zh="${zh}" data-en="${en}">${zh}</span>`;
const arrow='<span class="arrow" aria-hidden="true">↗</span>';
const current=document.body.dataset.page||'home';
let language=localStorage.getItem('b2-language')||'zh';
const underline='<svg class="scribble-line" viewBox="0 0 180 14" aria-hidden="true"><path d="M2 8C45 0 128 0 177 5M9 13C57 6 131 4 170 10"/></svg>';

function header(){return `<a class="skip" href="#main">${t('跳至内容','Skip to content')}</a><header class="site-header ${current!=='home'?'solid':''}" id="site-header"><a class="brand" href="index.html" aria-label="B2 — 首页"><span class="brand-mark">B2<b>✳</b></span><span class="brand-name">MOVING<br>IMAGES</span></a><nav class="header-nav" aria-label="主导航"><a class="header-link" href="index.html#work">${t('作品','WORK')}</a><a class="header-link" href="index.html#about">${t('关于 B2','ABOUT B2')}</a><button class="index-toggle" id="index-toggle" aria-expanded="false" aria-controls="index-panel"><span>${t('作品索引','INDEX')}</span><span class="arrow" id="menu-symbol" aria-hidden="true">↗</span></button><div class="language" aria-label="Language"><button data-language="zh" aria-label="切换中文" class="${language==='zh'?'active':''}">CN</button><span aria-hidden="true">|</span><button data-language="en" aria-label="Switch to English" class="${language==='en'?'active':''}">EN</button></div></nav></header>`}
function menu(){return `<section class="index-panel" id="index-panel" aria-label="作品索引" hidden><div class="index-top"><span class="mono">B2<br>FILMS & MOVING IMAGES</span><span class="hand" style="font-size:28px;transform:rotate(7deg)">Pick a world.</span></div><nav class="index-list" aria-label="作品分类">${Object.entries(categories).map(([id,c])=>`<a href="${id}.html"><span class="menu-category">${doodle(c.icon)}<span>${c.name}</span></span>${arrow}</a>`).join('')}<a href="index.html#about"><span>${t('关于 B2','About B2')}</span>${arrow}</a></nav><div class="index-bottom"><span class="mono">${t('一些故事，许多个世界。','SMALL STORIES. MANY DIFFERENT WORLDS.')}<br>© ${new Date().getFullYear()} B2</span><span class="index-signature">See you in the next frame.</span></div></section>`}
function tabs(isHome=false){return `<div class="work-tabs"><span class="tabs-label">${t('按世界探索','EXPLORE BY WORLD')}</span><nav class="category-links" aria-label="作品分类">${isHome?`<span class="category-link current">${t('精选','Selected')}</span>`:''}${Object.entries(categories).map(([id,c])=>`<a class="category-link ${current===id?'current':''}" href="${id}.html" ${current===id?'aria-current="page"':''}>${c.name}</a>`).join('')}</nav></div>`}
function card(p,loading='lazy'){let letter=0;const title=p.title.split(' ').map(word=>`<span class="title-word">${[...word].map(char=>`<i class="title-letter" style="--letter:${letter++}">${char}</i>`).join('')}</span>`).join(' ');return `<article class="work-card"><h3 class="sr-only">${p.title}</h3><div class="holo-stage"><button class="image-button holo-card" data-preset="bursts" data-project="${p.id}" aria-haspopup="dialog" aria-label="${p.title} — 查看作品"><img src="assets/${p.image}" alt="${p.title} 作品封面" width="1600" height="900" loading="${loading}" decoding="async" draggable="false"><span class="holo-foil" aria-hidden="true"></span><span class="holo-bursts" aria-hidden="true"></span><span class="holo-sparkles" aria-hidden="true"></span><span class="holo-glare" aria-hidden="true"></span><span class="holo-edge" aria-hidden="true"></span><span class="cover-caption" aria-hidden="true"><span class="cover-category">${categories[p.category].name}</span><span class="cover-name">${title}</span></span></button></div></article>`}
function footer(){return `<footer class="site-footer"><div class="footer-top"><p>${t('故事还在继续。<br>下一个画面，再见。','The story goes on.<br>See you in the next frame.')}</p><a href="#top" class="back-top">${t('回到顶部','BACK TO TOP')} <span class="arrow">↑</span></a></div><div class="footer-word" aria-hidden="true">STAY <span>curious.</span></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} B2. ALL RIGHTS RESERVED.</span><nav class="footer-nav" aria-label="页脚导航"><a href="music-video.html">MUSIC VIDEO</a><a href="animation.html">ANIMATION</a><a href="live-action.html">LIVE ACTION</a></nav></div></footer>`}
function dialog(){return `<dialog class="project-dialog" id="project-dialog" aria-labelledby="dialog-title"><button class="dialog-close" aria-label="关闭作品" type="button">×</button><video class="dialog-video" id="dialog-video" controls playsinline preload="metadata" aria-labelledby="dialog-title"></video><p class="dialog-error" id="dialog-error" role="status" hidden>${t('视频暂时无法播放，请稍后重试。','The video couldn’t load. Please try again in a moment.')}</p><div class="dialog-info"><div><span class="mono" id="dialog-category"></span><h2 class="dialog-title" id="dialog-title"></h2><p class="dialog-name">${t('创作 / B2','A film by B2')}</p></div><span class="dialog-status">${t('正片','FULL FILM')}</span></div></dialog>`}
function home(){return `<main id="main">
<section class="hero hero--heart" aria-label="B2">
  <div class="heart-stage" data-b2-heart aria-hidden="true">
    <div class="heart-fallback"><div class="heart-silhouette"></div></div>
  </div>
  <div class="hero-topline mono">
    <span>B2<br>FILMS & MOVING IMAGES</span>
    <span>${t('动画 · 音乐影像 · 真人作品','ANIMATION · MUSIC VIDEO · LIVE ACTION')}</span>
  </div>
  <h1>B2 Design Portfolio</h1>
  <div class="hero-scribble hand"><span class="dream-symbol" aria-hidden="true">✳</span>Welcome to<br>my world. ${underline}</div>
  <div class="hero-bottom">
    <a class="scroll-link" href="#work"><span class="scroll-arrow" aria-hidden="true">↓</span><span>${t('向下探索作品','SCROLL TO EXPLORE')}</span></a>
    <div class="feature-switcher">
      <div class="heart-instructions">
        <p class="mono">${t('划过地面，留下蓝色轨迹','SWEEP ACROSS THE FLOOR TO PAINT IT BLUE')}</p>
        <button type="button" class="heart-touch" data-heart-touch>${t('点一下爱心','TOUCH THE HEART')} <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  </div>
</section><section class="intro" aria-labelledby="intro-heading"><span class="label">THE WORLD OF B2</span><h2 id="intro-heading">SOMEWHERE BETWEEN<br> A DAYDREAM <span class="amp">&</span> A FILM.</h2><div class="star" aria-hidden="true">✳</div><p class="intro-copy">${t('我是 B2。<br>用影像讲故事，在动画、音乐与真实之间，<br>寻找想象的另一种可能。','I’m B2.<br>I tell stories through moving images,<br>somewhere between animation, music and real life.')}<span class="english">Small ideas. Strange worlds. Moving stories.</span></p><div class="intro-sign">B2</div><span class="intro-side">IMAGINATION HAS NO FIXED ADDRESS.</span><span class="intro-side right">NEITHER DO THE STORIES.</span></section><section class="works" id="work" aria-labelledby="work-heading"><div class="section-top"><h2 class="section-title" id="work-heading">SELECTED<br>WORLDS.</h2><div class="section-note">${doodle('clapper')}A few places<br>I’ve been. <span class="arrow" aria-hidden="true">↘</span></div></div>${tabs(true)}<div class="work-grid">${[projects[0],projects[2],projects[3],projects[7]].map(p=>card(p)).join('')}</div><a class="view-all" href="animation.html"><span>${t('继续探索 / 全部动画作品','KEEP EXPLORING / ALL ANIMATION')}</span>${arrow}</a></section><section class="about" id="about" aria-labelledby="about-heading"><div class="about-left"><span class="label">THE PERSON BEHIND THE FRAME</span><div class="about-doodle" aria-hidden="true">B2<span>${doodle('ghost')}</span></div></div><div class="about-content"><h2 id="about-heading">ONE CREATOR.<br>MANY DIFFERENT<br>WORLDS.</h2><p>${t('我是 B2。<br>一名视频内容创作者。<br><br>作品横跨动画音乐影像、动画短片与真人影像。这里记录着我的故事与想象，也收藏着那些值得被看见的瞬间。','I’m B2.<br>A video content creator.<br><br>My work moves between animated music videos, animation and live action. This is a collection of stories, imagined worlds, and moments made to be seen.')}</p><div class="about-bottom mono"><span>ANIMATION / MUSIC VIDEO / LIVE ACTION</span><span>B2</span></div></div></section></main>`}
function categoryPage(){const c=categories[current],next=categories[c.next];const ps=projects.filter(p=>p.category===current);return `<main class="category-main" id="main"><section class="category-hero"><div class="category-topline"><a class="back-home" href="index.html">← ${t('返回首页','BACK TO HOME')}</a><span class="mono">SELECTED WORKS </span></div><h1 class="category-heading">${c.heading}</h1><div class="category-subline"><p>${t(c.zh,c.en)}</p><span class="category-scribble">${doodle(c.icon)}<span>${c.note}</span></span></div></section><section class="category-works ${ps.length===1?'single':''}" aria-label="${c.name} 作品">${tabs()}<div class="work-grid">${ps.map((p,i)=>card(p,i<2?'eager':'lazy')).join('')}</div></section><a class="next-category" href="${c.next}.html"><div class="mono">${t('下一个世界','NEXT WORLD')} ${doodle(next.icon)}</div><div><span>${next.name.toUpperCase()}</span>${arrow}</div></a></main>`}
document.getElementById('app').innerHTML=header()+menu()+(current==='home'?home():categoryPage())+footer()+dialog();

function setLanguage(lang){language=lang;localStorage.setItem('b2-language',lang);document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.querySelectorAll('[data-zh]').forEach(e=>e.innerHTML=e.dataset[lang]);document.querySelectorAll('[data-language]').forEach(b=>{b.classList.toggle('active',b.dataset.language===lang);b.setAttribute('aria-pressed',String(b.dataset.language===lang))});document.querySelector('.dialog-close').setAttribute('aria-label',lang==='zh'?'关闭作品':'Close film');}
document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));
setLanguage(language);
const indexToggle=document.getElementById('index-toggle'),indexPanel=document.getElementById('index-panel'),siteHeader=document.getElementById('site-header');
function closeMenu(){indexPanel.hidden=true;indexToggle.setAttribute('aria-expanded','false');document.getElementById('menu-symbol').textContent='↗';document.body.classList.remove('locked');document.querySelector('main').inert=false;document.querySelector('footer').inert=false;updateHeader();}
function updateHeader(){siteHeader.classList.toggle('solid',indexPanel.hidden&&(current!=='home'||window.scrollY>window.innerHeight*.95||document.querySelector('.hero--heart')!==null));}
indexToggle.addEventListener('click',()=>{if(!indexPanel.hidden){closeMenu();return}indexPanel.hidden=false;indexToggle.setAttribute('aria-expanded','true');document.getElementById('menu-symbol').textContent='×';document.body.classList.add('locked');document.querySelector('main').inert=true;document.querySelector('footer').inert=true;siteHeader.classList.remove('solid');indexPanel.querySelector('a').focus();});
indexPanel.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('scroll',updateHeader,{passive:true});
updateHeader();updateHeader();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!indexPanel.hidden){closeMenu();indexToggle.focus()}if(e.key==='Tab'&&!indexPanel.hidden){const focusables=[indexToggle,...document.querySelectorAll('[data-language]'),...indexPanel.querySelectorAll('a')];const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
const projectDialog=document.getElementById('project-dialog');
const projectVideo=document.getElementById('dialog-video');
const videoError=document.getElementById('dialog-error');
let opener;
function openProject(id,trigger){
 const p=projects.find(p=>p.id===id);
 if(!p)return;
 opener=trigger;
 document.getElementById('dialog-title').textContent=p.title;
 document.getElementById('dialog-category').textContent=categories[p.category].name.toUpperCase();
 videoError.hidden=true;
 projectVideo.poster=`assets/${p.image}`;
 projectVideo.src=`videos/${p.id}.mp4`;
 projectDialog.showModal();
 document.body.classList.add('locked');
}
projectVideo.addEventListener('error',()=>{if(projectDialog.open && projectVideo.hasAttribute('src'))videoError.hidden=false;});
document.querySelectorAll('[data-project]').forEach(e=>e.addEventListener('click',event=>{event.preventDefault();openProject(e.dataset.project,e)}));
document.querySelector('.dialog-close').addEventListener('click',()=>projectDialog.close());
projectDialog.addEventListener('click',event=>{if(event.target===projectDialog){const r=projectDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)projectDialog.close()}});
projectDialog.addEventListener('close',()=>{
 projectVideo.pause();
 projectVideo.removeAttribute('src');
 projectVideo.removeAttribute('poster');
 projectVideo.load();
 document.body.classList.remove('locked');
 opener?.focus();
});
