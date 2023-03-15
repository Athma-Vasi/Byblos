import{r as P,k as b,m as j,R as l,o as x,J as w}from"./index-031fa283.js";function L(r){return P.Children.toArray(r).filter(Boolean)}const B={left:"flex-start",center:"center",right:"flex-end",apart:"space-between"};var F=b((r,{spacing:e,position:a,noWrap:t,grow:n,align:s,count:o})=>({root:{boxSizing:"border-box",display:"flex",flexDirection:"row",alignItems:s||"center",flexWrap:t?"nowrap":"wrap",justifyContent:B[a],gap:r.fn.size({size:e,sizes:r.spacing}),"& > *":{boxSizing:"border-box",maxWidth:n?`calc(${100/o}% - ${r.fn.size({size:e,sizes:r.spacing})-r.fn.size({size:e,sizes:r.spacing})/o}px)`:void 0,flexGrow:n?1:0}}}));const H=F;var A=Object.defineProperty,u=Object.getOwnPropertySymbols,R=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable,S=(r,e,a)=>e in r?A(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a,J=(r,e)=>{for(var a in e||(e={}))R.call(e,a)&&S(r,a,e[a]);if(u)for(var a of u(e))h.call(e,a)&&S(r,a,e[a]);return r},U=(r,e)=>{var a={};for(var t in r)R.call(r,t)&&e.indexOf(t)<0&&(a[t]=r[t]);if(r!=null&&u)for(var t of u(r))e.indexOf(t)<0&&h.call(r,t)&&(a[t]=r[t]);return a};const q={position:"left",spacing:"md"},C=P.forwardRef((r,e)=>{const a=j("Group",q,r),{className:t,position:n,align:s,children:o,noWrap:d,grow:i,spacing:c,unstyled:_}=a,m=U(a,["className","position","align","children","noWrap","grow","spacing","unstyled"]),p=L(o),{classes:v,cx:O}=H({align:s,grow:i,noWrap:d,spacing:c,position:n,count:p.length},{unstyled:_,name:"Group"});return l.createElement(x,J({className:O(v.root,t),ref:e},m),p)});C.displayName="@mantine/core/Group";var K=b((r,{spacing:e,align:a,justify:t})=>({root:{display:"flex",flexDirection:"column",alignItems:a,justifyContent:t,gap:r.fn.size({size:e,sizes:r.spacing})}}));const M=K;var Q=Object.defineProperty,g=Object.getOwnPropertySymbols,D=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable,N=(r,e,a)=>e in r?Q(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a,X=(r,e)=>{for(var a in e||(e={}))D.call(e,a)&&N(r,a,e[a]);if(g)for(var a of g(e))G.call(e,a)&&N(r,a,e[a]);return r},Y=(r,e)=>{var a={};for(var t in r)D.call(r,t)&&e.indexOf(t)<0&&(a[t]=r[t]);if(r!=null&&g)for(var t of g(r))e.indexOf(t)<0&&G.call(r,t)&&(a[t]=r[t]);return a};const Z={spacing:"md",align:"stretch",justify:"flex-start"},W=P.forwardRef((r,e)=>{const a=j("Stack",Z,r),{spacing:t,className:n,align:s,justify:o,unstyled:d}=a,i=Y(a,["spacing","className","align","justify","unstyled"]),{classes:c,cx:_}=M({spacing:t,align:s,justify:o},{name:"Stack",unstyled:d});return l.createElement(x,X({className:_(c.root,n),ref:e},i))});W.displayName="@mantine/core/Stack";function gr({spacing:r,offset:e,orientation:a,children:t,role:n,unstyled:s}){return a==="horizontal"?l.createElement(C,{pt:e,spacing:r,role:n,unstyled:s},t):l.createElement(W,{pt:e,spacing:r,role:n,unstyled:s},t)}var rr=Object.defineProperty,er=Object.defineProperties,ar=Object.getOwnPropertyDescriptors,z=Object.getOwnPropertySymbols,tr=Object.prototype.hasOwnProperty,nr=Object.prototype.propertyIsEnumerable,E=(r,e,a)=>e in r?rr(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a,sr=(r,e)=>{for(var a in e||(e={}))tr.call(e,a)&&E(r,a,e[a]);if(z)for(var a of z(e))nr.call(e,a)&&E(r,a,e[a]);return r},lr=(r,e)=>er(r,ar(e));const or={xs:16,sm:20,md:24,lg:30,xl:36};var ir=b((r,{labelPosition:e,size:a})=>({root:{},body:{display:"flex"},labelWrapper:lr(sr({},r.fn.fontStyles()),{display:"inline-flex",flexDirection:"column",WebkitTapHighlightColor:"transparent",fontSize:r.fn.size({size:a,sizes:r.fontSizes}),lineHeight:`${r.fn.size({size:a,sizes:or})}px`,color:r.colorScheme==="dark"?r.colors.dark[0]:r.black,cursor:r.cursorType,order:e==="left"?1:2}),description:{marginTop:`calc(${r.spacing.xs}px / 2)`,[e==="left"?"paddingRight":"paddingLeft"]:r.spacing.sm},error:{marginTop:`calc(${r.spacing.xs}px / 2)`,[e==="left"?"paddingRight":"paddingLeft"]:r.spacing.sm},label:{cursor:r.cursorType,[e==="left"?"paddingRight":"paddingLeft"]:r.spacing.sm,"&[data-disabled]":{color:r.colorScheme==="dark"?r.colors.dark[3]:r.colors.gray[5]}}}));const cr=ir;var pr=Object.defineProperty,y=Object.getOwnPropertySymbols,T=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable,I=(r,e,a)=>e in r?pr(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a,fr=(r,e)=>{for(var a in e||(e={}))T.call(e,a)&&I(r,a,e[a]);if(y)for(var a of y(e))V.call(e,a)&&I(r,a,e[a]);return r},dr=(r,e)=>{var a={};for(var t in r)T.call(r,t)&&e.indexOf(t)<0&&(a[t]=r[t]);if(r!=null&&y)for(var t of y(r))e.indexOf(t)<0&&V.call(r,t)&&(a[t]=r[t]);return a};function _r(r){var e=r,{__staticSelector:a,className:t,classNames:n,styles:s,unstyled:o,children:d,label:i,description:c,id:_,disabled:m,error:p,size:v,labelPosition:O}=e,k=dr(e,["__staticSelector","className","classNames","styles","unstyled","children","label","description","id","disabled","error","size","labelPosition"]);const{classes:f,cx:$}=cr({size:v,labelPosition:O},{name:a,styles:s,classNames:n,unstyled:o});return l.createElement(x,fr({className:$(f.root,t)},k),l.createElement("div",{className:$(f.body)},d,l.createElement("div",{className:f.labelWrapper},i&&l.createElement("label",{className:f.label,"data-disabled":m||void 0,htmlFor:_},i),c&&l.createElement(w.Description,{className:f.description},c),p&&p!=="boolean"&&l.createElement(w.Error,{className:f.error},p))))}_r.displayName="@mantine/core/InlineInput";export{gr as I,_r as a};