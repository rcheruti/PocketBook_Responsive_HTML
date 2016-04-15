
(function(){
  
  /*
  function _animacao(){
    requestAnimationFrame(_animacao);
    TWEEN.update();
  }
  requestAnimationFrame(_animacao);
  */
 console.log( fastdom );
 
  fastdom.measure(function(){
    console.log( 'aa', fastdom );
  });
  fastdom.measure(function(){
    console.log( 'bb', fastdom );
  });
  
  
})();
