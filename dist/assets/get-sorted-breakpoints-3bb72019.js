function n(s,t){if(!s)return[];const r=Object.keys(s).filter(e=>e!=="base").map(e=>[t.fn.size({size:e,sizes:t.breakpoints}),s[e]]);return r.sort((e,i)=>e[0]-i[0]),r}export{n as g};
