import {states,interpolate} from './geometry.js';
const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
function cubic(p,t){const q=1-t;return [0,1].map(k=>q*q*q*p[k]+3*q*q*t*p[k+2]+3*q*t*t*p[k+4]+t*t*t*p[k+6]);}
function arc(a,u,reverse){const z=Math.min(u*4,3.999999999),j=Math.floor(z),t=z-j;let p;
 if(!reverse){const i=2+j*6,start=j?a.slice(i-2,i):a.slice(0,2);p=[...start,...a.slice(i,i+6)];}
 else{const k=7-j,i=2+k*6;p=[...a.slice(i+4,i+6),...a.slice(i+2,i+4),...a.slice(i,i+2),...a.slice(i-2,i)];}
 return cubic(p,t);
}
export function surface(s,u,v,cream){const a=arc(s.outer,u,cream),b=arc(s.inner,u,cream),a0=s.outer.slice(0,2),b0=s.inner.slice(0,2),a1=s.outer.slice(24,26),b1=s.inner.slice(24,26);
 const c=cubic([...a0,...s.topFold.slice(2,4),...s.topFold.slice(0,2),...b0],v),d=cubic([...a1,...s.bottomFold,...b1],v);
 const blend=lerp(lerp(a0,b0,v),lerp(a1,b1,v),u);
 return [0,1].map(k=>(1-v)*a[k]+v*b[k]+(1-u)*c[k]+u*d[k]-blend[k]);}
export function mesh(s,cream,cols=32,rows=cream?16:6){const vertices=[];for(let i=0;i<=cols;i++)for(let j=0;j<=rows;j++)vertices.push(surface(s,i/cols,j/rows,cream));// Relax interior vertices so texture follows the curved fold boundaries.
 for(let pass=0;pass<350;pass++)for(let i=1;i<cols;i++)for(let j=1;j<rows;j++){const k=i*(rows+1)+j;for(let d=0;d<2;d++)vertices[k][d]=(vertices[k-1][d]+vertices[k+1][d]+vertices[k-rows-1][d]+vertices[k+rows+1][d])/4;}
 const tris=[];for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const a=i*(rows+1)+j,b=a+rows+1;tris.push([a,b,a+1],[b,b+1,a+1]);}const sign=cream?-1:1,free=k=>{const i=Math.floor(k/(rows+1)),j=k%(rows+1);return i>0&&i<cols&&j>0&&j<rows;};
 for(let pass=0;pass<1800;pass++)for(const tri of tris){const [a,b,c]=tri.map(k=>vertices[k]),area=sign*((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]));if(area>=2)continue;const gradients=[[b[1]-c[1],c[0]-b[0]],[c[1]-a[1],a[0]-c[0]],[a[1]-b[1],b[0]-a[0]]].map(g=>g.map(x=>x*sign));const norm=gradients.reduce((n,g,j)=>n+(free(tri[j])?g[0]*g[0]+g[1]*g[1]:0),0);if(norm)tri.forEach((k,j)=>{if(free(k))for(let d=0;d<2;d++)vertices[k][d]+=.8*(2-area)*gradients[j][d]/norm;});}
 return {vertices,tris};}
export function isRenderedTriangle(cream,index,count){return cream?index!==31:index!==count-1;}
export function affine(src,dst){const [p,q,r]=src,[a,b,c]=dst,ux=q[0]-p[0],uy=q[1]-p[1],vx=r[0]-p[0],vy=r[1]-p[1],det=ux*vy-vx*uy;
 if(Math.abs(det)<1e-8)return null;
 const ax=((b[0]-a[0])*vy-(c[0]-a[0])*uy)/det,bx=((c[0]-a[0])*ux-(b[0]-a[0])*vx)/det;
 const ay=((b[1]-a[1])*vy-(c[1]-a[1])*uy)/det,by=((c[1]-a[1])*ux-(b[1]-a[1])*vx)/det;
 return [ax,ay,bx,by,a[0]-ax*p[0]-bx*p[1],a[1]-ay*p[0]-by*p[1]];}
const endpoints=[false,true].map(cream=>[mesh(states.normal,cream),mesh(states.odd,cream)]);
export function sourceVertices(cream,material){const odd=material==='odd';return endpoints[cream?1:0][odd?1:0].vertices.map(([x,y])=>odd?[438+(x-450)/.88,507+(y-450)/.88]:[1169+(x-450)/1.08,507+(y-450)/1.08]);}
export function textureLayer(id,url,t=0,material='normal'){let markup=`<defs><image id="${id}-source" href="${url}" width="1536" height="1024"/></defs><g class="texture">`;
 const patches=[];
 for(const cream of [false,true]){const m=endpoints[cream?1:0][1];const source=sourceVertices(cream,material);markup+=`<g clip-path="url(#${id}-${cream?'cream':'clip'})">`;
 for(let j=0;j<m.tris.length;j++){if(!isRenderedTriangle(cream,j,m.tris.length))continue;const key=`${id}-tri-${cream?1:0}-${j}`;const points=m.tris[j].map(k=>lerp(endpoints[cream?1:0][0].vertices[k],m.vertices[k],t)),uv=m.tris[j].map(k=>source[k]),matrix=affine(uv,points);const center=points.reduce((a,p)=>[a[0]+p[0]/3,a[1]+p[1]/3],[0,0]),expanded=points.map(p=>p.map((v,k)=>v+(v-center[k])*.009));markup+=`<clipPath id="${key}" clipPathUnits="userSpaceOnUse"><path d="M${expanded.map(p=>p.join(' ')).join('L')}Z"/></clipPath><g clip-path="url(#${key})"><use href="#${id}-source" transform="matrix(${matrix.join(' ')})"/></g>`;patches.push({key,indices:m.tris[j],source:m.tris[j].map(k=>source[k]),cream});}markup+='</g>';}
 return {markup:markup+'</g>',patches};}
export function updateTexture(root,patches,t){const meshes=endpoints.map(([a,b])=>({vertices:a.vertices.map((p,i)=>lerp(p,b.vertices[i],t))}));
 for(const p of patches){const points=p.indices.map(i=>meshes[p.cream?1:0].vertices[i]),m=affine(p.source,points);if(!m)continue;
 // Expand by a fraction of a pixel to avoid antialiased cracks between tiles.
 const center=points.reduce((a,p)=>[a[0]+p[0]/3,a[1]+p[1]/3],[0,0]);const expanded=points.map(p=>p.map((v,k)=>v+(v-center[k])*.009));
 p.path.setAttribute('d',`M${expanded.map(p=>p.join(' ')).join('L')}Z`);p.image.setAttribute('transform',`matrix(${m.join(' ')})`);}
}
