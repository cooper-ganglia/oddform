import './src/oddform-morph.js';
const logo=document.querySelector('oddform-morph');
// The parent anchor owns interaction; preserve the component's rendering and motion.
logo.tabIndex=-1;logo.removeAttribute('role');logo.removeAttribute('aria-label');logo.removeAttribute('aria-pressed');
const brand=document.querySelector('.brand');
brand.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')logo.setState(1)});
brand.addEventListener('pointerleave',()=>logo.setState(0));
brand.addEventListener('focus',()=>logo.setState(1));brand.addEventListener('blur',()=>logo.setState(0));
brand.addEventListener('click',()=>{logo.setState(1);setTimeout(()=>logo.setState(0),900)});
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
function closeMenu(){toggle.setAttribute('aria-expanded','false');nav.classList.remove('open')}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();toggle.focus()}});
matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
document.querySelector('#year').textContent=new Date().getFullYear();
const form=document.querySelector('#brief-form'),action=document.querySelector('#contact-action');
action.textContent='Start a conversation ↗';action.setAttribute('aria-expanded','false');action.setAttribute('aria-controls','brief-form');
action.addEventListener('click',()=>{form.hidden=!form.hidden;action.setAttribute('aria-expanded',String(!form.hidden));if(!form.hidden)form.querySelector('input').focus()});
form.querySelector('button[type=submit]').textContent='Open email draft ↗';
document.querySelector('#form-status').innerHTML='Opens a draft to <a href="mailto:tyler@oddform.works">tyler@oddform.works</a> in your email app. You review and send it there.';
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const body=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('type')}\n\n${data.get('message')}`;location.href=`mailto:tyler@oddform.works?subject=${encodeURIComponent('Oddform inquiry — '+data.get('type'))}&body=${encodeURIComponent(body)}`;document.querySelector('#form-status').textContent='Email draft requested. If your email app did not open, email tyler@oddform.works directly. Nothing has been sent by this website.'});
// Accumulate small scroll changes to avoid header flicker on trackpads.
let menuScrollPinned=false;
const header=document.querySelector('header');let lastScroll=window.scrollY,travel=0,scrollQueued=false;
window.addEventListener('scroll',()=>{if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{const y=Math.max(0,window.scrollY),delta=y-lastScroll;if(Math.sign(delta)!==Math.sign(travel))travel=0;travel+=delta;const protectedState=menuScrollPinned||nav.classList.contains('open')||header.contains(document.activeElement);if(y<40||protectedState){header.classList.remove('header-hidden');travel=0}else if(Math.abs(travel)>12){header.classList.toggle('header-hidden',travel>0);travel=0}lastScroll=y;scrollQueued=false})},{passive:true});
header.addEventListener('focusin',()=>header.classList.remove('header-hidden'));
const topButton=document.querySelector('.back-top');
window.addEventListener('scroll',()=>{topButton.hidden=window.scrollY<400},{passive:true});
topButton.addEventListener('click',()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('.brand').focus({preventScroll:true})});
const dialog=document.querySelector('.image-dialog'),screenshot=document.querySelector('.screenshot-link');
screenshot.addEventListener('click',()=>dialog.showModal());
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const canAnimate=()=>matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches;
const hero=document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{if(!canAnimate())return;const r=hero.getBoundingClientRect();hero.style.setProperty('--pointer-x',`${100*(e.clientX-r.left)/r.width}%`);hero.style.setProperty('--pointer-y',`${100*(e.clientY-r.top)/r.height}%`)});
screenshot.addEventListener('pointermove',e=>{if(!canAnimate())return;const r=screenshot.getBoundingClientRect();screenshot.style.setProperty('--tilt-x',`${-3*((e.clientY-r.top)/r.height-.5)}deg`);screenshot.style.setProperty('--tilt-y',`${4*((e.clientX-r.left)/r.width-.5)}deg`)});
screenshot.addEventListener('pointerleave',()=>{screenshot.style.setProperty('--tilt-x','0deg');screenshot.style.setProperty('--tilt-y','0deg')});
// Anchor-driven scrolling keeps navigation available until the next manual scroll.
nav.addEventListener('click',e=>{if(e.target.closest('a[href^="#"]')){menuScrollPinned=true;header.classList.remove('header-hidden');travel=0}});
function releaseMenuScroll(){if(!menuScrollPinned)return;menuScrollPinned=false;if(header.contains(document.activeElement))document.activeElement.blur();lastScroll=window.scrollY;travel=0}
window.addEventListener('wheel',releaseMenuScroll,{passive:true});
window.addEventListener('touchmove',releaseMenuScroll,{passive:true});
window.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)&&!e.target.matches('input,textarea,select'))releaseMenuScroll()});
window.addEventListener('pointerdown',e=>{if(e.clientX>=document.documentElement.clientWidth)releaseMenuScroll()},{passive:true});
// Equal-length contours morph each conversation bubble into a practical object.
function samplePolygon(vertices,count=64){const lengths=vertices.map((p,i)=>Math.hypot(p[0]-vertices[(i+1)%vertices.length][0],p[1]-vertices[(i+1)%vertices.length][1]));const perimeter=lengths.reduce((a,b)=>a+b,0);return Array.from({length:count},(_,i)=>{let distance=i*perimeter/count,index=0;while(distance>lengths[index]&&index<lengths.length-1)distance-=lengths[index++];const a=vertices[index],b=vertices[(index+1)%vertices.length],t=distance/lengths[index];return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]})}
const bubbleVertices=[[42,27],[63,17],[130,17],[156,30],[166,49],[164,78],[148,94],[91,100],[56,119],[60,96],[38,83],[30,59],[33,40]];
const ideaShapes=[[[38,29],[161,29],[161,100],[38,100]],[[63,15],[138,15],[138,110],[63,110]],[[30,23],[170,23],[170,103],[30,103]],[[100,12],[153,41],[153,94],[100,123],[47,94],[47,41]]];
const ideaDetails=[
'<path d="M38 48H161 M55 29L68 48 M84 29L97 48 M114 29L127 48 M142 29L155 48"/>',
'<path d="M63 46H138 M63 78H138 M89 31H122 M89 63H122 M89 94H122"/><circle cx="76" cy="31" r="2"/><circle cx="76" cy="63" r="2"/><circle cx="76" cy="94" r="2"/>',
'<path d="M30 42H170 M45 33H46 M55 33H56 M65 33H66 M52 65L42 74L52 83 M147 65L157 74L147 83 M105 58L94 90"/>',
'<path d="M47 41L100 70L153 41 M100 70V123 M100 12V37 M88 44L100 37L112 44"/>'
];
document.querySelectorAll('.idea-bubble').forEach((button,index)=>{const contour=button.querySelector('.idea-contour'),details=button.querySelector('.idea-details');const mirrored=index%2?bubbleVertices.map(([x,y])=>[200-x,y]).reverse():bubbleVertices;const source=samplePolygon(mirrored),target=samplePolygon(ideaShapes[index]);details.innerHTML=ideaDetails[index];let progress=0,destination=0,frame=0,last=0,hover=false;function draw(){contour.setAttribute('d',source.map((p,i)=>`${i?'L':'M'}${(p[0]+(target[i][0]-p[0])*progress).toFixed(2)} ${(p[1]+(target[i][1]-p[1])*progress).toFixed(2)}`).join(' ')+'Z');details.style.opacity=String(Math.max(0,(progress-.5)*2))}function tick(now){progress+=(destination-progress)*(1-Math.exp(-Math.min(now-last,40)/120));last=now;if(Math.abs(progress-destination)<.001){progress=destination;frame=0;draw()}else{draw();frame=requestAnimationFrame(tick)}}function move(value){destination=value;if(matchMedia('(prefers-reduced-motion:reduce)').matches){cancelAnimationFrame(frame);frame=0;progress=value;draw()}else if(!frame){last=performance.now();frame=requestAnimationFrame(tick)}}button.addEventListener('pointerenter',()=>{hover=true;move(1)});button.addEventListener('pointerleave',()=>{hover=false;if(document.activeElement!==button)move(0)});button.addEventListener('focus',()=>move(1));button.addEventListener('blur',()=>{if(!hover)move(0)});button.addEventListener('click',()=>move(destination?0:1));draw()});
