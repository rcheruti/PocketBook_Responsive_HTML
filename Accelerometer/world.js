
// World class

(function(window, document){
  
  function World( node ){
    this.el = node ;
    this.elStyle = window.getComputedStyle( node ) ;
    this.width = parseFloat(this.elStyle.width) ;   // width px
    this.height = parseFloat(this.elStyle.height) ; // height px
    
    this.airDensity = 1.2922 ; // 1.2922: density of the air, kg * m^-3
    this.xGravity = 0 ; // acceleration by gravity, m/s^2
    this.yGravity = 0 ;
    this.zGravity = 0 ;
    this.motionInterval = 0 ; // Motion Events interval
  }
  
  // calculate the air drag force for this world
  World.prototype.airDragForce = function( area, coeficient, velocity ){
    //                                                    v^2                 ( v / abs(v) ) to opposite direction
    return -0.5 * this.airDensity * area * coeficient   *velocity *velocity   *velocity/Math.abs(velocity) ; 
  };
  
  // -------------------------------------
  
  // export class to Global context:
  window.World = World ;
    
})(window, document);
