(function(window){
  var vetor = null;
  
  window.has3d = function( force ){
    if( force ) vetor = null;
    else if( vetor ) return vetor;
    
    var 
      el = document.createElement('p'),
      style,
      body = document.body,
      has3d,
      trans = [
        ['transform',       'transform'],
        ['webkitTransform', '-webkit-transform'],
        ['OTransform',      '-o-transform'],
        ['MozTransform',    '-moz-transform'],
        ['msTransform',     '-ms-transform']
      ]
    ;

    // Add it to the body to get the computed style
    body.insertBefore(el, null);
    style = el.style;
    for( var t in trans ){
      style[ trans[t][0] ] = 'translate3d(1px,1px,1px)' ;
      has3d = getComputedStyle(el).getPropertyValue( trans[t][1] );
      if( has3d && has3d !== "none" ){
        vetor = trans[t];
        break;
      }
    }

    body.removeChild(el);

    return vetor;

  };
})(window);