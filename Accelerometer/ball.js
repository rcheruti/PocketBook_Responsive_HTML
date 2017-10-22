
// Ball class

(function(window, document){
  
  // constructor
  function Ball( node ){
    this.mass = 3.0 ;   // kg, mass of the ball
    this.coeficient = 0.47 ; // this number is a constant; this is for a Sphere
    this.el = node ;
    this.elStyle = window.getComputedStyle( node ) ;
    this.width = parseFloat(this.elStyle.width) ;   // width px
    this.height = parseFloat(this.elStyle.height) ; // height px
    
    var radius = this.width / 2 ;
    this.area = pixelsToMeters( radius * radius ) * Math.PI ; // area of the ball that is 'hiting' the air (its a shape; 2D)
    
    this.vX = 0 ;       // velocity of the ball, on X
    this.vY = 0 ;       // velocity of the ball, on Y
    this.vZ = 0 ;       // velocity of the ball, on Z
    this.x = 0 ;        // pixels position, on x
    this.y = 0 ;        // pixels position, on y
    this.z = 0 ;        // pixels position, on z
    
    this.el.style.left = '0px';
    this.el.style.top = '0px';
  }
  
  // set ball position (in px)
  Ball.prototype.pos = function( x, y, z ){
    this.x = x ;
    this.y = y ;
    this.z = z ;
    return this;
  };
  
  // set ball velocity (in m/s)
  Ball.prototype.vel = function( x, y, z ){
    this.vX = x ;
    this.vY = y ;
    this.vZ = z ;
    return this;
  };
  
  // apply ball position to document
  Ball.prototype.applyPos = function(){
    this.el.style.webkitTransform = 'translate( '+ this.x +'px, '+ this.y +'px )';
    this.el.style.mozTransform = 'translate( '+ this.x +'px, '+ this.y +'px )';
    this.el.style.transform = 'translate( '+ this.x +'px, '+ this.y +'px )';
    return this;
  };
  
  // detect if this ball is inside the box. Put the ball inside if needed
  Ball.prototype.insideBox = function( top, right, bottom, left ){
    if( this.x < left ){
      this.x = left ;
      this.vX *= -0.8 ; // change direction
    } 
    if( this.y < top ){
      this.y = top ;
      this.vY *= -0.8 ; // change direction
    }
    
    if( this.x + this.width > right ){
      this.x = right - this.width ;
      this.vX *= -0.8 ; // change direction
    }
    if( this.y + this.height > bottom ){
      this.y = bottom - this.height ;
      this.vY *= -0.8 ; // change direction
    }
    return this;
  };
  
  // -------------------------------------
  
  // export class to Global context:
  window.Ball = Ball ;
  
})(window, document);
