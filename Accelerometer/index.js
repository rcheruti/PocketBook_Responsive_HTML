
var raf =   requestAnimationFrame
        ||  oRequestAnimationFrame
        ||  msRequestAnimationFrame
        ||  mozRequestAnimationFrame
        ||  webkitRequestAnimationFrame
        ||  function(callback){ setTimeout(callback, 16); };
function $(str){ return document.querySelector(str); }
function $A(str){ return document.querySelectorAll(str); }

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
  
  var body = $('body');
  var bodyStyle = getComputedStyle( body );
  
  var widthMeters = 0 ;
  var heightMeters = 0 ;
    // to find screen size, in meters:
  function screenSize(){
    widthMeters = 96 * parseFloat(bodyStyle.width) / 2.54 * 100 ;
    heightMeters = 96 * parseFloat(bodyStyle.height) / 2.54 * 100 ;
  }
  screenSize();
  
  function metersToPixels( meters ){
    return meters / 100 * 96 / 2.54 ;
  }
  
    // some values for the fisics :
  //var GA = 9.81 ; // gravity acceleration
  var ball = {
    mass : 3.0 ,  // kg, mass of the ball
    vX : 0 ,  // velocity of the ball, on X
    vY : 0 ,  // velocity of the ball, on Y
    vZ : 0 ,  // velocity of the ball, on Z
    area : 2.5 * 2 * Math.PI ,  // area of the ball that is 'hiting' the air (its a shape; 2D)
    coeficient : 0.47 , // this number is a constant; this is for a Sphere
    x : 0 ,
    y : 0 ,
    z : 0 ,
    el : $('.ball') ,
    elStyle : getComputedStyle( $('.ball') )
  }; 
    
    // put the on the center of the scree :
  ball.elStyle.left =  ( parseFloat(bodyStyle.width) / 2 - parseFloat(ball.elStyle.width) / 2 )  +'px';
  ball.elStyle.top =  ( parseFloat(bodyStyle.height) / 2 - parseFloat(ball.elStyle.height) / 2 )  +'px';
  
    // return the force of the drag of the air: 
  function dragForce( density, velocity, area, coeficient ){
    return 0.5 * density * area * coeficient     *velocity *velocity ; // v^2
  }
    // return the acceleration created by the force:
  function accFromForceMass( force, mass ){
    return force / mass ;
  }
  
    // transform the ball position:
  function transBall( x, y, z ){
    ball.elStyle.transform = 'transition(  )';
  }
  
  var airDensity = 1.2922 ; // density of the air, kg * m^-3
    // the that we will store :
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
    
    // -----  calculus :
      // force on each direction: 
    var dragX = dragForce( airDensity, ball.vX, ball.area, ball.coeficient );
    var dragY = dragForce( airDensity, ball.vY, ball.area, ball.coeficient );
    var dragZ = dragForce( airDensity, ball.vZ, ball.area, ball.coeficient );
    
      // acceleration opposite to each direction:
    var accelX = accFromForceMass( gradX, ball.mass ) * ( ball.vX / Math.abs( ball.vX ) ) ;
    var accelY = accFromForceMass( gradY, ball.mass ) * ( ball.vY / Math.abs( ball.vY ) ) ;
    var accelZ = accFromForceMass( gradZ, ball.mass ) * ( ball.vZ / Math.abs( ball.vZ ) ) ;
    
    ball.vX += accelX / acc.interval / 1000 ;
    ball.vY += accelY / acc.interval / 1000 ;
    ball.vZ += accelZ / acc.interval / 1000 ;
    
    ball.x += metersToPixels( ball.vX ) ;
    ball.y += metersToPixels( ball.vY ) ;
    ball.z += metersToPixels( ball.vZ ) ;
    
      // repaint
    raf( repaint );
  }
  raf( repaint );
  
    // this will get the motion events :
  window.ondevicemotion = function(ev){
    //console.debug( ev );
    
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
    
    
  };
  
}

// ===================================================================

document.addEventListener('DOMContentLoaded', function(){
  
  initMotion();
  
});

