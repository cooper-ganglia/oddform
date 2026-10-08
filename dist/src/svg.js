import {ring,cream} from './geometry.js';
export function svgMarkup(s,id='oddform'){
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" role="img" aria-label="Oddform sculpted ribbon" class="sculpture">
 <defs>
 <linearGradient id="${id}-orange" x1="15%" y1="25%" x2="85%" y2="70%"><stop stop-color="#341307"/><stop offset=".38" stop-color="#a33309"/><stop offset=".64" stop-color="#ed4a0b"/><stop offset=".85" stop-color="#e94c0a"/><stop offset="1" stop-color="#7c270c"/></linearGradient>
 <linearGradient id="${id}-ivory" x1="20%" y1="5%" x2="80%" y2="95%"><stop stop-color="#fff7e4"/><stop offset=".35" stop-color="#f5ead3"/><stop offset=".63" stop-color="#e4d5bb"/><stop offset="1" stop-color="#fff0d9"/></linearGradient>
 <radialGradient id="${id}-fold"><stop stop-color="#271e17" stop-opacity=".85"/><stop offset=".46" stop-color="#524a40" stop-opacity=".58"/><stop offset="1" stop-color="#887c68" stop-opacity="0"/></radialGradient>
 <linearGradient id="${id}-edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffbe9" stop-opacity=".9"/><stop offset=".6" stop-color="#fffbe9" stop-opacity="0"/></linearGradient>
 <filter id="${id}-shadow" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="15" flood-color="#000" flood-opacity=".36"/></filter>
 <clipPath id="${id}-clip"><path data-geometry="ring" d="${ring(s)}" clip-rule="evenodd"/></clipPath>
 <clipPath id="${id}-cream"><path data-geometry="cream" d="${cream(s)}"/></clipPath>
 </defs>
 <g class="body" filter="url(#${id}-shadow)">
 <path data-geometry="ring" class="orange surface" d="${ring(s)}" fill="url(#${id}-orange)" fill-rule="evenodd"/>
 <g clip-path="url(#${id}-clip)">
 <path data-geometry="cream" class="ivory surface" d="${cream(s)}" fill="url(#${id}-ivory)"/>
 <g class="shading" clip-path="url(#${id}-cream)"><ellipse data-shade="upper" cx="350" cy="305" rx="190" ry="98" fill="url(#${id}-fold)" transform="rotate(-35 350 305)"/><ellipse data-shade="lower" cx="310" cy="640" rx="145" ry="110" fill="url(#${id}-fold)" transform="rotate(35 310 640)"/></g>
 <path data-geometry="cream" class="shading rim" d="${cream(s)}" fill="none" stroke="url(#${id}-edge)" stroke-width="1.5"/>
 </g></g></svg>`;
}
