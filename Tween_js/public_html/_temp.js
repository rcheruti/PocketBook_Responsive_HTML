

  /*
  proto.children = function(str){
    return $( _childrenAndContents(this, str, 'children') );
  };
  proto.clone = function(){
    return $( _forEachApply(this, ElementProto.clone, [true]) );
  };
  proto.contents = function(str){
    return $( _childrenAndContents(this, str, 'childNodes') );
  };
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
  proto.html = function(str){
    if( !this.length ) return '';
    if( str ){
      _forEachApply(this, ElementProto.html, str);
      return this;
    }
    return this[0].html();
  };
  proto.is = function(){
    if(!this.length) return false;
    return ElementProto.is.apply(this[0], arguments);
  };
  proto.parent = function(){
    return $( _removeEquals(  _forEachApply(this, ElementProto.parent) ) );
  };
  proto.prop = function( key, val ){
    if( !this.length ) return false;
    if( $.isUndef(val) ){
      return ElementProto.prop.call( this[0], key );
    }
    _forEachApply(this, ElementProto.prop, [key, val]);
    return this;
  };
  proto.replaceWith = function(){
    return $( _removeEquals(  _forEachApply(this, ElementProto.replaceWith, arguments) ) );
  };
  proto.text = function( str ){
    if( !this.length ) return '';
    var res = _forEachApply( $.isUndef(str)?[this[0]]:this , ElementProto.text, [str]);
    return res[0];
  };
  proto.val = function(){
    if(!this.length) return null;
    return ElementProto.val.apply(this[0], arguments);
  };
  /* */
  


