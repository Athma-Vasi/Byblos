import{r as h,u as A,j as P,a as t,S as E,E as V,b as j,M as F,l as i,c as N}from"./index-064c6a11.js";import{u as B}from"./react-intersection-observer.esm-299e8c76.js";import C from"./index-5d3916a2.js";import"./index.esm-008f09fb.js";import"./index.esm-6f373bf9.js";import"./index-63689533.js";import"./Popover-77682786.js";import"./use-reduced-motion-36c0a9c9.js";import"./get-default-z-index-b47c3510.js";import"./Card-5f2de60e.js";import"./CloseButton-a48066d3.js";import"./index.esm-348e47db.js";function v({allStates:d,allActions:u,allDispatches:y}){const[w,$]=h.useState(!0);A();const{ref:k,inView:b}=B({threshold:0});let{responseState:{fetchUrl:g,startIndex:R,searchTerm:m,searchResults:r,selectedVolume:D,selectedAuthor:S,selectedPublisher:T,bookshelfVolumes:q}}=d,{responseDispatch:M}=y,{responseActions:{setAll:U}}=u;return h.useEffect(()=>{let c=!1;return b&&(async()=>{var x;const l=R+40;try{const p=m||await i.getItem("byblos-searchTerm")||await i.getItem("byblos-searchTerm").then(e=>{var a;return(a=e==null?void 0:e.at(-1))==null?void 0:a.searchTerm})||"",[s,f]=g.split("?q=")||await i.getItem("byblos-fetchUrl").then(e=>e==null?void 0:e.split("?q="))||await i.getItem("byblos-fetchUrl").then(e=>{var a,I;return(I=(a=e==null?void 0:e.at(-1))==null?void 0:a.fetchUrl)==null?void 0:I.split("?q=")})||"",_=f.includes("&maxResults=")?`${s}?q=${m}&startIndex=${l}${f}`:`${s}?q=${m}&startIndex=${l}&maxResults=40${f}`,{data:o}=await N.get(_);c||(o.items&&((x=r==null?void 0:r.items)==null||x.push(...o==null?void 0:o.items),M({type:U,payload:{responseState:{fetchUrl:g,startIndex:l,searchTerm:p,searchResults:{...o,items:r==null?void 0:r.items},selectedVolume:D,selectedAuthor:S,selectedPublisher:T,bookshelfVolumes:q}}})),(l>600||!o.items)&&$(!1))}catch(p){const s=new Error(p,{cause:"fetchMoreResults()"});console.group("Error in displayResults useEffect"),console.error("name: ",s.name),console.error("message: ",s.message),console.error("cause: ",s.cause),console.groupCollapsed("stack trace"),console.trace(s),console.error("detailed stack trace",s.stack),console.groupEnd()}})(),()=>{c=!0}},[b]),P("div",{children:[Array.from({length:3}).map((c,n)=>t(E,{h:"xs"},n)),t(V,{fallback:t(j,{componentName:"Display Results"}),children:t(h.Suspense,{fallback:t(F,{componentName:"Display Results"}),children:t(C,{allStates:d,allActions:u,allDispatches:y})})}),t("div",{ref:w?k:null}),Array.from({length:5}).map((c,n)=>t(E,{h:"xl"},n))]})}export{v as default};
