import{r as f,u as V,j as T,F as $,a as e,L,S as d,T as k,E as N,b as z,M as B,l as i,c as C}from"./index-031fa283.js";import{u as G}from"./react-intersection-observer.esm-274d9d73.js";import H from"./index-1e643e4a.js";import"./index.esm-c48e3429.js";import"./index.esm-65c92dff.js";import"./index-d87e9139.js";import"./Popover-411edea3.js";import"./use-reduced-motion-017d389a.js";import"./get-default-z-index-b47c3510.js";import"./Card-06514448.js";import"./CloseButton-eab6b835.js";import"./index.esm-2ae87725.js";function re({allStates:u,allActions:y,allDispatches:x}){const[g,D]=f.useState(!0);V();const{ref:R,inView:b}=G({threshold:0});let{responseState:{fetchUrl:I,startIndex:S,searchTerm:m,searchResults:r,selectedVolume:F,selectedAuthor:j,selectedPublisher:q,bookshelfVolumes:M}}=u,{responseDispatch:U}=x,{responseActions:{setAll:_}}=y;f.useEffect(()=>{let c=!1;return b&&(async()=>{var w;const l=S+40;try{const p=m||await i.getItem("byblos-searchTerm")||await i.getItem("byblos-searchTerm").then(t=>{var a;return(a=t==null?void 0:t.at(-1))==null?void 0:a.searchTerm})||"",[s,h]=I.split("?q=")||await i.getItem("byblos-fetchUrl").then(t=>t==null?void 0:t.split("?q="))||await i.getItem("byblos-fetchUrl").then(t=>{var a,E;return(E=(a=t==null?void 0:t.at(-1))==null?void 0:a.fetchUrl)==null?void 0:E.split("?q=")})||"",P=h.includes("&maxResults=")?`${s}?q=${m}&startIndex=${l}${h}`:`${s}?q=${m}&startIndex=${l}&maxResults=40${h}`,{data:o}=await C.get(P);c||(o.items&&((w=r==null?void 0:r.items)==null||w.push(...o==null?void 0:o.items),U({type:_,payload:{responseState:{fetchUrl:I,startIndex:l,searchTerm:p,searchResults:{...o,items:r==null?void 0:r.items},selectedVolume:F,selectedAuthor:j,selectedPublisher:q,bookshelfVolumes:M}}})),(l>600||!o.items)&&D(!1))}catch(p){const s=new Error(p,{cause:"fetchMoreResults()"});console.group("Error in displayResults useEffect"),console.error("name: ",s.name),console.error("message: ",s.message),console.error("cause: ",s.cause),console.groupCollapsed("stack trace"),console.trace(s),console.error("detailed stack trace",s.stack),console.groupEnd()}})(),()=>{c=!0}},[b]);const A=r&&g?T($,{align:"center",justify:"center",children:[e(L,{size:"sm"}),e(d,{w:"xs"}),e(k,{children:"Fetching more results..."})]}):e($,{align:"center",justify:"center",children:e(k,{children:"No more results"})});return T("div",{children:[Array.from({length:3}).map((c,n)=>e(d,{h:"xs"},n)),e(N,{fallback:e(z,{componentName:"Display Results"}),children:e(f.Suspense,{fallback:e(B,{componentName:"Display Results"}),children:e(H,{allStates:u,allActions:y,allDispatches:x})})}),e("div",{ref:g?R:null,children:A}),Array.from({length:5}).map((c,n)=>e(d,{h:"xl"},n))]})}export{re as default};