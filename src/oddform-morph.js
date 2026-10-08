import {states,interpolate,ring,cream} from './geometry.js';
import {svgMarkup} from './svg.js';
import {textureLayer,updateTexture,sourceVertices} from './surface.js';
let serial=0;
/** Dependency-free reusable element. Public API: setState, replay, duration, flat. */
export class OddformMorph extends HTMLElement {
 constructor(){super();this.attachShadow({mode:'open'});this.progress=0;this.target=0;this.velocity=0;this.duration=800;this._raf=0;this._replayTimer=0;this.pinned=false;this.hovered=false;}
 connectedCallback(){if(this.shadowRoot.childNodes.length)return;
 const id='morph-'+(++serial);
 this.shadowRoot.innerHTML=`<style>:host{display:block;cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent}svg{display:block;width:100%;height:auto;overflow:visible}:host(:focus-visible){outline:1px solid #d98454;outline-offset:-40px;border-radius:50%}.shading{display:none}:host([flat]) .texture{display:none}:host([flat]) .body{filter:none}:host([flat]) .orange{fill:#d64a17}:host([flat]) .ivory{fill:#f4ead5}</style>${svgMarkup(states.normal,id)}`;
 const layer=textureLayer(id,new URL('../assets/reference-texture.png',import.meta.url).href);this.shadowRoot.querySelector('.body').insertAdjacentHTML('beforeend',layer.markup);this._patches=layer.patches;for(const p of this._patches){const clip=this.shadowRoot.getElementById(p.key);p.path=clip.firstElementChild;p.image=clip.nextElementSibling.firstElementChild;}
 this.setAttribute('role','button');this.setAttribute('aria-label','Transform the Oddform logo');this.tabIndex=0;this.setAttribute('aria-pressed','false');
 this.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){this.hovered=true;this.setState(1);}});
 this.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch'){this.hovered=false;if(!this.pinned)this.setState(0);}});
 this.addEventListener('click',()=>{this.pinned=!this.pinned;this.setState(this.pinned?1:0);});
 this.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();this.click();}});this.render();
 }
 disconnectedCallback(){cancelAnimationFrame(this._raf);clearTimeout(this._replayTimer);}
 set material(value){this._material=value==='odd'?'odd':'normal';const sources=[sourceVertices(false,this._material),sourceVertices(true,this._material)];for(const p of this._patches||[])p.source=p.indices.map(k=>sources[p.cream?1:0][k]);this.render();}get material(){return this._material||'normal';}
 get flat(){return this.hasAttribute('flat');}set flat(v){this.toggleAttribute('flat',!!v);}
 setState(value){clearTimeout(this._replayTimer);this.target=value==='odd'||value===1?1:0;this.setAttribute('aria-pressed',String(!!this.target));this.dispatchEvent(new CustomEvent('statechange',{detail:{state:this.target?'odd':'normal'},bubbles:true}));if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.progress=this.target;this.velocity=0;this.render();return;}if(!this._raf){this._last=performance.now();this._raf=requestAnimationFrame(t=>this.tick(t));}}
 tick(now){const dt=Math.min((now-this._last)/1000,.032);this._last=now;
 // Critically damped spring: preserves position AND velocity on reversal.
 const w=9.25/(this.duration/1000),x=this.progress-this.target,e=Math.exp(-w*dt),c=this.velocity+w*x;
 this.progress=this.target+(x+c*dt)*e;this.velocity=(this.velocity-w*c*dt)*e;this.render();
 if(Math.abs(this.progress-this.target)<.0006&&Math.abs(this.velocity)<.004){this.progress=this.target;this.velocity=0;this.render();this._raf=0;}else this._raf=requestAnimationFrame(t=>this.tick(t));
 }
 render(){const s=interpolate(Math.max(0,Math.min(1,this.progress))),paths={ring:ring(s),cream:cream(s)};this.shadowRoot.querySelectorAll('[data-geometry]').forEach(el=>el.setAttribute('d',paths[el.dataset.geometry]));
 const t=this.progress,shades=[['upper',350+100*t,305-45*t,190-45*t,98+10*t,-35+10*t],['lower',310-30*t,640+10*t,145-10*t,110-15*t,35+5*t]];
 for(const [key,x,y,rx,ry,a]of shades){const el=this.shadowRoot.querySelector(`[data-shade="${key}"]`);if(el){for(const[k,v]of Object.entries({cx:x,cy:y,rx,ry}))el.setAttribute(k,v);el.setAttribute('transform',`rotate(${a} ${x} ${y})`);}}
 if(this._patches)updateTexture(this.shadowRoot,this._patches,Math.max(0,Math.min(1,this.progress)));
 this.dispatchEvent(new CustomEvent('morphframe',{detail:{progress:this.progress},bubbles:true}));
 }
 replay(){this.pinned=false;this.setState(0);this._replayTimer=setTimeout(()=>{this.setState(1);this._replayTimer=setTimeout(()=>this.setState(0),this.duration+350);},this.duration+100);}
}
customElements.define('oddform-morph',OddformMorph);
