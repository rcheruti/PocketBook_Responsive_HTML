
(function(window){
  
  var EventTypeProto = window.EventTarget.prototype ;
  EventTypeProto.off = function(eventName, callback, useCapture){
    return this.removeEventListener( eventName, callback, useCapture );
  };
  EventTypeProto.on = function(eventName, callback, useCapture){
    this.addEventListener( eventName, callback, useCapture );
    return EventTypeProto.off.bind( this, eventName, callback, useCapture );
  };
  EventTypeProto.one = function(eventName, callback, useCapture, times){
    if( !times ) times = 1;
    else if( times < 1 ) return function(){};
    var _retirar = null;
    var _func = function(){
      callback();
      if( !--times ) _retirar();
    };
    _retirar = EventTypeProto.off.bind( this, eventName, _func, useCapture );
    this.addEventListener( eventName, _func, useCapture );
    return _retirar;
  };
  
  var ElementProto = window.Element.prototype;
  ElementProto.find = function( str ){
    var nodeList = this.querySelectorAll(str);
    var arr = [];
    for(var i = 0; i < nodeList.length; i++) arr.push( nodeList[i] );
    return $( arr );
  };
  
  var $ = function( param ){
    if( !(this instanceof $) ) return new $( param );
    if( param instanceof $ ) return param ;
    if( typeof param === 'string' ){
      return ElementProto.find.call( document, param );
    }
    if( !(param instanceof Array) ){
      param = [ param ] ;
    }
    
    this.array = param;
    return this;
  };
  var proto = ($.prototype = new Array()) ;
  proto.on = function(eventName, callback, useCapture){
    _forEachApply( this, EventTypeProto.on, [ eventName, callback, useCapture ] );
    return this;
  };
  proto.off = function(eventName, callback, useCapture){
    _forEachApply( this, EventTypeProto.off, [ eventName, callback, useCapture ] );
    return this;
  };
  proto.one = function(eventName, callback, useCapture, times){
    _forEachApply( this, EventTypeProto.one, [ eventName, callback, useCapture, times ] );
    return this;
  };
  proto.find = function( str ){
    _forEachApply();
    return this;
  };
  
  if( !window.$ ) window.$ = $;
  if( !window.$$ ) window.$$ = $;
  
  //---------------------------
  function _forEachApply( arr, func, arrApply ){
    var ret = [];
    for(var i = 0; i < arr.length; i++) ret.push( func.apply( arr[i], arrApply ) );
    return ret;
  }
  
})(window);
