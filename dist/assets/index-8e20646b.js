import{k as ve,r as G,Y as fe,R as E,o as te,Z as ue,p as ye,n as be,m as ge,h as U,j as Y,a as o,S as O,g as R,$ as ke,a0 as _e,a1 as we,l as i}from"./index-031fa283.js";import{f as Se,g as L}from"./index.esm-2ae87725.js";import{c as xe}from"./index.esm-c48e3429.js";import{g as ae}from"./get-sorted-breakpoints-3bb72019.js";import{g as Be}from"./get-default-z-index-b47c3510.js";import{N as B}from"./NavLink-b4e14e59.js";import"./use-reduced-motion-017d389a.js";var ze=Object.defineProperty,$e=Object.defineProperties,Oe=Object.getOwnPropertyDescriptors,Z=Object.getOwnPropertySymbols,Pe=Object.prototype.hasOwnProperty,Ie=Object.prototype.propertyIsEnumerable,q=(e,t,r)=>t in e?ze(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,V=(e,t)=>{for(var r in t||(t={}))Pe.call(t,r)&&q(e,r,t[r]);if(Z)for(var r of Z(t))Ie.call(t,r)&&q(e,r,t[r]);return e},J=(e,t)=>$e(e,Oe(t)),Re=ve((e,{height:t,width:r,fixed:a,position:g,hiddenBreakpoint:c,zIndex:d,section:p,withBorder:v,layout:m})=>{const f=typeof r=="object"&&r!==null?ae(r,e).reduce((w,[l,z])=>(w[`@media (min-width: ${l}px)`]={width:z,minWidth:z},w),{}):null,u=v?{[p==="navbar"?"borderRight":"borderLeft"]:`1px solid ${e.colorScheme==="dark"?e.colors.dark[5]:e.colors.gray[2]}`}:{};return{root:J(V(V(J(V(V({},e.fn.fontStyles()),g),{top:m==="alt"?0:(g==null?void 0:g.top)||"var(--mantine-header-height)",bottom:0,zIndex:d,height:t||(m==="alt"?"auto":"calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))"),width:(r==null?void 0:r.base)||"100%",position:a?"fixed":"static",boxSizing:"border-box",display:"flex",flexDirection:"column",backgroundColor:e.colorScheme==="dark"?e.colors.dark[7]:e.white}),u),f),{"&[data-hidden]":{[`@media (max-width: ${e.fn.size({size:c,sizes:e.breakpoints})-1}px)`]:{display:"none"}}})}});const Le=Re;var Ne=Object.defineProperty,C=Object.getOwnPropertySymbols,oe=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable,K=(e,t,r)=>t in e?Ne(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Q=(e,t)=>{for(var r in t||(t={}))oe.call(t,r)&&K(e,r,t[r]);if(C)for(var r of C(t))se.call(t,r)&&K(e,r,t[r]);return e},Ve=(e,t)=>{var r={};for(var a in e)oe.call(e,a)&&t.indexOf(a)<0&&(r[a]=e[a]);if(e!=null&&C)for(var a of C(e))t.indexOf(a)<0&&se.call(e,a)&&(r[a]=e[a]);return r};const le=G.forwardRef((e,t)=>{var r=e,{width:a,height:g,fixed:c=!1,position:d,zIndex:p,hiddenBreakpoint:v="md",hidden:m=!1,withBorder:f=!0,className:u,classNames:w,styles:l,children:z,section:$,__staticSelector:j,unstyled:M}=r,D=Ve(r,["width","height","fixed","position","zIndex","hiddenBreakpoint","hidden","withBorder","className","classNames","styles","children","section","__staticSelector","unstyled"]);const P=fe(),{classes:S,cx:k,theme:x}=Le({width:a,height:g,fixed:P.fixed||c,position:d,hiddenBreakpoint:v,zIndex:p||P.zIndex||Be("app"),section:$,withBorder:f,layout:P.layout},{classNames:w,styles:l,name:j,unstyled:M}),H=ae(a,x).reduce((N,[F,T])=>(N[`@media (min-width: ${F}px)`]={[`--mantine-${$}-width`]:`${T}px`},N),{});return E.createElement(te,Q({component:$==="navbar"?"nav":"aside",ref:t,"data-hidden":m||void 0,className:k(S.root,u)},D),z,E.createElement(ue,{styles:()=>({":root":Q({[`--mantine-${$}-width`]:a!=null&&a.base?`${a.base}px`:"0px"},H)})}))});le.displayName="@mantine/core/HorizontalSection";var Ee=Object.defineProperty,A=Object.getOwnPropertySymbols,ne=Object.prototype.hasOwnProperty,ie=Object.prototype.propertyIsEnumerable,X=(e,t,r)=>t in e?Ee(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Ce=(e,t)=>{for(var r in t||(t={}))ne.call(t,r)&&X(e,r,t[r]);if(A)for(var r of A(t))ie.call(t,r)&&X(e,r,t[r]);return e},Ae=(e,t)=>{var r={};for(var a in e)ne.call(e,a)&&t.indexOf(a)<0&&(r[a]=e[a]);if(e!=null&&A)for(var a of A(e))t.indexOf(a)<0&&ie.call(e,a)&&(r[a]=e[a]);return r};const ce=G.forwardRef((e,t)=>{var r=e,{children:a,grow:g=!1,sx:c}=r,d=Ae(r,["children","grow","sx"]);return E.createElement(te,Ce({ref:t,sx:[{flex:g?1:0,boxSizing:"border-box"},...ye(c)]},d),a)});ce.displayName="@mantine/core/Section";const je=be(ce);var Me=Object.defineProperty,ee=Object.getOwnPropertySymbols,De=Object.prototype.hasOwnProperty,He=Object.prototype.propertyIsEnumerable,re=(e,t,r)=>t in e?Me(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Fe=(e,t)=>{for(var r in t||(t={}))De.call(t,r)&&re(e,r,t[r]);if(ee)for(var r of ee(t))He.call(t,r)&&re(e,r,t[r]);return e};const Te={fixed:!1,position:{top:0,left:0},hiddenBreakpoint:"md",hidden:!1},W=G.forwardRef((e,t)=>{const r=ge("Navbar",Te,e);return E.createElement(le,Fe({section:"navbar",__staticSelector:"Navbar",ref:t},r))});W.Section=je;W.displayName="@mantine/core/Navbar";function Ge(e){return U({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M102.594 25.97l90.062 345.78L481.844 395 391.75 49.22 102.594 25.97zm-18.906 1.593c-30.466 11.873-55.68 53.098-49.75 75.312l3.25 11.78c.667-1.76 1.36-3.522 2.093-5.28C49.19 85.668 65.84 62.61 89.657 50.47l-5.97-22.907zm44.937 18.906l247.813 21.593 80.937 305.156-249.344-20.064L128.626 46.47zM94.53 69.155c-16.66 10.01-29.916 28.068-38 47.406-5.245 12.552-8.037 25.64-8.75 36.532l64.814 235.28c.293-.55.572-1.105.875-1.655 10.6-19.254 27.822-37.696 51.124-48.47L94.53 69.156zm74.876 287.563c-17.673 9.067-31.144 23.712-39.562 39-4.464 8.105-7.262 16.36-8.688 23.75l11.688 42.405 1.625.125c-3.825-27.528 11.382-60.446 41.25-81.03l-6.314-24.25zm26.344 34.03c-32.552 17.26-46.49 52.402-41.844 72.906l289.844 24.53c-5.315-7.75-8.637-17.84-8.594-28.342l-22.562-9.063 46.625-7.31-13.595-12.97c5.605-6.907 13.688-13.025 24.78-17.656L195.75 390.75z"}}]})(e)}function Ue(e){return U({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M169 57v430h78V57h-78zM25 105v190h46V105H25zm158 23h18v320h-18V128zm128.725 7.69l-45.276 8.124 61.825 344.497 45.276-8.124-61.825-344.497zM89 153v270h62V153H89zm281.502 28.68l-27.594 11.773 5.494 12.877 27.594-11.773-5.494-12.877zm12.56 29.433l-27.597 11.772 5.494 12.877 27.593-11.772-5.492-12.877zm12.555 29.434l-27.594 11.77 99.674 233.628 27.594-11.773-99.673-233.625zM25 313v30h46v-30H25zm190 7h18v128h-18V320zM25 361v126h46V361H25zm64 80v46h62v-46H89z"}}]})(e)}function We(e){return U({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256.65 38.984l-49.697 100.702-111.13 16.146 80.413 78.385-18.982 110.68 99.396-52.256 99.397 52.256-18.983-110.68 80.413-78.384-111.127-16.146-49.7-100.702zM112 308.826l-26.674 54.05-59.646 8.665 43.16 42.073-10.188 59.403L112 444.97l53.348 28.046-10.188-59.403 43.16-42.072-59.646-8.665L112 308.825zm288 0l-26.674 54.05-59.646 8.665 43.16 42.073-10.188 59.403L400 444.97l53.348 28.046-10.188-59.403 43.16-42.072-59.646-8.665L400 308.825z"}}]})(e)}function er({opened:e,setOpened:t,allStates:r,allActions:a,allDispatches:g}){let{responseState:{fetchUrl:c,startIndex:d,searchTerm:p,searchResults:v,selectedVolume:m,selectedAuthor:f,selectedPublisher:u,bookshelfVolumes:w},themeState:{theme:l},navlinksState:{isMyLibraryActive:z,isBookshelfActive:$,isFavouritesActive:j,isRatedActive:M,isMarkReadActive:D,isReadLaterActive:P}}=r,{responseDispatch:S,navlinksDispatch:k}=g,{responseActions:{setBookshelfVolumes:x},navlinksActions:{setIsMyLibraryActive:H,setIsBookshelfActive:N,setIsFavouritesActive:F,setIsRatedActive:T,setIsMarkReadActive:de,setIsReadLaterActive:he}}=a;async function me(){k({type:H});try{const _=await i.getItem("byblos-historyState")??[{fetchUrl:c,startIndex:d,searchTerm:p,searchResults:v,selectedVolume:m,selectedAuthor:f,selectedPublisher:u,bookshelfVolumes:w}];_.push({fetchUrl:c,startIndex:d,searchTerm:p,searchResults:v,selectedVolume:m,selectedAuthor:f,selectedPublisher:u,bookshelfVolumes:w}),await i.setItem("byblos-historyState",_)}catch(_){const y=new Error(_,{cause:"handleParentNavlinkClick()"});console.group("Error in navbar eventHandler"),console.error("name: ",y.name),console.error("message: ",y.message),console.error("cause: ",y.cause),console.groupCollapsed("stack trace"),console.trace(y),console.error("detailed stack trace",y.stack),console.groupEnd()}}async function I(_){switch(t(!1),window.scrollTo(0,0),_){case"bookshelf":{k({type:N});break}case"rated":{k({type:T});break}case"favourites":{k({type:F});break}case"markRead":{k({type:de});break}case"readLater":{k({type:he});break}}try{const y=await i.getItem("byblos-userBookshelf"),s=structuredClone(y);switch(_){case"bookshelf":{const n=s==null?void 0:s.map(h=>h.volume);S({type:x,payload:{responseState:{fetchUrl:c,startIndex:d,searchTerm:p,searchResults:v,selectedVolume:m,selectedAuthor:f,selectedPublisher:u,bookshelfVolumes:n??[]}}});break}case"rated":{const n=s==null?void 0:s.reduce((h,b)=>(b.rating&&h.push(b.volume),h),[]);S({type:x,payload:{responseState:{fetchUrl:c,startIndex:d,searchTerm:p,searchResults:v,selectedVolume:m,selectedAuthor:f,selectedPublisher:u,bookshelfVolumes:n??[]}}});break}case"favourites":{const n=s==null?void 0:s.reduce((h,b)=>(b.favourite&&h.push(b.volume),h),[]);S({type:x,payload:{responseState:{fetchUrl:c,startIndex:d,searchTerm:p,searchResults:v,selectedVolume:m,selectedAuthor:f,selectedPublisher:u,bookshelfVolumes:n??[]}}});break}case"markRead":{const n=s==null?void 0:s.reduce((h,b)=>(b.markRead&&h.push(b.volume),h),[]);S({type:x,payload:{responseState:{fetchUrl:c,startIndex:d,searchTerm:p,searchResults:v,selectedVolume:m,selectedAuthor:f,selectedPublisher:u,bookshelfVolumes:n??[]}}});break}case"readLater":{const n=s==null?void 0:s.reduce((h,b)=>(b.readLater&&h.push(b.volume),h),[]);S({type:x,payload:{responseState:{fetchUrl:c,startIndex:d,searchTerm:p,searchResults:v,selectedVolume:m,selectedAuthor:f,selectedPublisher:u,bookshelfVolumes:n??[]}}});break}}}catch(y){const s=new Error(y,{cause:"handleChildNavlinksClick()"});console.group("Error in navbar component"),console.error("name: ",s.name),console.error("message: ",s.message),console.error("cause: ",s.cause),console.groupCollapsed("stack trace"),console.trace(s),console.error("detailed stack",s.stack),console.groupEnd()}}async function pe(_){const y=window.confirm("Are you sure you want to clear your bookshelf from this device? This action cannot be undone.");try{if(!y)return;const s=[await i.removeItem("byblos-fetchUrl"),await i.removeItem("byblos-startIndex"),await i.removeItem("byblos-searchTerm"),await i.removeItem("byblos-searchResults"),await i.removeItem("byblos-selectedVolume"),await i.removeItem("byblos-selectedAuthor"),await i.removeItem("byblos-selectedPublisher"),await i.removeItem("byblos-bookshelfVolumes"),await i.removeItem("byblos-userBookshelf"),await i.removeItem("byblos-historyState"),await i.removeItem("byblos-footer")];Promise.all(s).then(()=>{window.alert("Your bookshelf has been cleared from this device.")})}catch(s){const n=new Error(s,{cause:"handleClearStorageNavlinkClick()"});console.group("Error in navbar eventHandler"),console.error("name: ",n.name),console.error("message: ",n.message),console.error("cause: ",n.cause),console.groupCollapsed("stack trace"),console.trace(n),console.error("detailed stack",n.stack),console.groupEnd()}}return Y(W,{p:"md",hiddenBreakpoint:"sm",hidden:!e,width:{sm:200,lg:300},color:l==="light"?"dark.6":"gray.5","data-cy":"navbar",children:[Y(B,{label:"My Library",active:z,onClick:me,icon:o(xe,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),rightSection:o(Se,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),variant:"subtle",childrenOffset:28,"data-cy":"navlink-myLibrary",children:[o(O,{h:"sm"}),o(R,{to:"/home/displayBookshelf",style:{textDecoration:"none",color:"inherit"},children:o(B,{label:"Bookshelf",icon:o(Ue,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),active:$,rightSection:o(L,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),onClick:()=>I("bookshelf"),variant:"subtle","data-cy":"navlink-bookshelf"})}),o(O,{h:"sm"}),o(R,{to:"/home/displayBookshelf",style:{textDecoration:"none",color:"inherit"},children:o(B,{label:"Favourites",icon:o(ke,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),active:j,rightSection:o(L,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),onClick:()=>I("favourites"),variant:"subtle","data-cy":"navlink-favourites"})}),o(O,{h:"sm"}),o(R,{to:"/home/displayBookshelf",style:{textDecoration:"none",color:"inherit"},children:o(B,{label:"Rated",icon:o(We,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),active:M,rightSection:o(L,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),onClick:()=>I("rated"),variant:"subtle","data-cy":"navlink-rated"})}),o(O,{h:"sm"}),o(R,{to:"/home/displayBookshelf",style:{textDecoration:"none",color:"inherit"},children:o(B,{label:"Finished reading",icon:o(Ge,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),active:D,rightSection:o(L,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),onClick:()=>I("markRead"),variant:"subtle","data-cy":"navlink-markRead"})}),o(O,{h:"sm"}),o(R,{to:"/home/displayBookshelf",style:{textDecoration:"none",color:"inherit"},children:o(B,{label:"Want to read",icon:o(_e,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),active:P,rightSection:o(L,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),onClick:()=>I("readLater"),variant:"subtle","data-cy":"navlink-readLater"})})]}),o(O,{h:"sm"}),o(B,{label:"Clear storage",icon:o(we,{size:20,style:{color:`${l==="light"?"#B06519":"#B87333"}`}}),"data-cy":"navlink-clearStorage",onClick:pe})]})}export{er as default};
