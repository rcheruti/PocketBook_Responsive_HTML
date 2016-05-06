
(function (window) {
  
  var undefined; // "undefined", deixar essa var sem valor !!!
  
  
  //===========================================================================
  //          EventTarget prototype

  var EventTypeProto = window.EventTarget.prototype;
  EventTypeProto.off = function (eventName, callback, useCapture) {
    return this.removeEventListener(eventName, callback, useCapture);
  };
  EventTypeProto.on = function (eventName, callback, useCapture) {
    this.addEventListener(eventName, callback, useCapture);
    var that = this;
    return function () {
      EventTypeProto.off.call(that, eventName, callback, useCapture);
    };
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
    _retirar = EventTypeProto.off.bind(this, eventName, _func, useCapture);
    this.addEventListener(eventName, _func, useCapture);
    return _retirar;
  };
  
  EventTypeProto.bind = EventTypeProto.on;
  
  
  
  
  
  
  
  
  //===========================================================================
  //          Element prototype

  var ElementProto = window.Element.prototype;
  ElementProto.find = function (str) {
    var nodeList = this.querySelectorAll(str), len = nodeList.length;
    var arr = [];
    for (var i = 0; i < len; i++)
      arr.push(nodeList[i]);
    return $(arr);
  };
  if ('classList' in ElementProto) {
    ElementProto.hasClass = function () {
      return this.classList.contains( arguments );
    };
    ElementProto.addClass = function () {
      this.classList.add( arguments );
      return this;
    };
    ElementProto.removeClass = function () {
      this.classList.remove( arguments );
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
  ElementProto.text = function (str){
    if( str === undefined ) return this.textContent;
    this.textContent = str;
    return this;
  };
  ElementProto.empty = function(){
    while(this.hasChildNodes()) {
      this.removeChild(this.firstChild);
    }
    return this;
  };
  ElementProto.html = function (str){
    if( str === undefined ) return this.innerHTML;
    this.innerHTML = str;
    return this;
  };
  ElementProto.attr = function( str, val ){
    if( str instanceof Object ){
      for( var g in str ){
        this.setAttribute( g, str[g] );
      }
      return this;
    }
    if( val === undefined ) return this.getAttribute( str );
    this.setAttribute( str, val );
    return this;
  };
  


  //===========================================================================
  //          $ function

  var $ = function (param) {
    if (!(this instanceof $))
      return new $(param);
    if (param instanceof $)
      return param;
    if (typeof param === 'string')
      return ElementProto.find.call(document, param);
    if (typeof param === 'undefined')
      param = [];
    if (!(param instanceof Array))
      param = [param];

    for (var g in param)
      this.push(param[g]);
    if (!this.length)
      this.length = 0;

    _defineProperty(this, 'length', 5);
    return this;
  };
  var proto = ($.prototype = new Array());
  
  var funcs = [
      'bind',
      'on',
      'off',
      'one',
      'find',
      'hasClass',
      'addClass',
      'removeClass',
      'toggleClass',
      'text',
      'empty',
      'attr'
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
  proto.text = function(){
    var res = _forEachApply(this, ElementProto.text, arguments);
  };


  
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







  //===========================================================================
  //    Publicando funções

  if (!window.$)
    window.$ = $;
  if (!window.$$)
    window.$$ = $;
  
  
  
  

})(window);
