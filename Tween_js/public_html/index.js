
if( !window.$ ) window.$ = function(str){ return document.querySelector(str); };
if( !window.$A ) window.$A = function(str){ return document.querySelectorAll(str); };
window.EventTarget.prototype.on = function(eventName, callback, bubble){
  return this.addEventListener( eventName, callback, bubble );
};

function _animacao(){
  requestAnimationFrame(_animacao);
  TWEEN.update();
}
requestAnimationFrame(_animacao);

  // obj == { x: 0, y: 0, z: 0 }
function _trans( el, obj ){
  var trans = 'translate3d('+ obj.x +'px, '+ obj.y +'px, '+ obj.z +'px )' ;
  el.style.transform = trans ;
}
function _getTrans( el ){
  var style = getComputedStyle( el );
  
}

//=============================================================================

var element = $('.bloco');
var tween = null ;
var config = {
  interpolation: TWEEN.Interpolation.Linear ,
  repeat: 0,
  time: 1000
};

_newTween();
function _newTween(){
  var obj = { x:0, y:0, z:0 };
  _trans( element, obj );
  tween = new TWEEN.Tween( obj );
  tween.to({ 
      x: [ 40, 80, 100], 
      y: [ 80, 80,  40]
    }, config.time );
  tween.repeat( config.repeat );
  tween.easing(TWEEN.Easing.Cubic.Out);
  tween.interpolation( config.interpolation );
  tween.onUpdate(function(){
    _trans( element, this );
  });
}
$('#reset').on('click',function(){
  _newTween();
});
$('#start').on('click',function(){
  tween.start();
});
$('#stop').on('click',function(){
  tween.stop();
});
$('#repeat').on('change',function(){
  config.repeat = $('#repeat').value ;
  tween.repeat( config.repeat );
});
$('#time').on('change',function(){
  config.time = $('#time').value ;
  tween.to({ 
      x: [ 40, 80, 100], 
      y: [ 80, 80,  40]
    }, config.time );
});
var interps = {
  1: TWEEN.Interpolation.Linear ,
  2: TWEEN.Interpolation.Bezier ,
  3: TWEEN.Interpolation.CatmullRom 
};
$('#interpolation').on('change',function(){
  var val = $('#interpolation').value ;
  config.interpolation = interps[ val ];
  tween.interpolation( config.interpolation );
});

