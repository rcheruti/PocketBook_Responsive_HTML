
(function(window, TWEEN, fastdom){
  var raf =  window.requestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.mozRequestAnimationFrame
          || window.msRequestAnimationFrame
          || function(cb) { return setTimeout(cb, 16); }
        ,
      animacaoRodando = true,
      animacaoAgendada = false,
      isColor = /#[0-9a-f]{3,8}|rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[.\d]+\s*)\)/i,
      regUnit = /px|em|mm|cm|%|in|pt|pc|ex|ch|rem|vh|vw|vmin|vmax/i,
      defaultUnit = 'px' ,
      requestUnit = {
        'top': defaultUnit,
        'right': defaultUnit,
        'bottom': defaultUnit,
        'left': defaultUnit,
        'height': defaultUnit,
        'width': defaultUnit,
        'minHeight': defaultUnit,
        'minWidth': defaultUnit,
        'maxHeight': defaultUnit,
        'maxWidth': defaultUnit,
        'marginTop': defaultUnit,
        'marginRight': defaultUnit,
        'marginBottom': defaultUnit,
        'marginLeft': defaultUnit,
        'paddingTop': defaultUnit,
        'paddingRight': defaultUnit,
        'paddingBottom': defaultUnit,
        'paddingLeft': defaultUnit,
        'borderTopWidth': defaultUnit,
        'borderRightWidth': defaultUnit,
        'borderBottomWidth': defaultUnit,
        'borderLeftWidth': defaultUnit,
        'borderRadius': defaultUnit,
        'backgroundPositionX': defaultUnit,
        'backgroundPositionY': defaultUnit,
        'fontSize': defaultUnit,
        'wordSpacing': defaultUnit
      } 
      ;
      
      /*
       * !ATENÇÃO: 
       * falta ainda criar formas de configuração para:
       *  - margin
       *  - padding
       *  - border
       *  - boxShadow
       *  - textShadow
       *  - backgroundSize
       *  - backgroundPosition
       */
      
      
      
  function _animacao(){
    animacaoAgendada = false;
    Animate.update();
    if( animacaoRodando && !animacaoAgendada ){
      raf(_animacao);
      animacaoAgendada = true;
    }
  }
  raf(_animacao);
  
    // auxiliar:
  function _isTransProp( prop ){ return prop==='x' || prop==='y' || prop==='z'; }
  function _isScaleProp( prop ){ return prop==='sx' || prop==='sy' || prop==='sz'; }
  function _isRotateProp( prop ){ return prop==='rx' || prop==='ry' || prop==='rz'; }
  function _isSkewProp( prop ){ return prop==='kx' || prop==='ky' || prop==='kz'; }
  function _parseMatrix( val ){
    var res = { 
      x: 0, y: 0, z: 0 ,    // translação
      sx: 1, sy: 1, sz: 1,  // escala
      rx: 0, ry: 0, rz: 0,  // rotação (não existe na matrix!)
      kx: 0, ky: 0, kz: 0   // cisilamento (skew)
    };
    if( !val ) return res;
    if( val.indexOf('matrix3') === 0 ){
      var arr = val.substring( 9, val.length-1 ).split(/,\s*/);
      res.sx = arr[0];
      res.ky = arr[1];
      // arr[2]; // nada aqui
      res.kz = arr[ 3 ]; // ???
      res.kx = arr[4];
      res.sy = arr[5];
      // arr[6]; // nada aqui
      // arr[7]; // skew???
      // arr[8]; // nada aqui
      // arr[9]; // nada aqui
      res.sz = arr[10];
      // arr[11]; // nada aqui
      res.x = arr[12];
      res.y = arr[13];
      res.z = arr[14];
      // arr[15]; // algum tipo de nivel de profundidade
    }else if( val.indexOf('matrix') === 0 ){
      var arr = val.substring( 7, val.length-1 ).split(/,\s*/);
      res.sx = arr[0];
      res.ky = arr[1];
      res.kx = arr[2];
      res.sy = arr[3];
      res.x = arr[4];
      res.y = arr[5];
    }
    return res;
  }
  
  function Animate( element ){
    this._interpolation = TWEEN.Interpolation.Linear;
    this._easing = TWEEN.Easing.Cubic.Out;
    this._repeat = 0;
    this._time = 350;
    this._delay = 0;
    this._chain = null;
    
    this._to = null;
    this._from = null;
    this._tween = null;
    this._el = element;
    
    this._recalc = true;
    this._repeated = 0;
  }
    // statics:
  Animate.attributes = {};
  Animate.defaultUnits = requestUnit;
  Animate.raf = function( val ){ 
    animacaoRodando = val; 
    if( val && !animacaoAgendada ){
      raf(_animacao);
      animacaoAgendada = true;
    }
  };
  Animate.update = function(){ TWEEN.update(); };
  
    // prototype:
  var proto = Animate.prototype;
  
  _setVal( proto, 'to' );
  _setVal( proto, 'time' );
  _setVal( proto, 'recalc' );
  
  _setAndTweenVal( proto, 'interpolation' );
  _setAndTweenVal( proto, 'easing' );
  _setAndTweenVal( proto, 'repeat' );
  _setAndTweenVal( proto, 'yoyo' );
  _setAndTweenVal( proto, 'delay' );
  
  proto.start = function(){
    if( this._recalc || !this._tween ) this.build();
    this._tween.start();
    return this;
  };
  proto.stop = function(){
    this._tween.stop();
    return this;
  };
  proto.update = function(){
    this._tween.update();
    return this;
  };
  
  proto.chain = function( animateObj ){
    this._chain = animateObj;
    if( this._tween ) this._tween.chain( animateObj.tween );
    return this;
  };
  proto.on = function( val, callback ){
    switch(val){
      case 'start':
        this.tween.onStart( callback );
        break;
      case 'stop':
        this.tween.onStop( callback );
        break;
      case 'update':
        this.tween.onUpdate( callback );
        break;
      case 'complete':
        this.tween.onComplete( callback );
        break;
      default:
        console.warn('Animate.Tween: No event dispatcher to "'+ val +'" listeners!');
    }
    return this;
  };
  proto.build = function(){
    var obj = {}, objUnit = {}, from = this._from, el = this._el, to = this._to;
    
    if( !from ){
      this._from = from = getComputedStyle( el );
    }

    for( var g in to ){
      if( _isTransProp(g) || _isScaleProp(g) || _isRotateProp(g)
          || _isSkewProp(g) ){
        continue;
      }
      var val = to[g], floatVal = parseFloat(val);

      if( isFinite( floatVal ) ){
        obj[g] = parseFloat( from[g] ) || 0; 
        var unit = regUnit.exec( val );
        unit = unit? unit[0] : Animate.defaultUnits[g];
        objUnit[g] = unit;
      }else if( isColor.test( val ) ){
        console.warn('Falta impl. de animação para cores!');
      }
    }

    var tween = new TWEEN.Tween( obj );
    this._tween = tween;
    tween.to( to, this._time );
    tween.interpolation( this._interpolation );
    tween.delay( this._delay );
    tween.repeat( this._repeat );
    tween.easing( this._easing );
    tween.yoyo( this._yoyo );
    if( this._chain ) tween.chain( this._chain.tween ); // <<--  precisa inverter a chamada, o novo Tween ainda não existe (não foi chamado .start)
    tween.onUpdate(function(){
      var vals = this;
      var hasTrans = false, hasScale = false, hasRotate = false, hasSkew = false
        ;
      for( var g in vals ){
        if( _isTransProp(g) ){ hasTrans = true; continue; }
        if( _isScaleProp(g) ){ hasScale = true; continue; }
        if( _isRotateProp(g) ){ hasRotate = true; continue; }
        if( _isSkewProp(g) ){ hasSkew = true; continue; }

        el.style[g] = vals[g] +( objUnit[g] || '' );
      }
    });
    
    return this;
  };
  
  //============================================================================
  
  function _setVal( proto, method, attr ){
    attr = attr ||'_' + method ;
    proto[method] = function( val ){
      this[attr] = val;
      return this;
    };
  }
  function _setAndTweenVal( proto, method, attr, tweenMethod ){
    tweenMethod = tweenMethod || method;
    attr = attr ||'_' + method ;
    proto[method] = function( val ){
      this[attr] = val;
      if( this._tween ) this._tween.chain( val );
      return this;
    };
  }
  
  //console.log( fastdom );
 
  
  //fastdom.mutate(function(){
    //console.log( 'bb', fastdom );
  //});
  
  window.Animate = Animate;
  
})(window, TWEEN, fastdom);
