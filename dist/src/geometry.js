// Hand-traced reference-space cubic contours. Both states have identical topology.
// Each contour has 8 cubics; indices 0 and 4 anchor the ribbon's two folds.
const normal = {
 outer: [1209,201, 1288,216,1386,302,1431,358, 1468,404,1487,468,1483,529, 1481,644,1397,760,1294,799, 1230,823,1157,822,1093,813, 1000,794,919,724,880,650, 844,582,847,479,876,402, 924,285,1039,207,1115,198, 1153,193,1181,194,1209,201],
 inner: [1068,371, 1099,354,1133,346,1165,351, 1201,354,1230,372,1250,400, 1280,430,1304,472,1296,511, 1295,552,1278,592,1254,622, 1208,641,1162,650,1117,639, 1067,627,1033,596,1013,558, 985,509,999,445,1025,411, 1038,394,1053,381,1068,371],
 topFold: [1115,315,1162,258], bottomFold: [1147,749,1200,686]
};
const odd = {
 outer: [558,211, 600,247,645,357,674,413, 711,478,767,511,798,553, 845,619,827,690,774,731, 682,799,521,831,428,826, 343,822,320,760,240,723, 163,688,83,681,59,584, 23,451,132,403,233,358, 386,289,398,134,523,204,
 ],
 inner: [394,440, 438,427,471,447,494,477, 534,526,618,528,656,562, 673,588,624,652,578,676, 553,690,529,695,506,694, 458,664,407,640,365,607, 326,580,300,552,305,519, 309,484,338,458,366,446, 376,442,385,441,394,440],
 topFold: [610,414,623,272], bottomFold: [554,837,558,723]
};
odd.outer.splice(44,6, 365,299,393,150,558,211); // maintain 8-cubic contour
odd.outer[odd.outer.length-2]=558; odd.outer[odd.outer.length-1]=211;
function normalize(shape,cx,cy,scale){
 const map=a=>a.map((v,i)=>450+(v-(i%2?cy:cx))*scale);
 return Object.fromEntries(Object.entries(shape).map(([k,v])=>[k,map(v)]));
}
export const states={normal:normalize(normal,1169,507,1.08),odd:normalize(odd,438,507,.88)};
const n=v=>Number(v.toFixed(3));
export function contour(a){let d=`M${n(a[0])} ${n(a[1])}`; for(let i=2;i<a.length;i+=6)d+=`C${a.slice(i,i+6).map(n).join(' ')}`;return d+'Z';}
export function ring(s){return contour(s.outer)+contour(s.inner);}
export function cream(s){
 const a=s.outer,b=s.inner;
 let d=`M${n(a[0])} ${n(a[1])}`;
 // Walk backwards along left outside, from the upper to the lower fold.
 for(let j=7;j>=4;j--){const i=2+j*6,p=j===0?a.slice(0,2):a.slice(2+(j-1)*6+4,2+(j-1)*6+6); d+=`C${[...a.slice(i+2,i+4),...a.slice(i,i+2),...p].map(n).join(' ')}`;}
 const lower=b.slice(24,26); d+=`C${[...s.bottomFold,...lower].map(n).join(' ')}`;
 for(let j=4;j<8;j++)d+=`C${b.slice(2+j*6,8+j*6).map(n).join(' ')}`;
 d+=`C${[...s.topFold,...a.slice(0,2)].map(n).join(' ')}Z`;return d;
}
export function interpolate(t){return Object.fromEntries(Object.keys(states.normal).map(k=>[k,states.normal[k].map((v,i)=>v+(states.odd[k][i]-v)*t)]));}
