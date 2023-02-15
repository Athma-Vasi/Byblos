import{r as w,y as Ee,g as q,h as I,R as _,m as se,k as Ie,T as Me,q as Ce,u as Ne,d as je,j as A,F as J,a as u,L as V,S as Le,O as Re,t as Ae,l as Q}from"./index-064c6a11.js";import{a as Ve,b as Te}from"./index.esm-008f09fb.js";import{d as He,e as Be}from"./index.esm-6f373bf9.js";import{V as ze}from"./index.esm-4d5fd9be.js";import{P as G,i as Fe}from"./Popover-77682786.js";import{c as O,u as Ue}from"./use-delayed-hover-2ef1bd55.js";import{u as Ke,a as qe}from"./use-reduced-motion-36c0a9c9.js";import{N as L}from"./NavLink-756590e1.js";import"./get-default-z-index-b47c3510.js";function T(e,r){let o=e;for(;(o=o.parentElement)&&!o.matches(r););return o}function We(e,r,o){for(let t=e-1;t>=0;t-=1)if(!r[t].disabled)return t;if(o){for(let t=r.length-1;t>-1;t-=1)if(!r[t].disabled)return t}return e}function Ge(e,r,o){for(let t=e+1;t<r.length;t+=1)if(!r[t].disabled)return t;if(o){for(let t=0;t<r.length;t+=1)if(!r[t].disabled)return t}return e}function Je(e,r,o){return T(e,o)===T(r,o)}function Qe({parentSelector:e,siblingSelector:r,onKeyDown:o,loop:t=!0,activateOnFocus:c=!1,dir:i="rtl",orientation:a}){return n=>{var p;o==null||o(n);const l=Array.from(((p=T(n.currentTarget,e))==null?void 0:p.querySelectorAll(r))||[]).filter(m=>Je(n.currentTarget,m,e)),s=l.findIndex(m=>n.currentTarget===m),d=Ge(s,l,t),h=We(s,l,t),b=i==="rtl"?h:d,f=i==="rtl"?d:h;switch(n.key){case"ArrowRight":{a==="horizontal"&&(n.stopPropagation(),n.preventDefault(),l[b].focus(),c&&l[b].click());break}case"ArrowLeft":{a==="horizontal"&&(n.stopPropagation(),n.preventDefault(),l[f].focus(),c&&l[f].click());break}case"ArrowUp":{a==="vertical"&&(n.stopPropagation(),n.preventDefault(),l[h].focus(),c&&l[h].click());break}case"ArrowDown":{a==="vertical"&&(n.stopPropagation(),n.preventDefault(),l[d].focus(),c&&l[d].click());break}case"Home":{n.stopPropagation(),n.preventDefault(),!l[0].disabled&&l[0].focus();break}case"End":{n.stopPropagation(),n.preventDefault();const m=l.length-1;!l[m].disabled&&l[m].focus();break}}}}function Xe(e,r,o){var t;return o?Array.from(((t=T(o,r))==null?void 0:t.querySelectorAll(e))||[]).findIndex(c=>c===o):null}function Ye(){const[e,r]=w.useState(-1);return[e,{setHovered:r,resetHovered:()=>r(-1)}]}const ie={context:"Menu component was not found in the tree",children:"Menu.Target component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported"},[Ze,R]=Ee(ie.context);var er=q(e=>({divider:{margin:`calc(${e.spacing.xs}px / 2) -5px`,borderTop:`1px solid ${e.colorScheme==="dark"?e.colors.dark[4]:e.colors.gray[2]}`}}));const rr=er;var or=Object.defineProperty,H=Object.getOwnPropertySymbols,ce=Object.prototype.hasOwnProperty,de=Object.prototype.propertyIsEnumerable,X=(e,r,o)=>r in e?or(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,tr=(e,r)=>{for(var o in r||(r={}))ce.call(r,o)&&X(e,o,r[o]);if(H)for(var o of H(r))de.call(r,o)&&X(e,o,r[o]);return e},nr=(e,r)=>{var o={};for(var t in e)ce.call(e,t)&&r.indexOf(t)<0&&(o[t]=e[t]);if(e!=null&&H)for(var t of H(e))r.indexOf(t)<0&&de.call(e,t)&&(o[t]=e[t]);return o};const ar={},ue=w.forwardRef((e,r)=>{const o=I("MenuDivider",ar,e),{children:t,className:c}=o,i=nr(o,["children","className"]),{classNames:a,styles:n,unstyled:p}=R(),{classes:l,cx:s}=rr(null,{name:"Menu",classNames:a,styles:n,unstyled:p});return _.createElement(se,tr({className:s(l.divider,c),ref:r},i))});ue.displayName="@mantine/core/MenuDivider";var lr=Object.defineProperty,B=Object.getOwnPropertySymbols,pe=Object.prototype.hasOwnProperty,fe=Object.prototype.propertyIsEnumerable,Y=(e,r,o)=>r in e?lr(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,sr=(e,r)=>{for(var o in r||(r={}))pe.call(r,o)&&Y(e,o,r[o]);if(B)for(var o of B(r))fe.call(r,o)&&Y(e,o,r[o]);return e},ir=(e,r)=>{var o={};for(var t in e)pe.call(e,t)&&r.indexOf(t)<0&&(o[t]=e[t]);if(e!=null&&B)for(var t of B(e))r.indexOf(t)<0&&fe.call(e,t)&&(o[t]=e[t]);return o};const cr={};function me(e){const r=I("MenuDropdown",cr,e),{children:o,onMouseEnter:t,onMouseLeave:c}=r,i=ir(r,["children","onMouseEnter","onMouseLeave"]),a=w.useRef(),n=R(),p=d=>{(d.key==="ArrowUp"||d.key==="ArrowDown")&&(d.preventDefault(),a.current.querySelectorAll("[data-menu-item]")[0].focus())},l=O(t,()=>n.trigger==="hover"&&n.openDropdown()),s=O(c,()=>n.trigger==="hover"&&n.closeDropdown());return _.createElement(G.Dropdown,sr({onMouseEnter:l,onMouseLeave:s,role:"menu","aria-orientation":"vertical"},i),_.createElement("div",{tabIndex:-1,"data-menu-dropdown":!0,"data-autofocus":!0,onKeyDown:p,ref:a,style:{outline:0}},o))}me.displayName="@mantine/core/MenuDropdown";var dr=Object.defineProperty,ur=Object.defineProperties,pr=Object.getOwnPropertyDescriptors,Z=Object.getOwnPropertySymbols,fr=Object.prototype.hasOwnProperty,mr=Object.prototype.propertyIsEnumerable,ee=(e,r,o)=>r in e?dr(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,vr=(e,r)=>{for(var o in r||(r={}))fr.call(r,o)&&ee(e,o,r[o]);if(Z)for(var o of Z(r))mr.call(r,o)&&ee(e,o,r[o]);return e},hr=(e,r)=>ur(e,pr(r)),yr=q((e,{color:r,radius:o})=>({item:hr(vr({},e.fn.fontStyles()),{WebkitTapHighlightColor:"transparent",fontSize:e.fontSizes.sm,border:0,backgroundColor:"transparent",outline:0,width:"100%",textAlign:"left",textDecoration:"none",boxSizing:"border-box",padding:`${e.spacing.xs}px ${e.spacing.sm}px`,cursor:"pointer",borderRadius:e.fn.radius(o),color:r?e.fn.variant({variant:"filled",primaryFallback:!1,color:r}).background:e.colorScheme==="dark"?e.colors.dark[0]:e.black,display:"flex",alignItems:"center","&:disabled":{color:e.colorScheme==="dark"?e.colors.dark[3]:e.colors.gray[5],pointerEvents:"none",userSelect:"none"},"&[data-hovered]":{backgroundColor:r?e.fn.variant({variant:"light",color:r}).background:e.colorScheme==="dark"?e.fn.rgba(e.colors.dark[3],.35):e.colors.gray[1]}}),itemLabel:{flex:1},itemIcon:{display:"flex",justifyContent:"center",alignItems:"center",marginRight:e.spacing.xs},itemRightSection:{}}));const gr=yr;var _r=Object.defineProperty,wr=Object.defineProperties,br=Object.getOwnPropertyDescriptors,z=Object.getOwnPropertySymbols,ve=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable,re=(e,r,o)=>r in e?_r(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,Or=(e,r)=>{for(var o in r||(r={}))ve.call(r,o)&&re(e,o,r[o]);if(z)for(var o of z(r))he.call(r,o)&&re(e,o,r[o]);return e},Pr=(e,r)=>wr(e,br(r)),$r=(e,r)=>{var o={};for(var t in e)ve.call(e,t)&&r.indexOf(t)<0&&(o[t]=e[t]);if(e!=null&&z)for(var t of z(e))r.indexOf(t)<0&&he.call(e,t)&&(o[t]=e[t]);return o};const xr={},ye=w.forwardRef((e,r)=>{const o=I("MenuItem",xr,e),{children:t,className:c,color:i,closeMenuOnClick:a,icon:n,rightSection:p}=o,l=$r(o,["children","className","color","closeMenuOnClick","icon","rightSection"]),s=R(),{classes:d,cx:h,theme:b}=gr({radius:s.radius,color:i},{name:"Menu",classNames:s.classNames,styles:s.styles,unstyled:s.unstyled}),f=w.useRef(),m=s.getItemIndex(f.current),y=l,g=O(y.onMouseLeave,()=>s.setHovered(-1)),M=O(y.onMouseEnter,()=>s.setHovered(s.getItemIndex(f.current))),C=O(y.onClick,()=>{typeof a=="boolean"?a&&s.closeDropdownImmediately():s.closeOnItemClick&&s.closeDropdownImmediately()}),N=O(y.onFocus,()=>s.setHovered(s.getItemIndex(f.current)));return _.createElement(se,Pr(Or({component:"button",type:"button"},l),{tabIndex:-1,onFocus:N,className:h(d.item,c),ref:Ke(f,r),role:"menuitem","data-menu-item":!0,"data-hovered":s.hovered===m?!0:void 0,onMouseEnter:M,onMouseLeave:g,onClick:C,onKeyDown:Qe({siblingSelector:"[data-menu-item]",parentSelector:"[data-menu-dropdown]",activateOnFocus:!1,loop:s.loop,dir:b.dir,orientation:"vertical",onKeyDown:y.onKeydown})}),n&&_.createElement("div",{className:d.itemIcon},n),t&&_.createElement("div",{className:d.itemLabel},t),p&&_.createElement("div",{className:d.itemRightSection},p))});ye.displayName="@mantine/core/MenuItem";const kr=Ie(ye);var Sr=q(e=>({label:{color:e.colorScheme==="dark"?e.colors.dark[2]:e.colors.gray[6],fontWeight:500,fontSize:e.fontSizes.xs,padding:`calc(${e.spacing.xs}px / 2) ${e.spacing.sm}px`,cursor:"default"}}));const Dr=Sr;var Er=Object.defineProperty,F=Object.getOwnPropertySymbols,ge=Object.prototype.hasOwnProperty,_e=Object.prototype.propertyIsEnumerable,oe=(e,r,o)=>r in e?Er(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,Ir=(e,r)=>{for(var o in r||(r={}))ge.call(r,o)&&oe(e,o,r[o]);if(F)for(var o of F(r))_e.call(r,o)&&oe(e,o,r[o]);return e},Mr=(e,r)=>{var o={};for(var t in e)ge.call(e,t)&&r.indexOf(t)<0&&(o[t]=e[t]);if(e!=null&&F)for(var t of F(e))r.indexOf(t)<0&&_e.call(e,t)&&(o[t]=e[t]);return o};const Cr={},we=w.forwardRef((e,r)=>{const o=I("MenuLabel",Cr,e),{children:t,className:c}=o,i=Mr(o,["children","className"]),{classNames:a,styles:n,unstyled:p}=R(),{classes:l,cx:s}=Dr(null,{name:"Menu",classNames:a,styles:n,unstyled:p});return _.createElement(Me,Ir({className:s(l.label,c),ref:r},i),t)});we.displayName="@mantine/core/MenuLabel";var Nr=Object.defineProperty,U=Object.getOwnPropertySymbols,be=Object.prototype.hasOwnProperty,Oe=Object.prototype.propertyIsEnumerable,te=(e,r,o)=>r in e?Nr(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,jr=(e,r)=>{for(var o in r||(r={}))be.call(r,o)&&te(e,o,r[o]);if(U)for(var o of U(r))Oe.call(r,o)&&te(e,o,r[o]);return e},Lr=(e,r)=>{var o={};for(var t in e)be.call(e,t)&&r.indexOf(t)<0&&(o[t]=e[t]);if(e!=null&&U)for(var t of U(e))r.indexOf(t)<0&&Oe.call(e,t)&&(o[t]=e[t]);return o};const Rr={refProp:"ref"},Pe=w.forwardRef((e,r)=>{const o=I("MenuTarget",Rr,e),{children:t,refProp:c}=o,i=Lr(o,["children","refProp"]);if(!Fe(t))throw new Error(ie.children);const a=R(),n=O(t.props.onClick,()=>a.trigger==="click"&&a.toggleDropdown()),p=O(t.props.onMouseEnter,()=>a.trigger==="hover"&&a.openDropdown()),l=O(t.props.onMouseLeave,()=>a.trigger==="hover"&&a.closeDropdown());return _.createElement(G.Target,jr({refProp:c,popupType:"menu",ref:r},i),w.cloneElement(t,{onClick:n,onMouseEnter:p,onMouseLeave:l,"data-expanded":a.opened?!0:void 0}))});Pe.displayName="@mantine/core/MenuTarget";var Ar=q({dropdown:{padding:4}});const Vr=Ar;var Tr=Object.defineProperty,Hr=Object.defineProperties,Br=Object.getOwnPropertyDescriptors,K=Object.getOwnPropertySymbols,$e=Object.prototype.hasOwnProperty,xe=Object.prototype.propertyIsEnumerable,ne=(e,r,o)=>r in e?Tr(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,ae=(e,r)=>{for(var o in r||(r={}))$e.call(r,o)&&ne(e,o,r[o]);if(K)for(var o of K(r))xe.call(r,o)&&ne(e,o,r[o]);return e},le=(e,r)=>Hr(e,Br(r)),zr=(e,r)=>{var o={};for(var t in e)$e.call(e,t)&&r.indexOf(t)<0&&(o[t]=e[t]);if(e!=null&&K)for(var t of K(e))r.indexOf(t)<0&&xe.call(e,t)&&(o[t]=e[t]);return o};const Fr={closeOnItemClick:!0,loop:!0,trigger:"click",openDelay:0,closeDelay:100};function v(e){const r=I("Menu",Fr,e),{children:o,onOpen:t,onClose:c,opened:i,defaultOpened:a,onChange:n,closeOnItemClick:p,loop:l,closeOnEscape:s,trigger:d,openDelay:h,closeDelay:b,classNames:f,styles:m,unstyled:y,radius:g}=r,M=zr(r,["children","onOpen","onClose","opened","defaultOpened","onChange","closeOnItemClick","loop","closeOnEscape","trigger","openDelay","closeDelay","classNames","styles","unstyled","radius"]),{classes:C,cx:N}=Vr(),[$,{setHovered:x,resetHovered:W}]=Ye(),[P,j]=qe({value:i,defaultValue:a,finalValue:!1,onChange:n}),k=()=>{j(!1),P&&(c==null||c())},D=()=>{j(!0),!P&&(t==null||t())},E=()=>P?k():D(),{openDropdown:S,closeDropdown:ke}=Ue({open:D,close:k,closeDelay:b,openDelay:h}),Se=De=>Xe("[data-menu-item]","[data-menu-dropdown]",De);return Ce(()=>{W()},[P]),_.createElement(Ze,{value:{opened:P,toggleDropdown:E,getItemIndex:Se,hovered:$,setHovered:x,closeOnItemClick:p,closeDropdown:d==="click"?k:ke,openDropdown:d==="click"?D:S,closeDropdownImmediately:k,loop:l,trigger:d,radius:g,classNames:f,styles:m,unstyled:y}},_.createElement(G,le(ae({},M),{radius:g,opened:P,onChange:j,defaultOpened:a,trapFocus:d==="click",closeOnEscape:s&&d==="click",__staticSelector:"Menu",classNames:le(ae({},f),{dropdown:N(C.dropdown,f==null?void 0:f.dropdown)}),styles:m,unstyled:y,onClose:k,onOpen:D}),o))}v.displayName="@mantine/core/Menu";v.Item=kr;v.Label=we;v.Dropdown=me;v.Target=Pe;v.Divider=ue;function Zr({allStates:e,allActions:r,allDispatches:o}){const{volumeId:t}=Ne(),{width:c=0}=je(),[i,a]=w.useState({menu:!1,overview:!0,otherEditions:!1,publisherCollection:!1,authorCollection:!1}),[n,p]=w.useState(!1);let{responseState:{fetchUrl:l,startIndex:s,searchTerm:d,searchResults:h,selectedVolume:b,selectedAuthor:f,selectedPublisher:m,bookshelfVolumes:y},themeState:{theme:g},navlinksState:M}=e,{navlinksActions:C}=r,{navlinksDispatch:N}=o;const $={navlinksState:M,navlinksActions:C,navlinksDispatch:N};async function x(W,P){let{navlinksState:j,navlinksActions:k,navlinksDispatch:D}=P;Ae(j,k,D);try{const E=await Q.getItem("byblos-historyState")??[{fetchUrl:l,startIndex:s,searchTerm:d,searchResults:h,selectedVolume:b,selectedAuthor:f,selectedPublisher:m,bookshelfVolumes:y}];E.push({fetchUrl:l,startIndex:s,searchTerm:d,searchResults:h,selectedVolume:b,selectedAuthor:f,selectedPublisher:m,bookshelfVolumes:y}),await Q.setItem("byblos-historyState",E)}catch(E){const S=new Error(E,{cause:"handleNavLinkActiveClick()"});console.group("Error in displayVolume eventHandler"),console.error("name: ",S.name),console.error("message: ",S.message),console.error("cause: ",S.cause),console.groupCollapsed("stack trace"),console.trace(S),console.error("detailed stack trace",S.stack),console.groupEnd()}switch(W){case"Menu":{a({...i,menu:!0});break}case"Overview":{a({...i,menu:!1,overview:!0,otherEditions:!1,publisherCollection:!1,authorCollection:!1});break}case"Other editions":{a({...i,menu:!1,overview:!1,otherEditions:!0,publisherCollection:!1,authorCollection:!1});break}case"Publisher collection":{a({...i,menu:!1,overview:!1,otherEditions:!1,publisherCollection:!0,authorCollection:!1});break}case"Author collection":{a({...i,menu:!1,overview:!1,otherEditions:!1,publisherCollection:!1,authorCollection:!0});break}default:{a({...i,menu:!1,overview:!0,otherEditions:!1,publisherCollection:!1,authorCollection:!1});break}}}return A(J,{direction:"column",align:"center",justify:"center",style:{width:"100%"},children:[A(v,{position:"bottom-start",transition:c<576?"slide-left":"slide-down",transitionDuration:382,radius:"sm",children:[u(v.Target,{children:u(L,{active:i.menu,label:"Menu",variant:"light",icon:u(Ve,{size:20,style:{color:`${g==="light"?"#B06519":"#B87333"}`}}),"data-cy":"menu-displayVolume",onClick:()=>{x("Menu",$),p(!n)}})}),A(v.Dropdown,{children:[u(v.Label,{color:g==="light"?"dark.6":"gray.5",children:"Navigate to"}),A(J,{direction:c<576?"column":"row",children:[u(v.Item,{children:u(V,{to:`/home/displayVolume/${t}/overview`,style:{textDecoration:"none",color:"inherit"},children:u(L,{active:i.overview,label:"Overview",variant:"subtle",icon:u(He,{size:20,style:{color:`${g==="light"?"#B06519":"#B87333"}`}}),"data-cy":"menu-overview-displayVolume",onClick:()=>x("Overview",$)})})}),u(v.Item,{children:u(V,{to:`/home/displayVolume/${t}/otherEditions`,style:{textDecoration:"none",color:"inherit"},children:u(L,{active:i.otherEditions,label:"Other editions",variant:"subtle",icon:u(ze,{size:20,style:{color:`${g==="light"?"#B06519":"#B87333"}`}}),"data-cy":"menu-otherEditions-displayVolume",onClick:()=>x("Other editions",$)})})}),u(v.Item,{children:u(V,{to:`/home/displayVolume/${t}/publisherCollection`,style:{textDecoration:"none",color:"inherit"},children:u(L,{active:i.publisherCollection,label:"Publisher collection",variant:"subtle",icon:u(Be,{size:20,style:{color:`${g==="light"?"#B06519":"#B87333"}`}}),"data-cy":"menu-publisherCollection-displayVolume",onClick:()=>x("Publisher collection",$)})})}),u(v.Item,{children:u(V,{to:`/home/displayVolume/${t}/authorCollection`,style:{textDecoration:"none",color:"inherit"},children:u(L,{active:i.authorCollection,label:"Author collection",variant:"subtle",icon:u(Te,{size:20,style:{color:`${g==="light"?"#B06519":"#B87333"}`}}),"data-cy":"menu-authorCollection-displayVolume",onClick:()=>x("Author collection",$)})})})]})]})]}),u(Le,{h:"xl"}),u(Re,{})]})}export{Zr as default};
