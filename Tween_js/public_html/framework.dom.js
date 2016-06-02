
(function (window, document) {
  
  //===========================================================================
  //          Polyfills
  
  // Array.isArray: como no site da MDN (Mozilla)
  function _isClass(arg, strKlass){
    return Object.prototype.toString.call(arg) === strKlass;
  }
  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return _isClass(arg,'[object Array]');
    };
  }
  
  
  
  //===========================================================================
  //          Function prototype
  
  var FunctionProto = window.Function.prototype;
  if( !FunctionProto.bind ) FunctionProto.bind = function(that){
    var me = this, arr = Array.prototype.slice(arguments,1);
    return function(){
      return me.apply( that, arr );
    };
  };
  
  
  
  
  
  
  //===========================================================================
  //          EventTarget prototype
  
  // EventTarget para a maioria dos navegadores
  // Node para o IE!
  var EventTypeProto = (window.EventTarget || window.Node).prototype;
  EventTypeProto.off = function (eventName, callback, useCapture) {
    return this.removeEventListener(eventName, callback, useCapture);
  };
  EventTypeProto.on = function (eventName, callback, useCapture) {
    this.addEventListener(eventName, callback, useCapture);
    return EventTypeProto.off.bind(this, eventName, callback, useCapture);
  };
  EventTypeProto.one = function (eventName, callback, useCapture, times) {
    if (!times)
      times = 1;
    else if (times < 1)
      return function () {};
    var _retirar = null;
    var _func = function () {
      callback();
      if (!--times)
        _retirar();
    };
    return _retirar = this.on(eventName, _func, useCapture);
  };
  
  EventTypeProto.bind = EventTypeProto.on;
  EventTypeProto.unbind = EventTypeProto.off;
  
  
  
  
  
  
  
  
  //===========================================================================
  //          Element prototype

  var ElementProto = window.Element.prototype;
  var matchesSelector = ElementProto.matches
                        || ElementProto.matchesSelector
                        || ElementProto.webkitMatchesSelector
                        || ElementProto.mozMatchesSelector
                        || ElementProto.msMatchesSelector
                        || ElementProto.oMatchesSelector;
  if(!ElementProto.matches) ElementProto.matches = function( str ){ return matchesSelector.call(this,str); };
  
  ElementProto.find = function (str) {
    var nodeList = this.querySelectorAll(str), len = nodeList.length;
    var arr = [];
    for (var i = 0; i < len; i++)
      arr.push(nodeList[i]);
    return $(arr);
  };
  
  if ('classList' in ElementProto) {
    ElementProto.hasClass = function () {
      return this.classList.contains.apply(this.classList, arguments );
    };
    ElementProto.addClass = function () {
      this.classList.add.apply(this.classList, arguments );
      return this;
    };
    ElementProto.removeClass = function () {
      this.classList.remove.apply(this.classList, arguments );
      return this;
    };
  } else {
    ElementProto.hasClass = function (str) {
      return new RegExp('\\b' + str + '\\b').test(this.className);
    };
    ElementProto.addClass = function () {
      var i = arguments.length, str;
      while( i-- ){
        str = arguments[i];
        if( !this.hasClass(str) ) this.className += ' ' + str;
      }
      return this;
    };
    ElementProto.removeClass = function (str) {
      var i = arguments.length, str;
      while( i-- ){
        str = arguments[i];
        this.className = this.className.replace(new RegExp('\\b'+ str+'\\b', 'g'), '');
      }
      return this;
    };
  }
  ElementProto.toggleClass = function (str) {
    if (this.hasClass(str))
      this.removeClass(str);
    else
      this.addClass(str);
    return this;
  };
  
  ElementProto.after = function(/*...val*/){
    var el, lenArg = arguments.length, j = 0, parent = this.parent(), next = this.next();
    for(; j < lenArg; j++){ 
      el = arguments[j-1];
      if( $.is$(el) ){
        var len = el.length, i = len;
        while( i-- ) parent.insertBefore( el[len-i-1], next );
      }else if( $.isFunc(el) ){
        parent.insertBefore( el(), next );
      }else{
        parent.insertBefore( _elStr(el)? _createElFromStr(el) : el, next );
      }
    }
  };
  ElementProto.append = function(/*...el*/){
    var el, lenArg = arguments.length, j = 0;
    for(; j < lenArg; j++){
      el = arguments[j];
      if( $.is$(el) ){
        var len = el.length, i = len;
        while( i-- ) this.appendChild( el[len-i-1] );
      }else if( $.isFunc(el) ){
        this.appendChild( el() );
      }else{
        this.appendChild( _elStr(el)? _createElFromStr(el) : el );
      }
    }
    return this;
  };
  ElementProto.attr = function( str, val ){
    if( $.isObj(str) ){
      for( var g in str ){
        this.setAttribute( g, str[g] );
      }
      return this;
    }
    if( $.isUndef(val) ) return this.getAttribute( str );
    this.setAttribute( str, val );
    return this;
  };
  ElementProto.before = function(/*...el*/){
    var el, lenArg = arguments.length, j = lenArg, parent = this.parent();
    for(; j > 0; j--){ 
      el = arguments[j-1];
      if( $.is$(el) ){
        var len = el.length, i = len;
        while( i-- ) parent.insertBefore( el[len-i-1], this );
      }else if( $.isFunc(el) ){
        parent.insertBefore( el(), this );
      }else{
        parent.insertBefore( _elStr(el)? _createElFromStr(el) : el, this );
      }
    }
  };
  ElementProto.clone = function( val ){
    return this.cloneNode( val );
  };
  ElementProto.css = function( obj, val ){
    if( $.isString(obj) ){
      if( $.isUndef(val) ) 
        return window.getComputedStyle(this)[obj];
      this.style[obj] = val;
    }
    for( var g in obj ){
      this.style[g] = obj[g];
    }
    return this;
  };
  ElementProto.data = function( keyOrObj, val ){
    if( !this._data ) this._data = {};
    if( $.isObj(keyOrObj) ){
      for(var g in keyOrObj){
        this._data[g] = keyOrObj[g];
      }
    }else if( $.isUndef(val) ){
      return this._data[keyOrObj] || (this._data[keyOrObj] = _getDataAttr(this, keyOrObj));
    }else{
      this._data[keyOrObj] = val;
    }
    return this;
  };
  ElementProto.detach = function(str){
    this.remove(str);
    return this;
  };
  ElementProto.empty = function(){
    while(this.hasChildNodes()) {
      this.removeChild(this.firstChild);
    }
    return this;
  };
  ElementProto.html = function (str){
    if( $.isUndef(str) ) return this.innerHTML;
    this.innerHTML = str;
    return this;
  };
  ElementProto.next = function( str ){
    if(!str) return this.nextSibling;
    var el = this;
    while(el){
      if( el.matches(str) ) return el;
      el = el.nextSibling;
    }
    return null;
  };
  ElementProto.parent = function(){
    return this.parentNode;
  };
  ElementProto.prepend = function( /*...el*/ ){
    var el, lenArg = arguments.length, j = lenArg;
    for(; j > 0; j--){
      el = arguments[j-1];
      if( $.is$(el) ){
        var len = el.length, i = len;
        while( i-- ) this.insertBefore( el[len-i-1], this.firstChild );
      }else if( $.isFunc(el) ){
        this.insertBefore( el(), this.firstChild );
      }else{
        this.insertBefore( _elStr(el)? _createElFromStr(el) : el, this.firstChild );
      }
    }
    return this;
  };
  ElementProto.replaceWith = function( el ){
    el = _elStr(el)? _createElFromStr(el) : el;
    this.parent().replaceChild( el, this );
    return el;
  };
  
  var selfRemove = ElementProto.remove || function(){
    this.parentNode.removeChild( this );
  };
  ElementProto.remove = function( str ){
    if(!str) selfRemove.call(this);
    else this.find(str).remove();
    return this;
  };
  ElementProto.removeAttr = function( str ){
    this.removeAttribute(str);
    return this;
  };
  ElementProto.removeData = function( strOrArr ){
    if( this._data ) {
      if( $.isString(strOrArr) ){
        strOrArr = strOrArr.split(/\s+/);
      }
      for(var g in strOrArr){
        var str = strOrArr[g];
        delete this._data[str];
        this.removeAttribute( _toDataAttrStr(str) );
      }
    }
    return this;
  };
  
  ElementProto.text = function (str){
    if( $.isUndef(str) ) return this.textContent;
    this.textContent = str;
    return this;
  };
  ElementProto.wrap = function( param ){
    var wrapEl, parent = this.parent() ;
    if( $.is$(param) ){
      if( !param.length ) return this;
      param = param[0];
    }
    
    if( $.isString(param) ){
      wrapEl = _createElFromStr( param );
    }else if( _isClass(param, '[object Text]') ){
      wrapEl = _createElFromStr( param.textContent );
    }else{
      wrapEl = param;
    }
    
    if( parent ){
      this.replaceWith( wrapEl );
    }
    wrapEl.append( this );
    return $(wrapEl);
  };
  
  

  //===========================================================================
  //          $ function

  function $(param) {
    if (!$.is$(this))
      return new $(param);
    if ($.is$(param))
      return param;
    if ( $.isString(param) )
      return ElementProto.find.call(document, param);
    if ( $.isUndef(param) )
      param = [];
    if (!$.isArray(param))
      param = [param];

    for (var g in param)
      this.push(param[g]);
    if (!this.length)
      this.length = 0;

    _defineProperty(this, 5, 'length');
    return this;
  };
  var proto = ($.prototype = new Array());
  
  // !!!  Atenção: as linhas comentadas, com traços, estão pendentes!  !!!
  var funcs = [
      'addClass',
      'after',
      'append',
      'attr',
      'before',
      'bind',
      //'children',
      'clone',
      //'contents',
      'css',
      'data',
      'detach',
      'empty',
      'eq',
      'find',
      'hasClass',
      'html',
      'next',
      'off',
      'on',
      'one',
      'parent',
      'prepend',
      //--- 'prop',
      //--- 'ready',
      'remove',
      'removeAttr',
      'removeClass',
      'removeData',
      'replaceWith',
      'text',
      'toggleClass',
      //--- 'triggerHandle',
      'unbind',
      //--- 'val',
      'wrap',
      
    ], funcsI = funcs.length;
    
    
    // comportamento padrão;
  while( funcsI-- ){ 
     _normalElementCall(proto, funcs[funcsI]);
  }
  
    //  Sobreescrever as funções que precisam de comportamento 'especial':
    
  proto.find = function (str) {
    var res = _forEachApply(this, ElementProto.find, [str]);
    var obj = $(), len = res.length;
    for (var i = 0; i < len; i++) {
      var resI = res[i], lenI = resI.length;
      for (var j = 0; j < lenI; j++) {
        obj.push(resI[j]);
      }
    }
    return obj;
  };
  proto.hasClass = function(){
    var res = _forEachApply(this, ElementProto.hasClass, arguments), i = res.length;
    while( i-- ) if( !res[i] ) return false;
    return true;
  };
  proto.text = function( str ){
    if( !this.length ) return '';
    var res = _forEachApply( $.isUndef(str)?[this[0]]:this , ElementProto.text, [str]);
    return res[0];
  };
  proto.children = function(str){
    return $(_forEachApply(this, ElementProto.find, str?str:'*'));
    /*
    if( str ) return $(_forEachApply(this, ElementProto.find, str));
    var res = [], len = this.length, i = len, j, lenJ, arrJ;
    while( i-- ){
      arrJ = this[len-i-1].children;
      j = lenJ = arrJ.length;
      while( j-- ){
        res.push( arrJ[lenJ-j-1] );
      }
    }
    return $( _removeEquals( res ) );
    /* */
  };
  proto.contents = function(){
    var res = [], len = this.length, i = len, j, lenJ, arrJ;
    while( i-- ){
      arrJ = this[len-i-1].childNodes;
      j = lenJ = arrJ.length;
      while( j-- ){
        res.push( arrJ[lenJ-j-1] );
      }
    }
    return $( res );
  };
  proto.html = function(str){
    if( !this.length ) return '';
    if( str ){
      _forEachApply(this, ElementProto.html, str);
      return this;
    }
    return this[0].html();
  };
  proto.eq = function(val){
    return $([ this[val] ]);
  };
  proto.clone = function(){
    return $( _forEachApply(this, ElementProto.clone, [true]) );
  };
  proto.parent = function(){
    return $( _removeEquals(  _forEachApply(this, ElementProto.parent) ) );
  };
  proto.replaceWith = function(){
    return $( _removeEquals(  _forEachApply(this, ElementProto.replaceWith, arguments) ) );
  };
  
  
    // Adicionar funções auxiliares:
  $.is$ = function(val){ return val instanceof $; };
  $.isArray = function(val){ return Array.isArray(val); };
  $.isDate = function(val){ return _isClass(val,'[object Date]'); };
  $.isDef = function(val){ return !$.isUndef(val); };
  $.isFunc = function(val){ return (typeof val === 'function'); };
  $.isNumber = function(val){ return !isNaN(parseFloat(val)) && isFinite(val); };
  $.isObj = function(val){ return val && (typeof val === 'object') && !proto.isArray(val); };
  $.isString = function(val){ return (typeof val === 'string'); };
  $.isUndef = function(val){ return (typeof val === 'undefined'); };
  
  
  
    // bloquear a iteração desses elementos:
  funcsI = funcs.length;
  while( funcsI-- ){ 
    _defineProperty(proto, 5, funcs[funcsI]);
  }


  //===========================================================================
  //    Funções auxiliares
  
  
  function _normalElementCall(proto, funcName){
    proto[funcName] = function(){
      _forEachApply(this, ElementProto[funcName], arguments);
      return this;
    };
  }
  function _forEachApply(arr, func, arrApply) {
    var ret = [], len = arr.length;
    for (var i = 0; i < len; i++)
      ret.push(func.apply(arr[i], arrApply));
    return ret;
  }
  function _defineProperty(obj, intConf, prop ) {
    if (!intConf)
      intConf = 0;
    
    Object.defineProperty(obj, prop, {
      configurable: !!(1 & intConf),
      enumerable: !!(2 & intConf),
      writable: !!(4 & intConf),
      iterable: !!(8 & intConf)
        //value: conf.value,
        //get: conf.get,
        //set: conf.set
    });
  }
  function _removeEquals( arr ){
    var len = arr.length, i = len, j;
    while(i--){
      j = len - i;
      while(--j){
        if( arr[i] === arr[i+j] ) arr.splice(i+j, 1);
      }
    }
    return arr;
  }
  function _elStr( objOrStr ){
    return $.isString(objOrStr) && /^\s*</.test(objOrStr);
  }
  function _createElFromStr( str ){
    var div = document.createElement('div'),
        frag = document.createDocumentFragment(),
        len, i;
    div.innerHTML = str;
    len = i = div.childNodes.length;
    while(i--){
      frag.appendChild( div.childNodes[len-i-1] );
    }
    return frag;
  }
  
  function _toDataKeyStr( key ){
    key = key.replace(/^data-/, '');
    var reg = /-([\w\d])/g, letra = null;
    while( (letra = reg.exec(key)) ){
      key = key.replace( letra[0], letra[1].toUpperCase() );
    }
    return key;
  }
  function _toDataAttrStr( key ){
    var reg = /[A-Z]/g, letra = null;
    while( (letra = reg.exec(key)) ){
      key = key.replace( letra[0], '-'+letra[0].toLowerCase() );
    }
    key = 'data-'+ key;
    return key;
  }
  function _getDataAttr(el, key){
    return el.getAttribute( _toDataAttrStr(key) );
  }



  //===========================================================================
  //    Publicando funções

  if (!window.$)
    window.$ = $;
  if (!window.$$)
    window.$$ = $;
  
  
  
  

})(window, document);
