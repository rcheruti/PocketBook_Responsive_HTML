
(function(){
  has3d();
  //console.log( 'has3d',has3d() );
  
  /*
  var isColor = /#[0-9a-f]{3,8}|rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[.\d]+\s*)\)/i ;
  console.log( 'isColor.test( "Rgb( 255, 237, 64 )" )' , isColor.test( "Rgb( 255, 237, 64 )" ) );
  console.log( 'isColor.test( "Rgba( 255, 237, 64, 0.8 )" )' , isColor.test( "Rgba( 255, 237, 64, 0.8 )" ) );
  console.log( 'isColor.test( "Rgba( 255, 237, 64, .8 )" )' , isColor.test( "Rgba( 255, 237, 64, .8 )" ) );
  console.log( 'isColor.test( "Rgba( 255, 237, 64, . )" )' , isColor.test( "Rgba( 255, 237, 64, . )" ) );
  console.log( 'isColor.test( "#888" )' , isColor.test( "#888" ) );
  console.log( 'isColor.test( "#888" )' , isColor.test( "#888" ) );
  console.log( 'isColor.test( "#fF8741" )' , isColor.test( "#fF8741" ) );
  console.log( 'isColor.test( "#fF874101" )' , isColor.test( "#fF874101" ) );
  /* */
    
    
  var anim = new Animate( $('.bloco2')[0] ).relative(true).from({ sx:1, sy:1 });
  
  new Animate( $('.bloco2')[0] )
    .from({ backgroundColor: '#ff0000' })
    .to({ backgroundColor: 'rgb(0,0,255)' })
    .time(1000)
    .start({ backgroundColor: '#0000ff' })
  ;
  
  
  $('#reset').on('click', function(){
    anim = new Animate( $('.bloco2')[0] ).relative(true).from({ sx:1, sy:1 });
    anim.to({}).start();
  });
  $('#goRight').on('click', function(){
    anim.to({ x: '100%' }).start();
  });
  $('#goLeft').on('click', function(){
    anim.to({ x: '-100%' }).start();
  });
  $('#goUp').on('click', function(){
    anim.to({ y: '-100%' }).start();
  });
  $('#goDown').on('click', function(){
    anim.to({ y: '100%' }).start();
  });
  $('#scaleX').on('click', function(){
    anim.to({ sx: 0.1 }).start();
  });
  $('#scaleY').on('click', function(){
    anim.to({ sy: 0.1 }).start();
  });
  $('#rotateZ').on('click', function(){
    anim.to({ rz: 10 }).start();
  });
  $('#Caminhar').on('click', function(){
    new Animate( $('.bloco2')[0] )
      .from({ x:0, y:0 })
      .to({ x:[ 40, 80, 100], y:[ 80, 80,  40] })
      .time(1000)
      .easing( Animate.Easing.Cubic.Out )
      .interpolation( Animate.Interpolation.Linear )
      .start();
  });
  
})();


//=============================================================================

  // obj == { x: 0, y: 0, z: 0 }
function _trans( el, obj ){
  var trans = 'translate3d('+ obj.x +'px, '+ obj.y +'px, '+ obj.z +'px )' ;
  el.style.transform = trans ;
}
function _getTrans( el ){
  var style = getComputedStyle( el );
  
}

var element = $('.bloco1')[0];
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
  config.repeat = $('#repeat')[0].value ;
  tween.repeat( config.repeat );
});
$('#time').on('change',function(){
  config.time = $('#time')[0].value ;
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
  var val = $('#interpolation')[0].value ;
  config.interpolation = interps[ val ];
  tween.interpolation( config.interpolation );
});

