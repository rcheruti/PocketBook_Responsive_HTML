
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
  function _isScaleProp( prop ){ return prop==='s' || prop==='scale'; }
  function _isRotateProp( prop ){ return prop==='rx' || prop==='ry' || prop==='rz'; }
  function _isSkewProp( prop ){ return false; }
  
  function Animate(){
    
  }
    // statics:
  Animate.attributes = {};
  Animate.raf = function( val ){ 
    animacaoRodando = val; 
    if( val && !animacaoAgendada ){
      raf(_animacao);
      animacaoAgendada = true;
    }
  };
  Animate.update = function(){ TWEEN.update(); };
  Animate.animate = function( el, to, time, from ){
    
    if( !from ){
      from = getComputedStyle( el );
    }
    
    var obj = {}, objUnit = {};
    for( var g in to ){
      if( g.toLowerCase() === 'x' ){
        continue;
      }
      var val = to[g], floatVal = parseFloat(val);
      
      if( isFinite( floatVal ) ){
        obj[g] = parseFloat( from[g] ) || 0; 
        var unit = regUnit.exec( val );
        unit = unit? unit[0] : requestUnit[g];
        objUnit[g] = unit;
      }else if( isColor.test( val ) ){
        console.warn('Falta impl. de animação para cores!');
      }
    }
    
    var tween = new TWEEN.Tween( obj );
    tween.to( to, time );
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
    return tween ;
  };
  
    // prototype:
  var proto = Animate.prototype;
  
  //============================================================================
  
  //console.log( fastdom );
 
  fastdom.measure(function(){
    //console.log( 'aa', fastdom );
  });
  fastdom.mutate(function(){
    //console.log( 'bb', fastdom );
  });
  
  window.Animate = Animate;
  
})(window, TWEEN, fastdom);
