/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-atrule-domprefixes-hasevent-mq-prefixed-prefixedcss-prefixedcssvalue-prefixes-setclasses-testallprops-testprop-teststyles !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,i,s,a;for(var u in C)if(C.hasOwnProperty(u)){if(e=[],n=C[u],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),g.push((o?"":"no-")+a.join("-"))}}function i(e){var n=x.className,t=Modernizr._config.classPrefix||"";if(w&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),w?x.className.baseVal=n:x.className=n)}function s(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):w?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function a(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function u(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function f(){var e=n.body;return e||(e=s(w?"svg":"body"),e.fake=!0),e}function l(e,t,r,o){var i,a,u,l,p="modernizr",c=s("div"),d=f();if(parseInt(r,10))for(;r--;)u=s("div"),u.id=o?o[r]:p+(r+1),c.appendChild(u);return i=s("style"),i.type="text/css",i.id="s"+p,(d.fake?d:c).appendChild(i),d.appendChild(c),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),c.id=p,d.fake&&(d.style.background="",d.style.overflow="hidden",l=x.style.overflow,x.style.overflow="hidden",x.appendChild(d)),a=t(c,e),d.fake?(d.parentNode.removeChild(d),x.style.overflow=l,x.offsetHeight):c.parentNode.removeChild(c),!!a}function p(e,n){return!!~(""+e).indexOf(n)}function c(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(u(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+u(n[o])+":"+r+")");return i=i.join(" or "),l("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return t}function d(e,n){return function(){return e.apply(n,arguments)}}function m(e,n,t){var o;for(var i in e)if(e[i]in n)return t===!1?e[i]:(o=n[e[i]],r(o,"function")?d(o,t||n):o);return!1}function v(e,n,o,i){function u(){l&&(delete L.style,delete L.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var f=c(e,o);if(!r(f,"undefined"))return f}for(var l,d,m,v,y,h=["modernizr","tspan"];!L.style;)l=!0,L.modElem=s(h.shift()),L.style=L.modElem.style;for(m=e.length,d=0;m>d;d++)if(v=e[d],y=L.style[v],p(v,"-")&&(v=a(v)),L.style[v]!==t){if(i||r(o,"undefined"))return u(),"pfx"==n?v:!0;try{L.style[v]=o}catch(g){}if(L.style[v]!=y)return u(),"pfx"==n?v:!0}return u(),!1}function y(e,n,t,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+P.join(s+" ")+s).split(" ");return r(n,"string")||r(n,"undefined")?v(a,n,o,i):(a=(e+" "+E.join(s+" ")+s).split(" "),m(a,n,t))}function h(e,n,r){return y(e,t,t,n,r)}var g=[],C=[],S={_version:"3.2.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){C.push({name:e,fn:n,options:t})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=S,Modernizr=new Modernizr;var _=S._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];S._prefixes=_;var x=n.documentElement,w="svg"===x.nodeName.toLowerCase(),b="Moz O ms Webkit",E=S._config.usePrefixes?b.toLowerCase().split(" "):[];S._domPrefixes=E;var P=S._config.usePrefixes?b.split(" "):[];S._cssomPrefixes=P;var z=function(n){var r,o=_.length,i=e.CSSRule;if("undefined"==typeof i)return t;if(!n)return!1;if(n=n.replace(/^@/,""),r=n.replace(/-/g,"_").toUpperCase()+"_RULE",r in i)return"@"+n;for(var s=0;o>s;s++){var a=_[s],u=a.toUpperCase()+"_"+r;if(u in i)return"@-"+a.toLowerCase()+"-"+n}return!1};S.atRule=z;var A=function(){function e(e,n){var o;return e?(n&&"string"!=typeof n||(n=s(n||"div")),e="on"+e,o=e in n,!o&&r&&(n.setAttribute||(n=s("div")),n.setAttribute(e,""),o="function"==typeof n[e],n[e]!==t&&(n[e]=t),n.removeAttribute(e)),o):!1}var r=!("onblur"in n.documentElement);return e}();S.hasEvent=A;var N=function(e,n){var t=!1,r=s("div"),o=r.style;if(e in o){var i=E.length;for(o[e]=n,t=o[e];i--&&!t;)o[e]="-"+E[i]+"-"+n,t=o[e]}return""===t&&(t=!1),t};S.prefixedCSSValue=N;var j=function(){var n=e.matchMedia||e.msMatchMedia;return n?function(e){var t=n(e);return t&&t.matches||!1}:function(n){var t=!1;return l("@media "+n+" { #modernizr { position: absolute; } }",function(n){t="absolute"==(e.getComputedStyle?e.getComputedStyle(n,null):n.currentStyle).position}),t}}();S.mq=j;var k=(S.testStyles=l,{elem:s("modernizr")});Modernizr._q.push(function(){delete k.elem});var L={style:k.elem.style};Modernizr._q.unshift(function(){delete L.style});S.testProp=function(e,n,r){return v([e],t,n,r)};S.testAllProps=y;var T=S.prefixed=function(e,n,t){return 0===e.indexOf("@")?z(e):(-1!=e.indexOf("-")&&(e=a(e)),n?y(e,n,t):y(e,"pfx"))};S.prefixedCSS=function(e){var n=T(e);return n&&u(n)};S.testAllProps=h,o(),i(g),delete S.addTest,delete S.addAsyncTest;for(var q=0;q<Modernizr._q.length;q++)Modernizr._q[q]();e.Modernizr=Modernizr}(window,document);