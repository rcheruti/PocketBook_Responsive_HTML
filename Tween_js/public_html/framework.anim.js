
(function(window, TWEEN, fastdom){
  var raf =  window.requestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.mozRequestAnimationFrame
          || window.msRequestAnimationFrame
          || function(cb) { return setTimeout(cb, 16); }
        ,
      animacaoRodando = true,
      animacaoAgendada = false,
      isColor = /#[0-9a-f]{3,8}|rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[.\d]+\s*)?\)/i,
      parseRGBAColor = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\.\d]+)\s*)?\)/i,
      regUnit = /px|em|mm|cm|%|in|pt|pc|ex|ch|rem|vh|vw|vmin|vmax/i,
      defaultUnit = 'px' ,
      requestUnit = {
        x                     : defaultUnit,
        y                     : defaultUnit,
        z                     : defaultUnit,
        sx                    : '',
        sy                    : '',
        sz                    : '',
        rx                    : 'deg',
        ry                    : 'deg',
        rz                    : 'deg',
        kx                    : 'deg',
        ky                    : 'deg',
        kz                    : 'deg',
      
        top                   : defaultUnit,
        right                 : defaultUnit,
        bottom                : defaultUnit,
        left                  : defaultUnit,
        height                : defaultUnit,
        width                 : defaultUnit,
        minHeight             : defaultUnit,
        minWidth              : defaultUnit,
        maxHeight             : defaultUnit,
        maxWidth              : defaultUnit,
        marginTop             : defaultUnit,
        marginRight           : defaultUnit,
        marginBottom          : defaultUnit,
        marginLeft            : defaultUnit,
        paddingTop            : defaultUnit,
        paddingRight          : defaultUnit,
        paddingBottom         : defaultUnit,
        paddingLeft           : defaultUnit,
        borderTopWidth        : defaultUnit,
        borderRightWidth      : defaultUnit,
        borderBottomWidth     : defaultUnit,
        borderLeftWidth       : defaultUnit,
        borderRadius          : defaultUnit,
        backgroundPositionX   : defaultUnit,
        backgroundPositionY   : defaultUnit,
        fontSize              : defaultUnit,
        wordSpacing           : defaultUnit
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
      
      /*
      var res = { 
        x: 0, y: 0, z: 0 ,    // translação
        sx: 1, sy: 1, sz: 1,  // escala
        rx: 0, ry: 0, rz: 0,  // rotação (não existe na matrix!)
        kx: 0, ky: 0, kz: 0   // cisilamento (skew)
      };
      /* */
      
  function _animacao(){
    animacaoAgendada = false;
    TWEEN.update();
    if( animacaoRodando && !animacaoAgendada ){
      raf(_animacao);
      animacaoAgendada = true;
    }
  }
  raf(_animacao);
  
    // auxiliar:
  var __transfArr = [ 'x', 'y', 'z',
                      'sx','sy','sz',
                      'rx','ry','rz',
                      'kx','ky','kz' ];
  function _isTransformProp( prop ){
    return __transfArr.indexOf(prop) > -1;
  }
    // Nas propriedades ed cores será colocado um simbolo para identificar:
  function _isColorProp( prop ){
    return prop.indexOf('#') > -1;
  }
  function _toRadians( val ){
    return val / (180/Math.PI) ;
  }
  function _toDegrees( val ){
    return val * (180/Math.PI) ;
  }
  
  function _toTransformString(objVals, objUnits){
    var str = '', empS = '';
    if( 'x' in objVals || 'y' in objVals || 'z' in objVals  ){
      str += 'translate3d('+
              (objVals.x||0) + (objUnits.x||empS) + ','+
              (objVals.y||0) + (objUnits.y||empS) + ','+
              (objVals.z||0) + (objUnits.z||empS) +    
              ') '; // deixar 1 espaço no final (/\s/)!
    }
    if( 'rx' in objVals ){
      str += 'rotatex('+ (objVals.rx||0) + (objUnits.rx||empS) + ') ';  // deixar 1 espaço no final (/\s/)!
    }
    if( 'ry' in objVals ){
      str += 'rotatey('+ (objVals.ry||0) + (objUnits.ry||empS) + ') ';  // deixar 1 espaço no final (/\s/)!
    }
    if( 'rz' in objVals ){
      str += 'rotatez('+ (objVals.rz||0) + (objUnits.rz||empS) + ') ';  // deixar 1 espaço no final (/\s/)!
    }
    if( 'sx' in objVals || 'sy' in objVals || 'sz' in objVals  ){
      str += 'scale3d('+
              ('sx' in objVals?objVals.sx:1) + (objUnits.sx||empS) + ','+
              ('sy' in objVals?objVals.sy:1) + (objUnits.sy||empS) + ','+
              ('sz' in objVals?objVals.sy:1) + (objUnits.sy||empS) +    
              ') '; // deixar 1 espaço no final (/\s/)!
    }
    if( 'kx' in objVals || 'ky' in objVals || 'kz' in objVals  ){
      str += 'skew('+
              (objVals.kx||0) + (objUnits.kx||empS) + ','+
              (objVals.ky||0) + (objUnits.ky||empS) + 
              ') '; // deixar 1 espaço no final (/\s/)!
    }
    
    return str? 'transform: '+str : '';
  }
  
  
  function Animate( element ){
    this._interpolation = TWEEN.Interpolation.Linear;
    this._easing = TWEEN.Easing.Cubic.Out;
    this._repeat = 0;
    this._repeat = false;
    this._time = 350;
    this._delay = 0;
    this._chain = null;
    this._to = null;
    this._from = null;
    
    this._lastFrom = null; // bk do último ciclo
    this._fromUnits = null;
    this._tween = null;
    this._colorProp = {};
    this._el = element;
    
    this._recalc = true;
    this._repeated = 0;
    this._executing = false;
  }
  /*
   * .Interpolation.Linear
   * .Interpolation.Bezier
   * .Interpolation.CatmullRom
   */
  Animate.Interpolation = TWEEN.Interpolation ;
  /*
   * .Easing.Cubic.Out
   * .Easing.Cubic.In
   * .Easing.Cubic.InOut (?)
   * ...
   */
  Animate.Easing = TWEEN.Easing ;
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
  _setVal( proto, 'el' );
  _setVal( proto, 'from' );
  _setVal( proto, 'time' );
  _setVal( proto, 'recalc' );
  _setVal( proto, 'relative' );
  
  _setAndTweenVal( proto, 'interpolation' );
  _setAndTweenVal( proto, 'easing' );
  _setAndTweenVal( proto, 'repeat' );
  _setAndTweenVal( proto, 'yoyo' );
  _setAndTweenVal( proto, 'delay' );
  
  proto.start = function(){
    if( this._executing ) return;
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
    var i, unit = '',
        obj = {}, copObj = {}, objUnit = this._fromUnits, 
        from = this._lastFrom||this._from||{}, colorProp = this._colorProp , 
        el = this._el, to = {}, _to = this._to;
    
    if( !objUnit ){
      objUnit = {};
      for(i in from){
        unit = regUnit.exec( from[i] );
        objUnit[i] = unit? unit[0] : requestUnit[i];
      }
    }
    for(i in from){
      if( !(i in _to) ){
        _to[i] = 0 + objUnit[i];
      }
    }
    
    for( i in _to ){
      var val = _to[i], floatVal = val instanceof Array? null : parseFloat(val) ;
      
      if( isFinite( floatVal ) || val instanceof Array ){
        if( floatVal !== null ){
          to[i] = floatVal;
          unit = regUnit.exec( val );
        }else{
          unit = regUnit.exec( val[0] );
          to[i] = [];
          for(var k in val) to[i].push( parseFloat(val[k]) );
        }
        obj[i] = parseFloat( from[i] ) || 0; 
        objUnit[i] = unit? unit[0] : requestUnit[i];
      }else if( isColor.test( val ) ){
        colorProp[i] = true; // marcar como propriedade de cor
        var r, g, b, a;
        if( val.indexOf('#') > -1 ){ // Hex
          val = val.substr( 1 );
          if( val.length < 6 ){
            r = val.substr(0,1); r += r;
            g = val.substr(1,1); g += g;
            b = val.substr(2,1); b += b;
          }else{
            r = val.substr(0,2);
            g = val.substr(2,2);
            b = val.substr(4,2);
          }
          r = parseInt( r, 16 );
          g = parseInt( g, 16 );
          b = parseInt( b, 16 );
          a = 1;
        }else{ // RGB/RGBA
          var res = parseRGBAColor.exec( val );
          r = parseInt( res[1] );
          g = parseInt( res[2] );
          b = parseInt( res[3] );
          a = res[4];
          if( a ){
            if( a.indexOf('.') === 0 ) a = 0 + a;
            a = parseFloat( a );
          }else{
            a = 1;
          }
        }
        //console.log( '---  Cores', r, g, b, a );
        obj[ i+'#r' ] = r;
        obj[ i+'#g' ] = g;
        obj[ i+'#b' ] = b;
        obj[ i+'#a' ] = a;
        objUnit[ i+'#r' ] = '';
        objUnit[ i+'#g' ] = '';
        objUnit[ i+'#b' ] = '';
        objUnit[ i+'#a' ] = '';
        //console.warn('Falta impl. de animação para cores!');
      }
    }
    if( this._relative ){
      copObj = obj;
      for(i in to){
        to[i] += (obj[i]||0);
      }
    }else{
      for(i in obj) copObj[i] = obj[i];
    }
    this._lastFrom = obj;
    this._fromUnits = objUnit;
    
    //var tween = new TWEEN.Tween( JSON.parse(JSON.stringify(obj)) );
    var tween = new TWEEN.Tween( copObj );
    this._tween = tween;
    tween.to( to, this._time );
    tween.interpolation( this._interpolation );
    tween.delay( this._delay );
    tween.repeat( this._repeat );
    tween.easing( this._easing );
    tween.yoyo( this._yoyo );
    if( this._chain ) tween.chain( this._chain.tween ); // <<--  precisa inverter a chamada, o novo Tween ainda não existe (não foi chamado .start)
    
    var that = this;
    tween.onStart(function(){
      that._recalc = true;
      that._executing = true;
    });
    tween.onStop(function(){
      that._executing = false;
    });
    tween.onComplete(function(){
      that._executing = false;
    });
    tween.onUpdate(function(){
      that._lastFrom = this;
      var vals = this, cssText = '', colorPropProc = {}, gC, r, g, b, a;
      cssText += _toTransformString(vals, objUnit);
      for( var i in vals ){
        if( _isTransformProp(i) ){
          
        }else if( _isColorProp(i) ){
          gC = i.split('#');
          if( colorPropProc[ gC ] ) continue;
          colorPropProc[ gC ] = true;
          r = vals[ gC+'#r' ].toFixed(0);
          g = vals[ gC+'#g' ].toFixed(0);
          b = vals[ gC+'#b' ].toFixed(0);
          a = vals[ gC+'#a' ].toFixed(3);
          cssText += gC +':rgba('+r+','+g+','+b+','+a+')';
        }else{
          cssText += i +':'+ vals[i] +( objUnit[i] || '' )+';';
        }
      }
      el.style.cssText = _toCssTxt(cssText);
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
    // Valores não podem ter letra maiúscula!!!
  function _toCssTxt( str ){
    var reg = /[A-Z]/g, letra = null;
    while( (letra = reg.exec(str)) ){
      str = str.replace( letra[0], '-'+letra[0].toLowerCase() );
    }
    return str;
  }
  
  
  
  //console.log( fastdom );
  
  //fastdom.mutate(function(){
    //console.log( 'bb', fastdom );
  //});
  
  window.Animate = Animate;
  
})(window, TWEEN, fastdom);
