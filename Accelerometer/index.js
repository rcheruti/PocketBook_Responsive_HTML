
var raf =   requestAnimationFrame
        ||  oRequestAnimationFrame
        ||  msRequestAnimationFrame
        ||  mozRequestAnimationFrame
        ||  webkitRequestAnimationFrame
        ||  function(callback){ setTimeout(callback, 16); };
function $(str){ return document.querySelector(str); }
function $A(str){ return document.querySelectorAll(str); }
function metersToPixels( meters ){ return meters * 100 * 96 / 2.54 ; } // para 1px CSS, 96dpi
function pixelsToMeters( pixels ){ return pixels / (96 / 2.54) / 100 ; } // para 1px CSS, 96dpi
function accFromForceMass( force, mass ){ return (force / mass) || 0 ; } // return the acceleration created by the force

// --------------------------------

function initMotion(){
  if( !window.DeviceMotionEvent ){
    $('.motionNotSupported').style.display = 'block';
    $('.motionSupported').style.display = 'none';
    console.warn('Motion not supported in this browser!');
    return;
  }
  $('.motionNotSupported').style.display = 'none';
  $('.motionSupported').style.display = 'block';
  
  // ---  Calculus of the World
  
  var world = new World( $('body') );
  var ball = new Ball( $('.ball') );
    
  // put the ball on the center of the screen :
  ball.pos( ( world.width / 2 - ball.width / 2 ), ( world.height / 4 - ball.height / 2 ), 0 ).applyPos();
  
  // the Motion Event we will store :
  var acc = {
    xGravity : 0 , // acceleration including gravity
    yGravity : 0 , // acceleration including gravity
    zGravity : 0 , // acceleration including gravity
    x : 0 , // acceleration without gravity
    y : 0 , // acceleration without gravity
    z : 0 , // acceleration without gravity
    alpha : 0 ,  // rotation
    beta : 0 ,    // rotation
    gamma : 0 ,  // rotation
    interval : 0   // interval (in ms) at which data is obtained from device
  };
  
  // this function will do the repaint of the scene :
  function repaint(){  
    // showing the values on the screen :
    $('.accNumbers .accGravityX').textContent = acc.xGravity.toFixed(2);
    $('.accNumbers .accGravityY').textContent = acc.yGravity.toFixed(2);
    $('.accNumbers .accGravityZ').textContent = acc.zGravity.toFixed(2);
    
    $('.accNumbers .accX').textContent = acc.x.toFixed(2);
    $('.accNumbers .accY').textContent = acc.y.toFixed(2);
    $('.accNumbers .accZ').textContent = acc.z.toFixed(2);
    
    $('.accNumbers .accAlpha').textContent = acc.alpha.toFixed(2);
    $('.accNumbers .accBeta').textContent = acc.beta.toFixed(2);
    $('.accNumbers .accGamma').textContent = acc.gamma.toFixed(2);
    
    $('.accNumbers .accInterval').textContent = acc.interval.toFixed(2);
    
    // ---
    
    $('.ballData .ballMass').textContent = ball.mass.toFixed(2) ;
    $('.ballData .ballArea').textContent = ball.area.toFixed(2) ;
    $('.ballData .ballCoeficient').textContent = ball.coeficient.toFixed(2) ;
    $('.ballData .ballWidth').textContent = ball.width.toFixed(0) ;
    $('.ballData .ballHeight').textContent = ball.height.toFixed(0) ;
    
    $('.ballData .ballVelX').textContent = ball.vX.toFixed(2) ;
    $('.ballData .ballVelY').textContent = ball.vY.toFixed(2) ;
    $('.ballData .ballVelZ').textContent = ball.vZ.toFixed(2) ;
    
    $('.ballData .ballPosX').textContent = ball.x.toFixed(2) ;
    $('.ballData .ballPosY').textContent = ball.y.toFixed(2) ;
    $('.ballData .ballPosZ').textContent = ball.z.toFixed(2) ;
    
    // -----  calculus :
    // force on each direction: 
    var dragX = world.airDragForce( ball.area, ball.coeficient, ball.vX ) || 0 ;
    var dragY = world.airDragForce( ball.area, ball.coeficient, ball.vY ) || 0 ;
    var dragZ = world.airDragForce( ball.area, ball.coeficient, ball.vZ ) || 0 ;
    
    // acceleration opposite to each direction:
    var accelX = accFromForceMass( dragX, ball.mass ) || 0 ;
    var accelY = accFromForceMass( dragY, ball.mass ) || 0 ;
    var accelZ = accFromForceMass( dragZ, ball.mass ) || 0 ;
    
    var accResist = 0.6 ; // to reduce the acceleration of an object
    ball.vX += accResist* (accelX + world.xGravity) * ( world.motionInterval / 1000 ) || 0 ;
    ball.vY += accResist* (accelY + world.yGravity) * ( world.motionInterval / 1000 ) || 0 ;
    ball.vZ += accResist* (accelZ + world.zGravity) * ( world.motionInterval / 1000 ) || 0 ;
    
    ball.x += metersToPixels( ball.vX * ( world.motionInterval / 1000 ) ) || 0 ;
    ball.y += metersToPixels( ball.vY * ( world.motionInterval / 1000 ) ) || 0 ;
    ball.z += metersToPixels( ball.vZ * ( world.motionInterval / 1000 ) ) || 0 ;
    
    ball.insideBox( 0, world.width, world.height, 0 ).applyPos();
    
    $('.ballData .airDragX').textContent = accelX.toFixed(2) ;
    $('.ballData .airDragY').textContent = accelY.toFixed(2) ;
    $('.ballData .airDragZ').textContent = accelZ.toFixed(2) ;
    
    $('.ballData .ballAccX').textContent = (accelX + world.xGravity).toFixed(2) ;
    $('.ballData .ballAccY').textContent = (accelY + world.yGravity).toFixed(2) ;
    $('.ballData .ballAccZ').textContent = (accelZ + world.zGravity).toFixed(2) ;
    
    // repaint
    raf( repaint );
  }
  raf( repaint );
  
  // this will get the motion events :
  window.ondevicemotion = function(ev){
    
    acc = {
      xGravity : parseFloat( ev.accelerationIncludingGravity.x || 0 ) , // acceleration including gravity
      yGravity : parseFloat( ev.accelerationIncludingGravity.y || 0 ) , // acceleration including gravity
      zGravity : parseFloat( ev.accelerationIncludingGravity.z || 0 ) , // acceleration including gravity
      x : parseFloat( ev.acceleration.x || 0 ) , // acceleration without gravity
      y : parseFloat( ev.acceleration.y || 0 ) , // acceleration without gravity
      z : parseFloat( ev.acceleration.z || 0 ) , // acceleration without gravity
      alpha : parseFloat( ev.rotationRate.alpha || 0 ) ,  // rotation
      beta : parseFloat( ev.rotationRate.beta || 0 ) ,    // rotation
      gamma : parseFloat( ev.rotationRate.gamma || 0 ) ,  // rotation
      interval : parseFloat( ev.interval || 0 )   // interval (in ms) at which data is obtained from device
    };
    
    world.xGravity = acc.xGravity *-1 ; // device X axis is inverted
    world.yGravity = acc.yGravity ;
    world.zGravity = acc.zGravity ; // positive is to back side, negative is to screen side
    world.motionInterval = acc.interval ;
  };
  
}

// ===================================================================

document.addEventListener('DOMContentLoaded', function(){
  initMotion();
});

